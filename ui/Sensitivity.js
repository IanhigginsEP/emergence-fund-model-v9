// ui/Sensitivity.js - Tornado diagram for sensitivity analysis
// v7.1: Shows which variables have most impact on key outputs
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.Sensitivity = function Sensitivity({ assumptions, baseCapitalInputs, baseMultipliers }) {
  const { useMemo } = React;
  const { runModel, applyMultipliers } = window.FundModel;
  
  const variables = [
    { key: 'gpOrganic', label: 'GP Organic Raise', swing: 0.3 },
    { key: 'annualReturn', label: 'Investment Returns', swing: 0.3 },
    { key: 'bdmRaise', label: 'BDM Raise', swing: 0.5 },
    { key: 'brokerRaise', label: 'Broker Raise', swing: 0.5 },
    { key: 'redemption', label: 'Redemptions', swing: 0.5 },
  ];
  
  const results = useMemo(() => {
    const baseInputs = applyMultipliers(baseCapitalInputs, baseMultipliers);
    const baseResult = runModel(assumptions, baseInputs, baseMultipliers.annualReturn, baseMultipliers.bdmRevenueShare || 0);
    const baseFunding = baseResult.cumulativeFounderFunding;
    const baseBreakeven = baseResult.breakEvenMonth || 36;
    
    return variables.map(v => {
      const lowMult = { ...baseMultipliers, [v.key]: baseMultipliers[v.key] * (1 - v.swing) };
      const lowInputs = applyMultipliers(baseCapitalInputs, lowMult);
      const lowResult = runModel(assumptions, lowInputs, lowMult.annualReturn, lowMult.bdmRevenueShare || 0);
      
      const highMult = { ...baseMultipliers, [v.key]: baseMultipliers[v.key] * (1 + v.swing) };
      const highInputs = applyMultipliers(baseCapitalInputs, highMult);
      const highResult = runModel(assumptions, highInputs, highMult.annualReturn, highMult.bdmRevenueShare || 0);
      
      return {
        ...v,
        funding: { low: lowResult.cumulativeFounderFunding, base: baseFunding, high: highResult.cumulativeFounderFunding },
        breakeven: { low: lowResult.breakEvenMonth || 36, base: baseBreakeven, high: highResult.breakEvenMonth || 36 },
        impact: Math.abs(highResult.cumulativeFounderFunding - lowResult.cumulativeFounderFunding),
      };
    }).sort((a, b) => b.impact - a.impact);
  }, [assumptions, baseCapitalInputs, baseMultipliers]);
  
  const fmt = (v) => {
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(1) + 'M';
    if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'K';
    return '$' + v.toFixed(0);
  };
  
  const maxImpact = Math.max(...results.map(r => r.impact));
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-4">🌪️ Sensitivity Analysis (Founder Funding Impact)</h2>
      <p className="text-sm text-gray-500 mb-4">Shows impact of ±30-50% swing on each variable</p>
      
      <div className="space-y-4">
        {results.map((r, i) => {
          const lowDelta = r.funding.low - r.funding.base;
          const highDelta = r.funding.high - r.funding.base;
          const scale = maxImpact > 0 ? 150 / maxImpact : 1;
          
          return (
            <div key={r.key} className="flex items-center gap-4">
              <div className="w-32 text-sm text-gray-700 text-right">{r.label}</div>
              <div className="flex-1 relative h-8 flex items-center">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
                <div 
                  className={`absolute h-6 ${lowDelta > 0 ? 'bg-red-400' : 'bg-green-400'} rounded-l`}
                  style={{ right: '50%', width: `${Math.abs(lowDelta) * scale}px` }}
                />
                <div 
                  className={`absolute h-6 ${highDelta > 0 ? 'bg-red-400' : 'bg-green-400'} rounded-r`}
                  style={{ left: '50%', width: `${Math.abs(highDelta) * scale}px` }}
                />
                <span className="absolute left-0 text-xs text-gray-500">
                  -{(r.swing * 100).toFixed(0)}%: {fmt(r.funding.low)}
                </span>
                <span className="absolute right-0 text-xs text-gray-500">
                  +{(r.swing * 100).toFixed(0)}%: {fmt(r.funding.high)}
                </span>
              </div>
              <div className="w-20 text-xs text-gray-600">
                BE: M{r.breakeven.low}-M{r.breakeven.high}
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t flex gap-4 text-xs">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-400 rounded"></span> Increases funding need</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-400 rounded"></span> Decreases funding need</span>
      </div>
    </div>
  );
};
