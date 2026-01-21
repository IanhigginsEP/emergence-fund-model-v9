// model/engine.js - Core P&L calculation loop
// v10.14: Fix marketing/travel defaults to $2000, add BDM trailing commission

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
  return true;
};

window.FundModel.runModel = function(assumptions, capitalInputs, returnMult, bdmRevShare) {
  returnMult = returnMult || 1.0;
  bdmRevShare = bdmRevShare !== undefined ? bdmRevShare : (assumptions.bdmRevSharePct || 0);
  
  const revenueConfig = window.FundModel.REVENUE || {};
  const carryBelowLine = revenueConfig.carryBelowLine !== false;
  const shareClasses = window.FundModel.SHARE_CLASSES || {};
  
  const effectiveReturn = assumptions.annualReturn * returnMult;
  const startingCashUSD = assumptions.startingCashUSD || 367000;
  const eaSalary = assumptions.eaSalary || 1000;
  const gpCommitRate = assumptions.gpCommitmentRate || 0.02;
  
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
  const usFeederIsGpExpense = assumptions.usFeederIsGpExpense !== false;
  
  // BDM settings with trailing commission
  const bdmStartMonth = assumptions.bdmStartMonth || 7;
  const bdmRetainer = assumptions.bdmRetainer || 0;
  const bdmTrailingMonths = assumptions.bdmTrailingMonths || 12;
  const bdmCommRate = assumptions.bdmCommissionRate || 0;
  
  // Broker trailing commission settings
  const brokerStartMonth = assumptions.brokerStartMonth || 3;
  const brokerRetainer = assumptions.brokerRetainer || 0;
  const brokerCommRate = assumptions.brokerCommissionRate || 0.01;
  const brokerTrailingMonths = assumptions.brokerTrailingMonths || 12;
  
  // Track raises for trailing commission calculation
  const brokerRaiseHistory = [];
  const bdmRaiseHistory = [];
  
  const months = [];
  let breakEvenMonth = null;
  let rollingEBITDA = [0, 0, 0];
  let cumulativeCarryPrivate = 0, cumulativeCarryPublic = 0;
  let cumulativeFounderFunding = 0, cumulativeBDMAUM = 0;
  let cumulativeGPCommit = 0, cumulativeLPCapital = 0;
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
      cumulativeGPCommit: 0, cumulativeLPCapital: 0,
    };
    
    // Capital
    const gpOrganic = isPreLaunch ? 0 : inp.gpOrganic;
    const bdmRaise = isPreLaunch ? 0 : inp.bdmRaise;
    const brokerRaise = isPreLaunch ? 0 : inp.brokerRaise;
    
    if (brokerRaise > 0) brokerRaiseHistory.push({ month: m, amount: brokerRaise });
    if (bdmRaise > 0) bdmRaiseHistory.push({ month: m, amount: bdmRaise });
    
    const lpCapital = gpOrganic + bdmRaise + brokerRaise;
    const gpCommitment = lpCapital * gpCommitRate;
    const newCapital = lpCapital + gpCommitment;
    const redemption = isPreLaunch ? 0 : (inp.redemption || 0);
    const netCapital = newCapital - redemption;
    
    // Track cumulative GP Commit and LP Capital for share class allocation
    cumulativeGPCommit = prev.cumulativeGPCommit + gpCommitment;
    cumulativeLPCapital = prev.cumulativeLPCapital + lpCapital;
    
    const openingAUM = prev.closingAUM;
    const preReturnAUM = openingAUM + netCapital;
    const investmentGain = isPreLaunch ? 0 : preReturnAUM * (effectiveReturn / 12);
    const closingAUM = preReturnAUM + investmentGain;
    const cumulativeCapital = prev.cumulativeCapital + netCapital;
    
    cumulativeBDMAUM = prev.cumulativeBDMAUM + bdmRaise;
    const bdmAUMProportion = closingAUM > 0 ? Math.min(cumulativeBDMAUM / closingAUM, 1) : 0;
    
    // Share class allocation: GP Commit → Founder, LP → Class A
    const founderPct = (cumulativeGPCommit + cumulativeLPCapital) > 0 
      ? cumulativeGPCommit / (cumulativeGPCommit + cumulativeLPCapital) 
      : gpCommitRate / (1 + gpCommitRate);
    const classAPct = 1 - founderPct;
    
    // AUM by share class
    const founderAUM = closingAUM * founderPct;
    const classAAUM = closingAUM * classAPct;
    
    // Management fee by share class
    const founderMgmtFee = 0;
    const classAMgmtFeeRate = shareClasses.classA?.mgmtFeeRate || 0.015;
    const classAMgmtFee = isPreLaunch ? 0 : classAAUM * (classAMgmtFeeRate / 12);
    const grossMgmtFee = founderMgmtFee + classAMgmtFee;
    
    const weightedMgmtRate = closingAUM > 0 ? (grossMgmtFee * 12) / closingAUM : 0;
    
    // Carry by share class
    const founderCarryRate = shareClasses.founder?.carryRate || 0;
    const classACarryRate = shareClasses.classA?.carryRate || 0.175;
    const privateWeight = 1 - assumptions.publicWeight;
    const carryPrivate = investmentGain * privateWeight * classACarryRate * classAPct;
    const carryPublic = investmentGain * assumptions.publicWeight * classACarryRate * classAPct;
    const carryRevenue = carryPrivate + carryPublic;
    cumulativeCarryPrivate += carryPrivate;
    cumulativeCarryPublic += carryPublic;
    
    // BDM fee share (from gross mgmt fee)
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
    const paulCashDraw = assumptions.paulCashDrawEnabled !== false;
    const paulShouldRollUp = !paulCashDraw && window.FundModel.shouldRollUp(paulRollUpMode, paulRollUpEndMonth, m, breakEvenMonth);
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
    
    // OpEx - FIXED: defaults now $2000
    const marketingAmount = isPostBreakeven ? (assumptions.marketingPostBE || 2000) : (assumptions.marketingPreBE || 2000);
    const marketingCash = marketingRollUp ? 0 : marketingAmount;
    const marketingAccrual = marketingRollUp ? marketingAmount : 0;
    
    const travelAmount = isPostBreakeven ? (assumptions.travelPostBE || 2000) : (assumptions.travelPreBE || 2000);
    const travelCash = travelRollUp ? 0 : travelAmount;
    const travelAccrual = travelRollUp ? travelAmount : 0;
    
    const officeIT = assumptions.officeIT;
    const compliance = isPreLaunch ? 0 : assumptions.compliance;
    const setupCost = m === 0 ? assumptions.setupCost : 0;
    
    // US Feeder Fund expense
    let usFeederExpense = 0, usFeederLpExpense = 0;
    if (usFeederMonth !== null && m === usFeederMonth) {
      if (usFeederIsGpExpense) usFeederExpense = usFeederAmount;
      else usFeederLpExpense = usFeederAmount;
    }
    
    // BDM expenses with trailing commission
    const bdmRetainerExpense = (!isPreLaunch && m >= bdmStartMonth) ? bdmRetainer : 0;
    let bdmTrailingComm = 0;
    if (!isPreLaunch && bdmCommRate > 0) {
      bdmRaiseHistory.forEach(raise => {
        if (m >= raise.month && m < raise.month + bdmTrailingMonths) {
          bdmTrailingComm += raise.amount * bdmCommRate / 12;
        }
      });
    }
    
    // Broker expenses with trailing commission
    const brokerRetainerExpense = (!isPreLaunch && m >= brokerStartMonth) ? brokerRetainer : 0;
    let brokerTrailingComm = 0;
    if (!isPreLaunch) {
      brokerRaiseHistory.forEach(raise => {
        if (m >= raise.month && m < raise.month + brokerTrailingMonths) {
          brokerTrailingComm += raise.amount * brokerCommRate / 12;
        }
      });
    }
    
    const totalBrokerExpense = brokerRetainerExpense + brokerTrailingComm;
    const totalBdmExpense = bdmRetainerExpense + bdmFeeShare + bdmTrailingComm;
    
    const totalOpexCash = officeIT + marketingCash + travelCash + compliance + setupCost + usFeederExpense;
    const totalOpex = officeIT + marketingAmount + travelAmount + compliance + setupCost + usFeederExpense;
    
    const totalCashExpenses = totalCashSalaries + totalOpexCash + totalBrokerExpense + bdmRetainerExpense + bdmTrailingComm;
    const totalExpenses = totalSalaries + totalOpex + totalBrokerExpense + bdmRetainerExpense + bdmTrailingComm;
    
    // EBITDA & EBT
    const ebitda = operatingRevenue - totalCashExpenses;
    const ebt = totalRevenue - totalExpenses;
    const netIncome = carryBelowLine ? (ebitda + carryRevenue - ianAccrual - paulAccrual) : ebt;
    
    // Breakeven (EBITDA-based)
    if (!isPreLaunch) {
      rollingEBITDA.shift(); rollingEBITDA.push(ebitda);
      if (breakEvenMonth === null && rollingEBITDA.every(e => e > 0) && m >= 2) breakEvenMonth = m;
    }
    
    // Cash flow with founder funding logic
    const netCashFlow = ebitda;
    let closingCash = prev.closingCash + netCashFlow;
    let founderFundingRequired = 0;
    
    // At M0 (launch), founders inject to restore starting pot
    if (m === 0 && closingCash < startingCashUSD) {
      founderFundingRequired = startingCashUSD - closingCash;
      closingCash = startingCashUSD;
      cumulativeFounderFunding += founderFundingRequired;
    }
    // After launch, founders inject only if cash goes negative
    else if (!isPreLaunch && m > 0 && closingCash < 0) {
      founderFundingRequired = Math.abs(closingCash);
      closingCash = 0;
      cumulativeFounderFunding += founderFundingRequired;
    }
    
    const adjustedClosingCash = closingCash;
    
    // Shareholder loan accumulation
    shareholderLoanBalance = prev.shareholderLoanBalance + ianAccrual + paulAccrual + marketingAccrual + travelAccrual;
    
    if (isPreLaunch) {
      preLaunchCosts += totalExpenses;
      preLaunchData.push({ month: m, label: 'M'+m, expenses: totalExpenses, lewisSalary, ianSalary: ianSalaryAmount, paulSalary: paulSalaryAmount, closingCash: adjustedClosingCash, founderFundingRequired });
    }
    
    months.push({
      month: m, label: 'M'+m, isPreLaunch, isPostBreakeven, openingAUM, gpOrganic, bdmRaise, brokerRaise,
      lpCapital, gpCommitment, newCapital, redemption, netCapital, investmentGain, closingAUM, cumulativeCapital,
      cumulativeBDMAUM, cumulativeGPCommit, cumulativeLPCapital, bdmAUMProportion,
      shareClasses: {
        founder: { aum: founderAUM, pct: founderPct, mgmtFee: founderMgmtFee, carryRate: founderCarryRate },
        classA: { aum: classAAUM, pct: classAPct, mgmtFee: classAMgmtFee, carryRate: classACarryRate },
        classB: { aum: 0, pct: 0, mgmtFee: 0, carryRate: 0 },
        classC: { aum: 0, pct: 0, mgmtFee: 0, carryRate: 0 },
      },
      weightedMgmtRate,
      grossMgmtFee, bdmFeeShare, mgmtFee, operatingRevenue, carryRevenue, totalRevenue,
      carryPrivate, carryPublic, cumulativeCarryPrivate, cumulativeCarryPublic, 
      ianSalary: ianSalaryAmount, ianCashExpense, ianAccrual, ianRollUp: ianShouldRollUp,
      paulSalary: paulSalaryAmount, paulCashExpense, paulAccrual, paulRollUp: paulShouldRollUp,
      lewisSalary, eaSalary: eaSalaryCost, adrianSalary, chairmanCost, totalSalaries, totalCashSalaries,
      officeIT, marketing: marketingAmount, marketingCash, marketingAccrual, 
      travel: travelAmount, travelCash, travelAccrual, compliance, setupCost,
      usFeederExpense, usFeederLpExpense,
      bdmRetainerExpense, bdmTrailingComm, bdmFeeShare: bdmFeeShare, totalBdmExpense,
      brokerRetainerExpense, brokerTrailingComm, totalBrokerExpense,
      totalOpex, totalOpexCash, totalCashExpenses, totalExpenses, ebitda, ebt, netIncome, netCashFlow,
      closingCash: adjustedClosingCash, founderFundingRequired, cumulativeFounderFunding, shareholderLoanBalance,
    });
  });
  
  return { months, preLaunchData, preLaunchCosts, breakEvenMonth, cumulativeFounderFunding, startingCashUSD };
};

window.FundModel.getInitialShareholderLoan = function() {
  const slConfig = window.FundModel.SHAREHOLDER_LOAN || {};
  const items = slConfig.initialItems || [];
  return items.filter(item => item.description !== 'US Feeder Fund')
              .reduce((sum, item) => sum + (item.amount || 0), 0);
};
