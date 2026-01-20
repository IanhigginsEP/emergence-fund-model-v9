// model/engine.js - Core P&L calculation loop
// v9.3: Carry below line, EBITDA calc, shareholder loan tracking

window.FundModel = window.FundModel || {};

window.FundModel.runModel = function(assumptions, capitalInputs, returnMult, bdmRevShare) {
  returnMult = returnMult || 1.0;
  bdmRevShare = bdmRevShare || 0;
  
  // Read from v9.3 config
  const timeline = window.FundModel.TIMELINE || {};
  const revenueConfig = window.FundModel.REVENUE || {};
  const personnelConfig = window.FundModel.PERSONNEL || {};
  const carryBelowLine = revenueConfig.carryBelowLine !== false;
  
  const effectiveReturn = assumptions.annualReturn * returnMult;
  const eurToUsd = assumptions.fxRates?.eurToUsd || 1.08;
  const gbpToUsd = assumptions.fxRates?.gbpToUsd || 1.27;
  const eaSalaryUSD = (assumptions.eaSalaryGBP || 1000) * gbpToUsd;
  const stoneParkUSD = (assumptions.stonePark?.availableBalanceEUR || 50000) * eurToUsd;
  
  // Ian salary config
  const ianConfig = personnelConfig.ian || {};
  const ianTreatAsRollUp = ianConfig.treatAsRollUp === true;
  
  const months = [];
  let breakEvenMonth = null;
  let rollingEBITDA = [0, 0, 0];
  let cumulativeCarryPrivate = 0, cumulativeCarryPublic = 0;
  let cumulativeFounderFunding = 0, cumulativeBDMAUM = 0;
  let shareholderLoanBalance = window.FundModel.getInitialShareholderLoan();
  const preLaunchData = [];
  let preLaunchCosts = 0;
  
  capitalInputs.forEach((inp, idx) => {
    const m = inp.month;
    const isPreLaunch = m < 0;
    const isPostBreakeven = breakEvenMonth !== null && m > breakEvenMonth;
    const prev = months.length > 0 ? months[months.length - 1] : {
      closingAUM: 0, closingCash: stoneParkUSD, cumulativeCapital: 0,
      cumulativeBDMAUM: 0, cumulativeFounderFunding: 0, shareholderLoanBalance,
    };
    
    // Capital calculations
    const gpOrganic = isPreLaunch ? 0 : inp.gpOrganic;
    const bdmRaise = isPreLaunch ? 0 : inp.bdmRaise;
    const brokerRaise = isPreLaunch ? 0 : inp.brokerRaise;
    const lpCapital = gpOrganic + bdmRaise + brokerRaise;
    const gpCommitment = lpCapital * assumptions.gpCommitmentRate;
    const newCapital = lpCapital + gpCommitment;
    const redemption = isPreLaunch ? 0 : (inp.redemption || 0);
    const netCapital = newCapital - redemption;
    
    const openingAUM = prev.closingAUM;
    const preReturnAUM = openingAUM + netCapital;
    const investmentGain = isPreLaunch ? 0 : preReturnAUM * (effectiveReturn / 12);
    const closingAUM = preReturnAUM + investmentGain;
    const cumulativeCapital = prev.cumulativeCapital + netCapital;
    
    cumulativeBDMAUM = prev.cumulativeBDMAUM + bdmRaise;
    const bdmAUMProportion = closingAUM > 0 ? Math.min(cumulativeBDMAUM / closingAUM, 1) : 0;
    
    // Carry calculations (tracked separately)
    const privateWeight = 1 - assumptions.publicWeight;
    const carryPrivate = investmentGain * privateWeight * assumptions.carryRatePrivate;
    const carryPublic = investmentGain * assumptions.publicWeight * assumptions.carryRatePublic;
    const carryRevenue = carryPrivate + carryPublic;
    cumulativeCarryPrivate += carryPrivate;
    cumulativeCarryPublic += carryPublic;
    
    // Management fee (operating revenue)
    const grossMgmtFee = isPreLaunch ? 0 : openingAUM * (assumptions.mgmtFeeAnnual / 12);
    const bdmFeeShare = grossMgmtFee * bdmAUMProportion * bdmRevShare;
    const mgmtFee = grossMgmtFee - bdmFeeShare;
    const operatingRevenue = mgmtFee;
    const totalRevenue = carryBelowLine ? operatingRevenue : (operatingRevenue + carryRevenue);
    
    // Expense calculations with Ian accrual logic
    const ianSalaryAmount = isPostBreakeven ? assumptions.ianSalaryPost : assumptions.ianSalaryPre;
    const ianCashExpense = ianTreatAsRollUp ? 0 : ianSalaryAmount;
    const ianAccrual = ianTreatAsRollUp ? ianSalaryAmount : 0;
    const paulSalary = isPostBreakeven ? assumptions.paulSalaryPost : assumptions.paulSalaryPre;
    
    const lewisActive = m >= assumptions.lewisStartMonth && m < (assumptions.lewisStartMonth + assumptions.lewisMonths);
    const lewisSalary = lewisActive ? assumptions.lewisSalary : 0;
    const eaActive = m >= assumptions.eaStartMonth;
    const eaSalary = eaActive ? eaSalaryUSD : 0;
    const chairmanActive = m >= assumptions.chairmanStartMonth && ((m - assumptions.chairmanStartMonth) % 3 === 0);
    const chairmanCost = chairmanActive ? assumptions.chairmanSalary : 0;
    
    // Adrian salary (from v9.3 config)
    const adrianConfig = personnelConfig.adrian || {};
    const adrianActive = m >= (adrianConfig.startMonth || -6);
    const adrianSalary = adrianActive ? (adrianConfig.monthlySalary || 0) : 0;
    
    // Cash salaries (excludes Ian accrual)
    const totalCashSalaries = ianCashExpense + paulSalary + lewisSalary + eaSalary + chairmanCost + adrianSalary;
    const totalSalaries = ianSalaryAmount + paulSalary + lewisSalary + eaSalary + chairmanCost + adrianSalary;
    
    // OpEx
    const opexConfig = window.FundModel.OPEX || {};
    const marketing = (assumptions.marketingStopsAtBreakeven && isPostBreakeven) ? 0 : assumptions.marketing;
    const officeIT = assumptions.officeIT;
    const travel = assumptions.travel;
    const compliance = isPreLaunch ? 0 : assumptions.compliance;
    const setupCost = m === 0 ? assumptions.setupCost : 0;
    const totalOpex = officeIT + marketing + travel + compliance + setupCost;
    const brokerCommission = brokerRaise * assumptions.brokerCommissionRate;
    
    const totalCashExpenses = totalCashSalaries + totalOpex + brokerCommission;
    const totalExpenses = totalSalaries + totalOpex + brokerCommission;
    
    // EBITDA (operating revenue - cash expenses)
    const ebitda = operatingRevenue - totalCashExpenses;
    const ebt = totalRevenue - totalExpenses;
    const netIncome = carryBelowLine ? (ebitda + carryRevenue - ianAccrual) : ebt;
    
    // Breakeven check based on EBITDA
    if (!isPreLaunch) {
      rollingEBITDA.shift(); rollingEBITDA.push(ebitda);
      if (breakEvenMonth === null && rollingEBITDA.every(e => e > 0) && m >= 2) breakEvenMonth = m;
    }
    
    // Cash flow (based on EBITDA, not full income)
    const netCashFlow = ebitda;
    const closingCash = prev.closingCash + netCashFlow;
    let founderFundingRequired = 0;
    let adjustedClosingCash = closingCash;
    if (closingCash < 0) {
      founderFundingRequired = Math.abs(closingCash);
      adjustedClosingCash = 0;
      cumulativeFounderFunding += founderFundingRequired;
    }
    
    // Update shareholder loan balance
    shareholderLoanBalance = prev.shareholderLoanBalance + ianAccrual;
    
    if (isPreLaunch) {
      preLaunchCosts += totalExpenses;
      preLaunchData.push({ month: m, label: 'M'+m, expenses: totalExpenses, lewisSalary, ianSalary: ianSalaryAmount, paulSalary, closingCash: adjustedClosingCash, founderFundingRequired });
    }
    
    months.push({
      month: m, label: 'M'+m, isPreLaunch, isPostBreakeven, openingAUM, gpOrganic, bdmRaise, brokerRaise,
      lpCapital, gpCommitment, newCapital, redemption, netCapital, investmentGain, closingAUM, cumulativeCapital,
      cumulativeBDMAUM, bdmAUMProportion, grossMgmtFee, bdmFeeShare, mgmtFee, 
      operatingRevenue, carryRevenue, totalRevenue,
      carryPrivate, carryPublic, cumulativeCarryPrivate, cumulativeCarryPublic, 
      ianSalary: ianSalaryAmount, ianCashExpense, ianAccrual, paulSalary, lewisSalary, eaSalary, adrianSalary,
      chairmanCost, totalSalaries, totalCashSalaries, officeIT, marketing, travel, compliance, setupCost, 
      totalOpex, brokerCommission, totalCashExpenses, totalExpenses, 
      ebitda, ebt, netIncome, netCashFlow, closingCash: adjustedClosingCash, 
      founderFundingRequired, cumulativeFounderFunding, shareholderLoanBalance,
    });
  });
  
  return { months, preLaunchData, preLaunchCosts, breakEvenMonth, cumulativeFounderFunding, stoneParkUSD };
};

// Helper: Get initial shareholder loan balance
window.FundModel.getInitialShareholderLoan = function() {
  const slConfig = window.FundModel.SHAREHOLDER_LOAN || {};
  const items = slConfig.initialItems || [];
  return items.reduce((sum, item) => sum + (item.amount || 0), 0);
};
