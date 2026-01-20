// config/capital.js - Capital generation and multipliers
// v8.2: Window globals for GitHub Pages

window.FundModel = window.FundModel || {};

window.FundModel.generateCapitalInputs = function(preLaunchMonths, projectionMonths) {
  const inputs = [];
  for (let m = -preLaunchMonths; m < 0; m++) {
    inputs.push({ month: m, gpOrganic: 0, bdmRaise: 0, brokerRaise: 0, redemption: 0 });
  }
  for (let m = 0; m < projectionMonths; m++) {
    let gpOrganic = 0, bdmRaise = 0, brokerRaise = 0, redemption = 0;
    if (m >= 0 && m <= 3) gpOrganic = 2000000;
    if (m >= 4 && m <= 11) gpOrganic = 3000000;
    if (m >= 12) gpOrganic = 2500000;
    if (m >= 7) bdmRaise = 500000;
    if (m >= 3) brokerRaise = 500000;
    if (m === 25) redemption = 3000000;
    if (m === 28) redemption = 2000000;
    if (m === 31) redemption = 4000000;
    if (m === 34) redemption = 5000000;
    inputs.push({ month: m, gpOrganic, bdmRaise, brokerRaise, redemption });
  }
  return inputs;
};

window.FundModel.applyMultipliers = function(base, mult) {
  return base.map(r => ({
    ...r,
    gpOrganic: r.gpOrganic * mult.gpOrganic,
    bdmRaise: r.bdmRaise * mult.bdmRaise,
    brokerRaise: r.brokerRaise * mult.brokerRaise,
    redemption: r.redemption * mult.redemption,
  }));
};
