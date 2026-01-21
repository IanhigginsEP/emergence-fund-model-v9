// model/engine.js - Core P&L calculation loop
// v10.0: Founder salary toggle modes (untilBreakeven/untilMonth/always/never)
// v10.8: US Feeder Fund expense - triggered at selected month, GP/LP toggle

window.FundModel = window.FundModel || {};

// Helper: Determine if founder salary should roll up this month
window.FundModel.shouldRollUp = function(mode, endMonth, currentMonth, breakEvenMonth) {
  if (mode === 'always') return true;
  if (mode === 'never') return false;
  if (mode === 'untilMonth' && endMonth !== null) {
    return currentMonth < endMonth;
  }
  if (mode === 'untilBreakeven') {
    return breakEvenMonth === null || currentMonth <= breakEvenMonth;
  }
  return true; // default: roll up
};

window.FundModel.runModel = function(assumptions, capitalInputs, returnMult, bdmRevShare) {
  returnMult = returnMult || 1.0;
  bdmRevShare = bdmRevShare || 0;
  
  const revenueConfig = window.FundModel.REVENUE || {};
  const carryBelowLine = revenueConfig.carryBelowLine !== false;
  
  const effectiveReturn = assumptions.annualReturn * returnMult;
  const startingCashUSD = assumptions.startingCashUSD || 367000;
  const eaSalary = assumptions.eaSalary || 1000;
  
  // Founder salary toggle modes
  const ianRollUpMode = assumptions.ianRollUpMode || 'untilBreakeven';
  const ianRollUpEndMonth = assumptions.ianRollUpEndMonth;
  const paulRollUpMode = assumptions.paulRollUpMode || 'untilBreakeven';
  const paulRollUpEndMonth = assumptions.paulRollUpEndMonth;
  
  // OpEx roll-up toggles
  const marketingRollUp = assumptions.marketingRollUp || false;
  const travelRollUp = assumptions.travelRollUp || false;
  
  // US Feeder Fund settings
  const usFeederMonth = assumptions.usFeederMonth;
  const usFeederAmount = assumptions.usFeederAmount || 30000;
  const usFeederIsGpExpense = assumptions.usFeederIsGpExpense !== false; // default true
  
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
      closingAUM: 0, closingCash: startingCashUSD, cumulativeCapital: 0,
      cumulativeBDMAUM: 0, cumulativeFounderFunding: 0, shareholderLoanBalance,
    };
    
    // Capital
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
    
    // Carry
    const privateWeight = 1 - assumptions.publicWeight;
    const carryPrivate = investmentGain * privateWeight * assumptions.carryRatePrivate;
    const carryPublic = investmentGain * assumptions.publicWeight * assumptions.carryRatePublic;
    const carryRevenue = carryPrivate + carryPublic;
    cumulativeCarryPrivate += carryPrivate;
    cumulativeCarryPublic += carryPublic;
    
    // Management fee
    const grossMgmtFee = isPreLaunch ? 0 : openingAUM * (assumptions.mgmtFeeAnnual / 12);
    const bdmFeeShare = grossMgmtFee * bdmAUMProportion * bdmRevShare;
    const mgmtFee = grossMgmtFee - bdmFeeShare;
    const operatingRevenue = mgmtFee;
    const totalRevenue = carryBelowLine ? operatingRevenue : (operatingRevenue + carryRevenue);
    
    // Founder salary
    const ianSalaryAmount = isPostBreakeven ? assumptions.ianSalaryPost : assumptions.ianSalaryPre;
    const ianShouldRollUp = window.FundModel.shouldRollUp(ianRollUpMode, ianRollUpEndMonth, m, breakEvenMonth);
    const ianCashExpense = ianShouldRollUp ? 0 : ianSalaryAmount;
    const ianAccrual = ianShouldRollUp ? ianSalaryAmount : 0;
    
    const paulSalaryAmount = isPostBreakeven ? assumptions.paulSalaryPost : assumptions.paulSalaryPre;
    const paulShouldRollUp = window.FundModel.shouldRollUp(paulRollUpMode, paulRollUpEndMonth, m, breakEvenMonth);
    const paulCashExpense = paulShouldRollUp ? 0 : paulSalaryAmount;
    const paulAccrual = paulShouldRollUp ? paulSalaryAmount : 0;
    
    // Lewis (with optional adjustment)
    const lewisActive = m >= assumptions.lewisStartMonth && m < (assumptions.lewisStartMonth + assumptions.lewisMonths);
    let lewisSalary = 0;
    if (lewisActive) {
      if (assumptions.lewisAdjustmentMonth && m >= assumptions.lewisAdjustmentMonth && assumptions.lewisAdjustedSalary) {
        lewisSalary = assumptions.lewisAdjustedSalary;
      } else {
        lewisSalary = assumptions.lewisSalary;
      }
    }
    
    // Other personnel
    const eaActive = m >= assumptions.eaStartMonth;
    const eaSalaryCost = eaActive ? eaSalary : 0;
    const chairmanActive = m >= assumptions.chairmanStartMonth && ((m - assumptions.chairmanStartMonth) % 3 === 0);
    const chairmanCost = chairmanActive ? assumptions.chairmanSalary : 0;
    const adrianActive = m >= (assumptions.adrianStartMonth || -6);
    const adrianSalary = adrianActive ? (assumptions.adrianSalary || 1667) : 0;
    
    const totalCashSalaries = ianCashExpense + paulCashExpense + lewisSalary + eaSalaryCost + chairmanCost + adrianSalary;
    const totalSalaries = ianSalaryAmount + paulSalaryAmount + lewisSalary + eaSalaryCost + chairmanCost + adrianSalary;
    
    // OpEx (with roll-up toggles)
    const marketingAmount = isPostBreakeven ? (assumptions.marketingPostBE || 3000) : (assumptions.marketingPreBE || 1500);
    const marketingCash = marketingRollUp ? 0 : marketingAmount;
    const marketingAccrual = marketingRollUp ? marketingAmount : 0;
    
    const travelAmount = isPostBreakeven ? (assumptions.travelPostBE || 3000) : (assumptions.travelPreBE || 1500);
    const travelCash = travelRollUp ? 0 : travelAmount;
    const travelAccrual = travelRollUp ? travelAmount : 0;
    
    const officeIT = assumptions.officeIT;
    const compliance = isPreLaunch ? 0 : assumptions.compliance;
    const setupCost = m === 0 ? assumptions.setupCost : 0;
    
    // US Feeder Fund expense (triggered at specific month)
    let usFeederExpense = 0;
    let usFeederLpExpense = 0;
    if (usFeederMonth !== null && m === usFeederMonth) {
      if (usFeederIsGpExpense) {
        usFeederExpense = usFeederAmount; // GP expense - hits cash flow
      } else {
        usFeederLpExpense = usFeederAmount; // LP expense - separate tracking
      }
    }
    
    const totalOpexCash = officeIT + marketingCash + travelCash + compliance + setupCost + usFeederExpense;
    const totalOpex = officeIT + marketingAmount + travelAmount + compliance + setupCost + usFeederExpense;
    const brokerCommission = brokerRaise * assumptions.brokerCommissionRate;
    
    const totalCashExpenses = totalCashSalaries + totalOpexCash + brokerCommission;
    const totalExpenses = totalSalaries + totalOpex + brokerCommission;
    
    // EBITDA & EBT
    const ebitda = operatingRevenue - totalCashExpenses;
    const ebt = totalRevenue - totalExpenses;
    const netIncome = carryBelowLine ? (ebitda + carryRevenue - ianAccrual - paulAccrual) : ebt;
    
    // Breakeven (EBITDA-based)
    if (!isPreLaunch) {
      rollingEBITDA.shift(); rollingEBITDA.push(ebitda);
      if (breakEvenMonth === null && rollingEBITDA.every(e => e > 0) && m >= 2) breakEvenMonth = m;
    }
    
    // Cash flow
    const netCashFlow = ebitda;
    const closingCash = prev.closingCash + netCashFlow;
    let founderFundingRequired = 0;
    let adjustedClosingCash = closingCash;
    if (closingCash < 0) {
      founderFundingRequired = Math.abs(closingCash);
      adjustedClosingCash = 0;
      cumulativeFounderFunding += founderFundingRequired;
    }
    
    // Shareholder loan accumulation
    shareholderLoanBalance = prev.shareholderLoanBalance + ianAccrual + paulAccrual + marketingAccrual + travelAccrual;
    
    if (isPreLaunch) {
      preLaunchCosts += totalExpenses;
      preLaunchData.push({ month: m, label: 'M'+m, expenses: totalExpenses, lewisSalary, ianSalary: ianSalaryAmount, paulSalary: paulSalaryAmount, closingCash: adjustedClosingCash, founderFundingRequired });
    }
    
    months.push({
      month: m, label: 'M'+m, isPreLaunch, isPostBreakeven, openingAUM, gpOrganic, bdmRaise, brokerRaise,
      lpCapital, gpCommitment, newCapital, redemption, netCapital, investmentGain, closingAUM, cumulativeCapital,
      cumulativeBDMAUM, bdmAUMProportion, grossMgmtFee, bdmFeeShare, mgmtFee, 
      operatingRevenue, carryRevenue, totalRevenue,
      carryPrivate, carryPublic, cumulativeCarryPrivate, cumulativeCarryPublic, 
      ianSalary: ianSalaryAmount, ianCashExpense, ianAccrual, ianRollUp: ianShouldRollUp,
      paulSalary: paulSalaryAmount, paulCashExpense, paulAccrual, paulRollUp: paulShouldRollUp,
      lewisSalary, eaSalary: eaSalaryCost, adrianSalary, chairmanCost, totalSalaries, totalCashSalaries,
      officeIT, marketing: marketingAmount, marketingCash, marketingAccrual, 
      travel: travelAmount, travelCash, travelAccrual, compliance, setupCost,
      usFeederExpense, usFeederLpExpense,
      totalOpex, totalOpexCash, brokerCommission,
      totalCashExpenses, totalExpenses, ebitda, ebt, netIncome, netCashFlow,
      closingCash: adjustedClosingCash, founderFundingRequired, cumulativeFounderFunding, shareholderLoanBalance,
    });
  });
  
  return { months, preLaunchData, preLaunchCosts, breakEvenMonth, cumulativeFounderFunding, startingCashUSD };
};

window.FundModel.getInitialShareholderLoan = function() {
  const slConfig = window.FundModel.SHAREHOLDER_LOAN || {};
  const items = slConfig.initialItems || [];
  // Only include items that are NOT the US Feeder (it's handled separately by month trigger)
  return items.filter(item => item.description !== 'US Feeder Fund')
              .reduce((sum, item) => sum + (item.amount || 0), 0);
};
