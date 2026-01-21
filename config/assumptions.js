// config/assumptions.js - All editable model inputs
// v9.6: Paul cash draw toggle added to DEFAULT_ASSUMPTIONS

window.FundModel = window.FundModel || {};

window.FundModel.TIMELINE = {
  launchDate: '2026-02-23',
  projectionMonths: 24,
  preLaunchMonths: 11,
  rollingBalanceMonths: 18,
  targetBreakevenMonth: 7,
};

window.FundModel.FUNDING = {
  startingCashUSD: 367000,
};

window.FundModel.PERSONNEL = {
  ian: { preBESalary: 5000, postBESalary: 10000, treatAsRollUp: true },
  paul: { preBESalary: 5000, postBESalary: 10000, treatAsRollUp: false, cashDrawToggle: true },
  lewis: { monthlySalary: 7000, startMonth: -5, durationMonths: 12 },
  emma: { monthlySalary: 1000, startMonth: 0 },
  adrian: { monthlySalary: 1800, startMonth: -6 },
  chairman: { quarterlyAmount: 5000, startMonth: 4 },
};

window.FundModel.OPEX = {
  leventus: 5000,
  adminCustodial: 1500,
  office: 600,
  tech: 400,
  mobile: 200,
  marketing: { preBE: 0, postBE: 1000, budgetPreBE: 6000, inverse: true },
  travel: { preBE: 500, postBE: 1000, budgetPreBE: 6000, inverse: true },
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
    { description: 'Setup invoices (actuals)', amount: 10000 },
    { description: 'PPM legal fees', amount: 15000 },
    { description: 'Adrian historical', amount: 8000 },
    { description: 'Historical travel', amount: 6000 },
    { description: 'US Feeder Fund (wash)', amount: 30000 },
    { description: 'Ian personal costs', amount: 100000 },
  ],
  usFeederWash: { out: 30000, in: 30000 },
  repaymentStartYear: 3,
  interestRate: 0.05,
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

window.FundModel.DEFAULT_ASSUMPTIONS = {
  projectionMonths: window.FundModel.TIMELINE.projectionMonths,
  preLaunchMonths: window.FundModel.TIMELINE.preLaunchMonths,
  startingCashUSD: window.FundModel.FUNDING.startingCashUSD,
  mgmtFeeAnnual: window.FundModel.FUND_ECONOMICS.mgmtFeeAnnual,
  carryRatePrivate: window.FundModel.FUND_ECONOMICS.carryRate,
  carryRatePublic: window.FundModel.FUND_ECONOMICS.carryRate,
  annualReturn: window.FundModel.FUND_ECONOMICS.annualReturn,
  publicWeight: window.FundModel.FUND_ECONOMICS.publicWeight,
  gpCommitmentRate: window.FundModel.FUND_ECONOMICS.gpCommitmentRate,
  ianSalaryPre: window.FundModel.PERSONNEL.ian.preBESalary,
  ianSalaryPost: window.FundModel.PERSONNEL.ian.postBESalary,
  ianRollUp: window.FundModel.PERSONNEL.ian.treatAsRollUp,
  paulSalaryPre: window.FundModel.PERSONNEL.paul.preBESalary,
  paulSalaryPost: window.FundModel.PERSONNEL.paul.postBESalary,
  paulCashDraw: window.FundModel.PERSONNEL.paul.cashDrawToggle,
  lewisSalary: window.FundModel.PERSONNEL.lewis.monthlySalary,
  lewisStartMonth: window.FundModel.PERSONNEL.lewis.startMonth,
  lewisMonths: window.FundModel.PERSONNEL.lewis.durationMonths,
  eaSalary: window.FundModel.PERSONNEL.emma.monthlySalary,
  eaStartMonth: window.FundModel.PERSONNEL.emma.startMonth,
  chairmanSalary: window.FundModel.PERSONNEL.chairman.quarterlyAmount,
  chairmanStartMonth: window.FundModel.PERSONNEL.chairman.startMonth,
  officeIT: window.FundModel.OPEX.office + window.FundModel.OPEX.tech + window.FundModel.OPEX.mobile,
  marketing: window.FundModel.OPEX.marketing.preBE,
  marketingStopsAtBreakeven: false,
  travel: window.FundModel.OPEX.travel.preBE,
  compliance: window.FundModel.OPEX.leventus + window.FundModel.OPEX.adminCustodial,
  setupCost: window.FundModel.OPEX.setupCost,
  brokerStartMonth: window.FundModel.CAPITAL.brokerRaise.startMonth,
  brokerCommissionRate: window.FundModel.CAPITAL.brokerRaise.commissionRate,
};
