// ui/WhatIf.js - Quick scenario sliders for common questions
// v7.1: Instant visual comparison to base case
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.WhatIf = function WhatIf({ baseAssumptions, baseCapitalInputs, baseMultipliers, baseModel }) {
  const { useState, useMemo } = React;
  const { runModel, applyMultipliers } = window.FundModel;
  
  const [adjustments, setAdjustments] = useState({
    launchDelay: 0,
    salaryIncrease: 0,
    returnReduction: 0,
    aumReduction: 0,
  });
  
  const whatIfModel = useMemo(() => {
    const adjAssumptions = {
      ...baseAssumptions,
      ianSalaryPost: baseAssumptions.ianSalaryPost * (1 + adjustments.salaryIncrease / 100),
      paulSalaryPost: baseAssumptions.paulSalaryPost * (1 + adjustments.salaryIncrease / 100),
    };
    
    const adjMultipliers = {
      ...baseMultipliers,
      gpOrganic: baseMultipliers.gpOrganic * (1 - adjustments.aumReduction / 100),
      bdmRaise: baseMultipliers.bdmRaise * (1 - adjustments.aumReduction / 100),
      brokerRaise: baseMultipliers.brokerRaise * (1 - adjustments.aumReduction / 100),
      annualReturn: baseMultipliers.annualReturn * (1 - adjustments.returnReduction / 14),
    };
    
    const inputs = applyMultipliers(baseCapitalInputs, adjMultipliers);
    return runModel(adjAssumptions, inputs, adjMultipliers.annualReturn, adjMultipliers.bdmRevenueShare || 0);
  }, [baseAssumptions, baseCapitalInputs, baseMultipliers, adjustments]);
  
  const fmt = (v) => {
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
    if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'K';
    return '$' + v.toFixed(0);
  };
  
  const delta = (base, adj) => {
    const diff = adj - base;
    const pct = base !== 0 ? (diff / base * 100).toFixed(0) : 0;
    return { diff, pct, isWorse: diff > 0 };
  };
  
  const fundingDelta = delta(baseModel.cumulativeFounderFunding, whatIfModel.cumulativeFounderFunding);
  const breakevenDelta = delta(baseModel.breakEvenMonth || 36, whatIfModel.breakEvenMonth || 36);
  
  const SliderInput = ({ label, value, onChange, min, max, step, unit, question }) => (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-sm font-medium text-gray-700 mb-1">{question}</p>
      <div className="flex items-center gap-3">
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className={`font-mono text-sm w-16 text-right ${value !== 0 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
          {value > 0 ? '+' : ''}{value}{unit}
        </span>
      </div>
    </div>
  );
  
  const hasAdjustments = Object.values(adjustments).some(v => v !== 0);
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-semibold">🤔 What If...</h2>
          {hasAdjustments && (
            <button
              onClick={() => setAdjustments({ launchDelay: 0, salaryIncrease: 0, returnReduction: 0, aumReduction: 0 })}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
            >
              Reset All
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SliderInput
            question="We raise founder salaries post-breakeven?"
            value={adjustments.salaryIncrease} onChange={(v) => setAdjustments(p => ({ ...p, salaryIncrease: v }))}
            min={0} max={50} step={5} unit="%"
          />
          <SliderInput
            question="Investment returns are lower than expected?"
            value={adjustments.returnReduction} onChange={(v) => setAdjustments(p => ({ ...p, returnReduction: v }))}
            min={0} max={8} step={1} unit="pp"
          />
          <SliderInput
            question="We raise less AUM than projected?"
            value={adjustments.aumReduction} onChange={(v) => setAdjustments(p => ({ ...p, aumReduction: v }))}
            min={0} max={50} step={5} unit="%"
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">📊 Impact vs Base Case</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 uppercase">Base Funding</p>
            <p className="text-xl font-bold text-gray-700">{fmt(baseModel.cumulativeFounderFunding)}</p>
          </div>
          <div className={`p-3 rounded-lg ${fundingDelta.isWorse ? 'bg-red-50' : 'bg-green-50'}`}>
            <p className="text-xs text-gray-500 uppercase">What-If Funding</p>
            <p className={`text-xl font-bold ${fundingDelta.isWorse ? 'text-red-600' : 'text-green-600'}`}>
              {fmt(whatIfModel.cumulativeFounderFunding)}
            </p>
            <p className={`text-xs ${fundingDelta.isWorse ? 'text-red-500' : 'text-green-500'}`}>
              {fundingDelta.diff > 0 ? '+' : ''}{fmt(fundingDelta.diff)} ({fundingDelta.pct}%)
            </p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50">
            <p className="text-xs text-gray-500 uppercase">Base Breakeven</p>
            <p className="text-xl font-bold text-gray-700">M{baseModel.breakEvenMonth || 'N/A'}</p>
          </div>
          <div className={`p-3 rounded-lg ${breakevenDelta.isWorse ? 'bg-red-50' : 'bg-green-50'}`}>
            <p className="text-xs text-gray-500 uppercase">What-If Breakeven</p>
            <p className={`text-xl font-bold ${breakevenDelta.isWorse ? 'text-red-600' : 'text-green-600'}`}>
              M{whatIfModel.breakEvenMonth || 'N/A'}
            </p>
            {breakevenDelta.diff !== 0 && (
              <p className={`text-xs ${breakevenDelta.isWorse ? 'text-red-500' : 'text-green-500'}`}>
                {breakevenDelta.diff > 0 ? '+' : ''}{breakevenDelta.diff} months
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
