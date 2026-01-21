// ui/RevenueWaterfall.js - Revenue breakdown waterfall chart
// Shows Management Fees + Carried Interest → Total Revenue
// v10.19: FIXED - Y1/Y2/Y3 buttons now clickable

window.FundModel = window.FundModel || {};

window.FundModel.RevenueWaterfall = function RevenueWaterfall({ model }) {
  const { useState, useMemo } = React;
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  
  // State for selected year filter
  const [year, setYear] = useState('all');
  
  const data = useMemo(() => {
    const postLaunch = model.months.filter(m => !m.isPreLaunch);
    const months = year === 'all' ? postLaunch :
      year === 1 ? postLaunch.slice(0, 12) :
      year === 2 ? postLaunch.slice(12, 24) : postLaunch.slice(24, 36);
    
    const sum = (field) => months.reduce((s, m) => s + (m[field] || 0), 0);
    const carry = sum('carryRevenue') || sum('totalCarry');
    const bdmShare = sum('bdmFeeShare');
    
    return [
      { label: 'Management Fees', value: sum('grossMgmtFee') || sum('mgmtFee'), type: 'positive', color: '#3b82f6' },
      { label: 'Carried Interest', value: carry, type: 'positive', color: '#8b5cf6' },
      { label: 'BDM Fee Share', value: -bdmShare, type: 'negative', color: '#ef4444' },
      { label: 'Net Revenue', value: sum('totalRevenue'), type: 'total', color: '#22c55e' },
    ].filter(d => Math.abs(d.value) > 0 || d.type === 'total');
  }, [model, year]);
  
  const maxVal = Math.max(...data.map(d => Math.abs(d.value)));
  const chartH = 200, chartW = 500;
  const padL = 130, padR = 80, padT = 20, padB = 20;
  const plotH = chartH - padT - padB;
  const barHeight = Math.min(40, (plotH / data.length) - 10);
  
  const scaleX = v => padL + (Math.abs(v) / maxVal) * (chartW - padL - padR);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">💰 Revenue Waterfall</h2>
        <div className="flex gap-1">
          {['all', 1, 2, 3].map(y => (
            <button
              key={y}
              onClick={() => setYear(y)}
              className={`text-xs px-3 py-1 rounded transition-colors cursor-pointer ${
                year === y 
                  ? 'bg-blue-600 text-white font-semibold' 
                  : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-700'
              }`}
            >
              {y === 'all' ? '36M' : `Y${y}`}
            </button>
          ))}
        </div>
      </div>
      
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-48">
        {data.map((d, i) => {
          const y = padT + i * (barHeight + 15);
          const barW = scaleX(d.value) - padL;
          const isTotal = d.type === 'total';
          
          return (
            <g key={i}>
              {/* Label */}
              <text x={padL - 8} y={y + barHeight/2 + 4} textAnchor="end" 
                className={`text-xs ${isTotal ? 'fill-gray-800 font-semibold' : 'fill-gray-600'}`}>
                {d.label}
              </text>
              
              {/* Bar */}
              <rect x={padL} y={y} width={Math.max(barW, 2)} height={barHeight} 
                fill={d.color} rx={3} opacity={isTotal ? 1 : 0.8} />
              
              {/* Value */}
              <text x={padL + barW + 8} y={y + barHeight/2 + 4} 
                className={`text-xs font-mono ${isTotal ? 'fill-green-700 font-bold' : 'fill-gray-700'}`}>
                {d.value < 0 ? '(' + fmt(Math.abs(d.value)) + ')' : fmt(d.value)}
              </text>
              
              {/* Separator line before total */}
              {isTotal && (
                <line x1={padL - 5} x2={chartW - padR + 40} y1={y - 5} y2={y - 5} 
                  stroke="#d1d5db" strokeWidth="1" />
              )}
            </g>
          );
        })}
      </svg>
      
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Mgmt Fee: 1.5% of AUM</span>
        <span>Carry: 17.5% of gains</span>
      </div>
    </div>
  );
};
