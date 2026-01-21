// config/assumptions.js v10.19 - BDM/Broker trailing rev share fixed (50bps)
// Model Start: March 1, 2025 | Fund Launch: February 1, 2026 | Lewis: Aug 1, 2025
window.FundModel = window.FundModel || {};

window.FundModel.TIMELINE = {
  modelStartDate: '2025-03-01', launchDate: '2026-02-01',
  projectionMonths: 36, preLaunchMonths: 11, rollingBalanceMonths: 18,
};

// STONE PARK LOAN (Starting Capital at M0)
// This is the $367K available from Paul & Ian's 2/3 share of Stone Park
window.FundModel.STONE_PARK = {
  totalEUR: 550000,
  founderSharePct: 0.6667,  // Paul & Ian's 2/3
  fxRate: 1.27,             // EUR to USD
  availableUSD: 367000,     // Starting cash at M0 - THIS IS THE STARTING POT
};

// Legacy alias for backwards compatibility
window.FundModel.FUNDING = { startingCashUSD: 367000 };

window.FundModel.PERSONNEL = {
  ian: { preBESalary: 5000, postBESalary: 10000, rollUpMode: 'untilBreakeven', cashDrawEnabled: true },
  paul: { preBESalary: 5000, postBESalary: 10000, rollUpMode: 'untilBreakeven', cashDrawEnabled: true },
  lewis: { monthlySalary: 7000, startMonth: -6, durationMonths: 12 }, // Aug 2025, 12mo incl pre-launch
  emma: { monthlySalary: 1000, startMonth: 0 },
  chairman: { quarterlyAmount: 5000, startMonth: 4 }, // £5K quarterly = Adrian's ONLY cost
};

window.FundModel.OPEX = {
  leventus: 5000, adminCustodial: 1500, office: 600, tech: 400, mobile: 200,
  marketing: { preBE: 2000, postBE: 2000, rollUpToSL: false },
  travel: { preBE: 2000, postBE: 2000, rollUpToSL: false },
  setupCost: 10000,
};

window.FundModel.FUND_ECONOMICS = {
  mgmtFeeAnnual: 0.015, carryRate: 0.175, hurdleRate: 0.06,
  annualReturn: 0.14, publicWeight: 0.6, gpCommitmentRate: 0.02,
};

window.FundModel.REVENUE = { mgmtFeeRate: 0.015, carryRate: 0.175, carryBelowLine: true, hwm: true };

// SHAREHOLDER LOAN (Money owed TO founders from pre-launch costs)
window.FundModel.SHAREHOLDER_LOAN = {
  preLaunchCosts: {
    lewisSalary: 84000,
    setupCosts: 10000,
    legal: 15000,
    adrianHistorical: 8000,
    historicalTravel: 6000,
    other: 3000,
    total: 126000,
  },
  initialItems: [
    { description: 'Setup invoices', amount: 10000 },
    { description: 'PPM legal fees', amount: 15000 },
    { description: 'Adrian historical', amount: 8000 },
    { description: 'Historical travel', amount: 6000 },
    { description: 'US Feeder Fund', amount: 30000, gpExpense: true },
    { description: 'Ian personal costs', amount: 100000 },
    { description: 'Paul sundry costs', amount: 100000 },
  ],
  repaymentStartYear: 3, 
  interestRate: 0.05,
  recovery: { triggerMonth: 24, rate: 0.5 },
};

window.FundModel.US_FEEDER = { amount: 30000, month: null, isGpExpense: true };

// CAPITAL RAISE - BDM and Broker with TRAILING rev share (50bps each)
// Mgmt fee is 1.5% (150bps), so 50bps = 33% of mgmt fee to BDM/Broker
window.FundModel.CAPITAL = {
  gpOrganic: { m0to3: 2000000, m4to11: 3000000, m12plus: 2500000 },
  bdm: { 
    enabled: true, 
    startMonth: 7, 
    monthly: 500000, 
    retainer: 0, 
    revSharePct: 0, 
    commissionRate: 0.005,  // 50bps trailing on AUM raised
    trailingMonths: 24      // 2 years trailing
  },
  brokerRaise: { 
    enabled: true, 
    startMonth: 3, 
    monthly: 500000, 
    retainer: 0, 
    commissionRate: 0.005,  // 50bps trailing on AUM raised
    trailingMonths: 24      // 2 years trailing
  },
};

window.FundModel.SHARE_CLASSES = {
  founder: { mgmtFeeRate: 0, carryRate: 0, publicWeight: 0.6 },
  classA: { mgmtFeeRate: 0.015, carryRate: 0.175, publicWeight: 0.6 },
  classB: { mgmtFeeRate: 0.015, carryRate: 0.175, publicWeight: 0 },
  classC: { mgmtFeeRate: 0.015, carryRate: 0.175, publicWeight: 1.0 },
};

window.FundModel.REDEMPTIONS = { 
  enabled: false, 
  schedule: [
    { month: 25, amount: 2000000 }, 
    { month: 31, amount: 3000000 }
  ] 
};

window.FundModel.DOWNSIDE = { y1AumTarget: 30000000, capitalMultiplier: 0.5 };

// DEFAULT_ASSUMPTIONS - flattened for engine
window.FundModel.DEFAULT_ASSUMPTIONS = {
  projectionMonths: 36, preLaunchMonths: 11,
  modelStartDate: '2025-03-01', launchDate: '2026-02-01',
  startingCashUSD: 367000,
  mgmtFeeAnnual: 0.015, carryRatePrivate: 0.175, carryRatePublic: 0.175,
  annualReturn: 0.14, publicWeight: 0.6, gpCommitmentRate: 0.02,
  ianSalaryPre: 5000, ianSalaryPost: 10000, ianRollUpMode: 'untilBreakeven', ianCashDrawEnabled: true,
  paulSalaryPre: 5000, paulSalaryPost: 10000, paulRollUpMode: 'untilBreakeven', paulCashDrawEnabled: true,
  lewisSalary: 7000, lewisStartMonth: -6, lewisMonths: 12,
  eaSalary: 1000, eaStartMonth: 0,
  chairmanSalary: 5000, chairmanStartMonth: 4,
  officeIT: 1200, marketingPreBE: 2000, marketingPostBE: 2000, marketingRollUp: false,
  travelPreBE: 2000, travelPostBE: 2000, travelRollUp: false,
  compliance: 6500, setupCost: 10000,
  gpOrganicM0to3: 2000000, gpOrganicM4to11: 3000000, gpOrganicM12plus: 2500000,
  bdmEnabled: true, bdmCapitalStartMonth: 7, bdmMonthlyCapital: 500000, 
  bdmRetainer: 0, bdmRevSharePct: 0, bdmCommissionRate: 0.005, bdmTrailingMonths: 24,
  brokerEnabled: true, brokerCapitalStartMonth: 3, brokerMonthlyCapital: 500000, 
  brokerRetainer: 0, brokerCommissionRate: 0.005, brokerTrailingMonths: 24,
  redemptionsEnabled: false, redemptionSchedule: [{ month: 25, amount: 2000000 }, { month: 31, amount: 3000000 }],
  usFeederMonth: null, usFeederAmount: 30000, usFeederIsGpExpense: true,
};
