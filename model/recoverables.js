// model/recoverables.js - Track recoverable costs with line-item toggles
// v8.5: Converted to window.FundModel namespace

window.FundModel = window.FundModel || {};

window.FundModel.RECOVERABLE_ITEMS = {
  setupCosts: { label: 'Setup Costs', default: true, description: 'Initial fund setup expenses' },
  founderSalariesPre: { label: 'Founder Salaries (Pre-BE)', default: true, description: 'Ian & Paul salaries before breakeven' },
  marketingPre: { label: 'Marketing (Pre-BE)', default: true, description: 'Marketing spend before breakeven' },
  travelPre: { label: 'Travel (Pre-BE)', default: false, description: 'Travel expenses before breakeven' },
  lewisSalary: { label: 'Lewis Salary', default: false, description: '12-month COO contract' },
  chairmanPrepaid: { label: 'Chairman Prepaid', default: false, description: 'Prepaid chairman fees' },
};

window.FundModel.calculateRecoverables = function(model, toggles) {
  toggles = toggles || {};
  const ITEMS = window.FundModel.RECOVERABLE_ITEMS;
  const enabled = { ...Object.fromEntries(Object.entries(ITEMS).map(([k, v]) => [k, v.default])), ...toggles };
  const months = model.months || [];
  const assumptions = window.FundModel.DEFAULT_ASSUMPTIONS || {};
  
  let setupCosts = 0, founderSalariesPre = 0, marketingPre = 0, travelPre = 0, lewisSalary = 0, chairmanPrepaid = 0;
  
  const beMonth = model.breakEvenMonth || 37;
  
  months.forEach(m => {
    if (m.month === 0 && enabled.setupCosts) setupCosts = assumptions.setupCost || 10000;
    if (m.month < beMonth && !m.isPreLaunch && enabled.founderSalariesPre) founderSalariesPre += (m.ianSalary || 0) + (m.paulSalary || 0);
    if (m.month < beMonth && !m.isPreLaunch && enabled.marketingPre) marketingPre += m.marketing || 0;
    if (m.month < beMonth && !m.isPreLaunch && enabled.travelPre) travelPre += assumptions.travel || 0;
    if (m.lewisSalary > 0 && enabled.lewisSalary) lewisSalary += m.lewisSalary;
  });
  
  if (enabled.chairmanPrepaid) chairmanPrepaid = assumptions.chairmanPrepaid || 7500;
  
  const items = [
    { key: 'setupCosts', label: 'Setup Costs', amount: setupCosts, enabled: enabled.setupCosts },
    { key: 'founderSalariesPre', label: 'Founder Salaries (Pre-BE)', amount: founderSalariesPre, enabled: enabled.founderSalariesPre },
    { key: 'marketingPre', label: 'Marketing (Pre-BE)', amount: marketingPre, enabled: enabled.marketingPre },
    { key: 'travelPre', label: 'Travel (Pre-BE)', amount: travelPre, enabled: enabled.travelPre },
    { key: 'lewisSalary', label: 'Lewis Salary', amount: lewisSalary, enabled: enabled.lewisSalary },
    { key: 'chairmanPrepaid', label: 'Chairman Prepaid', amount: chairmanPrepaid, enabled: enabled.chairmanPrepaid },
  ];
  
  const totalRecoverable = items.filter(i => i.enabled).reduce((sum, i) => sum + i.amount, 0);
  
  return { items, totalRecoverable, breakEvenMonth: beMonth < 37 ? beMonth : null };
};
