// ui/MetricsPanel.js - LP return metrics display
// v9.1: Shows IRR, MOIC, TVPI, DPI, Runway in professional format

window.FundModel = window.FundModel || {};

window.FundModel.MetricsPanel = function MetricsPanel({ model }) {
  const { useMemo } = React;
  const { formatCurrency, calculateMetrics } = window.FundModel;
  const fmt = formatCurrency;
  
  const metrics = useMemo(() => calculateMetrics(model), [model]);
  
  if (!metrics) return <div className="text-gray-500">Loading metrics...</div>;
  
  const pct = (v) => v !== null && !isNaN(v) ? `${(v * 100).toFixed(1)}%` : 'N/A';
  const multiple = (v) => v !== null && !isNaN(v) ? `${v.toFixed(2)}x` : 'N/A';
  
  const irrColor = metrics.irr > 0.15 ? 'text-green-600' : metrics.irr > 0.08 ? 'text-yellow-600' : 'text-red-600';
  const moicColor = metrics.moic > 2 ? 'text-green-600' : metrics.moic > 1.5 ? 'text-yellow-600' : 'text-red-600';
  const runwayColor = metrics.runway > 12 ? 'text-green-600' : metrics.runway > 6 ? 'text-yellow-600' : 'text-red-600';
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">📊 LP Return Metrics</h2>
        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Industry Standard</span>
      </div>
      
      {/* Primary Metrics */}
      <div className="grid grid-cols-4 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
          <p className="text-xs text-blue-600 uppercase font-semibold mb-1">IRR</p>
          <p className={`text-2xl font-bold ${irrColor}`}>{pct(metrics.irr)}</p>
          <p className="text-xs text-gray-500 mt-1">Internal Rate of Return</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 text-center">
          <p className="text-xs text-purple-600 uppercase font-semibold mb-1">MOIC</p>
          <p className={`text-2xl font-bold ${moicColor}`}>{multiple(metrics.moic)}</p>
          <p className="text-xs text-gray-500 mt-1">Multiple on Invested</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 text-center">
          <p className="text-xs text-green-600 uppercase font-semibold mb-1">TVPI</p>
          <p className="text-2xl font-bold text-green-700">{multiple(metrics.tvpi)}</p>
          <p className="text-xs text-gray-500 mt-1">Total Value / Paid-In</p>
        </div>
        
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg p-4 text-center">
          <p className="text-xs text-amber-600 uppercase font-semibold mb-1">DPI</p>
          <p className="text-2xl font-bold text-amber-700">{multiple(metrics.dpi)}</p>
          <p className="text-xs text-gray-500 mt-1">Distributions / Paid-In</p>
        </div>
      </div>
      
      {/* Secondary Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Runway</span>
            <span className={`font-bold ${runwayColor}`}>
              {metrics.runway >= 999 ? '∞' : `${Math.round(metrics.runway)} mo`}
            </span>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${metrics.runway > 12 ? 'bg-green-500' : metrics.runway > 6 ? 'bg-yellow-500' : 'bg-red-500'}`}
              style={{ width: `${Math.min(100, (metrics.runway / 36) * 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Breakeven</span>
            <span className="font-bold text-blue-600">
              {metrics.breakEvenMonth !== null ? `M${metrics.breakEvenMonth}` : 'TBD'}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">3-month rolling positive EBT</p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">RVPI</span>
            <span className="font-bold text-gray-700">{multiple(metrics.rvpi)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1">Residual Value / Paid-In</p>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="border-t pt-3">
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="text-center">
            <p className="text-gray-500">Total Invested</p>
            <p className="font-semibold">{fmt(metrics.totalInvested)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Distributions</p>
            <p className="font-semibold text-green-600">{fmt(metrics.totalDistributions)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">NAV (M35)</p>
            <p className="font-semibold">{fmt(metrics.nav)}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Cash Position</p>
            <p className="font-semibold text-blue-600">{fmt(metrics.currentCash)}</p>
          </div>
        </div>
      </div>
      
      {/* LP Benchmark Context */}
      <div className="mt-3 bg-blue-50 rounded p-2 text-xs text-blue-700">
        <strong>📍 LP Context:</strong> Top-quartile emerging PE funds target 20%+ IRR and 2.0x+ MOIC. 
        These metrics update as scenario assumptions change.
      </div>
    </div>
  );
};
