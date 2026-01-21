// ui/JCurve.js - Cash Position J-Curve
// Shows actual cash balance from M0 ($367K Stone Park start)
// Trough = maximum utilization of Stone Park funds
// v10.17: Fixed to show cash position, NOT cumulative P&L

window.FundModel = window.FundModel || {};

window.FundModel.JCurveChart = function JCurveChart({ model }) {
  const { formatCurrency } = window.FundModel;
  const { months, breakEvenMonth, startingCashUSD } = model;
  const fmt = formatCurrency;
  
  // Filter to post-launch months only (M0+)
  const postLaunchMonths = months.filter(m => m.month >= 0);
  
  // Use actual closing cash balance (already calculated in engine)
  const cashData = postLaunchMonths.map(m => ({
    month: m.month,
    value: m.closingCash,
    label: m.label
  }));
  
  // Starting cash reference line
  const startingCash = startingCashUSD || 367000;
  
  const values = cashData.map(d => d.value);
  const maxVal = Math.max(...values, startingCash);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;
  
  const chartH = 250, chartW = 700;
  const padL = 70, padR = 20, padT = 40, padB = 40;
  const plotW = chartW - padL - padR;
  const plotH = chartH - padT - padB;
  
  const scaleY = v => padT + plotH - ((v - minVal) / range) * plotH;
  const scaleX = i => padL + (i / Math.max(cashData.length - 1, 1)) * plotW;
  const zeroY = scaleY(0);
  const startingY = scaleY(startingCash);
  
  // Build path
  const path = cashData.map((d, i) => 
    `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(d.value)}`
  ).join(' ');
  
  // Find trough (lowest cash point) = maximum utilization
  const trough = cashData.reduce((min, d) => d.value < min.value ? d : min, cashData[0]);
  const troughIdx = cashData.findIndex(d => d === trough);
  const maxUtilization = startingCash - trough.value;
  
  // Find recovery point (when cash first exceeds starting cash)
  const recoveryMonth = cashData.find(d => d.value >= startingCash);
  const recoveryIdx = recoveryMonth ? cashData.findIndex(d => d === recoveryMonth) : null;
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold">💰 Cash Position (Stone Park Utilization)</h2>
        <div className="text-xs text-gray-500">Starting: {fmt(startingCash)} at M0</div>
      </div>
      
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-64">
        {/* Starting cash reference line */}
        <line x1={padL} x2={chartW - padR} y1={startingY} y2={startingY} 
          stroke="#3b82f6" strokeWidth="2" strokeDasharray="6,4" />
        <text x={chartW - padR - 5} y={startingY - 5} textAnchor="end" 
          className="text-xs fill-blue-600 font-semibold">Start: {fmt(startingCash)}</text>
        
        {/* Zero line */}
        <line x1={padL} x2={chartW - padR} y1={zeroY} y2={zeroY} 
          stroke="#ef4444" strokeWidth="1" strokeDasharray="4,4" />
        <text x={padL + 5} y={zeroY - 5} className="text-xs fill-red-500">$0 (Cash Depleted)</text>
        
        {/* Y-axis labels */}
        {[minVal, startingCash / 2, startingCash, maxVal].filter((v, i, a) => a.indexOf(v) === i).map((v, i) => (
          <g key={i}>
            <text x={padL - 8} y={scaleY(v) + 4} textAnchor="end" className="text-xs fill-gray-500">
              {fmt(v)}
            </text>
          </g>
        ))}
        
        {/* X-axis labels */}
        {[0, 6, 12, 18, 24, 30, 35].filter(i => i < cashData.length).map(i => (
          <text key={i} x={scaleX(i)} y={chartH - 10} textAnchor="middle" className="text-xs fill-gray-500">
            M{i}
          </text>
        ))}
        
        {/* Axis titles */}
        <text x={15} y={chartH / 2} transform={`rotate(-90 15 ${chartH/2})`} 
          textAnchor="middle" className="text-xs fill-gray-400">Cash Balance ($)</text>
        <text x={chartW / 2} y={chartH - 2} textAnchor="middle" className="text-xs fill-gray-400">Month</text>
        
        {/* Gradient fill - green above start, amber between 0 and start, red below 0 */}
        <defs>
          <linearGradient id="cashGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
            <stop offset={`${((maxVal - startingCash) / range) * 100}%`} stopColor="#3b82f6" stopOpacity="0.1" />
            <stop offset={`${((maxVal - 0) / range) * 100}%`} stopColor="#fbbf24" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path d={`${path} L${scaleX(cashData.length-1)},${zeroY} L${scaleX(0)},${zeroY} Z`} 
          fill="url(#cashGrad)" />
        
        {/* Main curve */}
        <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
        
        {/* Trough marker (max utilization) */}
        <circle cx={scaleX(troughIdx)} cy={scaleY(trough.value)} r="6" fill="#f59e0b" stroke="#fff" strokeWidth="2" />
        <text x={scaleX(troughIdx)} y={scaleY(trough.value) + 20} textAnchor="middle" 
          className="text-xs fill-amber-600 font-semibold">Trough: {fmt(trough.value)}</text>
        
        {/* Recovery marker */}
        {recoveryIdx !== null && (
          <g>
            <line x1={scaleX(recoveryIdx)} y1={padT} x2={scaleX(recoveryIdx)} y2={chartH - padB} 
              stroke="#22c55e" strokeWidth="2" strokeDasharray="4,4" />
            <text x={scaleX(recoveryIdx)} y={padT - 5} textAnchor="middle" 
              className="text-xs fill-green-600 font-semibold">Recovery M{recoveryMonth.month}</text>
          </g>
        )}
        
        {/* End point */}
        <circle cx={scaleX(cashData.length - 1)} cy={scaleY(cashData[cashData.length-1].value)} 
          r="5" fill="#22c55e" />
      </svg>
      
      <div className="grid grid-cols-4 gap-3 mt-3 text-center text-sm">
        <div className="bg-blue-50 rounded p-2 border border-blue-200">
          <p className="text-xs text-blue-600 uppercase">Starting Cash (M0)</p>
          <p className="font-bold text-blue-700">{fmt(startingCash)}</p>
        </div>
        <div className="bg-amber-50 rounded p-2 border border-amber-200">
          <p className="text-xs text-amber-600 uppercase">Trough (M{troughIdx})</p>
          <p className="font-bold text-amber-700">{fmt(trough.value)}</p>
        </div>
        <div className="bg-red-50 rounded p-2 border border-red-200">
          <p className="text-xs text-red-600 uppercase">Max Utilization</p>
          <p className="font-bold text-red-700">{fmt(maxUtilization)}</p>
        </div>
        <div className="bg-green-50 rounded p-2 border border-green-200">
          <p className="text-xs text-green-600 uppercase">Final (M35)</p>
          <p className="font-bold text-green-700">{fmt(cashData[cashData.length-1]?.value || 0)}</p>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 text-center">
        Pre-launch costs (~$126K) are tracked separately as Shareholder Loan — not shown here
      </div>
    </div>
  );
};
