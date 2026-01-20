// ui/JCurve.js - Classic PE/VC J-Curve visualization
// Shows cumulative net cash flow over fund life
// v9.1: Added for LP-ready enhancements

window.FundModel = window.FundModel || {};

window.FundModel.JCurveChart = function JCurveChart({ model }) {
  const { formatCurrency } = window.FundModel;
  const { months, breakEvenMonth } = model;
  const fmt = formatCurrency;
  
  // Calculate cumulative net cash flow (revenue - expenses)
  let cumulative = 0;
  const jCurveData = months.map(m => {
    cumulative += (m.totalRevenue - m.totalExpenses);
    return { month: m.month, value: cumulative, label: m.label };
  });
  
  const values = jCurveData.map(d => d.value);
  const maxVal = Math.max(...values, 0);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;
  
  const chartH = 220, chartW = 700;
  const padL = 70, padR = 20, padT = 30, padB = 40;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  
  const scaleY = v => padT + plotH - ((v - minVal) / range) * plotH;
  const scaleX = i => padL + (i / (months.length - 1)) * plotW;
  const zeroY = scaleY(0);
  
  // Build path
  const path = jCurveData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(d.value)}`
  ).join(' ');
  
  // Find trough (lowest point)
  const trough = jCurveData.reduce((min, d) => d.value < min.value ? d : min, jCurveData[0]);
  const troughIdx = jCurveData.findIndex(d => d === trough);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">📈 J-Curve (Cumulative Net Cash Flow)</h2>
        <div className="text-xs text-gray-500">Classic PE/VC visualization</div>
      </div>
      
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-56">
        {/* Y-axis labels */}
        {[minVal, 0, maxVal].map((v, i) => (
          <g key={i}>
            <line x1={padL} x2={chartW - padR} y1={scaleY(v)} y2={scaleY(v)} 
              stroke={v === 0 ? '#9ca3af' : '#e5e7eb'} strokeDasharray={v === 0 ? '0' : '4,4'} />
            <text x={padL - 8} y={scaleY(v) + 4} textAnchor="end" className="text-xs fill-gray-500">
              {fmt(v)}
            </text>
          </g>
        ))}
        
        {/* X-axis labels */}
        {[0, 11, 23, 35].map(i => (
          <text key={i} x={scaleX(i)} y={chartH - 10} textAnchor="middle" className="text-xs fill-gray-500">
            M{i}
          </text>
        ))}
        
        {/* Axis titles */}
        <text x={15} y={chartH / 2} transform={`rotate(-90 15 ${chartH/2})`} 
          textAnchor="middle" className="text-xs fill-gray-400">Cumulative Cash Flow</text>
        <text x={chartW / 2} y={chartH - 2} textAnchor="middle" className="text-xs fill-gray-400">Month</text>
        
        {/* Gradient fill under curve */}
        <defs>
          <linearGradient id="jcurveGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d={`${path} L${scaleX(months.length-1)},${zeroY} L${scaleX(0)},${zeroY} Z`} 
          fill="url(#jcurveGrad)" />
        
        {/* Main curve */}
        <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        
        {/* Trough marker */}
        <circle cx={scaleX(troughIdx)} cy={scaleY(trough.value)} r="5" fill="#ef4444" />
        <text x={scaleX(troughIdx)} y={scaleY(trough.value) + 18} textAnchor="middle" 
          className="text-xs fill-red-600 font-semibold">Trough: {fmt(trough.value)}</text>
        
        {/* Breakeven marker */}
        {breakEvenMonth !== null && (
          <g>
            <line x1={scaleX(breakEvenMonth)} y1={padT} x2={scaleX(breakEvenMonth)} y2={chartH - padB} 
              stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" />
            <text x={scaleX(breakEvenMonth)} y={padT - 5} textAnchor="middle" 
              className="text-xs fill-green-600 font-semibold">Breakeven M{breakEvenMonth}</text>
          </g>
        )}
        
        {/* End point */}
        <circle cx={scaleX(months.length - 1)} cy={scaleY(jCurveData[jCurveData.length-1].value)} 
          r="5" fill="#22c55e" />
      </svg>
      
      <div className="grid grid-cols-3 gap-4 mt-3 text-center text-sm">
        <div className="bg-red-50 rounded p-2">
          <p className="text-xs text-red-600 uppercase">Trough (M{troughIdx})</p>
          <p className="font-bold text-red-700">{fmt(trough.value)}</p>
        </div>
        <div className="bg-blue-50 rounded p-2">
          <p className="text-xs text-blue-600 uppercase">Breakeven</p>
          <p className="font-bold text-blue-700">{breakEvenMonth !== null ? `Month ${breakEvenMonth}` : 'Not yet'}</p>
        </div>
        <div className="bg-green-50 rounded p-2">
          <p className="text-xs text-green-600 uppercase">Final (M35)</p>
          <p className="font-bold text-green-700">{fmt(jCurveData[jCurveData.length-1].value)}</p>
        </div>
      </div>
    </div>
  );
};
