// ui/CapitalTab.js - Dedicated capital raising configuration
// v10.10: Created for Batch 10 - Capital tab with editable inputs

window.FundModel = window.FundModel || {};

window.FundModel.CapitalTab = function CapitalTab({ assumptions, capitalInputs, onUpdate }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const upd = (k, v) => onUpdate(k, v);
  
  // Calculate totals from capitalInputs
  const postLaunch = capitalInputs.filter(c => c.month >= 0);
  const totals = postLaunch.reduce((acc, c) => ({
    gpOrganic: acc.gpOrganic + c.gpOrganic,
    bdmRaise: acc.bdmRaise + c.bdmRaise,
    brokerRaise: acc.brokerRaise + c.brokerRaise,
    redemption: acc.redemption + c.redemption,
  }), { gpOrganic: 0, bdmRaise: 0, brokerRaise: 0, redemption: 0 });
  totals.total = totals.gpOrganic + totals.bdmRaise + totals.brokerRaise - totals.redemption;
  
  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <SummaryCard label="GP Organic" value={fmt(totals.gpOrganic)} color="blue" />
        <SummaryCard label="BDM Raise" value={fmt(totals.bdmRaise)} color="green" />
        <SummaryCard label="Broker Raise" value={fmt(totals.brokerRaise)} color="orange" />
        <SummaryCard label="Redemptions" value={fmt(totals.redemption)} color="red" />
        <SummaryCard label="Net Capital" value={fmt(totals.total)} color="purple" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* GP Organic Configuration */}
        <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
          <h3 className="font-semibold mb-3 text-blue-800 pb-2 border-b border-blue-200">GP Organic Raise</h3>
          <p className="text-xs text-blue-600 mb-3">Direct capital raised by founders/GPs</p>
          <NumInput label="M0-M3 (Launch)" value={assumptions.gpOrganicM0to3 || 2000000} 
            onChange={v => upd('gpOrganicM0to3', v)} suffix="$/mo" step={100000} />
          <NumInput label="M4-M11 (Growth)" value={assumptions.gpOrganicM4to11 || 3000000} 
            onChange={v => upd('gpOrganicM4to11', v)} suffix="$/mo" step={100000} />
          <NumInput label="M12+ (Mature)" value={assumptions.gpOrganicM12plus || 2500000} 
            onChange={v => upd('gpOrganicM12plus', v)} suffix="$/mo" step={100000} />
          <div className="mt-3 p-2 bg-blue-100 rounded text-xs">
            <strong>36M Total:</strong> {fmt(totals.gpOrganic)}
          </div>
        </div>
        
        {/* BDM Raise Configuration */}
        <div className="bg-green-50 rounded-lg shadow p-4 border border-green-200">
          <h3 className="font-semibold mb-3 text-green-800 pb-2 border-b border-green-200">BDM Raise</h3>
          <p className="text-xs text-green-600 mb-3">Capital raised through Business Development Manager</p>
          <NumInput label="Start Month" value={assumptions.bdmCapitalStartMonth || 7} 
            onChange={v => upd('bdmCapitalStartMonth', v)} suffix="M" />
          <NumInput label="Monthly Amount" value={assumptions.bdmMonthlyCapital || 500000} 
            onChange={v => upd('bdmMonthlyCapital', v)} suffix="$/mo" step={100000} />
          <div className="mt-3 p-2 bg-green-100 rounded text-xs space-y-1">
            <div><strong>Active Months:</strong> M{assumptions.bdmCapitalStartMonth || 7} - M35</div>
            <div><strong>36M Total:</strong> {fmt(totals.bdmRaise)}</div>
          </div>
        </div>
        
        {/* Broker Raise Configuration */}
        <div className="bg-orange-50 rounded-lg shadow p-4 border border-orange-200">
          <h3 className="font-semibold mb-3 text-orange-800 pb-2 border-b border-orange-200">Broker Raise</h3>
          <p className="text-xs text-orange-600 mb-3">Capital raised through placement agents/brokers</p>
          <NumInput label="Start Month" value={assumptions.brokerCapitalStartMonth || 3} 
            onChange={v => upd('brokerCapitalStartMonth', v)} suffix="M" />
          <NumInput label="Monthly Amount" value={assumptions.brokerMonthlyCapital || 500000} 
            onChange={v => upd('brokerMonthlyCapital', v)} suffix="$/mo" step={100000} />
          <div className="mt-3 p-2 bg-orange-100 rounded text-xs space-y-1">
            <div><strong>Active Months:</strong> M{assumptions.brokerCapitalStartMonth || 3} - M35</div>
            <div><strong>36M Total:</strong> {fmt(totals.brokerRaise)}</div>
          </div>
        </div>
      </div>
      
      {/* Capital Schedule Table */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <h3 className="font-semibold mb-3">Capital Schedule (36 Months)</h3>
        <table className="w-full text-xs freeze-table">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-2 text-left sticky left-0 bg-gray-50">Source</th>
              {postLaunch.slice(0, 12).map(c => (
                <th key={c.month} className="py-2 px-1 text-center min-w-14">M{c.month}</th>
              ))}
              <th className="py-2 px-2 text-right bg-blue-50 font-bold">Y1</th>
            </tr>
          </thead>
          <tbody>
            <CapitalRow label="GP Organic" field="gpOrganic" data={postLaunch.slice(0, 12)} color="blue" fmt={fmt} />
            <CapitalRow label="BDM" field="bdmRaise" data={postLaunch.slice(0, 12)} color="green" fmt={fmt} />
            <CapitalRow label="Broker" field="brokerRaise" data={postLaunch.slice(0, 12)} color="orange" fmt={fmt} />
            <CapitalRow label="Redemptions" field="redemption" data={postLaunch.slice(0, 12)} color="red" fmt={fmt} negative />
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">Showing Year 1 (M0-M11). Redemptions start M25+.</p>
      </div>
      
      {/* Redemption Schedule */}
      <div className="bg-red-50 rounded-lg shadow p-4 border border-red-200">
        <h3 className="font-semibold mb-3 text-red-800 pb-2 border-b border-red-200">Redemption Schedule</h3>
        <p className="text-xs text-red-600 mb-3">Expected capital outflows (per PPM lockup periods)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded p-3 border">
            <p className="text-xs text-gray-500">M25</p>
            <p className="font-mono font-semibold text-red-600">{fmt(3000000)}</p>
          </div>
          <div className="bg-white rounded p-3 border">
            <p className="text-xs text-gray-500">M28</p>
            <p className="font-mono font-semibold text-red-600">{fmt(2000000)}</p>
          </div>
          <div className="bg-white rounded p-3 border">
            <p className="text-xs text-gray-500">M31</p>
            <p className="font-mono font-semibold text-red-600">{fmt(4000000)}</p>
          </div>
          <div className="bg-white rounded p-3 border">
            <p className="text-xs text-gray-500">M34</p>
            <p className="font-mono font-semibold text-red-600">{fmt(5000000)}</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-3">Total Redemptions: {fmt(totals.redemption)}</p>
      </div>
    </div>
  );
};

function SummaryCard({ label, value, color }) {
  const colors = { blue: 'bg-blue-100 border-blue-300 text-blue-800', green: 'bg-green-100 border-green-300 text-green-800',
    orange: 'bg-orange-100 border-orange-300 text-orange-800', red: 'bg-red-100 border-red-300 text-red-800',
    purple: 'bg-purple-100 border-purple-300 text-purple-800' };
  return (
    <div className={`rounded-lg shadow p-4 border-2 ${colors[color]}`}>
      <p className="text-xs uppercase font-semibold">{label}</p>
      <p className="text-xl font-bold font-mono">{value}</p>
    </div>
  );
}

function NumInput({ label, value, onChange, suffix, step = 1 }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-200">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-1">
        <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} step={step}
          className="w-24 px-2 py-1 text-right text-blue-600 font-mono text-sm border border-gray-300 rounded" />
        <span className="text-xs text-gray-500 w-10">{suffix}</span>
      </div>
    </div>
  );
}

function CapitalRow({ label, field, data, color, fmt, negative }) {
  const colorClass = `text-${color}-600`;
  const total = data.reduce((s, c) => s + (c[field] || 0), 0);
  return (
    <tr className="border-b">
      <td className="py-1 px-2 font-medium sticky left-0 bg-white">{label}</td>
      {data.map(c => (
        <td key={c.month} className={`py-1 px-1 text-right font-mono ${colorClass}`}>
          {c[field] > 0 ? (negative ? `(${fmt(c[field])})` : fmt(c[field])) : '-'}
        </td>
      ))}
      <td className={`py-1 px-2 text-right font-mono font-bold bg-gray-50 ${colorClass}`}>
        {negative && total > 0 ? `(${fmt(total)})` : fmt(total)}
      </td>
    </tr>
  );
}
