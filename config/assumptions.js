// config/assumptions.js - All editable model inputs
// v10.9: Added BDM/Broker fee structure fields to DEFAULT_ASSUMPTIONS

window.FundModel = window.FundModel || {};

window.FundModel.TIMELINE = {
  launchDate: '2026-02-23',
  projectionMonths: 36,
  preLaunchMonths: 12,
  rollingBalanceMonths: 18,
  targetBreakevenMonth: null,
};

window.FundModel.FUNDING = {
  startingCashUSD: 367000,
};

window.FundModel.PERSONNEL = {
  ian: { 
    preBESalary: 5000, 
    postBESalary: 10000, 
    rollUpMode: 'untilBreakeven',
    rollUpEndMonth: null,
  },
  paul: { 
    preBESalary: 5000, 
    postBESalary: 10000, 
    rollUpMode: 'untilBreakeven',
    rollUpEndMonth: null,
  },
  lewis: { 
    monthlySalary: 7000, 
    startMonth: -5, 
    durationMonths: 12,
    adjustmentMonth: null,
    adjustedSalary: null,
  },
  emma: { monthlySalary: 1000, startMonth: 0 },
  adrian: { monthlySalary: 1667, startMonth: -6 },
  chairman: { quarterlyAmount: 5000, startMonth: 4 },
};

window.FundModel.OPEX = {
  leventus: 5000,
  adminCustodial: 1500,
  office: 600,
  tech: 400,
  mobile: 200,
  marketing: { preBE: 1500, postBE: 3000, rollUpToSL: false },
  travel: { preBE: 1500, postBE: 3000, rollUpToSL: false },
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
    { description: 'US Feeder Fund', amount: 30000, gpExpense: true, month: null },
    { description: 'Ian personal costs', amount: 100000 },
    { description: 'Paul sundry costs', amount: 100000 },
  ],
  repaymentStartYear: 3,
  interestRate: 0.05,
};

window.FundModel.US_FEEDER = {
  amount: 30000,
  month: null,
  isGpExpense: true,
};

window.FundModel.CAPITAL = {
  gpOrganic: { m0to11: 2500000, m12to35: 2500000 },
  bdm: { 
    startMonth: 7, 
    monthly: 500000, 
    retainer: 0,        // Monthly retainer amount
    revSharePct: 0,     // % of mgmt fee on BDM-raised AUM
  },
  brokerRaise: { 
    startMonth: 3, 
    monthly: 250000, 
    retainer: 0,        // Monthly retainer amount
    commissionRate: 0.01, // Annual commission rate on capital raised
    trailingMonths: 12,   // Months to apply trailing commission
  },
};

window.FundModel.SHARE_CLASSES = {
  founder: { mgmtFee: 0, perfFee: 0, publicWeight: 0.6 },
  classA: { mgmtFee: 0.015, perfFee: 0.175, publicWeight: 0.6 },
  classB: { mgmtFee: 0.015, perfFee: 0.175, publicWeight: 0 },
  classC: { mgmtFee: 0.015, perfFee: 0.175, publicWeight: 1.0 },
};

window.FundModel.DOWNSIDE = {
  y1AumTarget: 30000000,
  capitalMultiplier: 0.5,
};

// DEFAULT_ASSUMPTIONS - flattened for engine consumption
window.FundModel.DEFAULT_ASSUMPTIONS = {
  projectionMonths: 36,
  preLaunchMonths: 12,
  startingCashUSD: window.FundModel.FUNDING.startingCashUSD,
  mgmtFeeAnnual: window.FundModel.FUND_ECONOMICS.mgmtFeeAnnual,
  carryRatePrivate: window.FundModel.FUND_ECONOMICS.carryRate,
  carryRatePublic: window.FundModel.FUND_ECONOMICS.carryRate,
  annualReturn: window.FundModel.FUND_ECONOMICS.annualReturn,
  publicWeight: window.FundModel.FUND_ECONOMICS.publicWeight,
  gpCommitmentRate: window.FundModel.FUND_ECONOMICS.gpCommitmentRate,
  // Founder salary settings
  ianSalaryPre: window.FundModel.PERSONNEL.ian.preBESalary,
  ianSalaryPost: window.FundModel.PERSONNEL.ian.postBESalary,
  ianRollUpMode: window.FundModel.PERSONNEL.ian.rollUpMode,
  ianRollUpEndMonth: window.FundModel.PERSONNEL.ian.rollUpEndMonth,
  paulSalaryPre: window.FundModel.PERSONNEL.paul.preBESalary,
  paulSalaryPost: window.FundModel.PERSONNEL.paul.postBESalary,
  paulRollUpMode: window.FundModel.PERSONNEL.paul.rollUpMode,
  paulRollUpEndMonth: window.FundModel.PERSONNEL.paul.rollUpEndMonth,
  // Other personnel
  lewisSalary: window.FundModel.PERSONNEL.lewis.monthlySalary,
  lewisStartMonth: window.FundModel.PERSONNEL.lewis.startMonth,
  lewisMonths: window.FundModel.PERSONNEL.lewis.durationMonths,
  lewisAdjustmentMonth: window.FundModel.PERSONNEL.lewis.adjustmentMonth,
  lewisAdjustedSalary: window.FundModel.PERSONNEL.lewis.adjustedSalary,
  eaSalary: window.FundModel.PERSONNEL.emma.monthlySalary,
  eaStartMonth: window.FundModel.PERSONNEL.emma.startMonth,
  adrianSalary: window.FundModel.PERSONNEL.adrian.monthlySalary,
  adrianStartMonth: window.FundModel.PERSONNEL.adrian.startMonth,
  chairmanSalary: window.FundModel.PERSONNEL.chairman.quarterlyAmount,
  chairmanStartMonth: window.FundModel.PERSONNEL.chairman.startMonth,
  // OpEx
  officeIT: window.FundModel.OPEX.office + window.FundModel.OPEX.tech + window.FundModel.OPEX.mobile,
  marketingPreBE: window.FundModel.OPEX.marketing.preBE,
  marketingPostBE: window.FundModel.OPEX.marketing.postBE,
  marketingRollUp: window.FundModel.OPEX.marketing.rollUpToSL,
  travelPreBE: window.FundModel.OPEX.travel.preBE,
  travelPostBE: window.FundModel.OPEX.travel.postBE,
  travelRollUp: window.FundModel.OPEX.travel.rollUpToSL,
  compliance: window.FundModel.OPEX.leventus + window.FundModel.OPEX.adminCustodial,
  setupCost: window.FundModel.OPEX.setupCost,
  // BDM settings
  bdmStartMonth: window.FundModel.CAPITAL.bdm.startMonth,
  bdmRetainer: window.FundModel.CAPITAL.bdm.retainer,
  bdmRevSharePct: window.FundModel.CAPITAL.bdm.revSharePct,
  // Broker settings
  brokerStartMonth: window.FundModel.CAPITAL.brokerRaise.startMonth,
  brokerRetainer: window.FundModel.CAPITAL.brokerRaise.retainer,
  brokerCommissionRate: window.FundModel.CAPITAL.brokerRaise.commissionRate,
  brokerTrailingMonths: window.FundModel.CAPITAL.brokerRaise.trailingMonths,
  // US Feeder Fund
  usFeederMonth: window.FundModel.US_FEEDER.month,
  usFeederAmount: window.FundModel.US_FEEDER.amount,
  usFeederIsGpExpense: window.FundModel.US_FEEDER.isGpExpense,
};
