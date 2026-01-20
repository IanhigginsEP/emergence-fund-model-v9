// ui/FundingSchedule.js - Monthly founder funding calendar
// v7.1: Shows when and how much each founder needs to inject
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.FundingSchedule = function FundingSchedule({ model, timeline }) {
  const { useMemo } = React;
  const { getMonthLabel } = window.FundModel;
  
  const schedule = useMemo(() => {
    let ianCumulative = 0, paulCumulative = 0;
    
    return model.months.map(m => {
      const funding = m.founderFundingRequired || 0;
      const ianShare = funding / 2;
      const paulShare = funding / 2;
      ianCumulative += ianShare;
      paulCumulative += paulShare;
      
      return {
        month: m.month,
        label: getMonthLabel ? getMonthLabel(m.month, timeline) : `M${m.month}`,
        funding,
        ianShare,
        paulShare,
        ianCumulative,
        paulCumulative,
        cashPosition: m.closingCash,
        isBreakeven: m.month === model.breakEvenMonth,
      };
    }).filter(m => m.funding > 0 || m.isBreakeven);
  }, [model, timeline]);
  
  const totals = useMemo(() => ({
    totalFunding: model.cumulativeFounderFunding,
    ianTotal: model.cumulativeFounderFunding / 2,
    paulTotal: model.cumulativeFounderFunding / 2,
    peakMonth: schedule.reduce((max, m) => m.funding > (max?.funding || 0) ? m : max, null),
  }), [model, schedule]);
  
  const fmt = (v) => {
    if (v >= 1e6) return '$' + (v / 1e6).toFixed(2) + 'M';
    if (v >= 1e3) return '$' + (v / 1e3).toFixed(0) + 'K';
    return '$' + v.toFixed(0);
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-amber-50 rounded-lg shadow p-4 border-2 border-amber-200">
          <p className="text-xs text-amber-600 uppercase font-semibold">Total Founder Funding</p>
          <p className="text-2xl font-bold text-amber-700">{fmt(totals.totalFunding)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 uppercase">Ian's Share (50%)</p>
          <p className="text-2xl font-bold text-blue-600">{fmt(totals.ianTotal)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 uppercase">Paul's Share (50%)</p>
          <p className="text-2xl font-bold text-purple-600">{fmt(totals.paulTotal)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-xs text-gray-500 uppercase">Peak Funding Month</p>
          <p className="text-2xl font-bold text-gray-700">
            {totals.peakMonth ? `M${totals.peakMonth.month}` : '-'}
          </p>
          <p className="text-xs text-gray-500">{totals.peakMonth ? fmt(totals.peakMonth.funding) : ''}</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="font-semibold mb-3">📅 Funding Injection Schedule</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 bg-gray-50">
                <th className="py-2 px-3 text-left">Month</th>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3 text-right">Total Required</th>
                <th className="py-2 px-3 text-right text-blue-600">Ian</th>
                <th className="py-2 px-3 text-right text-purple-600">Paul</th>
                <th className="py-2 px-3 text-right text-blue-600">Ian Cumulative</th>
                <th className="py-2 px-3 text-right text-purple-600">Paul Cumulative</th>
                <th className="py-2 px-3 text-right">Cash After</th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((row, i) => (
                <tr 
                  key={row.month} 
                  className={`border-b ${row.isBreakeven ? 'bg-green-50 font-semibold' : i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="py-2 px-3">
                    M{row.month}
                    {row.isBreakeven && <span className="ml-2 text-green-600 text-xs">✓ BREAKEVEN</span>}
                  </td>
                  <td className="py-2 px-3 text-gray-600">{row.label}</td>
                  <td className="py-2 px-3 text-right font-mono text-amber-600">{row.funding > 0 ? fmt(row.funding) : '-'}</td>
                  <td className="py-2 px-3 text-right font-mono text-blue-600">{row.ianShare > 0 ? fmt(row.ianShare) : '-'}</td>
                  <td className="py-2 px-3 text-right font-mono text-purple-600">{row.paulShare > 0 ? fmt(row.paulShare) : '-'}</td>
                  <td className="py-2 px-3 text-right font-mono text-blue-500">{fmt(row.ianCumulative)}</td>
                  <td className="py-2 px-3 text-right font-mono text-purple-500">{fmt(row.paulCumulative)}</td>
                  <td className={`py-2 px-3 text-right font-mono ${row.cashPosition >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {fmt(row.cashPosition)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 bg-amber-50 font-bold">
                <td className="py-2 px-3" colSpan="2">TOTAL</td>
                <td className="py-2 px-3 text-right font-mono text-amber-700">{fmt(totals.totalFunding)}</td>
                <td className="py-2 px-3 text-right font-mono text-blue-700">{fmt(totals.ianTotal)}</td>
                <td className="py-2 px-3 text-right font-mono text-purple-700">{fmt(totals.paulTotal)}</td>
                <td colSpan="3"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 text-center">
        💡 Use browser print (Ctrl+P / Cmd+P) to save this schedule as PDF
      </div>
    </div>
  );
};
