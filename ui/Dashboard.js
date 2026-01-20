// ui/Dashboard.js - Summary KPI cards and annual table
// v8.5: Fixed - inline founderSplit calculation (matches working App.js)

window.FundModel = window.FundModel || {};

window.FundModel.Dashboard = function Dashboard({ model, scenarioName, onResetScenario }) {
  const fmt = window.FundModel.fmt || window.FundModel.formatCurrency || function(v) {
    if (v == null) return '-';
    const abs = Math.abs(v), sign = v < 0 ? '-' : '';
    if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return sign + '$' + (abs / 1e3).toFixed(0) + 'K';
    return sign + '$' + abs.toFixed(0);
  };
  
  const { summary, breakEvenMonth, cumulativeFounderFunding } = model;
  
  // Inline calculation - matches working App.js pattern
  const founderSplit = { 
    total: cumulativeFounderFunding || 0, 
    ian: (cumulativeFounderFunding || 0) / 2, 
    paul: (cumulativeFounderFunding || 0) / 2 
  };
  
  const totalRev = summary.totals.totalRevenue;
  
  return (
    <div className="space-y-4">
      {scenarioName !== 'Base' && (
        <div className="rounded-lg shadow p-3 flex justify-between items-center bg-blue-50 border border-blue-200">
          <span className="text-sm font-medium">📊 Viewing <strong>{scenarioName}</strong> scenario</span>
          <button onClick={onResetScenario} className="text-xs px-3 py-1 bg-white rounded border hover:bg-gray-50">Reset to Base</button>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Y3 Ending AUM" value={fmt(summary.y3.endingAUM)} />
        <KPICard label="Breakeven Month" value={breakEvenMonth !== null ? 'Month ' + breakEvenMonth : 'Not Yet'} color={breakEvenMonth !== null ? 'green' : 'red'} />
        <KPICard label="3Y Total Revenue" value={fmt(totalRev)} />
        <KPICard label="3Y Total Carry" value={fmt(summary.totals.totalCarry)} color="purple" border />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KPICard label="Total Founder Funding" value={fmt(founderSplit.total)} color="amber" border />
        <KPICard label="Ian's Share (50%)" value={fmt(founderSplit.ian)} color="amber" />
        <KPICard label="Paul's Share (50%)" value={fmt(founderSplit.paul)} color="amber" />
        <KPICard label="Y3 Cash Position" value={fmt(summary.y3.netCash)} color={summary.y3.netCash >= 0 ? 'green' : 'red'} />
      </div>
      
      <AnnualTable summary={summary} fmt={fmt} />
    </div>
  );
};

function KPICard({ label, value, color, border }) {
  const colorClasses = {
    green: 'text-green-600', red: 'text-red-600', purple: 'text-purple-600', amber: 'text-amber-600', default: 'text-gray-800'
  };
  const borderClasses = {
    purple: 'border-2 border-purple-200', amber: 'border-2 border-amber-200', default: ''
  };
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${borderClasses[color] || borderClasses.default}`}>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color] || colorClasses.default}`}>{value}</p>
    </div>
  );
}

function AnnualTable({ summary, fmt }) {
  const rows = [
    { label: 'Ending AUM', y1: summary.y1.endingAUM, y2: summary.y2.endingAUM, y3: summary.y3.endingAUM },
    { label: 'Management Fees', y1: summary.y1.totalMgmtFee, y2: summary.y2.totalMgmtFee, y3: summary.y3.totalMgmtFee, color: 'green', bg: 'green' },
    { label: 'Carried Interest', y1: summary.y1.totalCarry, y2: summary.y2.totalCarry, y3: summary.y3.totalCarry, color: 'purple', bg: 'purple' },
    { label: 'Total Revenue', y1: summary.y1.totalRevenue, y2: summary.y2.totalRevenue, y3: summary.y3.totalRevenue, color: 'green', bold: true },
    { label: 'Expenses', y1: -summary.y1.totalExpenses, y2: -summary.y2.totalExpenses, y3: -summary.y3.totalExpenses, color: 'red' },
    { label: 'Founder Funding', y1: summary.y1.founderFunding, y2: summary.y2.founderFunding, y3: summary.y3.founderFunding, color: 'amber', bg: 'amber' },
    { label: 'Net Cash', y1: summary.y1.netCash, y2: summary.y2.netCash, y3: summary.y3.netCash, bold: true, dynamic: true },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Annual Summary</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b"><th className="text-left py-2">Metric</th><th className="text-right py-2">Year 1</th><th className="text-right py-2">Year 2</th><th className="text-right py-2">Year 3</th><th className="text-right py-2 font-bold">Total</th></tr></thead>
        <tbody>
          {rows.map((r, i) => {
            const total = r.y1 + r.y2 + r.y3;
            const colorClass = r.dynamic ? (r.y3 >= 0 ? 'text-green-600' : 'text-red-600') : (r.color ? `text-${r.color}-600` : '');
            const bgClass = r.bg ? `bg-${r.bg}-50` : '';
            return (
              <tr key={i} className={`border-b ${bgClass}`}>
                <td className={`py-2 ${r.bold ? 'font-semibold' : ''}`}>{r.label}</td>
                <td className={`text-right font-mono ${colorClass}`}>{fmt(r.y1)}</td>
                <td className={`text-right font-mono ${colorClass}`}>{fmt(r.y2)}</td>
                <td className={`text-right font-mono ${colorClass}`}>{fmt(r.y3)}</td>
                <td className={`text-right font-mono font-bold ${colorClass}`}>{r.label === 'Net Cash' || r.label === 'Ending AUM' ? '-' : fmt(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
