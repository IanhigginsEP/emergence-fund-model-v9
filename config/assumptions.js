// config/assumptions.js - All editable model inputs
// v8.2: Converted to window globals for GitHub Pages compatibility

window.FundModel = window.FundModel || {};

window.FundModel.DEFAULT_FX_RATES = {
  gbpToUsd: 1.27,
  eurToUsd: 1.08,
};

window.FundModel.STONE_PARK = {
  totalEUR: 550000,
  founderSharePct: 0.6667,
  availableBalanceEUR: 50000,
  currency: 'EUR',
};

window.FundModel.DEFAULT_TARGETS = {
  y1AUM: 30000000,
  y2AUM: 75000000,
  y3AUM: 150000000,
  maxFounderFunding: 600000,
  targetBreakevenMonth: 9,
};

window.FundModel.DEFAULT_ASSUMPTIONS = {
  projectionMonths: 36,
  preLaunchMonths: 11,
  fxRates: { ...window.FundModel.DEFAULT_FX_RATES },
  stonePark: { ...window.FundModel.STONE_PARK },
  iansPersonalCosts: 100000,
  mgmtFeeAnnual: 0.015,
  carryRatePrivate: 0.175,
  carryRatePublic: 0.175,
  hurdleRate: 0.06,
  annualReturn: 0.14,
  brokerCommissionRate: 0.01,
  ianSalaryPre: 5000,
  ianSalaryPost: 10000,
  paulSalaryPre: 5000,
  paulSalaryPost: 10000,
  lewisSalary: 3000,
  lewisStartMonth: -5,
  lewisMonths: 12,
  eaSalaryGBP: 1000,
  eaStartMonth: 0,
  chairmanSalary: 5000,
  chairmanPrepaid: 7500,
  chairmanStartMonth: 2,
  officeIT: 1000,
  marketing: 1000,
  marketingStopsAtBreakeven: true,
  travel: 1250,
  compliance: 11000,
  setupCost: 10000,
  publicWeight: 0.6,
  gpCommitmentRate: 0.02,
  bdmStartMonth: 7,
  brokerStartMonth: 3,
  targets: { ...window.FundModel.DEFAULT_TARGETS },
};
