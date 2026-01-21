// ui/Tables.js - Monthly P&L and Cashflow tables with frozen columns
// v10.9: Added BDM/Broker expense lines in Cashflow Statement

window.FundModel = window.FundModel || {};

window.FundModel.MonthlyPL = function MonthlyPL({ model }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const fmtBracket = (v) => v < 0 ? '(' + fmt(Math.abs(v)) + ')' : fmt(v);
  const { months } = model;
  
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="font-semibold mb-3">Monthly P&L</h2>
      <table className="w-full text-xs freeze-table">
        <thead>
          <tr className="border-b bg-gray-50 sticky top-0 z-20">
            <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 z-30 min-w-28">Line Item</th>
            {months.map(m => <th key={m.month} className="py-2 px-1 text-center min-w-16">{m.label}</th>)}
          </tr>
        </thead>
        <tbody>
          <TableRow label="Closing AUM" months={months} field="closingAUM" fmt={fmt} bold />
          <TableRow label="Operating Revenue" months={months} field="operatingRevenue" fmt={fmt} color="green" bg="green" fallback="mgmtFee" />
          <TableRow label="BDM Share" months={months} field="bdmFeeShare" fmt={fmt} color="orange" />
          <TableRow label="Expenses" months={months} field="totalCashExpenses" fmt={fmtBracket} color="red" fallback="totalExpenses" />
          <TableRow label="EBITDA" months={months} field="ebitda" fmt={fmtBracket} dynamic bg="blue" bold fallback="ebt" />
          <tr className="bg-purple-100"><td colSpan={months.length+1} className="py-2 px-2 font-semibold text-purple-800 sticky left-0">Below the Line</td></tr>
          <TableRow label="Carried Interest" months={months} field="carryRevenue" fmt={fmt} color="purple" bg="purple" fallback="totalCarry" />
        </tbody>
      </table>
    </div>
  );
};

window.FundModel.CashflowStatement = function CashflowStatement({ model, showPersonnel }) {
  const { formatCurrency } = window.FundModel;
  const fmt = formatCurrency;
  const fmtBracket = (v) => v < 0 ? '(' + fmt(Math.abs(v)) + ')' : fmt(v);
  const { months } = model;
  const postLaunch = months ? months.filter(m => !m.isPreLaunch) : [];
  const [expanded, setExpanded] = React.useState(showPersonnel || false);
  
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold">Monthly Cashflow Statement</h2>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          {expanded ? 'Hide Details' : 'Show Details'}
        </button>
      </div>
      <table className="w-full text-xs freeze-table">
        <thead>
          <tr className="border-b bg-gray-50 sticky top-0 z-20">
            <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 z-30 min-w-32">Line Item</th>
            {postLaunch.map(m => <th key={m.month} className="py-2 px-1 text-center min-w-16">{m.label}</th>)}
          </tr>
        </thead>
        <tbody>
          <TableRow label="Operating Revenue" months={postLaunch} field="operatingRevenue" fmt={fmt} color="green" fallback="mgmtFee" />
          
          {/* Personnel Breakdown (collapsible) */}
          {expanded && (
            <>
              <tr className="bg-yellow-50"><td colSpan={postLaunch.length+1} className="py-1 px-2 text-xs font-medium text-yellow-800 sticky left-0">Personnel (Cash)</td></tr>
              <TableRow label="  Ian (cash)" months={postLaunch} field="ianCashExpense" fmt={fmt} color="red" />
              <TableRow label="  Paul (cash)" months={postLaunch} field="paulCashExpense" fmt={fmt} color="red" />
              <TableRow label="  Lewis" months={postLaunch} field="lewisSalary" fmt={fmt} color="red" />
              <TableRow label="  Emma (EA)" months={postLaunch} field="eaSalary" fmt={fmt} color="red" />
              <TableRow label="  Adrian" months={postLaunch} field="adrianSalary" fmt={fmt} color="red" />
              <TableRow label="  Chairman" months={postLaunch} field="chairmanCost" fmt={fmt} color="red" />
              <TableRow label="Total Cash Salaries" months={postLaunch} field="totalCashSalaries" fmt={fmtBracket} color="red" bold />
              
              <tr className="bg-yellow-50"><td colSpan={postLaunch.length+1} className="py-1 px-2 text-xs font-medium text-yellow-800 sticky left-0">OpEx</td></tr>
              <TableRow label="  Marketing" months={postLaunch} field="marketingCash" fmt={fmt} color="red" />
              <TableRow label="  Travel" months={postLaunch} field="travelCash" fmt={fmt} color="red" />
              <TableRow label="  Office/IT" months={postLaunch} field="officeIT" fmt={fmt} color="red" />
              <TableRow label="  Compliance" months={postLaunch} field="compliance" fmt={fmt} color="red" />
              <TableRow label="  US Feeder" months={postLaunch} field="usFeederExpense" fmt={fmt} color="red" />
              <TableRow label="Total OpEx" months={postLaunch} field="totalOpexCash" fmt={fmtBracket} color="red" bold />
              
              <tr className="bg-green-50"><td colSpan={postLaunch.length+1} className="py-1 px-2 text-xs font-medium text-green-800 sticky left-0">BDM Costs</td></tr>
              <TableRow label="  BDM Retainer" months={postLaunch} field="bdmRetainerExpense" fmt={fmt} color="green" />
              <TableRow label="  BDM Rev Share" months={postLaunch} field="bdmFeeShare" fmt={fmt} color="green" />
              
              <tr className="bg-orange-50"><td colSpan={postLaunch.length+1} className="py-1 px-2 text-xs font-medium text-orange-800 sticky left-0">Broker Costs</td></tr>
              <TableRow label="  Broker Retainer" months={postLaunch} field="brokerRetainerExpense" fmt={fmt} color="orange" />
              <TableRow label="  Trailing Comm" months={postLaunch} field="brokerTrailingComm" fmt={fmt} color="orange" />
              <TableRow label="Total Broker" months={postLaunch} field="totalBrokerExpense" fmt={fmtBracket} color="orange" bold />
            </>
          )}
          
          <TableRow label="Cash Expenses" months={postLaunch} field="totalCashExpenses" fmt={fmtBracket} color="red" fallback="totalExpenses" />
          <TableRow label="EBITDA" months={postLaunch} field="ebitda" fmt={fmtBracket} dynamic bg="blue" bold fallback="ebt" />
          <TableRow label="Net Cash Flow" months={postLaunch} field="netCashFlow" fmt={fmtBracket} dynamic bold />
          <TableRow label="Founder Funding Req" months={postLaunch} field="founderFundingRequired" fmt={fmt} color="amber" bg="amber" />
          <TableRow label="Cumulative Funding" months={postLaunch} field="cumulativeFounderFunding" fmt={fmt} color="amber" bold />
          <TableRow label="Cash Balance" months={postLaunch} field="closingCash" fmt={fmtBracket} dynamic bg="gray" bold />
          
          <tr className="bg-purple-100"><td colSpan={postLaunch.length+1} className="py-2 px-2 font-semibold text-purple-800 sticky left-0">Below the Line</td></tr>
          <TableRow label="Carried Interest" months={postLaunch} field="carryRevenue" fmt={fmt} color="purple" bg="purple" fallback="totalCarry" />
          <TableRow label="Ian Salary Accrual" months={postLaunch} field="ianAccrual" fmt={fmt} color="purple" />
          <TableRow label="Paul Salary Accrual" months={postLaunch} field="paulAccrual" fmt={fmt} color="purple" />
          <TableRow label="Marketing Accrual" months={postLaunch} field="marketingAccrual" fmt={fmt} color="purple" />
          <TableRow label="Travel Accrual" months={postLaunch} field="travelAccrual" fmt={fmt} color="purple" />
          <TableRow label="Shareholder Loan" months={postLaunch} field="shareholderLoanBalance" fmt={fmt} color="amber" bg="amber" bold />
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2">Negatives in brackets • Click 'Show Details' for full breakdown incl. BDM/Broker</p>
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
      <table className="w-full text-sm freeze-table">
        <thead>
          <tr className="border-b bg-gray-50 sticky top-0 z-20">
            <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 z-30">Source</th>
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

function TableRow({ label, months, field, fmt, color, bg, bold, dynamic, fallback }) {
  const bgClass = bg ? `bg-${bg}-50` : '';
  return (
    <tr className={`border-b ${bgClass}`}>
      <td className={`py-1 px-2 sticky left-0 z-10 ${bgClass || 'bg-white'} ${bold ? 'font-semibold' : ''}`}>{label}</td>
      {months.map(m => {
        let val = m[field];
        if (val === undefined && fallback) val = m[fallback];
        val = val || 0;
        let colorClass = '';
        if (dynamic) colorClass = val >= 0 ? 'text-green-600' : 'text-red-600';
        else if (color) colorClass = `text-${color}-600`;
        const display = fmt(val);
        return <td key={m.month} className={`py-1 px-1 text-right font-mono ${colorClass}`}>{val !== 0 ? display : '-'}</td>;
      })}
    </tr>
  );
}

function CapitalRow({ label, inputs, field, total, fmt, color }) {
  const colorClass = color ? `text-${color}-600` : 'text-blue-600';
  return (
    <tr className="border-b">
      <td className="py-1 px-2 font-medium sticky left-0 bg-white z-10">{label}</td>
      {inputs.map((r, i) => (
        <td key={i} className={`py-1 px-1 text-right font-mono text-xs ${colorClass}`}>{r[field] > 0 ? fmt(r[field]) : '-'}</td>
      ))}
      <td className="py-1 px-2 text-right font-mono font-bold bg-gray-50">{fmt(total)}</td>
    </tr>
  );
}
