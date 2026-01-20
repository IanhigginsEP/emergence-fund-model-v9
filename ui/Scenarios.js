// ui/Scenarios.js - Scenario selector and comparison
// v7: Four scenarios - Base, Upside 1, Upside 2, Downside
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.Scenarios = function Scenarios({ model, scenarioName, multipliers, assumptions, baseCapitalInputs, onApplyPreset, onUpdateMultiplier }) {
  const { PRESET_SCENARIOS, getScenarioColor, getScenarioDescription, applyMultipliers, runModel, calculateSummaries, formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  
  const sensitivityData = Object.entries(PRESET_SCENARIOS || {}).map(([name, mults]) => {
    const inputs = applyMultipliers(baseCapitalInputs, mults);
    const result = runModel(assumptions, inputs, mults.annualReturn, mults.bdmRevenueShare || 0);
    const summary = calculateSummaries(result.months, result.preLaunch);
    return {
      name, y1AUM: summary.y1.endingAUM, y3AUM: summary.y3.endingAUM,
      totalRevenue: summary.totals.totalRevenue, breakEvenMonth: result.breakEvenMonth,
      y3Cash: summary.y3.netCash, founderFunding: result.cumulativeFounderFunding,
      bdmShare: (mults.bdmRevenueShare || 0) * 100 + '%',
    };
  });
  
  return (
    <div className="space-y-4">
      <PresetSelector scenarioName={scenarioName} onSelect={onApplyPreset} />
      <CurrentImpact model={model} fmt={fmt} />
      <ComparisonTable data={sensitivityData} scenarioName={scenarioName} fmt={fmt} onSelect={onApplyPreset} />
      <FounderFundingComparison data={sensitivityData} scenarioName={scenarioName} fmt={fmt} />
    </div>
  );
};

function PresetSelector({ scenarioName, onSelect }) {
  const { PRESET_SCENARIOS } = window.FundModel;
  const colorMap = {
    'Downside': 'bg-orange-50 text-orange-700 border-orange-200',
    'Base': 'bg-blue-50 text-blue-700 border-blue-200',
    'Upside 1': 'bg-green-50 text-green-700 border-green-200',
    'Upside 2': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Scenario Selector</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Object.keys(PRESET_SCENARIOS || {}).map(name => (
          <button key={name} onClick={() => onSelect(name)}
            className={`px-4 py-3 rounded-lg font-medium text-sm border-2 transition ${
              scenarioName === name ? 'bg-blue-600 text-white border-blue-600' : colorMap[name] || 'bg-gray-50'}`}>
            <div>{name}</div>
            <div className="text-xs opacity-75 mt-1">{window.FundModel.getScenarioDescription ? window.FundModel.getScenarioDescription(name) : ''}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function CurrentImpact({ model, fmt }) {
  const { summary, breakEvenMonth, cumulativeFounderFunding } = model;
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {[
        { l: 'Y1 AUM', v: fmt(summary.y1.endingAUM) },
        { l: 'Y3 AUM', v: fmt(summary.y3.endingAUM) },
        { l: 'Breakeven', v: breakEvenMonth ? 'M' + breakEvenMonth : 'Never', c: breakEvenMonth ? 'green' : 'red' },
        { l: 'Founder Funding', v: fmt(cumulativeFounderFunding), c: 'amber' },
        { l: 'Y3 Cash', v: fmt(summary.y3.netCash), c: summary.y3.netCash >= 0 ? 'green' : 'red' },
      ].map((m, i) => (
        <div key={i} className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 uppercase">{m.l}</p>
          <p className={`text-xl font-bold ${m.c === 'green' ? 'text-green-600' : m.c === 'red' ? 'text-red-600' : m.c === 'amber' ? 'text-amber-600' : 'text-gray-800'}`}>{m.v}</p>
        </div>
      ))}
    </div>
  );
}

function ComparisonTable({ data, scenarioName, fmt, onSelect }) {
  const { getScenarioColor } = window.FundModel;
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="font-semibold mb-3">Scenario Comparison</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b-2 bg-gray-50">
          <th className="py-3 px-4 text-left">Scenario</th><th className="py-3 px-4 text-right">BDM Share</th>
          <th className="py-3 px-4 text-right">Y3 AUM</th><th className="py-3 px-4 text-right">Breakeven</th>
          <th className="py-3 px-4 text-right">Founder Funding</th><th className="py-3 px-4 text-right">Y3 Cash</th>
        </tr></thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.name} onClick={() => onSelect(row.name)}
              className={`border-b ${scenarioName === row.name ? 'bg-blue-50 font-semibold' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-100 cursor-pointer`}>
              <td className="py-3 px-4"><span className="inline-block w-3 h-3 rounded-full mr-2" style={{background: getScenarioColor ? getScenarioColor(row.name) : '#ccc'}}></span>{row.name}</td>
              <td className="py-3 px-4 text-right font-mono">{row.bdmShare}</td>
              <td className="py-3 px-4 text-right font-mono">{fmt(row.y3AUM)}</td>
              <td className={`py-3 px-4 text-right font-mono ${row.breakEvenMonth ? 'text-green-600' : 'text-red-600'}`}>{row.breakEvenMonth ? 'M' + row.breakEvenMonth : 'Never'}</td>
              <td className="py-3 px-4 text-right font-mono text-amber-600">{fmt(row.founderFunding)}</td>
              <td className={`py-3 px-4 text-right font-mono ${row.y3Cash >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(row.y3Cash)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FounderFundingComparison({ data, scenarioName, fmt }) {
  const maxFunding = Math.max(...data.map(d => d.founderFunding));
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Founder Funding by Scenario (50/50 Split)</h2>
      <div className="space-y-3">
        {data.map(row => {
          const barWidth = maxFunding > 0 ? (row.founderFunding / maxFunding) * 100 : 0;
          const perFounder = row.founderFunding / 2;
          return (
            <div key={row.name} className={`p-3 rounded-lg ${scenarioName === row.name ? 'bg-blue-50 ring-2 ring-blue-500' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{row.name}</span>
                <span className="text-amber-600 font-bold">{fmt(row.founderFunding)} total</span>
              </div>
              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: `${barWidth}%` }} />
              </div>
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Ian: {fmt(perFounder)}</span><span>Paul: {fmt(perFounder)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
