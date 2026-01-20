// ui/Dashboard.js - Summary KPI cards and annual table
// v9.5: KPITable with Rolling AUM, New AUM, Redemptions, Rev % AUM, EBITDA % AUM

window.FundModel = window.FundModel || {};

window.FundModel.Dashboard = function Dashboard({ model, scenarioName, onResetScenario }) {
  const fmtBracket = function(v) {
    if (v == null) return '-';
    const abs = Math.abs(v);
    let formatted;
    if (abs >= 1e6) formatted = '$' + (abs / 1e6).toFixed(2) + 'M';
    else if (abs >= 1e3) formatted = '$' + (abs / 1e3).toFixed(0) + 'K';
    else formatted = '$' + abs.toFixed(0);
    return v < 0 ? '(' + formatted + ')' : formatted;
  };
  const pct = function(v) {
    if (v == null || isNaN(v)) return '-';
    const val = (v * 100).toFixed(2);
    return v < 0 ? '(' + Math.abs(val) + '%)' : val + '%';
  };
  const fmt = fmtBracket;
  
  const { summary, breakEvenMonth, cumulativeFounderFunding, months, startingCashUSD } = model;
  const founderSplit = { total: cumulativeFounderFunding || 0, ian: (cumulativeFounderFunding || 0) / 2, paul: (cumulativeFounderFunding || 0) / 2 };
  const lastMonth = months && months.length > 0 ? months[months.length - 1] : {};
  const startingPot = startingCashUSD || 367000;
  
  const y1Months = months ? months.filter(m => m.month >= 0 && m.month < 12) : [];
  const y1EBITDA = y1Months.reduce((sum, m) => sum + (m.ebitda || 0), 0);
  const totalCarry = summary?.totals?.totalCarry || 0;
  
  return (
    <div className="space-y-4">
      {scenarioName !== 'Base' && (
        <div className="rounded-lg shadow p-3 flex justify-between items-center bg-blue-50 border border-blue-200">
          <span className="text-sm font-medium">📊 Viewing <strong>{scenarioName}</strong> scenario</span>
          <button onClick={onResetScenario} className="text-xs px-3 py-1 bg-white rounded border hover:bg-gray-50">Reset to Base</button>
        </div>
      )}
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <KPICard label="Starting Pot" value={fmt(startingPot)} color="blue" border />
        <KPICard label="Y2 Ending AUM" value={fmt(summary?.y2?.endingAUM || lastMonth.closingAUM)} />
        <KPICard label="Breakeven Month" value={breakEvenMonth !== null ? 'Month ' + breakEvenMonth : 'Not Yet'} color={breakEvenMonth !== null ? 'green' : 'red'} />
        <KPICard label="EBITDA (Y1)" value={fmtBracket(y1EBITDA)} color={y1EBITDA >= 0 ? 'green' : 'red'} />
        <KPICard label="Shareholder Loan" value={fmt(lastMonth.shareholderLoanBalance || 0)} color="amber" border />
        <KPICard label="Y2 Cash Position" value={fmtBracket(summary?.y2?.netCash || lastMonth.closingCash)} color={(summary?.y2?.netCash || lastMonth.closingCash) >= 0 ? 'green' : 'red'} />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <KPICard label="Total Founder Funding" value={fmt(founderSplit.total)} color="amber" border />
        <KPICard label="Ian's Share (50%)" value={fmt(founderSplit.ian)} color="amber" />
        <KPICard label="Paul's Share (50%)" value={fmt(founderSplit.paul)} color="amber" />
      </div>
      
      <div className="bg-purple-50 rounded-lg shadow p-4 border border-purple-200">
        <h3 className="font-semibold text-purple-800 mb-3">Below the Line (Not in Cash Flow)</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center"><p className="text-xs text-purple-600 uppercase">Total Carry (24M)</p><p className="text-2xl font-bold text-purple-700">{fmt(totalCarry)}</p></div>
          <div className="text-center"><p className="text-xs text-purple-600 uppercase">Unrealized Carry Value</p><p className="text-2xl font-bold text-purple-700">{fmt(lastMonth.closingAUM ? lastMonth.closingAUM * 0.175 : 0)}</p></div>
          <div className="text-center"><p className="text-xs text-purple-600 uppercase">Ian Accrued Salary</p><p className="text-2xl font-bold text-purple-700">{fmt(lastMonth.shareholderLoanBalance || 0)}</p></div>
        </div>
      </div>
      
      <AnnualTable summary={summary} fmt={fmt} fmtBracket={fmtBracket} />
      <KPITable model={model} fmt={fmt} pct={pct} />
    </div>
  );
};

function KPICard({ label, value, color, border }) {
  const colorClasses = { green: 'text-green-600', red: 'text-red-600', purple: 'text-purple-600', amber: 'text-amber-600', blue: 'text-blue-600', default: 'text-gray-800' };
  const borderClasses = { purple: 'border-2 border-purple-200', amber: 'border-2 border-amber-200', blue: 'border-2 border-blue-200', default: '' };
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
    { label: 'Operating Revenue', y1: summary.y1?.operatingRevenue, y2: summary.y2?.operatingRevenue, color: 'green', bg: 'green' },
    { label: 'EBITDA', y1: summary.y1?.ebitda, y2: summary.y2?.ebitda, color: 'blue', bg: 'blue', dynamic: true },
    { label: 'Expenses', y1: summary.y1?.totalExpenses, y2: summary.y2?.totalExpenses, color: 'red', negative: true },
    { label: 'Founder Funding', y1: summary.y1?.founderFunding, y2: summary.y2?.founderFunding, color: 'amber', bg: 'amber' },
    { label: 'Net Cash', y1: summary.y1?.netCash, y2: summary.y2?.netCash, bold: true, dynamic: true },
  ];
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-3">Annual Summary</h2>
      <table className="w-full text-sm"><thead><tr className="border-b"><th className="text-left py-2 sticky left-0 bg-white z-10">Metric</th><th className="text-right py-2">Year 1</th><th className="text-right py-2">Year 2</th><th className="text-right py-2 font-bold">Total</th></tr></thead>
        <tbody>{rows.map((r, i) => {
          const total = (r.y1 || 0) + (r.y2 || 0);
          const y1Color = r.dynamic ? (r.y1 >= 0 ? 'text-green-600' : 'text-red-600') : (r.color ? `text-${r.color}-600` : '');
          const y2Color = r.dynamic ? (r.y2 >= 0 ? 'text-green-600' : 'text-red-600') : (r.color ? `text-${r.color}-600` : '');
          const bgClass = r.bg ? `bg-${r.bg}-50` : '';
          return (<tr key={i} className={`border-b ${bgClass}`}><td className={`py-2 sticky left-0 bg-white z-10 ${r.bold ? 'font-semibold' : ''}`}>{r.label}</td><td className={`text-right font-mono ${y1Color}`}>{fmtBracket(r.y1)}</td><td className={`text-right font-mono ${y2Color}`}>{fmtBracket(r.y2)}</td><td className={`text-right font-mono font-bold ${r.color ? `text-${r.color}-600` : ''}`}>{r.label === 'Net Cash' || r.label === 'Ending AUM' ? '-' : fmtBracket(total)}</td></tr>);
        })}</tbody>
      </table>
    </div>
  );
}

function KPITable({ model, fmt, pct }) {
  const { months, summary } = model;
  if (!months || months.length === 0) return null;
  const postLaunch = months.filter(m => !m.isPreLaunch).slice(0, 24);
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="font-semibold mb-3">Monthly KPI Table</h2>
      <table className="w-full text-xs">
        <thead><tr className="border-b bg-gray-50"><th className="py-2 px-2 text-left sticky left-0 bg-gray-50 z-10 min-w-28">KPI</th>
          {postLaunch.map(m => <th key={m.month} className="py-2 px-1 text-center min-w-16">{m.label}</th>)}
        </tr></thead>
        <tbody>
          <tr className="border-b"><td className="py-1 px-2 font-medium sticky left-0 bg-white z-10">Rolling AUM</td>
            {postLaunch.map(m => <td key={m.month} className="py-1 px-1 text-right font-mono">{fmt(m.closingAUM)}</td>)}</tr>
          <tr className="border-b bg-blue-50"><td className="py-1 px-2 font-medium sticky left-0 bg-blue-50 z-10">New AUM</td>
            {postLaunch.map(m => <td key={m.month} className="py-1 px-1 text-right font-mono text-blue-600">{fmt(m.newCapital)}</td>)}</tr>
          <tr className="border-b bg-orange-50"><td className="py-1 px-2 font-medium sticky left-0 bg-orange-50 z-10">Redemptions</td>
            {postLaunch.map(m => <td key={m.month} className="py-1 px-1 text-right font-mono text-orange-600">{m.redemption > 0 ? fmt(m.redemption) : '-'}</td>)}</tr>
          <tr className="border-b bg-green-50"><td className="py-1 px-2 font-medium sticky left-0 bg-green-50 z-10">Revenue</td>
            {postLaunch.map(m => <td key={m.month} className="py-1 px-1 text-right font-mono text-green-600">{fmt(m.operatingRevenue)}</td>)}</tr>
          <tr className="border-b"><td className="py-1 px-2 font-medium sticky left-0 bg-white z-10">Rev % AUM</td>
            {postLaunch.map(m => <td key={m.month} className="py-1 px-1 text-right font-mono">{pct(m.openingAUM > 0 ? m.operatingRevenue / m.openingAUM : 0)}</td>)}</tr>
          <tr className="border-b"><td className="py-1 px-2 font-medium sticky left-0 bg-white z-10">EBITDA</td>
            {postLaunch.map(m => <td key={m.month} className={`py-1 px-1 text-right font-mono ${m.ebitda >= 0 ? 'text-green-600' : 'text-red-600'}`}>{fmt(m.ebitda)}</td>)}</tr>
          <tr className="border-b bg-gray-100"><td className="py-1 px-2 font-bold sticky left-0 bg-gray-100 z-10">EBITDA % AUM</td>
            {postLaunch.map(m => <td key={m.month} className={`py-1 px-1 text-right font-mono font-bold ${m.ebitda >= 0 ? 'text-green-700' : 'text-red-700'}`}>{pct(m.openingAUM > 0 ? m.ebitda / m.openingAUM : 0)}</td>)}</tr>
        </tbody>
      </table>
    </div>
  );
}
