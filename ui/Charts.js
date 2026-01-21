// ui/Charts.js - Visualizations v10.19
// ADDED: AUM by Source chart (Issue #6)
// EXISTING: AUM milestone annotations (BUG-104)

window.FundModel = window.FundModel || {};

window.FundModel.AUMChart = function AUMChart({ model }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const { months } = model;
  const maxAUM = Math.max(...months.map(m => m.closingAUM));
  const postLaunch = months.filter(m => m.month >= 0);
  
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
      {[0, 11, 23, 35].map(i => (
        <text key={i} x={scaleX(i)} y={h - 8} textAnchor="middle" className="text-xs fill-gray-500">M{i}</text>
      ))}
      <text x={15} y={h / 2} transform={`rotate(-90 15 ${h/2})`} textAnchor="middle" className="text-xs fill-gray-400">AUM ($)</text>
      <path d={path} fill="none" stroke="#3b82f6" strokeWidth="2.5" />
      {milestones.filter(m => m.value !== undefined).map(m => {
        const x = scaleX(m.idx);
        const y = scaleY(m.value);
        return (
          <g key={m.label}>
            <line x1={x} x2={x} y1={y} y2={padT + plotH} stroke="#3b82f6" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
            <circle cx={x} cy={y} r="5" fill="#3b82f6" />
            <rect x={x - 30} y={y - 22} width="60" height="18" rx="3" fill="#3b82f6" opacity="0.9" />
            <text x={x} y={y - 9} textAnchor="middle" className="text-xs fill-white font-semibold">{fmt(m.value)}</text>
          </g>
        );
      })}
    </svg>
  );
}

// NEW: AUM by Source Chart (Issue #6)
window.FundModel.AUMBySourceChart = function AUMBySourceChart({ model }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const { months } = model;
  const postLaunch = months.filter(m => m.month >= 0);
  
  // Calculate cumulative capital by source
  let cumGP = 0, cumBDM = 0, cumBroker = 0;
  const sourceData = postLaunch.map(m => {
    cumGP += m.gpOrganic || 0;
    cumBDM += m.bdmRaise || 0;
    cumBroker += m.brokerRaise || 0;
    return { month: m.month, gp: cumGP, bdm: cumBDM, broker: cumBroker, total: cumGP + cumBDM + cumBroker };
  });
  
  const lastMonth = sourceData[sourceData.length - 1] || { gp: 0, bdm: 0, broker: 0, total: 1 };
  const gpPct = lastMonth.total > 0 ? (lastMonth.gp / lastMonth.total * 100).toFixed(1) : 0;
  const bdmPct = lastMonth.total > 0 ? (lastMonth.bdm / lastMonth.total * 100).toFixed(1) : 0;
  const brokerPct = lastMonth.total > 0 ? (lastMonth.broker / lastMonth.total * 100).toFixed(1) : 0;
  
  const maxTotal = Math.max(...sourceData.map(d => d.total)) || 1;
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Capital by Source</h2>
      <AUMBySourceSVG data={sourceData} max={maxTotal} fmt={fmt} />
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="bg-blue-50 rounded p-2">
          <p className="text-xs text-blue-600 uppercase">GP Organic</p>
          <p className="text-lg font-bold text-blue-700">{fmt(lastMonth.gp)}</p>
          <p className="text-xs text-blue-500">{gpPct}%</p>
        </div>
        <div className="bg-green-50 rounded p-2">
          <p className="text-xs text-green-600 uppercase">BDM Raise</p>
          <p className="text-lg font-bold text-green-700">{fmt(lastMonth.bdm)}</p>
          <p className="text-xs text-green-500">{bdmPct}%</p>
        </div>
        <div className="bg-orange-50 rounded p-2">
          <p className="text-xs text-orange-600 uppercase">Broker Raise</p>
          <p className="text-lg font-bold text-orange-700">{fmt(lastMonth.broker)}</p>
          <p className="text-xs text-orange-500">{brokerPct}%</p>
        </div>
      </div>
    </div>
  );
};

function AUMBySourceSVG({ data, max, fmt }) {
  const h = 180, w = 700, padL = 60, padR = 80, padT = 10, padB = 30;
  const plotW = w - padL - padR, plotH = h - padT - padB;
  
  const scaleY = v => padT + plotH - (v / max) * plotH;
  const scaleX = i => padL + (i / (data.length - 1)) * plotW;
  
  const gpPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(d.gp)}`).join(' ');
  const bdmPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(d.gp + d.bdm)}`).join(' ');
  const brokerPath = data.map((d, i) => `${i === 0 ? 'M' : 'L'}${scaleX(i)},${scaleY(d.total)}`).join(' ');
  
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-44">
      {[0, 0.5, 1].map((pct, i) => {
        const val = max * pct;
        return (
          <g key={i}>
            <line x1={padL} x2={w - padR} y1={scaleY(val)} y2={scaleY(val)} stroke="#e5e7eb" strokeDasharray="4,4" />
            <text x={padL - 5} y={scaleY(val) + 4} textAnchor="end" className="text-xs fill-gray-500">{fmt(val)}</text>
          </g>
        );
      })}
      {[0, 11, 23, 35].map(i => (
        <text key={i} x={scaleX(i)} y={h - 5} textAnchor="middle" className="text-xs fill-gray-500">M{i}</text>
      ))}
      <path d={gpPath} fill="none" stroke="#3b82f6" strokeWidth="2" />
      <path d={bdmPath} fill="none" stroke="#22c55e" strokeWidth="2" />
      <path d={brokerPath} fill="none" stroke="#f97316" strokeWidth="2" />
      {/* Legend */}
      <rect x={w - 75} y={10} width="10" height="10" fill="#3b82f6" />
      <text x={w - 60} y={18} className="text-xs fill-gray-600">GP</text>
      <rect x={w - 75} y={25} width="10" height="10" fill="#22c55e" />
      <text x={w - 60} y={33} className="text-xs fill-gray-600">BDM</text>
      <rect x={w - 75} y={40} width="10" height="10" fill="#f97316" />
      <text x={w - 60} y={48} className="text-xs fill-gray-600">Broker</text>
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
      <h2 className="font-semibold mb-3">Monthly Burn Rate</h2>
      <SimpleSVGChart data={burnData} max={max} color="#ef4444" negColor="#22c55e" label="Burn" showZero invert />
      <p className="text-xs text-gray-500 mt-2">Positive = burning, Negative = generating</p>
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
