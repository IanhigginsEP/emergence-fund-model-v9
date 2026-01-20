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
    { description: 'Ian foregone salary (accrued)', amount: 0 },
  ],
};

window.FundModel.CAPITAL = {
  gpOrganic: { m0to11: 2500000, m12to23: 2500000 },
  brokerRaise: { startMonth: 3, monthly: 250000, commissionRate: 0.01 },
};

window.FundModel.DOWNSIDE = {
  y1AumTarget: 30000000,
  capitalMultiplier: 0.5,
};

// Legacy compatibility - map to new structure
window.FundModel.DEFAULT_FX_RATES = window.FundModel.FX;
window.FundModel.DEFAULT_ASSUMPTIONS = {
  projectionMonths: window.FundModel.TIMELINE.projectionMonths,
  preLaunchMonths: window.FundModel.TIMELINE.preLaunchMonths,
  fxRates: { ...window.FundModel.FX },
  mgmtFeeAnnual: window.FundModel.REVENUE.mgmtFeeRate,
  carryRatePrivate: window.FundModel.REVENUE.carryRate,
  carryRatePublic: window.FundModel.REVENUE.carryRate,
  annualReturn: 0.14,
  ianSalaryPre: window.FundModel.PERSONNEL.ian.preBESalary,
  ianSalaryPost: window.FundModel.PERSONNEL.ian.postBESalary,
  paulSalaryPre: window.FundModel.PERSONNEL.paul.preBESalary,
  paulSalaryPost: window.FundModel.PERSONNEL.paul.postBESalary,
  lewisSalary: window.FundModel.PERSONNEL.lewis.monthlySalary,
  lewisStartMonth: window.FundModel.PERSONNEL.lewis.startMonth,
  lewisMonths: window.FundModel.PERSONNEL.lewis.durationMonths,
  eaSalaryGBP: window.FundModel.PERSONNEL.emma.monthlySalary,
  eaStartMonth: window.FundModel.PERSONNEL.emma.startMonth,
  brokerStartMonth: window.FundModel.CAPITAL.brokerRaise.startMonth,
  brokerCommissionRate: window.FundModel.CAPITAL.brokerRaise.commissionRate,
};
