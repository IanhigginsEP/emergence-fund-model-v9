// model/summaries.js - Calculate annual summaries and loan status
// v10.15: Added getStoneParkStatus and getShareholderLoanStatus

window.FundModel = window.FundModel || {};

window.FundModel.formatCurrency = function(v) {
  if (v == null) return '-';
  const abs = Math.abs(v);
  let formatted;
  if (abs >= 1e6) formatted = '$' + (abs / 1e6).toFixed(2) + 'M';
  else if (abs >= 1e3) formatted = '$' + (abs / 1e3).toFixed(0) + 'K';
  else formatted = '$' + abs.toFixed(0);
  return v < 0 ? '(' + formatted + ')' : formatted;
};

window.FundModel.formatPercent = function(v, decimals) {
  if (v == null) return '-';
  decimals = decimals !== undefined ? decimals : 2;
  const val = (v * 100).toFixed(decimals);
  return v < 0 ? '(' + Math.abs(val) + '%)' : val + '%';
};

window.FundModel.calculateFounderSplit = function(totalFunding) {
  totalFunding = totalFunding || 0;
  return { total: totalFunding, ian: totalFunding * 0.5, paul: totalFunding * 0.5 };
};

// Stone Park (Starting Capital) status
window.FundModel.getStoneParkStatus = function(model) {
  const stonePark = window.FundModel.STONE_PARK || { availableUSD: 367000 };
  const initial = stonePark.availableUSD || 367000;
  
  // Find cash low point to determine utilization
  const postLaunch = model.months ? model.months.filter(m => !m.isPreLaunch) : [];
  const minCash = postLaunch.reduce((min, m) => Math.min(min, m.closingCash || 0), initial);
  const utilized = minCash < 0 ? initial + Math.abs(minCash) : initial - minCash;
  const remaining = initial - utilized;
  
  return {
    initial,
    utilized: Math.max(0, utilized),
    remaining: Math.max(0, remaining),
    utilizationPct: utilized / initial,
    cashLow: minCash,
  };
};

// Shareholder Loan (Money owed TO founders) status
window.FundModel.getShareholderLoanStatus = function(model) {
  const slConfig = window.FundModel.SHAREHOLDER_LOAN || {};
  const preLaunchTotal = slConfig.preLaunchCosts?.total || 126000;
  
  // Get final shareholder loan balance from model
  const lastMonth = model.months && model.months.length > 0 
    ? model.months[model.months.length - 1] 
    : null;
  const currentBalance = lastMonth ? lastMonth.shareholderLoanBalance || 0 : preLaunchTotal;
  
  // Calculate salary foregone (accumulated accruals)
  const postLaunch = model.months ? model.months.filter(m => !m.isPreLaunch) : [];
  const ianSalaryForegone = postLaunch.reduce((sum, m) => sum + (m.ianAccrual || 0), 0);
  const paulSalaryForegone = postLaunch.reduce((sum, m) => sum + (m.paulAccrual || 0), 0);
  
  return {
    preLaunch: preLaunchTotal,
    ianSalaryForegone,
    paulSalaryForegone,
    totalSalaryForegone: ianSalaryForegone + paulSalaryForegone,
    total: currentBalance,
    byFounder: {
      ian: preLaunchTotal + ianSalaryForegone,  // Ian absorbed pre-launch costs
      paul: paulSalaryForegone,
    },
  };
};

window.FundModel.calculateSummaries = function(months, startingCashUSD) {
  const postLaunch = months.filter(m => !m.isPreLaunch);
  const y1 = postLaunch.slice(0, 12);
  const y2 = postLaunch.slice(12, 24);
  const y3 = postLaunch.slice(24, 36);
  
  const sumF = (arr, f) => arr.reduce((s, m) => s + (m[f] || 0), 0);
  const lastOf = (arr, f) => arr[arr.length - 1]?.[f] || 0;
  
  const sumY = (arr) => ({
    endingAUM: lastOf(arr, 'closingAUM'),
    totalRevenue: sumF(arr, 'totalRevenue'),
    operatingRevenue: sumF(arr, 'operatingRevenue'),
    totalMgmtFee: sumF(arr, 'mgmtFee'),
    totalCarry: sumF(arr, 'carryRevenue'),
    ebitda: sumF(arr, 'ebitda'),
    totalExpenses: sumF(arr, 'totalExpenses'),
    totalRedemptions: sumF(arr, 'redemption'),
    newAUM: sumF(arr, 'newCapital'),
    totalLPCapital: sumF(arr, 'lpCapital'),
    netCash: lastOf(arr, 'closingCash'),
    founderFunding: sumF(arr, 'founderFundingRequired'),
    shareholderLoan: lastOf(arr, 'shareholderLoanBalance'),
  });
  
  const y1S = sumY(y1), y2S = sumY(y2), y3S = sumY(y3);
  
  return {
    y1: y1S, y2: y2S, y3: y3S,
    startingCashUSD: startingCashUSD || 367000,
    totals: {
      totalRevenue: y1S.totalRevenue + y2S.totalRevenue + y3S.totalRevenue,
      operatingRevenue: y1S.operatingRevenue + y2S.operatingRevenue + y3S.operatingRevenue,
      totalMgmtFees: y1S.totalMgmtFee + y2S.totalMgmtFee + y3S.totalMgmtFee,
      totalCarry: y1S.totalCarry + y2S.totalCarry + y3S.totalCarry,
      ebitda: y1S.ebitda + y2S.ebitda + y3S.ebitda,
      totalExpenses: y1S.totalExpenses + y2S.totalExpenses + y3S.totalExpenses,
      newAUM: y1S.newAUM + y2S.newAUM + y3S.newAUM,
      totalRedemptions: y1S.totalRedemptions + y2S.totalRedemptions + y3S.totalRedemptions,
      totalLPCapital: y1S.totalLPCapital + y2S.totalLPCapital + y3S.totalLPCapital,
      totalFounderFunding: y1S.founderFunding + y2S.founderFunding + y3S.founderFunding,
    },
  };
};
