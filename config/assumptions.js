// config/assumptions.js - All editable model inputs
// v9.3: Major update - 24mo horizon, new personnel/opex, carry below line

window.FundModel = window.FundModel || {};

window.FundModel.TIMELINE = {
  launchDate: '2026-02-23',
  projectionMonths: 24,
  preLaunchMonths: 11,
  rollingBalanceMonths: 18,
  targetBreakevenMonth: 7,
};

window.FundModel.FX = {
  gbpToUsd: 1.27,
  eurToUsd: 1.08,
};

window.FundModel.PERSONNEL = {
  ian: {
    preBESalary: 5000,
    postBESalary: 10000,
    treatAsRollUp: true,
  },
  paul: {
    preBESalary: 5000,
    postBESalary: 10000,
    treatAsRollUp: false,
  },
  lewis: {
    monthlySalary: 8850,
    startMonth: -5,
    durationMonths: 12,
  },
  emma: {
    monthlySalary: 1000,
    startMonth: 0,
  },
  adrian: {
    monthlySalary: 2300,
    startMonth: -6,
  },
  chairman: {
    quarterlyAmount: 5000,
    startMonth: 4,
  },
};

window.FundModel.OPEX = {
  leventus: 6300,
  adminCustodial: 1600,
  office: 760,
  tech: 500,
  mobile: 250,
  marketing: {
    preBE: 0,
    postBE: 1000,
    budgetPreBE: 6000,
    inverse: true,
  },
  travel: {
    preBE: 500,
    postBE: 1000,
    budgetPreBE: 6000,
    inverse: true,
  },
  setupCost: 10000,
};

window.FundModel.FUND_ECONOMICS = {
  mgmtFeeAnnual: 0.015,
  carryRate: 0.175,
  hurdleRate: 0.06,
  annualReturn: 0.14,
  publicWeight: 0.6,
  gpCommitmentRate: 0.02,
};

window.FundModel.REVENUE = {
  mgmtFeeRate: 0.015,
  carryRate: 0.175,
  carryBelowLine: true,
  hwm: true,
};

window.FundModel.SHAREHOLDER_LOAN = {
  initialItems: [
    { description: 'Pre-model setup costs', amount: 50000 },
    { description: 'PPM legal/drafting', amount: 15000 },
    { description: 'Historical travel', amount: 6000 },
    { description: 'Historical salaries (Adrian)', amount: 8000 },
    { description: 'US Feeder Fund', amount: 30000 },
    { description: 'Ians personal costs', amount: 100000 },
  ],
};

window.FundModel.STONE_PARK = {
  totalEUR: 550000,
  founderSharePct: 0.6667,
  availableBalanceEUR: 50000,
};

window.FundModel.CAPITAL = {
  gpOrganic: { m0to11: 2500000, m12to23: 2500000 },
  bdm: { startMonth: 7, monthly: 500000 },
  brokerRaise: { startMonth: 3, monthly: 250000, commissionRate: 0.01 },
};

window.FundModel.DOWNSIDE = {
  y1AumTarget: 30000000,
  capitalMultiplier: 0.5,
};

// Legacy compatibility - FULL mapping to engine expectations
window.FundModel.DEFAULT_FX_RATES = window.FundModel.FX;
window.FundModel.DEFAULT_ASSUMPTIONS = {
  // Timeline
  projectionMonths: window.FundModel.TIMELINE.projectionMonths,
  preLaunchMonths: window.FundModel.TIMELINE.preLaunchMonths,
  
  // FX Rates
  fxRates: { ...window.FundModel.FX },
  
  // Fund Economics
  mgmtFeeAnnual: window.FundModel.FUND_ECONOMICS.mgmtFeeAnnual,
  carryRatePrivate: window.FundModel.FUND_ECONOMICS.carryRate,
  carryRatePublic: window.FundModel.FUND_ECONOMICS.carryRate,
  annualReturn: window.FundModel.FUND_ECONOMICS.annualReturn,
  publicWeight: window.FundModel.FUND_ECONOMICS.publicWeight,
  gpCommitmentRate: window.FundModel.FUND_ECONOMICS.gpCommitmentRate,
  
  // Stone Park
  stonePark: {
    totalEUR: window.FundModel.STONE_PARK.totalEUR,
    founderSharePct: window.FundModel.STONE_PARK.founderSharePct,
    availableBalanceEUR: window.FundModel.STONE_PARK.availableBalanceEUR,
  },
  
  // Ian & Paul Salaries
  ianSalaryPre: window.FundModel.PERSONNEL.ian.preBESalary,
  ianSalaryPost: window.FundModel.PERSONNEL.ian.postBESalary,
  paulSalaryPre: window.FundModel.PERSONNEL.paul.preBESalary,
  paulSalaryPost: window.FundModel.PERSONNEL.paul.postBESalary,
  
  // Lewis
  lewisSalary: window.FundModel.PERSONNEL.lewis.monthlySalary,
  lewisStartMonth: window.FundModel.PERSONNEL.lewis.startMonth,
  lewisMonths: window.FundModel.PERSONNEL.lewis.durationMonths,
  
  // EA (Emma)
  eaSalaryGBP: window.FundModel.PERSONNEL.emma.monthlySalary,
  eaStartMonth: window.FundModel.PERSONNEL.emma.startMonth,
  
  // Chairman
  chairmanSalary: window.FundModel.PERSONNEL.chairman.quarterlyAmount,
  chairmanStartMonth: window.FundModel.PERSONNEL.chairman.startMonth,
  
  // OpEx - Direct values for engine
  officeIT: window.FundModel.OPEX.office + window.FundModel.OPEX.tech + window.FundModel.OPEX.mobile,
  marketing: window.FundModel.OPEX.marketing.preBE,
  marketingStopsAtBreakeven: false,
  travel: window.FundModel.OPEX.travel.preBE,
  compliance: window.FundModel.OPEX.leventus + window.FundModel.OPEX.adminCustodial,
  setupCost: window.FundModel.OPEX.setupCost,
  
  // Broker
  brokerStartMonth: window.FundModel.CAPITAL.brokerRaise.startMonth,
  brokerCommissionRate: window.FundModel.CAPITAL.brokerRaise.commissionRate,
};
