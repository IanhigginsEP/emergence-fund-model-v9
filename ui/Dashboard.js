// ui/Dashboard.js - Summary KPI cards, Cash Flow, and KPI Table
// v10.15: Fixed BUG-001 cash validation - M0 prevCash now uses M-1 closing cash

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
  
  // FIX BUG-001: Use M-1 closing cash as M0's prevCash, not startingCash
  const preLaunchMonths = months ? months.filter(m => m.isPreLaunch) : [];
  const postLaunch = months ? months.filter(m => !m.isPreLaunch) : [];
  const m0PrevCash = preLaunchMonths.length > 0 
    ? (preLaunchMonths[preLaunchMonths.length - 1].closingCash || startingPot) 
    : startingPot;
  const validationStatus = calculateValidationStatus(postLaunch, m0PrevCash);
  
  return (
    <div className="space-y-4">
      {/* Validation Status Banner */}
      <ValidationBanner status={validationStatus} />
      
      {scenarioName !== 'Base' && (
        <div className="rounded-lg shadow p-3 flex items-center justify-between bg-blue-50 border border-blue-200">
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
          <div className="text-center"><p className="text-xs text-purple-600 uppercase">Shareholder Loan Balance</p><p className="text-2xl font-bold text-purple-700">{fmt(lastMonth.shareholderLoanBalance || 0)}</p></div>
        </div>
      </div>
      
      {/* Cash Flow Table - primary position */}
      <DashboardCashFlow model={model} fmt={fmt} fmtBracket={fmtBracket} />
      
      {/* KPI Table - immediately below Cash Flow */}
      <DashboardKPITable model={model} fmt={fmt} pct={pct} />
      
      {/* Annual Summary at bottom */}
      <AnnualTable summary={summary} fmt={fmt} fmtBracket={fmtBracket} />
    </div>
  );
};

function calculateValidationStatus(postLaunch, m0PrevCash) {
  let aumOk = true, cashOk = true, shareClassOk = true;
  
  postLaunch.forEach((m, idx) => {
    // AUM check: Opening + Net Capital + Gain = Closing
    const aumVariance = Math.abs((m.closingAUM || 0) - ((m.openingAUM || 0) + (m.netCapital || 0) + (m.investmentGain || 0)));
    if (aumVariance > 1) aumOk = false;
    
    // Cash check: Previous Closing + Net Cash Flow + Founder Funding = Current Closing
    // BUG-001 FIX: For M0, use M-1's closing cash (m0PrevCash), not startingCash
    const prevCash = idx > 0 ? (postLaunch[idx - 1].closingCash || 0) : m0PrevCash;
    const founderFunding = m.founderFundingRequired || 0;
    const expectedCash = prevCash + (m.netCashFlow || 0) + founderFunding;
    const cashVariance = Math.abs((m.closingCash || 0) - expectedCash);
    if (cashVariance > 1) cashOk = false;
    
    // Share class check: Sum of classes = Total AUM
    if (m.shareClasses) {
      const sumClasses = (m.shareClasses.founder?.aum || 0) + (m.shareClasses.classA?.aum || 0) + 
                        (m.shareClasses.classB?.aum || 0) + (m.shareClasses.classC?.aum || 0);
      const scVariance = Math.abs((m.closingAUM || 0) - sumClasses);
      if (scVariance > 1) shareClassOk = false;
    }
  });
  
  return { aumOk, cashOk, shareClassOk, allOk: aumOk && cashOk && shareClassOk };
}

function ValidationBanner({ status }) {
  if (status.allOk) {
    return (
      <div className="rounded-lg p-3 flex items-center justify-between bg-green-50 border border-green-200">
        <div className="flex items-center gap-2">
          <span className="text-green-600 text-lg">✓</span>
          <span className="text-sm font-medium text-green-800">All reconciliations passed</span>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="text-green-600">✓ AUM</span>
          <span className="text-green-600">✓ Cash</span>
          <span className="text-green-600">✓ Share Classes</span>
        </div>
      </div>
    );
  }
  
  return (
    <div className="rounded-lg p-3 flex items-center justify-between bg-red-50 border border-red-200">
      <div className="flex items-center gap-2">
        <span className="text-red-600 text-lg">⚠</span>
        <span className="text-sm font-medium text-red-800">Reconciliation errors detected</span>
      </div>
      <div className="flex gap-3 text-xs">
        <span className={status.aumOk ? 'text-green-600' : 'text-red-600'}>{status.aumOk ? '✓' : '✗'} AUM</span>
        <span className={status.cashOk ? 'text-green-600' : 'text-red-600'}>{status.cashOk ? '✓' : '✗'} Cash</span>
        <span className={status.shareClassOk ? 'text-green-600' : 'text-red-600'}>{status.shareClassOk ? '✓' : '✗'} Share Classes</span>
      </div>
    </div>
  );
}

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

function DashboardCashFlow({ model, fmt, fmtBracket }) {
  const { months } = model;
  if (!months || months.length === 0) return null;
  const postLaunch = months.filter(m => !m.isPreLaunch).slice(0, 12);
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="font-semibold mb-3">Cash Flow Statement (Year 1)</h2>
      <table className="w-full text-xs">
        <thead><tr className="border-b bg-gray-50 sticky top-0 z-20">
          <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 z-30 min-w-32">Line Item</th>
          {postLaunch.map(m => <th key={m.month} className="py-2 px-1 text-center min-w-16">{m.label}</th>)}
        </tr></thead>
        <tbody>
          <CashFlowRow label="Operating Revenue" months={postLaunch} field="operatingRevenue" fmt={fmt} color="green" bg="green" />
          <CashFlowRow label="Cash Expenses" months={postLaunch} field="totalCashExpenses" fmt={fmt} color="red" bracket />
          <CashFlowRow label="EBITDA" months={postLaunch} field="ebitda" fmt={fmtBracket} dynamic bg="blue" bold />
          <CashFlowRow label="Founder Funding" months={postLaunch} field="founderFundingRequired" fmt={fmt} color="amber" bg="amber" />
          <CashFlowRow label="Cash Balance" months={postLaunch} field="closingCash" fmt={fmtBracket} dynamic bg="gray" bold />
        </tbody>
      </table>
    </div>
  );
}

function CashFlowRow({ label, months, field, fmt, color, bg, bold, bracket, dynamic }) {
  const bgClass = bg ? `bg-${bg}-50` : '';
  return (
    <tr className={`border-b ${bgClass}`}>
      <td className={`py-1 px-2 sticky left-0 z-10 ${bgClass || 'bg-white'} ${bold ? 'font-semibold' : ''}`}>{label}</td>
      {months.map(m => {
        let val = m[field] || 0;
        let colorClass = '';
        if (dynamic) colorClass = val >= 0 ? 'text-green-600' : 'text-red-600';
        else if (color) colorClass = `text-${color}-600`;
        const display = bracket && val < 0 ? '(' + fmt(Math.abs(val)) + ')' : fmt(val);
        return <td key={m.month} className={`py-1 px-1 text-right font-mono ${colorClass}`}>{val !== 0 ? display : '-'}</td>;
      })}
    </tr>
  );
}

function DashboardKPITable({ model, fmt, pct }) {
  const { months } = model;
  if (!months || months.length === 0) return null;
  const postLaunch = months.filter(m => !m.isPreLaunch).slice(0, 12);
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="font-semibold mb-3">KPI Metrics (Year 1)</h2>
      <table className="w-full text-xs">
        <thead><tr className="border-b bg-gray-50 sticky top-0 z-20">
          <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 z-30 min-w-28">KPI</th>
          {postLaunch.map(m => <th key={m.month} className="py-2 px-1 text-center min-w-16">{m.label}</th>)}
        </tr></thead>
        <tbody>
          <KPIRow label="Rolling AUM" months={postLaunch} field="closingAUM" fmt={fmt} />
          <KPIRow label="New AUM" months={postLaunch} field="newCapital" fmt={fmt} color="blue" bg="blue" />
          <KPIRow label="Redemptions" months={postLaunch} field="redemption" fmt={fmt} color="orange" bg="orange" />
          <KPIRow label="Rev % AUM" months={postLaunch} compute={m => m.openingAUM > 0 ? (m.operatingRevenue / m.openingAUM) * 12 : 0} fmt={pct} color="green" />
          <KPIRow label="EBITDA % AUM" months={postLaunch} compute={m => m.openingAUM > 0 ? (m.ebitda / m.openingAUM) * 12 : 0} fmt={pct} dynamic bold bg="gray" />
        </tbody>
      </table>
    </div>
  );
}

function KPIRow({ label, months, field, compute, fmt, color, bg, bold, dynamic }) {
  const bgClass = bg ? `bg-${bg}-50` : '';
  return (
    <tr className={`border-b ${bgClass}`}>
      <td className={`py-1 px-2 sticky left-0 z-10 ${bgClass || 'bg-white'} ${bold ? 'font-bold' : 'font-medium'}`}>{label}</td>
      {months.map(m => {
        const val = compute ? compute(m) : (m[field] || 0);
        let colorClass = '';
        if (dynamic) colorClass = val >= 0 ? 'text-green-700' : 'text-red-700';
        else if (color) colorClass = `text-${color}-600`;
        return <td key={m.month} className={`py-1 px-1 text-right font-mono ${colorClass} ${bold ? 'font-bold' : ''}`}>{val !== 0 ? fmt(val) : '-'}</td>;
      })}
    </tr>
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
