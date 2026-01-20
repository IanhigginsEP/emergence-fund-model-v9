// ui/Tables.js - Monthly P&L and Cashflow tables
// v9.3 Batch 4: EBITDA row, Below the Line section, bracket notation, shareholder loan

window.FundModel = window.FundModel || {};

window.FundModel.MonthlyPL = function MonthlyPL({ model }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const fmtNeg = (v) => v < 0 ? '(' + fmt(Math.abs(v)) + ')' : fmt(v);
  const { months } = model;
  
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="font-semibold mb-3">Monthly P&L</h2>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 min-w-28">Line Item</th>
            {months.map(m => <th key={m.month} className="py-2 px-1 text-center min-w-16">M{m.month}</th>)}
          </tr>
        </thead>
        <tbody>
          <TableRow label="Closing AUM" months={months} field="closingAUM" fmt={fmt} bold />
          <TableRow label="Operating Revenue" months={months} field="operatingRevenue" fmt={fmt} color="green" bg="green" fallback="mgmtFee" />
          <TableRow label="BDM Share" months={months} field="bdmFeeShare" fmt={fmt} color="orange" />
          <TableRow label="Expenses" months={months} field="totalCashExpenses" fmt={fmt} color="red" bracket fallback="totalExpenses" />
          <TableRow label="EBITDA" months={months} field="ebitda" fmt={fmt} dynamic bg="blue" bold fallback="ebt" />
          <tr className="bg-purple-100"><td colSpan={months.length+1} className="py-2 px-2 font-semibold text-purple-800">Below the Line</td></tr>
          <TableRow label="Carried Interest" months={months} field="carryRevenue" fmt={fmt} color="purple" bg="purple" fallback="totalCarry" />
        </tbody>
      </table>
    </div>
  );
};

window.FundModel.CashflowStatement = function CashflowStatement({ model }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const fmtNeg = (v) => v < 0 ? '(' + fmt(Math.abs(v)) + ')' : fmt(v);
  const { months } = model;
  
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="font-semibold mb-3">Monthly Cashflow Statement</h2>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 min-w-32">Line Item</th>
            {months.map(m => <th key={m.month} className="py-2 px-1 text-center min-w-16">M{m.month}</th>)}
          </tr>
        </thead>
        <tbody>
          <TableRow label="Operating Revenue (Mgmt Fees)" months={months} field="operatingRevenue" fmt={fmt} color="green" fallback="mgmtFee" />
          <TableRow label="Cash Expenses" months={months} field="totalCashExpenses" fmt={fmt} color="red" bracket fallback="totalExpenses" />
          <TableRow label="EBITDA" months={months} field="ebitda" fmt={fmt} dynamic bg="blue" bold fallback="ebt" />
          <TableRow label="Net Cash Flow" months={months} field="netCashFlow" fmt={fmt} dynamic bold />
          <TableRow label="Founder Funding Req" months={months} field="founderFundingRequired" fmt={fmt} color="amber" bg="amber" />
          <TableRow label="Cumulative Funding" months={months} field="cumulativeFounderFunding" fmt={fmt} color="amber" bold />
          <TableRow label="Cash Balance" months={months} field="closingCash" fmt={fmt} dynamic bg="gray" bold />
          
          {/* Below the Line Section */}
          <tr className="bg-purple-100"><td colSpan={months.length+1} className="py-2 px-2 font-semibold text-purple-800">Below the Line (Excluded from Cash Flow)</td></tr>
          <TableRow label="Carried Interest" months={months} field="carryRevenue" fmt={fmt} color="purple" bg="purple" fallback="totalCarry" />
          <TableRow label="Ian Salary Accrual" months={months} field="ianAccrual" fmt={fmt} color="purple" />
          <TableRow label="Shareholder Loan Balance" months={months} field="shareholderLoanBalance" fmt={fmt} color="amber" bg="amber" bold />
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2">Founder funding split 50/50 between Ian and Paul • Ian salary accrues to shareholder loan</p>
    </div>
  );
};

window.FundModel.CapitalTable = function CapitalTable({ capitalInputs }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const totals = { gpOrganic: 0, bdmRaise: 0, brokerRaise: 0, redemption: 0 };
  capitalInputs.forEach(r => {
    totals.gpOrganic += r.gpOrganic; totals.bdmRaise += r.bdmRaise;
    totals.brokerRaise += r.brokerRaise; totals.redemption += r.redemption;
  });
  
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="font-semibold mb-3">Capital Inflows & Redemptions</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="py-2 px-2 text-left sticky left-0 bg-gray-50">Source</th>
            {capitalInputs.map(r => <th key={r.month} className="py-2 px-1 text-center min-w-16">M{r.month}</th>)}
            <th className="py-2 px-2 text-right bg-gray-100 font-bold">TOTAL</th>
          </tr>
        </thead>
        <tbody>
          <CapitalRow label="GP Organic" inputs={capitalInputs} field="gpOrganic" total={totals.gpOrganic} fmt={fmt} />
          <CapitalRow label="BDM Raise" inputs={capitalInputs} field="bdmRaise" total={totals.bdmRaise} fmt={fmt} />
          <CapitalRow label="Broker" inputs={capitalInputs} field="brokerRaise" total={totals.brokerRaise} fmt={fmt} />
          <CapitalRow label="Redemptions" inputs={capitalInputs} field="redemption" total={totals.redemption} fmt={fmt} color="orange" />
        </tbody>
      </table>
    </div>
  );
};

function TableRow({ label, months, field, fmt, color, bg, bold, bracket, dynamic, fallback }) {
  const bgClass = bg ? `bg-${bg}-50` : '';
  return (
    <tr className={`border-b ${bgClass}`}>
      <td className={`py-1 px-2 sticky left-0 ${bgClass} ${bold ? 'font-semibold' : ''}`}>{label}</td>
      {months.map(m => {
        let val = m[field];
        if (val === undefined && fallback) val = m[fallback];
        val = val || 0;
        let colorClass = '';
        if (dynamic) colorClass = val >= 0 ? 'text-green-600' : 'text-red-600';
        else if (color) colorClass = `text-${color}-600`;
        const display = bracket || val < 0 ? (val < 0 ? '(' + fmt(Math.abs(val)) + ')' : fmt(val)) : fmt(val);
        return <td key={m.month} className={`py-1 px-1 text-right font-mono ${colorClass}`}>{val !== 0 ? display : '-'}</td>;
      })}
    </tr>
  );
}

function CapitalRow({ label, inputs, field, total, fmt, color }) {
  const colorClass = color ? `text-${color}-600` : 'text-blue-600';
  return (
    <tr className="border-b">
      <td className="py-1 px-2 font-medium sticky left-0 bg-white">{label}</td>
      {inputs.map((r, i) => (
        <td key={i} className={`py-1 px-1 text-right font-mono text-xs ${colorClass}`}>{r[field] > 0 ? fmt(r[field]) : '-'}</td>
      ))}
      <td className="py-1 px-2 text-right font-mono font-bold bg-gray-50">{fmt(total)}</td>
    </tr>
  );
}
