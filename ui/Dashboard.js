// ui/Dashboard.js - Summary KPI cards and annual table
// v9.3 Batch 4: Added EBITDA, Shareholder Loan, Below the Line section

window.FundModel = window.FundModel || {};

window.FundModel.Dashboard = function Dashboard({ model, scenarioName, onResetScenario }) {
  const fmt = window.FundModel.fmt || window.FundModel.formatCurrency || function(v) {
    if (v == null) return '-';
    const abs = Math.abs(v), sign = v < 0 ? '-' : '';
    if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return sign + '$' + (abs / 1e3).toFixed(0) + 'K';
    return sign + '$' + abs.toFixed(0);
  };
  
  // Bracket notation for negatives
  const fmtBracket = function(v) {
    if (v == null) return '-';
    const abs = Math.abs(v);
    let formatted;
    if (abs >= 1e6) formatted = '$' + (abs / 1e6).toFixed(2) + 'M';
    else if (abs >= 1e3) formatted = '$' + (abs / 1e3).toFixed(0) + 'K';
    else formatted = '$' + abs.toFixed(0);
    return v < 0 ? '(' + formatted + ')' : formatted;
  };
  
  const { summary, breakEvenMonth, cumulativeFounderFunding, months } = model;
  const founderSplit = { total: cumulativeFounderFunding || 0, ian: (cumulativeFounderFunding || 0) / 2, paul: (cumulativeFounderFunding || 0) / 2 };
  const lastMonth = months && months.length > 0 ? months[months.length - 1] : {};
  
  // Calculate Y1 EBITDA (first 12 months) or available months
  const y1Months = months ? months.filter(m => m.month >= 0 && m.month < 12) : [];
  const y1EBITDA = y1Months.reduce((sum, m) => sum + (m.ebitda || m.ebt || 0), 0);
  
  // Calculate total carry (below the line)
  const totalCarry = summary?.totals?.totalCarry || 0;
  const unrealizedCarryValue = lastMonth.closingAUM ? lastMonth.closingAUM * 0.175 : 0;
  
  return (
    <div className="space-y-4">
      {scenarioName !== 'Base' && (
        <div className="rounded-lg shadow p-3 flex justify-between items-center bg-blue-50 border border-blue-200">
          <span className="text-sm font-medium">📊 Viewing <strong>{scenarioName}</strong> scenario</span>
          <button onClick={onResetScenario} className="text-xs px-3 py-1 bg-white rounded border hover:bg-gray-50">Reset to Base</button>
        </div>
      )}
      
      {/* Primary KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KPICard label="Y2 Ending AUM" value={fmt(summary?.y2?.endingAUM || lastMonth.closingAUM)} />
        <KPICard label="Breakeven Month" value={breakEvenMonth !== null ? 'Month ' + breakEvenMonth : 'Not Yet'} color={breakEvenMonth !== null ? 'green' : 'red'} />
        <KPICard label="EBITDA (Y1)" value={fmtBracket(y1EBITDA)} color={y1EBITDA >= 0 ? 'green' : 'red'} />
        <KPICard label="Shareholder Loan" value={fmt(lastMonth.shareholderLoanBalance || 0)} color="amber" border />
        <KPICard label="Y2 Cash Position" value={fmtBracket(summary?.y2?.netCash || lastMonth.closingCash)} color={(summary?.y2?.netCash || lastMonth.closingCash) >= 0 ? 'green' : 'red'} />
      </div>
      
      {/* Founder Funding */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KPICard label="Total Founder Funding" value={fmt(founderSplit.total)} color="amber" border />
        <KPICard label="Ian's Share (50%)" value={fmt(founderSplit.ian)} color="amber" />
        <KPICard label="Paul's Share (50%)" value={fmt(founderSplit.paul)} color="amber" />
      </div>
      
      {/* Below the Line Section */}
      <div className="bg-purple-50 rounded-lg shadow p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-3">Below the Line (Not in Cash Flow)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-purple-600 uppercase">Total Carry (24M)</p>
            <p className="text-2xl font-bold text-purple-700">{fmt(totalCarry)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-purple-600 uppercase">Unrealized Carry Value</p>
            <p className="text-2xl font-bold text-purple-700">{fmt(unrealizedCarryValue)}</p>
            <p className="text-xs text-purple-500">17.5% of ending AUM</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-purple-600 uppercase">Ian Accrued Salary</p>
            <p className="text-2xl font-bold text-purple-700">{fmt(lastMonth.shareholderLoanBalance || 0)}</p>
            <p className="text-xs text-purple-500">In shareholder loan</p>
          </div>
        </div>
      </div>
      
      {/* KPI Table (if available) */}
      {window.FundModel.KPITable && <window.FundModel.KPITable model={model} />}
      
      {/* Annual Summary */}
      <AnnualTable summary={summary} fmt={fmt} fmtBracket={fmtBracket} />
    </div>
  );
};

function KPICard({ label, value, color, border }) {
  const colorClasses = { green: 'text-green-600', red: 'text-red-600', purple: 'text-purple-600', amber: 'text-amber-600', default: 'text-gray-800' };
  const borderClasses = { purple: 'border-2 border-purple-200', amber: 'border-2 border-amber-200', default: '' };
  return (
    <div className={`bg-white rounded-lg shadow p-4 ${border && borderClasses[color] ? borderClasses[color] : ''}`}>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className={`text-2xl font-bold ${colorClasses[color] || colorClasses.default}`}>{value}</p>
    </div>
  );
}

function AnnualTable({ summary, fmt, fmtBracket }) {
  if (!summary) return null;
  const rows = [
    { label: 'Ending AUM', y1: summary.y1?.endingAUM, y2: summary.y2?.endingAUM },
    { label: 'Operating Revenue', y1: summary.y1?.operatingRevenue || summary.y1?.totalMgmtFee, y2: summary.y2?.operatingRevenue || summary.y2?.totalMgmtFee, color: 'green', bg: 'green' },
    { label: 'EBITDA', y1: summary.y1?.ebitda, y2: summary.y2?.ebitda, color: 'blue', bg: 'blue', dynamic: true },
    { label: 'Expenses', y1: summary.y1?.totalExpenses, y2: summary.y2?.totalExpenses, color: 'red', negative: true },
    { label: 'Founder Funding', y1: summary.y1?.founderFunding, y2: summary.y2?.founderFunding, color: 'amber', bg: 'amber' },
    { label: 'Net Cash', y1: summary.y1?.netCash, y2: summary.y2?.netCash, bold: true, dynamic: true },
  ];
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Annual Summary</h2>
      <table className="w-full text-sm">
        <thead><tr className="border-b"><th className="text-left py-2">Metric</th><th className="text-right py-2">Year 1</th><th className="text-right py-2">Year 2</th><th className="text-right py-2 font-bold">Total</th></tr></thead>
        <tbody>
          {rows.map((r, i) => {
            const total = (r.y1 || 0) + (r.y2 || 0);
            const y1Color = r.dynamic ? (r.y1 >= 0 ? 'text-green-600' : 'text-red-600') : (r.color ? `text-${r.color}-600` : '');
            const y2Color = r.dynamic ? (r.y2 >= 0 ? 'text-green-600' : 'text-red-600') : (r.color ? `text-${r.color}-600` : '');
            const bgClass = r.bg ? `bg-${r.bg}-50` : '';
            const fmtFn = r.negative ? (v) => v ? '(' + fmt(Math.abs(v)) + ')' : '-' : fmtBracket;
            return (
              <tr key={i} className={`border-b ${bgClass}`}>
                <td className={`py-2 ${r.bold ? 'font-semibold' : ''}`}>{r.label}</td>
                <td className={`text-right font-mono ${y1Color}`}>{fmtFn(r.y1)}</td>
                <td className={`text-right font-mono ${y2Color}`}>{fmtFn(r.y2)}</td>
                <td className={`text-right font-mono font-bold ${r.color ? `text-${r.color}-600` : ''}`}>{r.label === 'Net Cash' || r.label === 'Ending AUM' ? '-' : fmtFn(total)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
