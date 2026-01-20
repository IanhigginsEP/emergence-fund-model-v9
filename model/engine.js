// model/engine.js - Core P&L calculation loop
// v8.2: Window globals for GitHub Pages

window.FundModel = window.FundModel || {};

window.FundModel.runModel = function(assumptions, capitalInputs, returnMult, bdmRevShare) {
  returnMult = returnMult || 1.0;
  bdmRevShare = bdmRevShare || 0;
  const effectiveReturn = assumptions.annualReturn * returnMult;
  const eurToUsd = assumptions.fxRates?.eurToUsd || 1.08;
  const gbpToUsd = assumptions.fxRates?.gbpToUsd || 1.27;
  const eaSalaryUSD = (assumptions.eaSalaryGBP || 1000) * gbpToUsd;
  const stoneParkUSD = (assumptions.stonePark?.availableBalanceEUR || 50000) * eurToUsd;
  
  const months = [];
  let breakEvenMonth = null;
  let rollingEBT = [0, 0, 0];
  let cumulativeCarryPrivate = 0, cumulativeCarryPublic = 0;
  let cumulativeFounderFunding = 0, cumulativeBDMAUM = 0;
  const preLaunchData = [];
  let preLaunchCosts = 0;
  
  capitalInputs.forEach((inp, idx) => {
    const m = inp.month;
    const isPreLaunch = m < 0;
    const isPostBreakeven = breakEvenMonth !== null && m > breakEvenMonth;
    const prev = months.length > 0 ? months[months.length - 1] : {
      closingAUM: 0, closingCash: stoneParkUSD, cumulativeCapital: 0,
      cumulativeBDMAUM: 0, cumulativeFounderFunding: 0,
    };
    
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
    
    const privateWeight = 1 - assumptions.publicWeight;
    const carryPrivate = investmentGain * privateWeight * assumptions.carryRatePrivate;
    const carryPublic = investmentGain * assumptions.publicWeight * assumptions.carryRatePublic;
    const totalCarry = carryPrivate + carryPublic;
    cumulativeCarryPrivate += carryPrivate;
    cumulativeCarryPublic += carryPublic;
    
    const grossMgmtFee = isPreLaunch ? 0 : openingAUM * (assumptions.mgmtFeeAnnual / 12);
    const bdmFeeShare = grossMgmtFee * bdmAUMProportion * bdmRevShare;
    const mgmtFee = grossMgmtFee - bdmFeeShare;
    const totalRevenue = mgmtFee + totalCarry;
    
    const ianSalary = isPostBreakeven ? assumptions.ianSalaryPost : assumptions.ianSalaryPre;
    const paulSalary = isPostBreakeven ? assumptions.paulSalaryPost : assumptions.paulSalaryPre;
    const lewisActive = m >= assumptions.lewisStartMonth && m < (assumptions.lewisStartMonth + assumptions.lewisMonths);
    const lewisSalary = lewisActive ? assumptions.lewisSalary : 0;
    const eaActive = m >= assumptions.eaStartMonth;
    const eaSalary = eaActive ? eaSalaryUSD : 0;
    const chairmanActive = m >= assumptions.chairmanStartMonth && ((m - assumptions.chairmanStartMonth) % 3 === 0);
    const chairmanCost = chairmanActive ? assumptions.chairmanSalary : 0;
    const totalSalaries = ianSalary + paulSalary + lewisSalary + eaSalary + chairmanCost;
    
    const marketing = (assumptions.marketingStopsAtBreakeven && isPostBreakeven) ? 0 : assumptions.marketing;
    const officeIT = assumptions.officeIT;
    const travel = assumptions.travel;
    const compliance = isPreLaunch ? 0 : assumptions.compliance;
    const setupCost = m === 0 ? assumptions.setupCost : 0;
    const totalOpex = officeIT + marketing + travel + compliance + setupCost;
    const brokerCommission = brokerRaise * assumptions.brokerCommissionRate;
    const totalExpenses = totalSalaries + totalOpex + brokerCommission;
    
    const ebt = totalRevenue - totalExpenses;
    if (!isPreLaunch) {
      rollingEBT.shift(); rollingEBT.push(ebt);
      if (breakEvenMonth === null && rollingEBT.reduce((a, b) => a + b, 0) > 0 && m >= 2) breakEvenMonth = m;
    }
    
    const netCashFlow = ebt;
    const closingCash = prev.closingCash + netCashFlow;
    let founderFundingRequired = 0;
    let adjustedClosingCash = closingCash;
    if (closingCash < 0) {
      founderFundingRequired = Math.abs(closingCash);
      adjustedClosingCash = 0;
      cumulativeFounderFunding += founderFundingRequired;
    }
    
    if (isPreLaunch) {
      preLaunchCosts += totalExpenses;
      preLaunchData.push({ month: m, label: 'M'+m, expenses: totalExpenses, lewisSalary, ianSalary, paulSalary, closingCash: adjustedClosingCash, founderFundingRequired });
    }
    
    months.push({
      month: m, label: 'M'+m, isPreLaunch, isPostBreakeven, openingAUM, gpOrganic, bdmRaise, brokerRaise,
      lpCapital, gpCommitment, newCapital, redemption, netCapital, investmentGain, closingAUM, cumulativeCapital,
      cumulativeBDMAUM, bdmAUMProportion, grossMgmtFee, bdmFeeShare, mgmtFee, carryPrivate, carryPublic, totalCarry,
      totalRevenue, cumulativeCarryPrivate, cumulativeCarryPublic, ianSalary, paulSalary, lewisSalary, eaSalary,
      chairmanCost, totalSalaries, officeIT, marketing, travel, compliance, setupCost, totalOpex, brokerCommission,
      totalExpenses, ebt, netCashFlow, closingCash: adjustedClosingCash, founderFundingRequired, cumulativeFounderFunding,
    });
  });
  
  return { months, preLaunchData, preLaunchCosts, breakEvenMonth, cumulativeFounderFunding, stoneParkUSD };
};