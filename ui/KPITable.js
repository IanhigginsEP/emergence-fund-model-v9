// ui/KPITable.js — KPI metrics table with Revenue/AUM and EBITDA/AUM
// Part of v9.3 LP Enhancement Batch 3

window.FundModel = window.FundModel || {};

window.FundModel.KPITable = function KPITable({ model }) {
  const { useMemo } = React;
  const { formatCurrency, formatPercent } = window.FundModel;
  
  const kpis = useMemo(() => {
    return model.months.map(m => ({
      month: m.month,
      label: `M${m.month}`,
      rollingAUM: m.closingAUM,
      newAUM: (m.lpCapital || 0) + (m.gpCommit || 0),
      redemptions: m.redemption || 0,
      // Use operatingRevenue (v9.3) or totalRevenue (legacy)
      revenue: m.operatingRevenue || m.totalRevenue || 0,
      // Use ebitda (v9.3) or ebt (legacy)
      ebitda: m.ebitda !== undefined ? m.ebitda : m.ebt || 0,
      // Annualized yields
      revenueYield: m.closingAUM > 0 ? ((m.operatingRevenue || m.totalRevenue || 0) / m.closingAUM) * 12 * 100 : 0,
      ebitdaEfficiency: m.closingAUM > 0 ? ((m.ebitda !== undefined ? m.ebitda : m.ebt || 0) / m.closingAUM) * 12 * 100 : 0,
    }));
  }, [model.months]);
  
  const fmt = (v) => {
    if (formatCurrency) return formatCurrency(v);
    const abs = Math.abs(v);
    const sign = v < 0 ? '-' : '';
    if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
    if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(0)}K`;
    return `${sign}$${abs.toFixed(0)}`;
  };
  
  const pct = (v) => `${v.toFixed(2)}%`;
  
  // Show first 12 months (Year 1)
  const year1 = kpis.slice(0, 12);
  
  return (
    <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
      <h2 className="font-semibold mb-3">
        KPI Metrics
        <span className="ml-2 text-xs text-gray-500 font-normal">Year 1 (M0-M11)</span>
      </h2>
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b-2 bg-gray-50">
            <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 min-w-32">Metric</th>
            {year1.map(k => (
              <th key={k.month} className="py-2 px-2 text-center min-w-16">{k.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b">
            <td className="py-1 px-2 font-medium sticky left-0 bg-white">Rolling AUM Balance</td>
            {year1.map(k => (
              <td key={k.month} className="py-1 px-2 text-right font-mono text-blue-600">{fmt(k.rollingAUM)}</td>
            ))}
          </tr>
          <tr className="border-b bg-green-50">
            <td className="py-1 px-2 font-medium sticky left-0 bg-green-50 text-green-700">Assumed New AUM</td>
            {year1.map(k => (
              <td key={k.month} className="py-1 px-2 text-right font-mono text-green-600">
                {k.newAUM > 0 ? fmt(k.newAUM) : '-'}
              </td>
            ))}
          </tr>
          <tr className="border-b bg-orange-50">
            <td className="py-1 px-2 font-medium sticky left-0 bg-orange-50 text-orange-700">Redemptions</td>
            {year1.map(k => (
              <td key={k.month} className="py-1 px-2 text-right font-mono text-orange-600">
                {k.redemptions > 0 ? `(${fmt(k.redemptions)})` : '-'}
              </td>
            ))}
          </tr>
          <tr className="border-b bg-purple-50">
            <td className="py-1 px-2 font-medium sticky left-0 bg-purple-50 text-purple-700">
              Revenue / AUM Yield
              <span className="text-xs text-gray-400 block">(Annualized)</span>
            </td>
            {year1.map(k => (
              <td key={k.month} className="py-1 px-2 text-right font-mono text-purple-600">
                {k.rollingAUM > 0 ? pct(k.revenueYield) : '-'}
              </td>
            ))}
          </tr>
          <tr className="border-b bg-indigo-50">
            <td className="py-1 px-2 font-medium sticky left-0 bg-indigo-50 text-indigo-700">
              EBITDA / AUM Efficiency
              <span className="text-xs text-gray-400 block">(Annualized)</span>
            </td>
            {year1.map(k => (
              <td key={k.month} className={`py-1 px-2 text-right font-mono ${k.ebitdaEfficiency >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>
                {k.rollingAUM > 0 ? pct(k.ebitdaEfficiency) : '-'}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      <p className="text-xs text-gray-500 mt-2">
        Revenue = Operating Revenue (Mgmt Fees) | EBITDA = Operating Revenue - Cash Expenses
      </p>
    </div>
  );
};
