// model/shareholderLoan.js - Shareholder loan tracking
// v9.3: Ian's salary accrues as liability, not cash outflow

window.FundModel = window.FundModel || {};

// Get detailed shareholder loan breakdown
window.FundModel.getShareholderLoanDetails = function(months) {
  const slConfig = window.FundModel.SHAREHOLDER_LOAN || {};
  const initialItems = slConfig.initialItems || [];
  const initialBalance = initialItems.reduce((sum, item) => sum + (item.amount || 0), 0);
  
  const totalIanAccrual = months.reduce((sum, m) => sum + (m.ianAccrual || 0), 0);
  const finalBalance = months.length > 0 
    ? months[months.length - 1].shareholderLoanBalance 
    : initialBalance;
  
  return {
    initialItems,
    initialBalance,
    totalIanAccrual,
    finalBalance,
    monthlyAccruals: months.map(m => ({
      month: m.month,
      label: m.label,
      ianAccrual: m.ianAccrual || 0,
      balance: m.shareholderLoanBalance,
    })),
  };
};

// Check if shareholder loan can be repaid from cash
window.FundModel.calculateRepaymentCapacity = function(months, repaymentMonth) {
  const targetMonth = months.find(m => m.month === repaymentMonth);
  if (!targetMonth) return null;
  
  const cashAvailable = targetMonth.closingCash;
  const loanBalance = targetMonth.shareholderLoanBalance;
  const canRepayFull = cashAvailable >= loanBalance;
  const repaymentAmount = Math.min(cashAvailable, loanBalance);
  const remainingLoan = loanBalance - repaymentAmount;
  
  return {
    month: repaymentMonth,
    cashAvailable,
    loanBalance,
    canRepayFull,
    repaymentAmount,
    remainingLoan,
  };
};
