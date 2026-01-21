// ui/Controls.js - Input controls v10.19
// ADDED: Redemptions schedule editor (Issue #5)
// UPDATED: BDM/Broker commission labels for clarity (50bps trailing)
window.FundModel = window.FundModel || {};

window.FundModel.Controls = function Controls({ assumptions, onUpdate }) {
  const { useState } = React;
  const upd = (k, v) => onUpdate(k, v);
  const monthOptions = [{ value: 'null', label: 'Not Triggered' }];
  for (let i = 0; i <= 35; i++) monthOptions.push({ value: String(i), label: `M${i}` });
  
  // State for redemptions editor
  const [newRedMonth, setNewRedMonth] = useState(25);
  const [newRedAmount, setNewRedAmount] = useState(2000000);
  
  const redemptionSchedule = assumptions.redemptionSchedule || [];
  
  const addRedemption = () => {
    const newSchedule = [...redemptionSchedule, { month: newRedMonth, amount: newRedAmount }]
      .sort((a, b) => a.month - b.month);
    upd('redemptionSchedule', newSchedule);
  };
  
  const removeRedemption = (idx) => {
    const newSchedule = redemptionSchedule.filter((_, i) => i !== idx);
    upd('redemptionSchedule', newSchedule);
  };
  
  const updateRedemption = (idx, field, value) => {
    const newSchedule = [...redemptionSchedule];
    newSchedule[idx] = { ...newSchedule[idx], [field]: value };
    upd('redemptionSchedule', newSchedule.sort((a, b) => a.month - b.month));
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Section title="Timeline" color="amber">
        <DateInput label="Model Start" value={assumptions.modelStartDate} onChange={v => upd('modelStartDate', v)} />
        <DateInput label="Fund Launch" value={assumptions.launchDate} onChange={v => upd('launchDate', v)} />
      </Section>
      
      <Section title="Fees &amp; Returns">
        <NumInput label="Mgmt Fee (Annual)" value={assumptions.mgmtFeeAnnual * 100} onChange={v => upd('mgmtFeeAnnual', v/100)} suffix="%" step={0.1} />
        <NumInput label="Carry Rate" value={assumptions.carryRatePrivate * 100} onChange={v => { upd('carryRatePrivate', v/100); upd('carryRatePublic', v/100); }} suffix="%" />
        <NumInput label="Annual Return" value={assumptions.annualReturn * 100} onChange={v => upd('annualReturn', v/100)} suffix="%" />
        <NumInput label="Public Weight" value={assumptions.publicWeight * 100} onChange={v => upd('publicWeight', v/100)} suffix="%" step={5} />
        <NumInput label="GP Commitment" value={assumptions.gpCommitmentRate * 100} onChange={v => upd('gpCommitmentRate', v/100)} suffix="%" step={0.5} />
      </Section>
      
      <Section title="Founder Salaries" color="blue">
        <p className="text-xs text-gray-500 mb-2">Ian: Roll-up (accrued to shareholder loan)</p>
        <NumInput label="Ian (Pre-BE)" value={assumptions.ianSalaryPre} onChange={v => upd('ianSalaryPre', v)} suffix="$" step={1000} />
        <NumInput label="Ian (Post-BE)" value={assumptions.ianSalaryPost} onChange={v => upd('ianSalaryPost', v)} suffix="$" step={1000} />
        <div className="border-t mt-2 pt-2">
          <ToggleInput label="Paul Cash Draw" value={assumptions.paulCashDrawEnabled !== false} onChange={v => upd('paulCashDrawEnabled', v)} help="ON=Cash, OFF=Roll-up" />
        </div>
        <NumInput label="Paul (Pre-BE)" value={assumptions.paulSalaryPre} onChange={v => upd('paulSalaryPre', v)} suffix="$" step={1000} />
        <NumInput label="Paul (Post-BE)" value={assumptions.paulSalaryPost} onChange={v => upd('paulSalaryPost', v)} suffix="$" step={1000} />
      </Section>
      
      <Section title="Staff Costs">
        <NumInput label="Lewis" value={assumptions.lewisSalary} onChange={v => upd('lewisSalary', v)} suffix="$" step={500} />
        <NumInput label="Lewis Months" value={assumptions.lewisMonths} onChange={v => upd('lewisMonths', v)} suffix="M" />
        <NumInput label="Lewis Start" value={assumptions.lewisStartMonth} onChange={v => upd('lewisStartMonth', v)} suffix="M" />
        <NumInput label="EA" value={assumptions.eaSalary} onChange={v => upd('eaSalary', v)} suffix="$" step={500} />
        <NumInput label="Chairman (Qtr)" value={assumptions.chairmanSalary} onChange={v => upd('chairmanSalary', v)} suffix="$" step={500} />
      </Section>
      
      <Section title="BDM Economics" color="green">
        <ToggleInput label="BDM Enabled" value={assumptions.bdmEnabled !== false} onChange={v => upd('bdmEnabled', v)} />
        {assumptions.bdmEnabled !== false && (<>
          <NumInput label="Start Month" value={assumptions.bdmCapitalStartMonth || 7} onChange={v => upd('bdmCapitalStartMonth', v)} suffix="M" />
          <NumInput label="Monthly Capital" value={assumptions.bdmMonthlyCapital || 500000} onChange={v => upd('bdmMonthlyCapital', v)} suffix="$" step={100000} />
          <NumInput label="Retainer" value={assumptions.bdmRetainer || 0} onChange={v => upd('bdmRetainer', v)} suffix="$/mo" step={500} />
          <NumInput label="Trailing Comm (bps)" value={(assumptions.bdmCommissionRate || 0) * 10000} onChange={v => upd('bdmCommissionRate', v/10000)} suffix="bps" step={5} />
          <NumInput label="Trailing Months" value={assumptions.bdmTrailingMonths || 24} onChange={v => upd('bdmTrailingMonths', v)} suffix="M" />
        </>)}
      </Section>
      
      <Section title="Broker Economics" color="orange">
        <ToggleInput label="Broker Enabled" value={assumptions.brokerEnabled !== false} onChange={v => upd('brokerEnabled', v)} />
        {assumptions.brokerEnabled !== false && (<>
          <NumInput label="Start Month" value={assumptions.brokerCapitalStartMonth || 3} onChange={v => upd('brokerCapitalStartMonth', v)} suffix="M" />
          <NumInput label="Monthly Capital" value={assumptions.brokerMonthlyCapital || 500000} onChange={v => upd('brokerMonthlyCapital', v)} suffix="$" step={100000} />
          <NumInput label="Retainer" value={assumptions.brokerRetainer || 0} onChange={v => upd('brokerRetainer', v)} suffix="$/mo" step={500} />
          <NumInput label="Trailing Comm (bps)" value={(assumptions.brokerCommissionRate || 0.005) * 10000} onChange={v => upd('brokerCommissionRate', v/10000)} suffix="bps" step={5} />
          <NumInput label="Trailing Months" value={assumptions.brokerTrailingMonths || 24} onChange={v => upd('brokerTrailingMonths', v)} suffix="M" />
        </>)}
      </Section>
      
      <Section title="Operating Expenses">
        <NumInput label="Marketing (Pre-BE)" value={assumptions.marketingPreBE || 2000} onChange={v => upd('marketingPreBE', v)} suffix="$" step={250} />
        <NumInput label="Marketing (Post-BE)" value={assumptions.marketingPostBE || 2000} onChange={v => upd('marketingPostBE', v)} suffix="$" step={250} />
        <NumInput label="Travel (Pre-BE)" value={assumptions.travelPreBE || 2000} onChange={v => upd('travelPreBE', v)} suffix="$" step={250} />
        <NumInput label="Travel (Post-BE)" value={assumptions.travelPostBE || 2000} onChange={v => upd('travelPostBE', v)} suffix="$" step={250} />
        <NumInput label="Office/IT" value={assumptions.officeIT} onChange={v => upd('officeIT', v)} suffix="$" step={250} />
        <NumInput label="Compliance" value={assumptions.compliance} onChange={v => upd('compliance', v)} suffix="$" step={500} />
        <NumInput label="Setup Cost" value={assumptions.setupCost} onChange={v => upd('setupCost', v)} suffix="$" step={1000} />
      </Section>
      
      {/* REDEMPTIONS - NEW EDITABLE UI */}
      <Section title="📤 Redemptions" color="red">
        <ToggleInput label="Redemptions Enabled" value={assumptions.redemptionsEnabled} onChange={v => upd('redemptionsEnabled', v)} />
        {assumptions.redemptionsEnabled && (
          <div className="mt-3 space-y-2">
            <p className="text-xs text-gray-600 font-semibold">Schedule:</p>
            {redemptionSchedule.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No redemptions scheduled</p>
            ) : (
              <table className="w-full text-xs">
                <thead><tr className="border-b"><th className="text-left py-1">Month</th><th className="text-right py-1">Amount</th><th></th></tr></thead>
                <tbody>
                  {redemptionSchedule.map((r, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-1">
                        <input type="number" value={r.month} onChange={e => updateRedemption(i, 'month', parseInt(e.target.value) || 0)}
                          className="w-12 px-1 py-0.5 text-center border rounded text-blue-600 font-mono" />
                      </td>
                      <td className="py-1 text-right">
                        <input type="number" value={r.amount} onChange={e => updateRedemption(i, 'amount', parseInt(e.target.value) || 0)}
                          step={500000} className="w-24 px-1 py-0.5 text-right border rounded text-blue-600 font-mono" />
                      </td>
                      <td className="py-1 text-right">
                        <button onClick={() => removeRedemption(i)} className="text-red-500 hover:text-red-700 font-bold px-2">×</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="flex gap-2 items-center pt-2 border-t mt-2">
              <input type="number" value={newRedMonth} onChange={e => setNewRedMonth(parseInt(e.target.value) || 0)} placeholder="M"
                className="w-12 px-1 py-1 text-center border rounded text-xs" />
              <input type="number" value={newRedAmount} onChange={e => setNewRedAmount(parseInt(e.target.value) || 0)} step={500000} placeholder="Amount"
                className="w-24 px-1 py-1 text-right border rounded text-xs" />
              <button onClick={addRedemption} className="px-3 py-1 bg-green-500 text-white rounded text-xs font-medium hover:bg-green-600">+ Add</button>
            </div>
          </div>
        )}
      </Section>
      
      <Section title="US Feeder Fund" color="purple">
        <SelectInput label="Trigger Month" value={assumptions.usFeederMonth === null ? 'null' : String(assumptions.usFeederMonth)} 
          options={monthOptions} onChange={v => upd('usFeederMonth', v === 'null' ? null : parseInt(v))} />
        <NumInput label="Amount" value={assumptions.usFeederAmount || 30000} onChange={v => upd('usFeederAmount', v)} suffix="$" step={5000} />
        <ToggleInput label="GP Expense" value={assumptions.usFeederIsGpExpense !== false} onChange={v => upd('usFeederIsGpExpense', v)} help="ON=GP pays" />
      </Section>
    </div>
  );
};

function Section({ title, color, children }) {
  const colorMap = { amber: 'bg-amber-50 border-amber-200', blue: 'bg-blue-50 border-blue-200', purple: 'bg-purple-50 border-purple-200', green: 'bg-green-50 border-green-200', orange: 'bg-orange-50 border-orange-200', red: 'bg-red-50 border-red-200' };
  return (<div className={`rounded-lg shadow p-4 border ${colorMap[color] || 'bg-white border-gray-200'}`}>
    <h3 className="font-semibold mb-3 pb-2 border-b">{title}</h3>
    <div className="space-y-2">{children}</div>
  </div>);
}
function NumInput({ label, value, onChange, suffix, step = 1 }) {
  return (<div className="flex justify-between items-center py-1 border-b border-gray-200">
    <span className="text-sm text-gray-700">{label}</span>
    <div className="flex items-center gap-1">
      <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} step={step}
        className="w-24 px-2 py-1 text-right text-blue-600 font-mono text-sm border border-gray-300 rounded" />
      <span className="text-xs text-gray-500 w-8">{suffix}</span>
    </div>
  </div>);
}
function DateInput({ label, value, onChange }) {
  return (<div className="flex justify-between items-center py-1 border-b border-gray-200">
    <span className="text-sm text-gray-700">{label}</span>
    <input type="date" value={value || ''} onChange={e => onChange(e.target.value)}
      className="px-2 py-1 text-blue-600 font-mono text-sm border border-gray-300 rounded" />
  </div>);
}
function SelectInput({ label, value, options, onChange }) {
  return (<div className="flex justify-between items-center py-1 border-b border-gray-200">
    <span className="text-sm text-gray-700">{label}</span>
    <select value={value} onChange={e => onChange(e.target.value)} className="px-2 py-1 text-blue-600 font-mono text-sm border border-gray-300 rounded">
      {options.map(opt => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
    </select>
  </div>);
}
function ToggleInput({ label, value, onChange, help }) {
  return (<div className="flex justify-between items-center py-1 border-b border-gray-200">
    <div><span className="text-sm text-gray-700">{label}</span>{help && <span className="text-xs text-gray-400 ml-1">({help})</span>}</div>
    <button onClick={() => onChange(!value)} className={`px-3 py-1 rounded text-sm font-medium transition ${value ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
      {value ? 'ON' : 'OFF'}
    </button>
  </div>);
}
