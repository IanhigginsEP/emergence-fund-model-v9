# PROGRESS: LP-Ready Enhancement Batches

**Last Updated**: January 20, 2026 - 4:30 PM  
**Status**: v9.3 BATCH 2 COMPLETE

## Repository
https://github.com/IanhigginsEP/emergence-fund-model-v9

## Live Site
https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## v9.3 MAJOR UPDATE — IN PROGRESS

| Batch | Description | Status |
|-------|-------------|--------|
| 1 | Config & Timeline (24mo, new expenses) | ✅ COMPLETE |
| 2 | Model Engine (carry below line, EBITDA) | ✅ COMPLETE |
| 3 | KPI Table (Revenue/AUM, EBITDA/AUM) | ⏳ NEXT |
| 4 | Dashboard & Cash Flow UI | ⏳ PENDING |
| 5 | Validation & README | ⏳ PENDING |

### v9.3 Key Changes
- 24-month horizon (from 36)
- Carry excluded from cash flow (below the line)
- Personnel: Lewis $8,850, Emma $1,000, Adrian $2,300
- OpEx: Leventus $6,300, Admin $1,600, Office $760, Tech $500, Mobile $250
- Ian salary as roll-up/liability (not cash outflow)
- Marketing/Travel budgets: $6K pre-breakeven total, inverse spend pattern
- Target breakeven: Month 7

---

## BATCH 2 DELIVERABLES ✅
**Completed**: January 20, 2026 - 4:30 PM

### Files Modified
- [x] `model/engine.js` - Major rewrite for v9.3

### Files Created
- [x] `model/shareholderLoan.js` - Shareholder loan tracking utilities

### Engine Changes
- [x] 24-month loop (reads from `TIMELINE.projectionMonths`)
- [x] Carry excluded from cash flow (`operatingRevenue` vs `carryRevenue`)
- [x] EBITDA calculation (`operatingRevenue - totalCashExpenses`)
- [x] Ian salary accrues to Shareholder Loan when `treatAsRollUp: true`
- [x] Breakeven based on EBITDA (3 consecutive positive months)
- [x] Added Adrian salary support
- [x] Month objects include: `operatingRevenue`, `carryRevenue`, `ebitda`, `netIncome`, `ianAccrual`, `shareholderLoanBalance`

### Shareholder Loan Features
- [x] `getInitialShareholderLoan()` - Get starting balance from config
- [x] `getShareholderLoanDetails(months)` - Detailed breakdown with accruals
- [x] `calculateRepaymentCapacity(months, repaymentMonth)` - Repayment analysis

---

## v9.3 Config Structure (Batch 1)
```javascript
window.FundModel.TIMELINE = { projectionMonths: 24, targetBreakevenMonth: 7 }
window.FundModel.PERSONNEL = { 
  ian: { preBESalary: 5000, postBESalary: 10000, treatAsRollUp: true },
  lewis: { monthlySalary: 8850 }, 
  emma: { monthlySalary: 1000 }, 
  adrian: { monthlySalary: 2300 } 
}
window.FundModel.OPEX = { leventus: 6300, adminCustodial: 1600, office: 760, tech: 500, mobile: 250 }
window.FundModel.REVENUE = { carryBelowLine: true }
window.FundModel.SHAREHOLDER_LOAN = { initialItems: [...] }
```

---

## PREVIOUS STATE (v9.2 - Verified Jan 20, 2026)

v9.2 LP-READY was deployed and working:
- ✅ LP Return Metrics panel (IRR 12.2%, MOIC 1.18x, TVPI 1.18x, DPI 0.06x)
- ✅ J-Curve chart (Trough M14: -$236K, Final: $6.47M)
- ✅ Revenue Waterfall ($2.98M + $5.18M = $8.08M)
- ✅ Expense Waterfall ($912K + $519K + $175K = $1.63M)
- ✅ Old validation targets: M5 breakeven, $182K founder funding, $140.58M Y3 AUM

**Note**: v9.3 will change these metrics due to new cost structure and 24mo horizon.

---

## BATCH OVERVIEW (Pre-v9.3 Work)

| Batch | Description | Status |
|-------|-------------|--------|
| 1 | Analysis & Research | ✅ COMPLETE |
| 2 | J-Curve + Waterfall Charts | ✅ COMPLETE |
| 3 | Return Metrics (IRR, MOIC, TVPI, DPI) | ✅ COMPLETE |
| 4 | Enhanced Scenario Analysis | ⏸️ PAUSED (superseded by v9.3) |
| 5 | LP-Ready Polish | ⏸️ PAUSED (superseded by v9.3) |

---

## BATCH 1: Analysis & Research ✅
**Completed**: January 20, 2026

### Deliverables
- [x] Reviewed current v9 model across all tabs
- [x] Conducted web research on LP expectations
- [x] Identified missing industry-standard features
- [x] Created prioritized implementation roadmap

---

## BATCH 2 (OLD): J-Curve + Waterfall Charts ✅
**Completed**: January 20, 2026

### Files Added
- [x] `ui/JCurve.js` - Classic PE/VC J-curve (cumulative net cash flow)
- [x] `ui/RevenueWaterfall.js` - Mgmt Fees + Carry → Total Revenue
- [x] `ui/ExpenseWaterfall.js` - Salaries + OpEx → Total Expenses

---

## BATCH 3 (OLD): Return Metrics ✅
**Completed**: January 20, 2026

### Files Added
- [x] `model/metrics.js` - IRR, MOIC, TVPI, DPI, Runway calculations
- [x] `ui/MetricsPanel.js` - Professional KPI display component

---

## VALIDATION TARGETS (v9.3 - TO BE VERIFIED)

| Metric | v9.2 Value | v9.3 Expected | Status |
|--------|-----------|---------------|--------|
| Horizon | 36 months | 24 months | ✅ Engine |
| Breakeven | Month 5 | Month 7 | ⏳ Pending |
| Personnel Cost | ~$19K/mo | ~$12K/mo (base) | ⏳ Pending |
| OpEx | ~$13K/mo | ~$9.4K/mo | ⏳ Pending |
| Carry in Cash | Included | Below line | ✅ Engine |
| Ian Salary | Cash expense | Shareholder loan | ✅ Engine |

---

## ARCHITECTURE RULES

1. **No file over 150 lines** - Split if needed
2. **Use window.FundModel namespace** - For GitHub Pages compatibility
3. **No ES6 imports** - Browser-based Babel doesn't support them
4. **Test after each batch** - Verify no regressions

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|--------|
| v9.0 | Jan 19, 2026 | Initial modular architecture |
| v9.1 | Jan 20, 2026 | J-Curve, Revenue/Expense waterfalls |
| v9.2 | Jan 20, 2026 | LP metrics (IRR, MOIC, TVPI, DPI) |
| v9.3 | Jan 20, 2026 | 24mo horizon, new personnel/opex, carry below line |

---

## NEXT STEPS (Batch 3)

1. Add KPI Table with Revenue/AUM and EBITDA/AUM metrics
2. Update Dashboard to display new EBITDA-based metrics
3. Show shareholder loan balance on relevant views

---

## NOTES

**Jan 20 4:30 PM**: Batch 2 complete. Model engine now:
- Separates `operatingRevenue` (mgmt fee) from `carryRevenue`
- Calculates `ebitda` = operatingRevenue - totalCashExpenses
- Ian's salary accrues to `shareholderLoanBalance` instead of reducing cash
- Breakeven uses EBITDA (3 consecutive positive months)
- All months have new fields: operatingRevenue, carryRevenue, ebitda, netIncome, ianAccrual, shareholderLoanBalance
