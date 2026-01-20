// ui/Controls.js - Input controls and recoverable costs panel
// v7: Updated for new assumptions structure
// v8.4: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.Controls = function Controls({ assumptions, onUpdate }) {
  const upd = (k, v) => onUpdate(k, v);
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Section title="Timeline" color="amber">
        <DateInput label="Model Start" value={assumptions.modelStartDate} onChange={v => upd('modelStartDate', v)} />
        <DateInput label="Fund Launch" value={assumptions.fundLaunchDate} onChange={v => upd('fundLaunchDate', v)} />
        <DateInput label="Lewis Start" value={assumptions.lewisStartDate} onChange={v => upd('lewisStartDate', v)} />
      </Section>
      
      <Section title="Fees & Returns">
        <NumInput label="Mgmt Fee (Annual)" value={assumptions.mgmtFeeAnnual * 100} onChange={v => upd('mgmtFeeAnnual', v/100)} suffix="%" step={0.1} />
        <NumInput label="Carry Rate" value={assumptions.carryRatePrivate * 100} onChange={v => { upd('carryRatePrivate', v/100); upd('carryRatePublic', v/100); }} suffix="%" />
        <NumInput label="Annual Return" value={assumptions.annualReturn * 100} onChange={v => upd('annualReturn', v/100)} suffix="%" />
        <NumInput label="Public Weight" value={assumptions.publicWeight * 100} onChange={v => upd('publicWeight', v/100)} suffix="%" step={5} />
        <NumInput label="GP Commitment" value={assumptions.gpCommitmentRate * 100} onChange={v => upd('gpCommitmentRate', v/100)} suffix="%" step={0.5} />
      </Section>
      
      <Section title="Founder Salaries">
        <NumInput label="Ian (Pre-BE)" value={assumptions.ianSalaryPre} onChange={v => upd('ianSalaryPre', v)} suffix="$" step={1000} />
        <NumInput label="Ian (Post-BE)" value={assumptions.ianSalaryPost} onChange={v => upd('ianSalaryPost', v)} suffix="$" step={1000} />
        <NumInput label="Paul (Pre-BE)" value={assumptions.paulSalaryPre} onChange={v => upd('paulSalaryPre', v)} suffix="$" step={1000} />
        <NumInput label="Paul (Post-BE)" value={assumptions.paulSalaryPost} onChange={v => upd('paulSalaryPost', v)} suffix="$" step={1000} />
      </Section>
      
      <Section title="Staff Costs">
        <NumInput label="Lewis" value={assumptions.lewisSalary} onChange={v => upd('lewisSalary', v)} suffix="$" step={500} />
        <NumInput label="Lewis Months" value={assumptions.lewisMonths} onChange={v => upd('lewisMonths', v)} suffix="M" />
        <NumInput label="EA" value={assumptions.eaSalary} onChange={v => upd('eaSalary', v)} suffix="$" step={500} />
        <NumInput label="Chairman (Quarterly)" value={assumptions.chairmanSalary} onChange={v => upd('chairmanSalary', v)} suffix="$" step={500} />
        <ToggleInput label="COO Enabled" value={assumptions.cooEnabled} onChange={v => upd('cooEnabled', v)} />
        {assumptions.cooEnabled && <NumInput label="COO Salary" value={assumptions.cooSalary} onChange={v => upd('cooSalary', v)} suffix="$" step={500} />}
      </Section>
      
      <Section title="Operating Expenses">
        <NumInput label="Office/IT" value={assumptions.officeIT} onChange={v => upd('officeIT', v)} suffix="$" step={250} />
        <NumInput label="Marketing" value={assumptions.marketing} onChange={v => upd('marketing', v)} suffix="$" step={250} />
        <ToggleInput label="Marketing stops at BE" value={assumptions.marketingStopsAtBreakeven} onChange={v => upd('marketingStopsAtBreakeven', v)} />
        <NumInput label="Travel" value={assumptions.travel} onChange={v => upd('travel', v)} suffix="$" step={250} />
        <NumInput label="Compliance" value={assumptions.compliance} onChange={v => upd('compliance', v)} suffix="$" step={500} />
        <NumInput label="Setup Cost" value={assumptions.setupCost} onChange={v => upd('setupCost', v)} suffix="$" step={1000} />
      </Section>
      
      <Section title="Fund Structure">
        <NumInput label="Fund Launch Month" value={assumptions.fundLaunchMonth} onChange={v => upd('fundLaunchMonth', v)} suffix="M" />
        <NumInput label="Redemption Start" value={assumptions.redemptionStartMonth} onChange={v => upd('redemptionStartMonth', v)} suffix="M" />
      </Section>
    </div>
  );
};

window.FundModel.RecoverablesPanel = function RecoverablesPanel({ recoverables, toggles, onToggle }) {
  const { formatCurrency, RECOVERABLE_ITEMS } = window.FundModel;
  const fmt = formatCurrency;
  const toggle = (key) => onToggle(prev => ({ ...prev, [key]: !prev[key] }));
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="font-semibold mb-4">Recoverable Costs Tracker</h2>
      <p className="text-sm text-gray-600 mb-4">Toggle which pre-breakeven costs should be tracked as potentially recoverable.</p>
      
      <div className="space-y-3">
        {recoverables.items.map(item => (
          <div key={item.key} className={`flex items-center justify-between p-3 rounded-lg ${item.enabled ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
            <div className="flex items-center gap-3">
              <input type="checkbox" checked={item.enabled} onChange={() => toggle(item.key)} className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-xs text-gray-500">{RECOVERABLE_ITEMS && RECOVERABLE_ITEMS[item.key]?.description}</p>
              </div>
            </div>
            <span className={`font-mono font-bold ${item.enabled ? 'text-green-600' : 'text-gray-400'}`}>{fmt(item.amount)}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-4 bg-green-100 rounded-lg border-2 border-green-300">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-green-800">Total Recoverable</span>
          <span className="text-2xl font-bold text-green-700">{fmt(recoverables.totalRecoverable)}</span>
        </div>
        {recoverables.breakEvenMonth && (
          <p className="text-sm text-green-600 mt-1">Based on breakeven at Month {recoverables.breakEvenMonth}</p>
        )}
      </div>
    </div>
  );
};

function Section({ title, color, children }) {
  const bgClass = color === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-white';
  const borderClass = color === 'amber' ? 'border-amber-300' : '';
  return (
    <div className={`rounded-lg shadow p-4 ${bgClass} border ${borderClass}`}>
      <h3 className="font-semibold mb-3 pb-2 border-b">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function NumInput({ label, value, onChange, suffix, step = 1 }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-200">
      <span className="text-sm text-gray-700">{label}</span>
      <div className="flex items-center gap-1">
        <input type="number" value={value} onChange={e => onChange(parseFloat(e.target.value) || 0)} step={step}
          className="w-24 px-2 py-1 text-right text-blue-600 font-mono text-sm border border-gray-300 rounded" />
        <span className="text-xs text-gray-500 w-6">{suffix}</span>
      </div>
    </div>
  );
}

function DateInput({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-200">
      <span className="text-sm text-gray-700">{label}</span>
      <input type="date" value={value} onChange={e => onChange(e.target.value)}
        className="px-2 py-1 text-blue-600 font-mono text-sm border border-gray-300 rounded" />
    </div>
  );
}

function ToggleInput({ label, value, onChange }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-200">
      <span className="text-sm text-gray-700">{label}</span>
      <button onClick={() => onChange(!value)}
        className={`px-3 py-1 rounded text-sm font-medium ${value ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}>
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}
