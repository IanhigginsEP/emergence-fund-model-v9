// ui/Tables.js - Monthly P&L and Cashflow tables
// v7: Added cashflow statement with founder funding
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.MonthlyPL = function MonthlyPL({ model }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
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
          <TableRow label="Mgmt Fee" months={months} field="mgmtFee" fmt={fmt} color="green" bg="green" />
          <TableRow label="BDM Share" months={months} field="bdmFeeShare" fmt={fmt} color="orange" />
          <TableRow label="Carry" months={months} field="totalCarry" fmt={fmt} color="purple" bg="purple" />
          <TableRow label="Total Revenue" months={months} field="totalRevenue" fmt={fmt} color="green" bold />
          <TableRow label="Expenses" months={months} field="totalExpenses" fmt={fmt} color="red" negative />
          <TableRow label="EBT" months={months} field="ebt" fmt={fmt} dynamic bg="yellow" bold />
        </tbody>
      </table>
    </div>
  );
};

window.FundModel.CashflowStatement = function CashflowStatement({ model }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
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
          <TableRow label="Revenue" months={months} field="totalRevenue" fmt={fmt} color="green" />
          <TableRow label="Expenses" months={months} field="totalExpenses" fmt={fmt} color="red" negative />
          <TableRow label="Net Cash Flow" months={months} field="netCashFlow" fmt={fmt} dynamic bold />
          <TableRow label="Founder Funding Req" months={months} field="founderFundingRequired" fmt={fmt} color="amber" bg="amber" />
          <TableRow label="Cumulative Funding" months={months} field="cumulativeFounderFunding" fmt={fmt} color="amber" bold />
          <TableRow label="Cash Balance" months={months} field="closingCash" fmt={fmt} dynamic bg="gray" bold />
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2">Founder funding split 50/50 between Ian and Paul</p>
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

function TableRow({ label, months, field, fmt, color, bg, bold, negative, dynamic }) {
  const bgClass = bg ? `bg-${bg}-50` : '';
  return (
    <tr className={`border-b ${bgClass}`}>
      <td className={`py-1 px-2 sticky left-0 ${bgClass} ${bold ? 'font-semibold' : ''}`}>{label}</td>
      {months.map(m => {
        let val = m[field] || 0;
        let colorClass = '';
        if (dynamic) colorClass = val >= 0 ? 'text-green-600' : 'text-red-600';
        else if (color) colorClass = `text-${color}-600`;
        const display = negative ? `(${fmt(Math.abs(val))})` : fmt(val);
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
