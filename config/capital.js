// config/capital.js - Capital generation with assumption-based parameters
// v10.10: Updated to use assumptions for start months and amounts

window.FundModel = window.FundModel || {};

window.FundModel.generateCapitalInputs = function(preLaunchMonths, projectionMonths, assumptions) {
  assumptions = assumptions || {};
  const inputs = [];
  
  // Get capital config from assumptions or use defaults
  const gpOrganicM0to3 = assumptions.gpOrganicM0to3 || 2000000;
  const gpOrganicM4to11 = assumptions.gpOrganicM4to11 || 3000000;
  const gpOrganicM12plus = assumptions.gpOrganicM12plus || 2500000;
  
  const bdmStartMonth = assumptions.bdmCapitalStartMonth || 7;
  const bdmMonthly = assumptions.bdmMonthlyCapital || 500000;
  
  const brokerStartMonth = assumptions.brokerCapitalStartMonth || 3;
  const brokerMonthly = assumptions.brokerMonthlyCapital || 500000;
  
  // Pre-launch months (no capital activity)
  for (let m = -preLaunchMonths; m < 0; m++) {
    inputs.push({ month: m, gpOrganic: 0, bdmRaise: 0, brokerRaise: 0, redemption: 0 });
  }
  
  // Post-launch months
  for (let m = 0; m < projectionMonths; m++) {
    let gpOrganic = 0, bdmRaise = 0, brokerRaise = 0, redemption = 0;
    
    // GP Organic (phased)
    if (m >= 0 && m <= 3) gpOrganic = gpOrganicM0to3;
    else if (m >= 4 && m <= 11) gpOrganic = gpOrganicM4to11;
    else if (m >= 12) gpOrganic = gpOrganicM12plus;
    
    // BDM Raise (from start month)
    if (m >= bdmStartMonth) bdmRaise = bdmMonthly;
    
    // Broker Raise (from start month)
    if (m >= brokerStartMonth) brokerRaise = brokerMonthly;
    
    // Redemptions (fixed schedule per PPM)
    if (m === 25) redemption = 3000000;
    if (m === 28) redemption = 2000000;
    if (m === 31) redemption = 4000000;
    if (m === 34) redemption = 5000000;
    
    inputs.push({ month: m, gpOrganic, bdmRaise, brokerRaise, redemption });
  }
  return inputs;
};

window.FundModel.applyMultipliers = function(base, mult) {
  mult = mult || { gpOrganic: 1, bdmRaise: 1, brokerRaise: 1, redemption: 1 };
  return base.map(r => ({
    ...r,
    gpOrganic: r.gpOrganic * (mult.gpOrganic || 1),
    bdmRaise: r.bdmRaise * (mult.bdmRaise || 1),
    brokerRaise: r.brokerRaise * (mult.brokerRaise || 1),
    redemption: r.redemption * (mult.redemption || 1),
  }));
};
