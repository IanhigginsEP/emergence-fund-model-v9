// model/formatters.js - Number formatting utilities
// v9.4: Brackets for negatives, USD only

window.FundModel = window.FundModel || {};

window.FundModel.fmt = function(v, decimals) {
  if (v === undefined || v === null || isNaN(v)) return '-';
  decimals = decimals !== undefined ? decimals : 0;
  const abs = Math.abs(v);
  const isNeg = v < 0;
  let formatted;
  if (abs >= 1e6) {
    formatted = '$' + (abs / 1e6).toFixed(2) + 'M';
  } else if (abs >= 1e3) {
    formatted = '$' + (abs / 1e3).toFixed(decimals) + 'K';
  } else {
    formatted = '$' + abs.toFixed(decimals);
  }
  return isNeg ? '(' + formatted + ')' : formatted;
};

window.FundModel.pct = function(v, decimals) {
  if (v === undefined || v === null || isNaN(v)) return '-';
  decimals = decimals !== undefined ? decimals : 1;
  const val = (v * 100).toFixed(decimals);
  return v < 0 ? '(' + Math.abs(val) + '%)' : val + '%';
};

window.FundModel.formatMonth = function(m) {
  return 'M' + m;
};
