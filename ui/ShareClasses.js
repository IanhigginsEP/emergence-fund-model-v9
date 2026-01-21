// ui/ShareClasses.js - Share class breakdown display
// v10.13: Added share class validation check (Founder + Class A = Total AUM)

window.FundModel = window.FundModel || {};

window.FundModel.ShareClassesTab = function ShareClassesTab({ model }) {
  const { months } = model;
  if (!months || months.length === 0) return null;
  
  const fmtM = (v) => v >= 1e6 ? '$' + (v/1e6).toFixed(2) + 'M' : v >= 1e3 ? '$' + (v/1e3).toFixed(0) + 'K' : '$' + v.toFixed(0);
  const pct = (v) => (v * 100).toFixed(2) + '%';
  
  const postLaunch = months.filter(m => !m.isPreLaunch);
  const lastMonth = postLaunch[postLaunch.length - 1] || {};
  const sc = lastMonth.shareClasses || { founder: {}, classA: {}, classB: {}, classC: {} };
  
  const shareClassDefs = [
    { key: 'founder', name: 'Founder Class', mgmtRate: '0%', carryRate: '0%', color: '#8b5cf6', bg: 'purple', desc: 'GP Commitment (2% of LP capital)' },
    { key: 'classA', name: 'Class A', mgmtRate: '1.5%', carryRate: '17.5%', color: '#3b82f6', bg: 'blue', desc: 'Main LP class (60/40 public/private)' },
    { key: 'classB', name: 'Class B', mgmtRate: '1.5%', carryRate: '17.5%', color: '#10b981', bg: 'green', desc: '100% private, 36mo lockup' },
    { key: 'classC', name: 'Class C', mgmtRate: '1.5%', carryRate: '17.5%', color: '#f59e0b', bg: 'amber', desc: '100% public, 12mo lockup' },
  ];
  
  // Calculate totals for Y1 and Y2
  const y1 = postLaunch.slice(0, 12);
  const y2 = postLaunch.slice(12, 24);
  const sumMgmtFee = (arr, key) => arr.reduce((s, m) => s + (m.shareClasses?.[key]?.mgmtFee || 0), 0);
  
  // Share class validation: Founder AUM + Class A AUM should equal Total AUM
  const validationResults = postLaunch.map(m => {
    const founderAUM = m.shareClasses?.founder?.aum || 0;
    const classAAUM = m.shareClasses?.classA?.aum || 0;
    const classBUM = m.shareClasses?.classB?.aum || 0;
    const classCUM = m.shareClasses?.classC?.aum || 0;
    const totalFromClasses = founderAUM + classAAUM + classBUM + classCUM;
    const totalAUM = m.closingAUM || 0;
    const variance = totalAUM - totalFromClasses;
    return { month: m.month, label: m.label, founderAUM, classAAUM, totalFromClasses, totalAUM, variance, isValid: Math.abs(variance) < 1 };
  });
  
  const allValid = validationResults.every(v => v.isValid);
  const invalidMonths = validationResults.filter(v => !v.isValid);
  
  return (
    <div className="space-y-4">
      {/* Header explanation with validation status */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-semibold text-purple-800 mb-2">📋 PPM-Compliant Share Class Structure</h2>
            <p className="text-sm text-gray-600">Share classes determine fee structures. GP Commitment (Founder Class) pays no fees, reducing the weighted average fee rate.</p>
          </div>
          <div className={`px-3 py-2 rounded-lg text-sm font-semibold ${allValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {allValid ? '✓ Classes Reconciled' : '⚠ Reconciliation Error'}
          </div>
        </div>
        {!allValid && (
          <div className="mt-3 p-2 bg-red-50 rounded border border-red-200">
            <p className="text-xs text-red-700 font-medium">Variance detected in: {invalidMonths.map(v => v.label).join(', ')}</p>
          </div>
        )}
      </div>
      
      {/* Share Class Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {shareClassDefs.map(def => {
          const data = sc[def.key] || {};
          const y1Fee = sumMgmtFee(y1, def.key);
          const y2Fee = sumMgmtFee(y2, def.key);
          return (
            <div key={def.key} className={`bg-white rounded-lg shadow p-4 border-l-4`} style={{ borderLeftColor: def.color }}>
              <h3 className="font-semibold text-gray-800">{def.name}</h3>
              <p className="text-xs text-gray-500 mb-2">{def.desc}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span>Mgmt Fee:</span><span className="font-mono" style={{ color: def.color }}>{def.mgmtRate}</span></div>
                <div className="flex justify-between"><span>Carry:</span><span className="font-mono" style={{ color: def.color }}>{def.carryRate}</span></div>
                <div className="border-t pt-1 mt-2">
                  <div className="flex justify-between"><span>Current AUM:</span><span className="font-mono">{fmtM(data.aum || 0)}</span></div>
                  <div className="flex justify-between"><span>Allocation:</span><span className="font-mono">{pct(data.pct || 0)}</span></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Fee Impact Summary */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Fee Impact Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-purple-50 rounded p-3 text-center">
            <p className="text-xs text-purple-600 uppercase">Founder AUM (0% fee)</p>
            <p className="text-xl font-bold text-purple-700">{fmtM(sc.founder?.aum || 0)}</p>
          </div>
          <div className="bg-blue-50 rounded p-3 text-center">
            <p className="text-xs text-blue-600 uppercase">Class A AUM (1.5% fee)</p>
            <p className="text-xl font-bold text-blue-700">{fmtM(sc.classA?.aum || 0)}</p>
          </div>
          <div className="bg-green-50 rounded p-3 text-center">
            <p className="text-xs text-green-600 uppercase">Weighted Avg Rate</p>
            <p className="text-xl font-bold text-green-700">{pct(lastMonth.weightedMgmtRate || 0)}</p>
          </div>
          <div className="bg-amber-50 rounded p-3 text-center">
            <p className="text-xs text-amber-600 uppercase">Fee Savings</p>
            <p className="text-xl font-bold text-amber-700">{fmtM((sc.founder?.aum || 0) * 0.015)}</p>
            <p className="text-xs text-gray-500">vs all Class A</p>
          </div>
        </div>
      </div>
      
      {/* Share Class Validation Table */}
      <div className="bg-white rounded-lg shadow p-4 overflow-x-auto">
        <h3 className="font-semibold mb-3">Share Class Validation (Y1)</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-2 text-left sticky left-0 bg-gray-50 z-10 min-w-28">Check</th>
              {y1.map(m => <th key={m.month} className="py-2 px-1 text-center min-w-16">{m.label}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-1 px-2 sticky left-0 bg-white z-10 font-medium">Founder AUM</td>
              {y1.map(m => (
                <td key={m.month} className="py-1 px-1 text-right font-mono text-purple-600">
                  {fmtM(m.shareClasses?.founder?.aum || 0)}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-1 px-2 sticky left-0 bg-white z-10 font-medium">+ Class A AUM</td>
              {y1.map(m => (
                <td key={m.month} className="py-1 px-1 text-right font-mono text-blue-600">
                  {fmtM(m.shareClasses?.classA?.aum || 0)}
                </td>
              ))}
            </tr>
            <tr className="border-b bg-gray-50">
              <td className="py-1 px-2 sticky left-0 bg-gray-50 z-10 font-semibold">= Sum of Classes</td>
              {y1.map((m, idx) => (
                <td key={m.month} className="py-1 px-1 text-right font-mono font-semibold">
                  {fmtM(validationResults[idx]?.totalFromClasses || 0)}
                </td>
              ))}
            </tr>
            <tr className="border-b">
              <td className="py-1 px-2 sticky left-0 bg-white z-10 font-semibold">Total AUM</td>
              {y1.map((m, idx) => (
                <td key={m.month} className="py-1 px-1 text-right font-mono font-semibold">
                  {fmtM(validationResults[idx]?.totalAUM || 0)}
                </td>
              ))}
            </tr>
            <tr className="bg-gray-100">
              <td className="py-1 px-2 sticky left-0 bg-gray-100 z-10 font-bold">Variance</td>
              {y1.map((m, idx) => {
                const r = validationResults[idx];
                const isOk = r?.isValid;
                return (
                  <td key={m.month} className={`py-1 px-1 text-right font-mono font-bold ${isOk ? 'text-green-600' : 'text-red-600 bg-red-100'}`}>
                    {isOk ? '✓' : fmtM(r?.variance || 0)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Annual Fee Breakdown Table */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-semibold mb-3">Annual Fee Revenue by Share Class</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="py-2 px-3 text-left">Share Class</th>
              <th className="py-2 px-3 text-right">Year 1 Mgmt Fee</th>
              <th className="py-2 px-3 text-right">Year 2 Mgmt Fee</th>
              <th className="py-2 px-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {shareClassDefs.map(def => {
              const y1Fee = sumMgmtFee(y1, def.key);
              const y2Fee = sumMgmtFee(y2, def.key);
              return (
                <tr key={def.key} className="border-b">
                  <td className="py-2 px-3">
                    <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: def.color }}></span>
                    {def.name}
                  </td>
                  <td className="py-2 px-3 text-right font-mono" style={{ color: y1Fee > 0 ? def.color : '#9ca3af' }}>{fmtM(y1Fee)}</td>
                  <td className="py-2 px-3 text-right font-mono" style={{ color: y2Fee > 0 ? def.color : '#9ca3af' }}>{fmtM(y2Fee)}</td>
                  <td className="py-2 px-3 text-right font-mono font-semibold">{fmtM(y1Fee + y2Fee)}</td>
                </tr>
              );
            })}
            <tr className="bg-gray-100 font-semibold">
              <td className="py-2 px-3">Total</td>
              <td className="py-2 px-3 text-right font-mono text-green-600">{fmtM(shareClassDefs.reduce((s, d) => s + sumMgmtFee(y1, d.key), 0))}</td>
              <td className="py-2 px-3 text-right font-mono text-green-600">{fmtM(shareClassDefs.reduce((s, d) => s + sumMgmtFee(y2, d.key), 0))}</td>
              <td className="py-2 px-3 text-right font-mono text-green-600">{fmtM(shareClassDefs.reduce((s, d) => s + sumMgmtFee(y1, d.key) + sumMgmtFee(y2, d.key), 0))}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
