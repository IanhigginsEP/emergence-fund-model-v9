// ui/BalanceSheet.js - Balance Sheet with Shareholder Loan tracking
// v10.0: Rolling SL balance display (accumulation only, no repayment)

window.FundModel = window.FundModel || {};

window.FundModel.BalanceSheet = function BalanceSheet({ model }) {
  const { months } = model;
  const slConfig = window.FundModel.SHAREHOLDER_LOAN || {};
  const initialItems = slConfig.initialItems || [];
  
  const fmt = function(v) {
    if (v == null) return '-';
    const abs = Math.abs(v);
    if (abs >= 1e6) return '$' + (abs / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return '$' + (abs / 1e3).toFixed(0) + 'K';
    return '$' + abs.toFixed(0);
  };
  
  const initialBalance = window.FundModel.getInitialShareholderLoan ? 
    window.FundModel.getInitialShareholderLoan() : 
    initialItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  
  const postLaunch = months ? months.filter(m => !m.isPreLaunch).slice(0, 24) : [];
  const lastMonth = postLaunch.length > 0 ? postLaunch[postLaunch.length - 1] : {};
  
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-3 text-amber-800">Shareholder Loan - Initial Balance</h2>
        <p className="text-sm text-gray-500 mb-3">Items contributed to initial SL balance (no interest until Year 3)</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-amber-50">
              <th className="py-2 px-3 text-left">Description</th>
              <th className="py-2 px-3 text-right">Amount</th>
              <th className="py-2 px-3 text-center">GP Expense?</th>
            </tr>
          </thead>
          <tbody>
            {initialItems.map((item, i) => (
              <tr key={i} className="border-b hover:bg-gray-50">
                <td className="py-2 px-3">{item.description}</td>
                <td className="py-2 px-3 text-right font-mono text-amber-600">{fmt(item.amount)}</td>
                <td className="py-2 px-3 text-center">{item.gpExpense ? '✓' : '-'}</td>
              </tr>
            ))}
            <tr className="bg-amber-100 font-semibold">
              <td className="py-2 px-3">Total Initial Balance</td>
              <td className="py-2 px-3 text-right font-mono text-amber-700">{fmt(initialBalance)}</td>
              <td className="py-2 px-3"></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-amber-50 rounded-lg shadow p-4 border border-amber-200">
          <p className="text-xs text-amber-600 uppercase font-semibold">Initial SL Balance</p>
          <p className="text-2xl font-bold text-amber-700">{fmt(initialBalance)}</p>
        </div>
        <div className="bg-amber-50 rounded-lg shadow p-4 border border-amber-200">
          <p className="text-xs text-amber-600 uppercase font-semibold">Accumulated Additions</p>
          <p className="text-2xl font-bold text-amber-700">{fmt((lastMonth.shareholderLoanBalance || 0) - initialBalance)}</p>
        </div>
        <div className="bg-amber-100 rounded-lg shadow p-4 border-2 border-amber-300">
          <p className="text-xs text-amber-600 uppercase font-semibold">Current SL Balance</p>
          <p className="text-2xl font-bold text-amber-800">{fmt(lastMonth.shareholderLoanBalance || initialBalance)}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <h2 className="font-semibold mb-3">Shareholder Loan - Rolling Balance (24 Months)</h2>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-gray-50 sticky top-0 z-20">
              <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 z-30 min-w-32">Line Item</th>
              {postLaunch.map(m => (
                <th key={m.month} className="py-2 px-1 text-center min-w-16">{m.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <SLRow label="Ian Accrual" months={postLaunch} field="ianAccrual" fmt={fmt} color="blue" />
            <SLRow label="Paul Accrual" months={postLaunch} field="paulAccrual" fmt={fmt} color="blue" />
            <SLRow label="Marketing Accrual" months={postLaunch} field="marketingAccrual" fmt={fmt} color="purple" />
            <SLRow label="Travel Accrual" months={postLaunch} field="travelAccrual" fmt={fmt} color="purple" />
            <tr className="bg-amber-100 font-semibold border-t-2 border-amber-300">
              <td className="py-2 px-2 sticky left-0 bg-amber-100 z-10">SL Balance</td>
              {postLaunch.map(m => (
                <td key={m.month} className="py-1 px-1 text-right font-mono text-amber-800">
                  {fmt(m.shareholderLoanBalance)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
        <p className="text-xs text-gray-500 mt-2">Note: SL balance accumulates only. Repayment starts Year 3 (not modeled in this projection).</p>
      </div>
      
      <div className="bg-blue-50 rounded-lg shadow p-4 border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Shareholder Loan Structure</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Initial balance:</strong> Setup costs, legal fees, historical expenses, founder contributions</li>
          <li>• <strong>Monthly additions:</strong> Rolled-up founder salaries, marketing, travel (when toggles enabled)</li>
          <li>• <strong>Interest:</strong> {((slConfig.interestRate || 0.05) * 100).toFixed(0)}% p.a. (accrues from Year 3)</li>
          <li>• <strong>Repayment:</strong> Starts Year {slConfig.repaymentStartYear || 3} from excess cash flow</li>
        </ul>
      </div>
    </div>
  );
};

function SLRow({ label, months, field, fmt, color }) {
  const colorClass = color ? `text-${color}-600` : '';
  return (
    <tr className="border-b">
      <td className="py-1 px-2 sticky left-0 bg-white z-10">{label}</td>
      {months.map(m => {
        const val = m[field] || 0;
        return (
          <td key={m.month} className={`py-1 px-1 text-right font-mono ${colorClass}`}>
            {val !== 0 ? fmt(val) : '-'}
          </td>
        );
      })}
    </tr>
  );
}
