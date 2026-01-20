// model/metrics.js - LP return metrics calculations
// v9.1: IRR, MOIC, TVPI, DPI, Runway

window.FundModel = window.FundModel || {};

// Calculate IRR using Newton-Raphson approximation
window.FundModel.calculateIRR = function(cashFlows, guess = 0.1, maxIter = 100, tolerance = 0.0001) {
  // cashFlows: array of { period, amount } where negative = outflow, positive = inflow
  if (!cashFlows || cashFlows.length === 0) return null;
  
  let rate = guess;
  for (let i = 0; i < maxIter; i++) {
    let npv = 0;
    let derivativeNpv = 0;
    
    for (const cf of cashFlows) {
      const t = cf.period;
      const pv = cf.amount / Math.pow(1 + rate, t);
      npv += pv;
      if (t > 0) {
        derivativeNpv -= t * cf.amount / Math.pow(1 + rate, t + 1);
      }
    }
    
    if (Math.abs(npv) < tolerance) return rate;
    if (Math.abs(derivativeNpv) < 1e-10) break; // Avoid division by zero
    
    rate = rate - npv / derivativeNpv;
    if (rate < -0.99) rate = -0.99; // Bound to avoid math errors
  }
  
  return rate;
};

// Calculate all LP metrics from model
window.FundModel.calculateMetrics = function(model) {
  const { months, cumulativeFounderFunding, breakEvenMonth } = model;
  if (!months || months.length === 0) return null;
  
  const postLaunch = months.filter(m => !m.isPreLaunch);
  const lastMonth = postLaunch[postLaunch.length - 1];
  const y1 = postLaunch.slice(0, 12);
  const y2 = postLaunch.slice(12, 24);
  const y3 = postLaunch.slice(24, 36);
  
  // Total invested capital (LP + GP)
  const totalInvested = postLaunch.reduce((s, m) => s + m.lpCapital + m.gpCommitment, 0);
  
  // Total distributions (revenue to GP)
  const totalDistributions = postLaunch.reduce((s, m) => s + m.totalRevenue, 0);
  
  // NAV at end (closing AUM represents LP value)
  const nav = lastMonth?.closingAUM || 0;
  
  // MOIC: Multiple on Invested Capital = (NAV + Distributions) / Invested
  const moic = totalInvested > 0 ? (nav + totalDistributions) / totalInvested : 0;
  
  // TVPI: Total Value to Paid-In = same as MOIC for fund level
  const tvpi = moic;
  
  // DPI: Distributions to Paid-In = Distributions / Invested
  const dpi = totalInvested > 0 ? totalDistributions / totalInvested : 0;
  
  // RVPI: Residual Value to Paid-In = NAV / Invested
  const rvpi = totalInvested > 0 ? nav / totalInvested : 0;
  
  // Build cash flows for IRR (monthly)
  const cashFlows = [];
  let investedToDate = 0;
  
  postLaunch.forEach((m, i) => {
    const investment = m.lpCapital + m.gpCommitment;
    const distribution = m.totalRevenue;
    const netFlow = distribution - investment;
    if (Math.abs(netFlow) > 0) {
      cashFlows.push({ period: i / 12, amount: netFlow });
    }
    investedToDate += investment;
  });
  
  // Add terminal value (NAV) as final cash flow
  if (nav > 0) {
    cashFlows.push({ period: postLaunch.length / 12, amount: nav });
  }
  
  // Calculate IRR (annualized)
  const irr = window.FundModel.calculateIRR(cashFlows);
  
  // Runway: months of cash at current burn rate
  const recentMonths = postLaunch.slice(-3);
  const avgBurn = recentMonths.reduce((s, m) => s + (m.totalExpenses - m.totalRevenue), 0) / 3;
  const currentCash = lastMonth?.closingCash || 0;
  const runway = avgBurn > 0 ? Math.max(0, currentCash / avgBurn) : (currentCash > 0 ? 999 : 0);
  
  // Payback period (months until cumulative cash flow turns positive)
  let cumulativeCF = 0;
  let paybackMonth = null;
  for (let i = 0; i < postLaunch.length; i++) {
    cumulativeCF += postLaunch[i].totalRevenue - postLaunch[i].totalExpenses;
    if (cumulativeCF > 0 && paybackMonth === null) {
      paybackMonth = i;
      break;
    }
  }
  
  return {
    irr,
    moic,
    tvpi,
    dpi,
    rvpi,
    runway,
    paybackMonth,
    totalInvested,
    totalDistributions,
    nav,
    currentCash,
    founderFunding: cumulativeFounderFunding,
    breakEvenMonth,
  };
};
