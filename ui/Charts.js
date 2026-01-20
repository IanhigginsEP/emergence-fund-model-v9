// ui/Charts.js - Visualizations for AUM, cash, burn rate
// v7: Added burn rate and founder funding charts
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.AUMChart = function AUMChart({ model }) {
  const { formatCurrency } = window.FundModel;
  const { months } = model;
  const maxAUM = Math.max(...months.map(m => m.closingAUM));
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">AUM Trajectory</h2>
      <SimpleSVGChart data={months.map(m => m.closingAUM)} max={maxAUM} color="#3b82f6" label="AUM" />
    </div>
  );
};

window.FundModel.CashChart = function CashChart({ model }) {
  const { months } = model;
  const values = months.map(m => m.closingCash);
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
  const burnData = months.map(m => m.totalExpenses - m.totalRevenue);
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
  const { months, cumulativeFounderFunding } = model;
  const cumData = months.map(m => m.cumulativeFounderFunding);
  const max = cumulativeFounderFunding || 1;
  const fmt = formatCurrency;
  
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
        <text key={i} x={scaleX(i)} y={h - 5} textAnchor="middle" className="text-xs fill-gray-500">M{i + 1}</text>
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
