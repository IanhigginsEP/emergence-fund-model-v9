// model/engine.js - Core P&L calculation loop
// v9.4: All USD, $367K starting pot, carry below line, EBITDA calc

window.FundModel = window.FundModel || {};

window.FundModel.runModel = function(assumptions, capitalInputs, returnMult, bdmRevShare) {
  returnMult = returnMult || 1.0;
  bdmRevShare = bdmRevShare || 0;
  
  const timeline = window.FundModel.TIMELINE || {};
  const revenueConfig = window.FundModel.REVENUE || {};
  const personnelConfig = window.FundModel.PERSONNEL || {};
  const carryBelowLine = revenueConfig.carryBelowLine !== false;
  
  const effectiveReturn = assumptions.annualReturn * returnMult;
  const startingCashUSD = assumptions.startingCashUSD || 367000;
  const eaSalary = assumptions.eaSalary || 1000;
  
  const ianConfig = personnelConfig.ian || {};
  const paulConfig = personnelConfig.paul || {};
  const ianTreatAsRollUp = ianConfig.treatAsRollUp === true;
  const paulCashDraw = paulConfig.cashDrawToggle !== false;
  
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
    
    // Carry (below line)
    const privateWeight = 1 - assumptions.publicWeight;
    const carryPrivate = investmentGain * privateWeight * assumptions.carryRatePrivate;
    const carryPublic = investmentGain * assumptions.publicWeight * assumptions.carryRatePublic;
    const carryRevenue = carryPrivate + carryPublic;
    cumulativeCarryPrivate += carryPrivate;
    cumulativeCarryPublic += carryPublic;
    
    // Management fee (operating revenue only)
    const grossMgmtFee = isPreLaunch ? 0 : openingAUM * (assumptions.mgmtFeeAnnual / 12);
    const bdmFeeShare = grossMgmtFee * bdmAUMProportion * bdmRevShare;
    const mgmtFee = grossMgmtFee - bdmFeeShare;
    const operatingRevenue = mgmtFee;
    const totalRevenue = carryBelowLine ? operatingRevenue : (operatingRevenue + carryRevenue);
    
    // Personnel expenses
    const ianSalaryAmount = isPostBreakeven ? assumptions.ianSalaryPost : assumptions.ianSalaryPre;
    const ianCashExpense = ianTreatAsRollUp ? 0 : ianSalaryAmount;
    const ianAccrual = ianTreatAsRollUp ? ianSalaryAmount : 0;
    const paulSalaryAmount = isPostBreakeven ? assumptions.paulSalaryPost : assumptions.paulSalaryPre;
    const paulCashExpense = paulCashDraw ? paulSalaryAmount : 0;
    const paulAccrual = paulCashDraw ? 0 : paulSalaryAmount;
    
    const lewisActive = m >= assumptions.lewisStartMonth && m < (assumptions.lewisStartMonth + assumptions.lewisMonths);
    const lewisSalary = lewisActive ? assumptions.lewisSalary : 0;
    const eaActive = m >= assumptions.eaStartMonth;
    const eaSalaryCost = eaActive ? eaSalary : 0;
    const chairmanActive = m >= assumptions.chairmanStartMonth && ((m - assumptions.chairmanStartMonth) % 3 === 0);
    const chairmanCost = chairmanActive ? assumptions.chairmanSalary : 0;
    
    const adrianConfig = personnelConfig.adrian || {};
    const adrianActive = m >= (adrianConfig.startMonth || -6);
    const adrianSalary = adrianActive ? (adrianConfig.monthlySalary || 1800) : 0;
    
    const totalCashSalaries = ianCashExpense + paulCashExpense + lewisSalary + eaSalaryCost + chairmanCost + adrianSalary;
    const totalSalaries = ianSalaryAmount + paulSalaryAmount + lewisSalary + eaSalaryCost + chairmanCost + adrianSalary;
    
    // OpEx
    const marketing = (assumptions.marketingStopsAtBreakeven && isPostBreakeven) ? 0 : assumptions.marketing;
    const officeIT = assumptions.officeIT;
    const travel = assumptions.travel;
    const compliance = isPreLaunch ? 0 : assumptions.compliance;
    const setupCost = m === 0 ? assumptions.setupCost : 0;
    const totalOpex = officeIT + marketing + travel + compliance + setupCost;
    const brokerCommission = brokerRaise * assumptions.brokerCommissionRate;
    
    const totalCashExpenses = totalCashSalaries + totalOpex + brokerCommission;
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
    
    shareholderLoanBalance = prev.shareholderLoanBalance + ianAccrual + paulAccrual;
    
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
      ianSalary: ianSalaryAmount, ianCashExpense, ianAccrual, paulSalary: paulSalaryAmount, paulCashExpense, paulAccrual,
      lewisSalary, eaSalary: eaSalaryCost, adrianSalary, chairmanCost, totalSalaries, totalCashSalaries,
      officeIT, marketing, travel, compliance, setupCost, totalOpex, brokerCommission,
      totalCashExpenses, totalExpenses, ebitda, ebt, netIncome, netCashFlow,
      closingCash: adjustedClosingCash, founderFundingRequired, cumulativeFounderFunding, shareholderLoanBalance,
    });
  });
  
  return { months, preLaunchData, preLaunchCosts, breakEvenMonth, cumulativeFounderFunding, startingCashUSD };
};

window.FundModel.getInitialShareholderLoan = function() {
  const slConfig = window.FundModel.SHAREHOLDER_LOAN || {};
  const items = slConfig.initialItems || [];
  return items.reduce((sum, item) => sum + (item.amount || 0), 0);
};
