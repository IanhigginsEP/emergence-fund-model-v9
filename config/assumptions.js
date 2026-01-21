// config/assumptions.js v10.14 - Added BDM trailing commission parameters
// Model Start: March 1, 2025 | Fund Launch: February 1, 2026 | Lewis: Aug 1, 2025
window.FundModel = window.FundModel || {};

window.FundModel.TIMELINE = {
  modelStartDate: '2025-03-01', launchDate: '2026-02-01',
  projectionMonths: 36, preLaunchMonths: 11, rollingBalanceMonths: 18,
};

window.FundModel.FUNDING = { startingCashUSD: 367000 };

window.FundModel.PERSONNEL = {
  ian: { preBESalary: 5000, postBESalary: 10000, rollUpMode: 'untilBreakeven', cashDrawEnabled: true },
  paul: { preBESalary: 5000, postBESalary: 10000, rollUpMode: 'untilBreakeven', cashDrawEnabled: true },
  lewis: { monthlySalary: 7000, startMonth: -6, durationMonths: 12 }, // Aug 2025, 12mo incl pre-launch
  emma: { monthlySalary: 1000, startMonth: 0 },
  adrian: { monthlySalary: 1667, startMonth: -6 },
  chairman: { quarterlyAmount: 5000, startMonth: 4 },
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

window.FundModel.SHAREHOLDER_LOAN = {
  initialItems: [
    { description: 'Setup invoices', amount: 10000 },
    { description: 'PPM legal fees', amount: 15000 },
    { description: 'Adrian historical', amount: 8000 },
    { description: 'Historical travel', amount: 6000 },
    { description: 'US Feeder Fund', amount: 30000, gpExpense: true },
    { description: 'Ian personal costs', amount: 100000 },
    { description: 'Paul sundry costs', amount: 100000 },
  ],
  repaymentStartYear: 3, interestRate: 0.05,
};

window.FundModel.US_FEEDER = { amount: 30000, month: null, isGpExpense: true };

window.FundModel.CAPITAL = {
  gpOrganic: { m0to3: 2000000, m4to11: 3000000, m12plus: 2500000 },
  bdm: { enabled: true, startMonth: 7, monthly: 500000, retainer: 0, revSharePct: 0, commissionRate: 0, trailingMonths: 12 },
  brokerRaise: { enabled: true, startMonth: 3, monthly: 500000, retainer: 0, commissionRate: 0.01, trailingMonths: 12 },
};

window.FundModel.SHARE_CLASSES = {
  founder: { mgmtFee: 0, perfFee: 0, publicWeight: 0.6 },
  classA: { mgmtFee: 0.015, perfFee: 0.175, publicWeight: 0.6 },
  classB: { mgmtFee: 0.015, perfFee: 0.175, publicWeight: 0 },
  classC: { mgmtFee: 0.015, perfFee: 0.175, publicWeight: 1.0 },
};

window.FundModel.REDEMPTIONS = { enabled: false, schedule: [{ month: 25, amount: 2000000 }, { month: 31, amount: 3000000 }] };
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
  adrianSalary: 1667, adrianStartMonth: -6,
  chairmanSalary: 5000, chairmanStartMonth: 4,
  officeIT: 1200, marketingPreBE: 2000, marketingPostBE: 2000, marketingRollUp: false,
  travelPreBE: 2000, travelPostBE: 2000, travelRollUp: false,
  compliance: 6500, setupCost: 10000,
  gpOrganicM0to3: 2000000, gpOrganicM4to11: 3000000, gpOrganicM12plus: 2500000,
  bdmEnabled: true, bdmCapitalStartMonth: 7, bdmMonthlyCapital: 500000, bdmRetainer: 0, bdmRevSharePct: 0, bdmCommissionRate: 0, bdmTrailingMonths: 12,
  brokerEnabled: true, brokerCapitalStartMonth: 3, brokerMonthlyCapital: 500000, brokerRetainer: 0, brokerCommissionRate: 0.01, brokerTrailingMonths: 12,
  redemptionsEnabled: false, redemptionSchedule: [{ month: 25, amount: 2000000 }, { month: 31, amount: 3000000 }],
  usFeederMonth: null, usFeederAmount: 30000, usFeederIsGpExpense: true,
};
