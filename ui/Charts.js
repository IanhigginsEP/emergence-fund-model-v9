// ui/Charts.js - Visualizations for AUM, cash, burn rate
// v10.18: Added AUM milestone annotations (BUG-104)

window.FundModel = window.FundModel || {};

window.FundModel.AUMChart = function AUMChart({ model }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const { months } = model;
  const maxAUM = Math.max(...months.map(m => m.closingAUM));
  const postLaunch = months.filter(m => m.month >= 0);
  
  // Calculate milestone values
  const m12Data = postLaunch.find(m => m.month === 11);
  const m24Data = postLaunch.find(m => m.month === 23);
  const m36Data = postLaunch.find(m => m.month === 35);
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">AUM Trajectory</h2>
      <AUMChartSVG 
        data={postLaunch.map(m => m.closingAUM)} 
        max={maxAUM} 
        milestones={[
          { idx: 11, value: m12Data?.closingAUM, label: 'M12' },
          { idx: 23, value: m24Data?.closingAUM, label: 'M24' },
          { idx: 35, value: m36Data?.closingAUM, label: 'M36' }
        ]}
        fmt={fmt}
      />
    </div>
  );
};

function AUMChartSVG({ data, max, milestones, fmt }) {
  const h = 200, w = 700, padL = 70, padR = 20, padT = 30, padB = 35;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const effectiveMax = max || 1;
  
  const scaleY = v => padT + plotH - (v / effectiveMax) * plotH;
  const scaleX = i => padL + (i / (data.length - 1)) * plotW;
  
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(v)}`).join(' ');
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-52">
      {/* Y-axis grid lines and labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
        const val = effectiveMax * pct;
        const y = scaleY(val);
        return (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4,4" />
            <text x={padL - 5} y={y + 4} textAnchor="end" className="text-xs fill-gray-500">{fmt(val)}</text>
          </g>
        );
      })}
      
      {/* X-axis labels */}
      {[0, 11, 23, 35].map(i => (
        <text key={i} x={scaleX(i)} y={h - 8} textAnchor="middle" className="text-xs fill-gray-500">M{i}</text>
      ))}
      
      {/* Axis titles */}
      <text x={15} y={h / 2} transform={`rotate(-90 15 ${h/2})`} textAnchor="middle" className="text-xs fill-gray-400">AUM ($)</text>
      <text x={w / 2} y={h - 2} textAnchor="middle" className="text-xs fill-gray-400">Month</text>
      
      {/* Main curve */}
      <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      
      {/* Milestone annotations (BUG-104) */}
      {milestones.filter(m => m.value !== undefined).map(m => {
        const x = scaleX(m.idx);
        const y = scaleY(m.value);
        return (
          <g key={m.label}>
            {/* Vertical reference line */}
            <line x1={x} x2={x} y1={y} y2={padT + plotH} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
            {/* Dot */}
            <circle cx={x} cy={y} r="5" fill="#3b82f6" />
            {/* Label background */}
            <rect x={x - 30} y={y - 22} width="60" height="18" rx="3" fill="#3b82f6" opacity="0.9" />
            {/* Label text */}
            <text x={x} y={y - 9} textAnchor="middle" className="text-xs fill-white font-semibold">{fmt(m.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}

window.FundModel.CashChart = function CashChart({ model }) {
  const { formatCurrency } = window.FundModel;
  const { months } = model;
  const values = months.filter(m => m.month >= 0).map(m => m.closingCash);
  const max = Math.max(...values.map(Math.abs));
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Cash Position</h2>
      <SimpleSVGChart data={values} max={max} color="#22c55e" negColor="#ef4444" label="Cash" showZero />
    </div>
  );
};

window.FundModel.BurnRateChart = function BurnRateChart({ model }) {
  const { months } = model;
  const postLaunch = months.filter(m => m.month >= 0);
  const burnData = postLaunch.map(m => m.totalExpenses - m.totalRevenue);
  const max = Math.max(...burnData.map(Math.abs));
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Monthly Burn Rate (Expenses - Revenue)</h2>
      <SimpleSVGChart data={burnData} max={max} color="#ef4444" negColor="#22c55e" label="Burn" showZero invert />
      <p className="text-xs text-gray-500 mt-2">Positive = burning cash, Negative = generating cash</p>
    </div>
  );
};

window.FundModel.FounderFundingChart = function FounderFundingChart({ model }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const { months, cumulativeFounderFunding } = model;
  const postLaunch = months.filter(m => m.month >= 0);
  const cumData = postLaunch.map(m => m.cumulativeFounderFunding);
  const max = cumulativeFounderFunding || 1;
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Cumulative Founder Funding</h2>
      <SimpleSVGChart data={cumData} max={max} color="#f59e0b" label="Funding" />
      <div className="mt-3 grid grid-cols-2 gap-4 text-center">
        <div className="bg-amber-50 rounded p-3">
          <p className="text-xs text-amber-600 uppercase">Ian's Total</p>
          <p className="text-xl font-bold text-amber-700">{fmt(cumulativeFounderFunding / 2)}</p>
        </div>
        <div className="bg-amber-50 rounded p-3">
          <p className="text-xs text-amber-600 uppercase">Paul's Total</p>
          <p className="text-xl font-bold text-amber-700">{fmt(cumulativeFounderFunding / 2)}</p>
        </div>
      </div>
    </div>
  );
};

function SimpleSVGChart({ data, max, color, negColor, label, showZero, invert }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const h = 180, w = 700, padL = 60, padR = 10, padT = 10, padB = 25;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  const effectiveMax = max || 1;
  const hasNeg = data.some(v => v < 0);
  const minVal = hasNeg ? Math.min(...data) : 0;
  const range = effectiveMax - minVal || 1;
  
  const scaleY = v => padT + plotH - ((v - minVal) / range) * plotH;
  const scaleX = i => padL + (i / (data.length - 1)) * plotW;
  const zeroY = scaleY(0);
  
  const path = data.map((v, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(v)}`).join(' ');
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-48">
      {[0, 0.5, 1].map((pct, i) => {
        const val = minVal + range * pct;
        const y = scaleY(val);
        return (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#e5e7eb" strokeDasharray="4,4" />
            <text x={padL - 5} y={y + 4} textAnchor="end" className="text-xs fill-gray-500">{fmt(val)}</text>
          </g>
        );
      })}
      {showZero && <line x1={padL} x2={w - padR} y1={zeroY} y2={zeroY} stroke="#9ca3af" />}
      {[0, 11, 23, 35].map(i => (
        <text key={i} x={scaleX(i)} y={h - 5} textAnchor="middle" className="text-xs fill-gray-500">M{i}</text>
      ))}
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" />
      {[0, 11, 23, 35].map(i => {
        const v = data[i];
        const dotColor = (negColor && v < 0) ? negColor : color;
        return <circle key={i} cx={scaleX(i)} cy={scaleY(v)} r="4" fill={dotColor} />;
      })}
    </svg>
  );
}

window.FundModel.CashVsLiabilitiesChart = function CashVsLiabilitiesChart({ model }) {
  return window.FundModel.CashChart({ model });
};
