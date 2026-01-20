// ui/Waterfall.js - Revenue/expense bridge chart
// v7.1: Shows the flow from $0 to final cash position
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.Waterfall = function Waterfall({ model, year = 'all' }) {
  const { useMemo } = React;
  
  const data = useMemo(() => {
    const months = year === 'all' ? model.months : 
      year === 1 ? model.months.slice(0, 12) :
      year === 2 ? model.months.slice(12, 24) : model.months.slice(24, 36);
    
    const sum = (field) => months.reduce((s, m) => s + (m[field] || 0), 0);
    
    return [
      { label: 'Starting Cash', value: 0, type: 'start' },
      { label: 'Management Fees', value: sum('mgmtFee'), type: 'positive' },
      { label: 'Carried Interest', value: sum('totalCarry'), type: 'positive' },
      { label: 'Salaries', value: -sum('totalSalaries'), type: 'negative' },
      { label: 'Operating Expenses', value: -sum('opex'), type: 'negative' },
      { label: 'Setup Costs', value: -sum('setupCost'), type: 'negative' },
      { label: 'BDM Fee Share', value: -sum('bdmFeeShare'), type: 'negative' },
      { label: 'Net Cash', value: months[months.length - 1]?.closingCash || 0, type: 'end' },
    ].filter(d => Math.abs(d.value) > 100 || d.type === 'start' || d.type === 'end');
  }, [model, year]);
  
  const fmt = (v) => {
    const abs = Math.abs(v);
    if (abs >= 1e6) return (v >= 0 ? '' : '-') + '$' + (abs / 1e6).toFixed(1) + 'M';
    if (abs >= 1e3) return (v >= 0 ? '' : '-') + '$' + (abs / 1e3).toFixed(0) + 'K';
    return '$' + v.toFixed(0);
  };
  
  let runningTotal = 0;
  const bars = data.map((d, i) => {
    const start = runningTotal;
    if (d.type !== 'end') runningTotal += d.value;
    return { ...d, start, end: d.type === 'end' ? d.value : runningTotal };
  });
  
  const maxVal = Math.max(...bars.map(b => Math.max(b.start, b.end)));
  const minVal = Math.min(...bars.map(b => Math.min(b.start, b.end)), 0);
  const range = maxVal - minVal || 1;
  
  const chartH = 300;
  const chartW = 700;
  const padL = 120, padR = 20, padT = 30, padB = 60;
  const plotH = chartH - padT - padB;
  const plotW = chartW - padL - padR;
  const barWidth = plotW / bars.length - 10;
  
  const scaleY = (v) => padT + plotH - ((v - minVal) / range) * plotH;
  const zeroY = scaleY(0);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">💧 Cash Flow Waterfall</h2>
        <div className="text-sm text-gray-500">
          {year === 'all' ? 'Full 36 Months' : `Year ${year}`}
        </div>
      </div>
      
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full">
        <line x1={padL} x2={chartW - padR} y1={zeroY} y2={zeroY} stroke="#9ca3af" strokeDasharray="4,4" />
        
        {bars.map((bar, i) => {
          const x = padL + i * (barWidth + 10) + 5;
          const isPositive = bar.type === 'positive' || (bar.type === 'end' && bar.value >= 0);
          const isNegative = bar.type === 'negative' || (bar.type === 'end' && bar.value < 0);
          const y1 = scaleY(Math.max(bar.start, bar.end));
          const y2 = scaleY(Math.min(bar.start, bar.end));
          const height = Math.max(y2 - y1, 2);
          
          const color = bar.type === 'start' ? '#9ca3af' :
            bar.type === 'end' ? (bar.value >= 0 ? '#22c55e' : '#ef4444') :
            isPositive ? '#22c55e' : '#ef4444';
          
          return (
            <g key={i}>
              <rect x={x} y={y1} width={barWidth} height={height} fill={color} rx={2} />
              {i > 0 && i < bars.length - 1 && (
                <line 
                  x1={x - 5} x2={x} 
                  y1={scaleY(bar.start)} y2={scaleY(bar.start)} 
                  stroke="#d1d5db" strokeWidth={1} strokeDasharray="2,2" 
                />
              )}
              <text 
                x={x + barWidth / 2} 
                y={isNegative ? y2 + 14 : y1 - 6} 
                textAnchor="middle" 
                className="text-xs fill-gray-700 font-mono"
              >
                {fmt(bar.type === 'end' ? bar.value : bar.value)}
              </text>
              <text 
                x={x + barWidth / 2} 
                y={chartH - 10} 
                textAnchor="middle" 
                className="text-[10px] fill-gray-500"
                transform={`rotate(-30 ${x + barWidth / 2} ${chartH - 10})`}
              >
                {bar.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
