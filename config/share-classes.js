// config/share-classes.js - PPM-compliant share class definitions
// v10.11: Dedicated share class configuration

window.FundModel = window.FundModel || {};

// Share class definitions per PPM
window.FundModel.SHARE_CLASSES = {
  founder: {
    name: 'Founder Class',
    mgmtFeeRate: 0,        // 0% management fee
    carryRate: 0,          // 0% performance fee
    publicWeight: 0.6,     // 60% public / 40% private allocation
    lockupMonths: 0,       // No lock-up
    description: 'GP commitment (1-2% of AUM)',
    color: '#8b5cf6',      // Purple
  },
  classA: {
    name: 'Class A',
    mgmtFeeRate: 0.015,    // 1.5% annual management fee
    carryRate: 0.175,      // 17.5% above HWM
    publicWeight: 0.6,     // 60% public / 40% private allocation
    lockupMonths: 0,       // N/A per PPM
    description: 'Main LP class',
    color: '#3b82f6',      // Blue
  },
  classB: {
    name: 'Class B',
    mgmtFeeRate: 0.015,    // 1.5% annual management fee
    carryRate: 0.175,      // 17.5% above HWM
    publicWeight: 0,       // 100% private allocation
    lockupMonths: 36,      // 36-month lock-up
    description: 'Patient capital - all private',
    color: '#10b981',      // Green
  },
  classC: {
    name: 'Class C',
    mgmtFeeRate: 0.015,    // 1.5% annual management fee
    carryRate: 0.175,      // 17.5% above HWM
    publicWeight: 1.0,     // 100% public allocation
    lockupMonths: 12,      // 12-month lock-up
    description: 'Enhanced liquidity - all public',
    color: '#f59e0b',      // Amber
  },
};

// Default allocation: GP Commit → Founder, LP Capital → Class A
window.FundModel.DEFAULT_ALLOCATION = {
  gpCommitment: 'founder',  // GP commit goes to Founder Class
  lpCapital: 'classA',      // Default LP class
};

// Calculate share-class-weighted fee rate
window.FundModel.calculateWeightedFeeRate = function(aumByClass) {
  const classes = window.FundModel.SHARE_CLASSES;
  let totalAUM = 0;
  let weightedMgmtFee = 0;
  let weightedCarry = 0;
  
  Object.entries(aumByClass).forEach(([classKey, aum]) => {
    if (aum > 0 && classes[classKey]) {
      totalAUM += aum;
      weightedMgmtFee += aum * classes[classKey].mgmtFeeRate;
      weightedCarry += aum * classes[classKey].carryRate;
    }
  });
  
  return {
    totalAUM,
    avgMgmtFeeRate: totalAUM > 0 ? weightedMgmtFee / totalAUM : 0,
    avgCarryRate: totalAUM > 0 ? weightedCarry / totalAUM : 0,
  };
};

// Calculate per-class fees for a given month
window.FundModel.calculateClassFees = function(monthData) {
  const classes = window.FundModel.SHARE_CLASSES;
  const gpRate = window.FundModel.FUND_ECONOMICS?.gpCommitmentRate || 0.02;
  
  // Derive AUM by class from capital sources
  // GP Commitment = Founder Class, LP Capital = Class A (default)
  const lpCapital = monthData.lpCapital || 0;
  const gpCommit = monthData.gpCommitment || (lpCapital * gpRate);
  const totalNewCapital = lpCapital + gpCommit;
  
  // Calculate cumulative AUM split (simplified: proportional to new capital)
  const totalAUM = monthData.closingAUM || 0;
  const founderPct = totalAUM > 0 && totalNewCapital > 0 ? (gpCommit / totalNewCapital) : gpRate / (1 + gpRate);
  const classAPct = 1 - founderPct;
  
  const aumByClass = {
    founder: totalAUM * founderPct,
    classA: totalAUM * classAPct,
    classB: 0,  // No allocation yet
    classC: 0,  // No allocation yet
  };
  
  // Calculate fees per class
  const result = {};
  Object.entries(aumByClass).forEach(([classKey, aum]) => {
    const classConfig = classes[classKey];
    result[classKey] = {
      aum,
      mgmtFeeAnnual: aum * classConfig.mgmtFeeRate,
      mgmtFeeMonthly: aum * classConfig.mgmtFeeRate / 12,
      carryRate: classConfig.carryRate,
      color: classConfig.color,
    };
  });
  
  // Calculate totals
  result.totals = {
    totalAUM,
    totalMgmtFeeMonthly: Object.values(result).reduce((s, c) => s + (c.mgmtFeeMonthly || 0), 0),
    weightedMgmtRate: window.FundModel.calculateWeightedFeeRate(aumByClass).avgMgmtFeeRate,
    weightedCarryRate: window.FundModel.calculateWeightedFeeRate(aumByClass).avgCarryRate,
  };
  
  return result;
};
