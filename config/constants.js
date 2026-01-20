// config/constants.js
// Timeline, FX rates, Stone Park, and other constants
// v8.2 - Extracted from v8.1 monolithic index.html

window.FUND_CONFIG = {
  // === TIMELINE CONFIG ===
  // Month 0 = Fund Launch (Feb 2026)
  // Negative months = Pre-launch (back to March 2025)
  TIMELINE: {
    modelStartDate: '2025-03-01',  // M-11
    fundLaunchDate: '2026-02-01',  // M0
    lewisStartDate: '2025-09-01',  // M-5
  },

  // === FX RATES ===
  DEFAULT_FX_RATES: {
    gbpToUsd: 1.27,
    eurToUsd: 1.08,
  },

  // === STONE PARK - IN EUR ===
  STONE_PARK: {
    totalEUR: 550000,           // Total in account (EUR)
    founderSharePct: 0.6667,    // 2/3 for Ian & Paul = €367K
    availableBalanceEUR: 50000, // Available after prior use
    currency: 'EUR',
  },

  // === IAN'S PERSONAL COSTS ===
  IANS_PERSONAL_COSTS: {
    amount: 100000,
    description: "Pre-model costs borne by Ian (to be shared with Paul)",
    isRecoverable: true,
  },

  // === TARGETS ===
  DEFAULT_TARGETS: {
    y1AUM: 30000000,      // $30M by end of Y1
    y2AUM: 75000000,      // $75M by end of Y2
    y3AUM: 150000000,     // $150M by end of Y3
    maxFounderFunding: 600000,  // Max acceptable founder funding
    targetBreakevenMonth: 9,    // Target breakeven by M9
  },
};
