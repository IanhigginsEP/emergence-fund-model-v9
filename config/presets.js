// config/presets.js - Named configuration presets for quick scenario loading
// v7.1: Save and load complete model configurations
// NOTE: This file uses ES6 exports and is not loaded by index.html
// Kept for potential future use with build step

export const PRESETS = {
  'Board Dec 2025': {
    description: 'Conservative case for December board meeting',
    multipliers: { gpOrganic: 0.8, bdmRaise: 0.7, brokerRaise: 0.7, redemption: 1.1, annualReturn: 0.9, bdmRevenueShare: 0 },
    assumptions: {},
    created: '2025-11-15',
  },
  'Investor Pitch': {
    description: 'Optimistic case for investor presentations',
    multipliers: { gpOrganic: 1.2, bdmRaise: 1.3, brokerRaise: 1.2, redemption: 0.8, annualReturn: 1.1, bdmRevenueShare: 0.1 },
    assumptions: {},
    created: '2025-10-01',
  },
  'Stress Test': {
    description: 'Severe downside for risk assessment',
    multipliers: { gpOrganic: 0.5, bdmRaise: 0.3, brokerRaise: 0.4, redemption: 1.5, annualReturn: 0.6, bdmRevenueShare: 0 },
    assumptions: {},
    created: '2025-09-01',
  },
  'Break-even Focus': {
    description: 'Minimum viable to hit breakeven',
    multipliers: { gpOrganic: 0.7, bdmRaise: 0.5, brokerRaise: 0.5, redemption: 1.0, annualReturn: 0.85, bdmRevenueShare: 0 },
    assumptions: { marketing: 500, travel: 750 },
    created: '2025-08-01',
  },
};

export function getPresetNames() {
  return Object.keys(PRESETS);
}

export function loadPreset(name) {
  return PRESETS[name] || null;
}

export function savePreset(name, config) {
  PRESETS[name] = { ...config, created: new Date().toISOString().split('T')[0] };
  return true;
}

export function deletePreset(name) {
  if (PRESETS[name]) {
    delete PRESETS[name];
    return true;
  }
  return false;
}
