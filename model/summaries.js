// model/summaries.js - Calculate annual summaries and utility functions
// v9.4: Added startingCashUSD to output, bracket formatting

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
  return {
    total: totalFunding,
    ian: totalFunding * 0.5,
    paul: totalFunding * 0.5,
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
    totalLPCapital: sumF(arr, 'lpCapital'),
    netCash: lastOf(arr, 'closingCash'),
    founderFunding: sumF(arr, 'founderFundingRequired'),
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
      totalLPCapital: y1S.totalLPCapital + y2S.totalLPCapital + y3S.totalLPCapital,
      totalFounderFunding: y1S.founderFunding + y2S.founderFunding + y3S.founderFunding,
    },
  };
};
