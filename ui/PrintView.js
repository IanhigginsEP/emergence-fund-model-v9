// ui/PrintView.js - Printer-friendly summary page
// v7.1: Single-page view optimized for PDF export
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.PrintView = function PrintView({ model, assumptions, scenarioName, timeline }) {
  const { getMonthLabel } = window.FundModel;
  
  const fmt = (v) => {
    if (v === undefined || v === null) return '-';
    const abs = Math.abs(v);
    if (abs >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
    if (abs >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'K';
    return '$' + v.toFixed(0);
  };
  
  const pct = (v) => (v * 100).toFixed(1) + '%';
  
  const y1 = model.months.slice(0, 12);
  const y2 = model.months.slice(12, 24);
  const y3 = model.months.slice(24, 36);
  const sum = (arr, f) => arr.reduce((s, m) => s + (m[f] || 0), 0);
  
  return (
    <div className="bg-white p-8 max-w-4xl mx-auto print:p-4 print:max-w-none">
      <div className="border-b-2 border-gray-800 pb-4 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Emergence Partners</h1>
            <h2 className="text-lg text-gray-600">Fund P&L Model Summary</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Generated: {new Date().toLocaleDateString()}</p>
            <p className="text-sm font-semibold text-blue-600">Scenario: {scenarioName}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="border rounded p-3">
          <p className="text-xs text-gray-500 uppercase">Y3 Ending AUM</p>
          <p className="text-xl font-bold">{fmt(model.months[35]?.closingAUM)}</p>
        </div>
        <div className="border rounded p-3">
          <p className="text-xs text-gray-500 uppercase">Breakeven Month</p>
          <p className="text-xl font-bold text-green-600">M{model.breakEvenMonth || 'N/A'}</p>
        </div>
        <div className="border rounded p-3">
          <p className="text-xs text-gray-500 uppercase">3Y Total Revenue</p>
          <p className="text-xl font-bold">{fmt(sum(model.months, 'totalRevenue'))}</p>
        </div>
        <div className="border rounded p-3">
          <p className="text-xs text-gray-500 uppercase">Founder Funding</p>
          <p className="text-xl font-bold text-amber-600">{fmt(model.cumulativeFounderFunding)}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2 text-gray-700">Annual Summary</h3>
        <table className="w-full text-sm border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Metric</th>
              <th className="border p-2 text-right">Year 1</th>
              <th className="border p-2 text-right">Year 2</th>
              <th className="border p-2 text-right">Year 3</th>
              <th className="border p-2 text-right font-bold">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-2">Ending AUM</td>
              <td className="border p-2 text-right font-mono">{fmt(y1[11]?.closingAUM)}</td>
              <td className="border p-2 text-right font-mono">{fmt(y2[11]?.closingAUM)}</td>
              <td className="border p-2 text-right font-mono">{fmt(y3[11]?.closingAUM)}</td>
              <td className="border p-2 text-right">-</td>
            </tr>
            <tr className="bg-green-50">
              <td className="border p-2">Management Fees</td>
              <td className="border p-2 text-right font-mono">{fmt(sum(y1, 'mgmtFee'))}</td>
              <td className="border p-2 text-right font-mono">{fmt(sum(y2, 'mgmtFee'))}</td>
              <td className="border p-2 text-right font-mono">{fmt(sum(y3, 'mgmtFee'))}</td>
              <td className="border p-2 text-right font-mono font-bold">{fmt(sum(model.months, 'mgmtFee'))}</td>
            </tr>
            <tr className="bg-purple-50">
              <td className="border p-2">Carried Interest</td>
              <td className="border p-2 text-right font-mono">{fmt(sum(y1, 'totalCarry'))}</td>
              <td className="border p-2 text-right font-mono">{fmt(sum(y2, 'totalCarry'))}</td>
              <td className="border p-2 text-right font-mono">{fmt(sum(y3, 'totalCarry'))}</td>
              <td className="border p-2 text-right font-mono font-bold">{fmt(sum(model.months, 'totalCarry'))}</td>
            </tr>
            <tr>
              <td className="border p-2">Total Expenses</td>
              <td className="border p-2 text-right font-mono text-red-600">({fmt(sum(y1, 'totalExpenses'))})</td>
              <td className="border p-2 text-right font-mono text-red-600">({fmt(sum(y2, 'totalExpenses'))})</td>
              <td className="border p-2 text-right font-mono text-red-600">({fmt(sum(y3, 'totalExpenses'))})</td>
              <td className="border p-2 text-right font-mono text-red-600 font-bold">({fmt(sum(model.months, 'totalExpenses'))})</td>
            </tr>
            <tr className="bg-gray-100 font-semibold">
              <td className="border p-2">Cash Position</td>
              <td className="border p-2 text-right font-mono">{fmt(y1[11]?.closingCash)}</td>
              <td className="border p-2 text-right font-mono">{fmt(y2[11]?.closingCash)}</td>
              <td className="border p-2 text-right font-mono">{fmt(y3[11]?.closingCash)}</td>
              <td className="border p-2 text-right">-</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Key Assumptions</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b"><td className="py-1">Management Fee</td><td className="py-1 text-right">{pct(assumptions.mgmtFeeAnnual)} annually</td></tr>
              <tr className="border-b"><td className="py-1">Carry Rate</td><td className="py-1 text-right">{pct(assumptions.carryRatePrivate)}</td></tr>
              <tr className="border-b"><td className="py-1">Hurdle Rate</td><td className="py-1 text-right">{pct(assumptions.hurdleRate)}</td></tr>
              <tr className="border-b"><td className="py-1">Expected Return</td><td className="py-1 text-right">{pct(assumptions.annualReturn)}</td></tr>
              <tr className="border-b"><td className="py-1">GP Commitment</td><td className="py-1 text-right">{pct(assumptions.gpCommitmentRate)}</td></tr>
            </tbody>
          </table>
        </div>
        <div>
          <h3 className="font-semibold mb-2 text-gray-700">Founder Funding Split</h3>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b"><td className="py-1">Total Required</td><td className="py-1 text-right font-bold text-amber-600">{fmt(model.cumulativeFounderFunding)}</td></tr>
              <tr className="border-b"><td className="py-1">Ian (50%)</td><td className="py-1 text-right text-blue-600">{fmt(model.cumulativeFounderFunding / 2)}</td></tr>
              <tr className="border-b"><td className="py-1">Paul (50%)</td><td className="py-1 text-right text-purple-600">{fmt(model.cumulativeFounderFunding / 2)}</td></tr>
              <tr className="border-b"><td className="py-1">Breakeven</td><td className="py-1 text-right">Month {model.breakEvenMonth || 'N/A'}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="border-t pt-4 text-xs text-gray-500 text-center">
        Emergence Partners Fund P&L Model v7.1 • DIFC • Confidential
      </div>
    </div>
  );
};
