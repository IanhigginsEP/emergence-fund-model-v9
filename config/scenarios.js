// config/scenarios.js - Preset scenarios
// v8.2: Window globals for GitHub Pages

window.FundModel = window.FundModel || {};

window.FundModel.PRESET_SCENARIOS = {
  'Downside': {
    gpOrganic: 0.7,
    bdmRaise: 0.7,
    brokerRaise: 0.7,
    redemption: 1.2,
    annualReturn: 0.8,
    bdmRevenueShare: 0
  },
  'Base': {
    gpOrganic: 1.0,
    bdmRaise: 1.0,
    brokerRaise: 1.0,
    redemption: 1.0,
    annualReturn: 1.0,
    bdmRevenueShare: 0
  },
  'Upside 1': {
    gpOrganic: 1.15,
    bdmRaise: 1.3,
    brokerRaise: 1.2,
    redemption: 0.9,
    annualReturn: 1.1,
    bdmRevenueShare: 0.10
  },
  'Upside 2': {
    gpOrganic: 1.3,
    bdmRaise: 1.5,
    brokerRaise: 1.3,
    redemption: 0.8,
    annualReturn: 1.15,
    bdmRevenueShare: 0.20
  },
};
