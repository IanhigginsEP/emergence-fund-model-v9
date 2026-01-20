// model/summaries.js - Calculate annual summaries and utility functions
// v8.2: Window globals for GitHub Pages
// v8.5: Added calculateFounderSplit and formatCurrency alias

window.FundModel = window.FundModel || {};

// Alias for formatting - Dashboard.js expects formatCurrency
window.FundModel.formatCurrency = window.FundModel.fmt || function(v) {
  if (v == null) return '-';
  const abs = Math.abs(v), sign = v < 0 ? '-' : '';
  if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return sign + '$' + (abs / 1e3).toFixed(0) + 'K';
  return sign + '$' + abs.toFixed(0);
};

// Calculate 50/50 founder split
window.FundModel.calculateFounderSplit = function(totalFunding) {
  totalFunding = totalFunding || 0;
  return {
    total: totalFunding,
    ian: totalFunding * 0.5,
    paul: totalFunding * 0.5,
  };
};

window.FundModel.calculateSummaries = function(months) {
  const postLaunch = months.filter(m => !m.isPreLaunch);
  const y1 = postLaunch.slice(0, 12);
  const y2 = postLaunch.slice(12, 24);
  const y3 = postLaunch.slice(24, 36);
  
  const sumF = (arr, f) => arr.reduce((s, m) => s + (m[f] || 0), 0);
  const lastOf = (arr, f) => arr[arr.length - 1]?.[f] || 0;
  
  const sumY = (arr) => ({
    endingAUM: lastOf(arr, 'closingAUM'),
    totalRevenue: sumF(arr, 'totalRevenue'),
    totalMgmtFee: sumF(arr, 'mgmtFee'),
    totalCarry: sumF(arr, 'totalCarry'),
    totalExpenses: sumF(arr, 'totalExpenses'),
    totalRedemptions: sumF(arr, 'redemption'),
    totalLPCapital: sumF(arr, 'lpCapital'),
    netCash: lastOf(arr, 'closingCash'),
    founderFunding: sumF(arr, 'founderFundingRequired'),
  });
  
  const y1S = sumY(y1), y2S = sumY(y2), y3S = sumY(y3);
  
  return {
    y1: y1S, y2: y2S, y3: y3S,
    totals: {
      totalRevenue: y1S.totalRevenue + y2S.totalRevenue + y3S.totalRevenue,
      totalMgmtFees: y1S.totalMgmtFee + y2S.totalMgmtFee + y3S.totalMgmtFee,
      totalCarry: y1S.totalCarry + y2S.totalCarry + y3S.totalCarry,
      totalExpenses: y1S.totalExpenses + y2S.totalExpenses + y3S.totalExpenses,
      totalLPCapital: y1S.totalLPCapital + y2S.totalLPCapital + y3S.totalLPCapital,
      totalFounderFunding: y1S.founderFunding + y2S.founderFunding + y3S.founderFunding,
    },
  };
};
