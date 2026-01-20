// ui/ExpenseWaterfall.js - Expense breakdown waterfall chart
// Shows Salaries + OpEx + Commissions → Total Expenses
// v9.1: Added for LP-ready enhancements

window.FundModel = window.FundModel || {};

window.FundModel.ExpenseWaterfall = function ExpenseWaterfall({ model, year = 'all' }) {
  const { useMemo } = React;
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  
  const data = useMemo(() => {
    const months = year === 'all' ? model.months :
      year === 1 ? model.months.slice(0, 12) :
      year === 2 ? model.months.slice(12, 24) : model.months.slice(24, 36);
    
    const sum = (field) => months.reduce((s, m) => s + (m[field] || 0), 0);
    
    return [
      { label: 'Founder Salaries', value: sum('ianSalary') + sum('paulSalary'), color: '#f59e0b' },
      { label: 'Lewis (COO)', value: sum('lewisSalary'), color: '#f97316' },
      { label: 'EA + Chairman', value: sum('eaSalary') + sum('chairmanCost'), color: '#fb923c' },
      { label: 'Compliance', value: sum('compliance'), color: '#6366f1' },
      { label: 'Office & IT', value: sum('officeIT'), color: '#8b5cf6' },
      { label: 'Marketing', value: sum('marketing'), color: '#a855f7' },
      { label: 'Travel', value: sum('travel'), color: '#c084fc' },
      { label: 'Setup Costs', value: sum('setupCost'), color: '#94a3b8' },
      { label: 'Broker Commission', value: sum('brokerCommission'), color: '#64748b' },
      { label: 'Total Expenses', value: sum('totalExpenses'), type: 'total', color: '#ef4444' },
    ].filter(d => Math.abs(d.value) > 0 || d.type === 'total');
  }, [model, year]);
  
  const maxVal = Math.max(...data.map(d => d.value));
  const chartH = 280, chartW = 500;
  const padL = 130, padR = 80, padT = 15, padB = 15;
  const plotH = chartH - padT - padB;
  const barHeight = Math.min(24, (plotH / data.length) - 4);
  
  const scaleX = v => padL + (v / maxVal) * (chartW - padL - padR);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">📊 Expense Waterfall</h2>
        <div className="flex gap-2">
          {['all', 1, 2, 3].map(y => (
            <span key={y} className={`text-xs px-2 py-1 rounded ${
              year === y ? 'bg-red-100 text-red-700' : 'text-gray-400'
            }`}>{y === 'all' ? '36M' : `Y${y}`}</span>
          ))}
        </div>
      </div>
      
      <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full h-64">
        {data.map((d, i) => {
          const y = padT + i * (barHeight + 4);
          const barW = scaleX(d.value) - padL;
          const isTotal = d.type === 'total';
          
          return (
            <g key={i}>
              {/* Label */}
              <text x={padL - 8} y={y + barHeight/2 + 3} textAnchor="end" 
                className={`text-[10px] ${isTotal ? 'fill-gray-800 font-semibold' : 'fill-gray-600'}`}>
                {d.label}
              </text>
              
              {/* Bar */}
              <rect x={padL} y={y} width={Math.max(barW, 2)} height={barHeight} 
                fill={d.color} rx={2} opacity={isTotal ? 1 : 0.85} />
              
              {/* Value */}
              <text x={padL + barW + 6} y={y + barHeight/2 + 3} 
                className={`text-[10px] font-mono ${isTotal ? 'fill-red-700 font-bold' : 'fill-gray-600'}`}>
                {fmt(d.value)}
              </text>
              
              {/* Separator line before total */}
              {isTotal && (
                <line x1={padL - 5} x2={chartW - padR + 40} y1={y - 3} y2={y - 3} 
                  stroke="#d1d5db" strokeWidth="1" />
              )}
            </g>
          );
        })}
      </svg>
      
      {/* Category breakdown */}
      <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
        <div className="bg-amber-50 rounded p-2 text-center">
          <p className="text-amber-600">Personnel</p>
          <p className="font-semibold text-amber-700">
            {fmt(data.filter(d => ['Founder Salaries', 'Lewis (COO)', 'EA + Chairman'].includes(d.label))
              .reduce((s, d) => s + d.value, 0))}
          </p>
        </div>
        <div className="bg-purple-50 rounded p-2 text-center">
          <p className="text-purple-600">Operations</p>
          <p className="font-semibold text-purple-700">
            {fmt(data.filter(d => ['Compliance', 'Office & IT', 'Marketing', 'Travel'].includes(d.label))
              .reduce((s, d) => s + d.value, 0))}
          </p>
        </div>
        <div className="bg-gray-50 rounded p-2 text-center">
          <p className="text-gray-600">One-time</p>
          <p className="font-semibold text-gray-700">
            {fmt(data.filter(d => ['Setup Costs', 'Broker Commission'].includes(d.label))
              .reduce((s, d) => s + d.value, 0))}
          </p>
        </div>
      </div>
    </div>
  );
};
