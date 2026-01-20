// model/formatters.js - Number and percentage formatters
// v8.2: Window globals for GitHub Pages

window.FundModel = window.FundModel || {};

window.FundModel.fmt = function(v) {
  if (v == null) return '-';
  const abs = Math.abs(v), sign = v < 0 ? '-' : '';
  if (abs >= 1e6) return sign + '$' + (abs / 1e6).toFixed(2) + 'M';
  if (abs >= 1e3) return sign + '$' + (abs / 1e3).toFixed(0) + 'K';
  return sign + '$' + abs.toFixed(0);
};

window.FundModel.pct = function(v) {
  return (v * 100).toFixed(1) + '%';
};