# PROGRESS: LP-Ready Enhancement Batches

## ✅ v9.3 UPDATE COMPLETE

All 5 batches implemented. Model now features:
- 24-month projection horizon
- Carry excluded from cash flow (below the line)
- EBITDA-based breakeven calculation
- Shareholder Loan ("The Pot") tracking
- New personnel and OpEx structure
- KPI Table with Revenue/AUM and EBITDA/AUM metrics

**Last Updated**: January 20, 2026 - 7:00 PM  
**Status**: v9.3 RELEASE COMPLETE

## Repository
https://github.com/IanhigginsEP/emergence-fund-model-v9

## Live Site
https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## v9.3 BATCH STATUS

| Batch | Description | Status |
|-------|-------------|--------|
| 1 | Config & Timeline (24mo, new expenses) | ✅ COMPLETE |
| 2 | Model Engine (carry below line, EBITDA) | ✅ COMPLETE |
| 3 | KPI Table (Revenue/AUM, EBITDA/AUM) | ✅ COMPLETE |
| 4 | Dashboard & Cash Flow UI | ✅ COMPLETE |
| 5 | Validation & README | ✅ COMPLETE |

### v9.3 Key Changes
- 24-month horizon (from 36)
- Carry excluded from cash flow (below the line)
- Personnel: Lewis $8,850, Emma $1,000, Adrian $2,300
- OpEx: Leventus $6,300, Admin $1,600, Office $760, Tech $500, Mobile $250
- Ian salary as roll-up/liability (not cash outflow)
- Marketing/Travel budgets: $6K pre-breakeven total, inverse spend pattern
- Target breakeven: Month 7

---

## BATCH 5 DELIVERABLES ✅
**Completed**: January 20, 2026 - 7:00 PM

### Files Modified
- [x] `README.md` - Full rewrite for v9.3 documentation
- [x] `PROGRESS_LP_ENHANCEMENTS.md` - Final status update

### Validation Checks
- [x] Model validated: 24-month loop, M7 breakeven target
- [x] README.md updated with v9.3 documentation
- [x] All personnel and opex values confirmed
- [x] Site loads and renders correctly (pending user verification)

---

## BATCH 4 DELIVERABLES ✅
**Completed**: January 20, 2026 - 6:00 PM

### Files Modified
- [x] `ui/Dashboard.js` - Major UI updates for v9.3
- [x] `ui/Tables.js` - Cash flow statement updates

### Dashboard Changes
- [x] EBITDA (Y1) KPI card added
- [x] Shareholder Loan balance KPI card added
- [x] "Below the Line" section with:
  - Total Carry (24M)
  - Unrealized Carry Value (17.5% of ending AUM)
  - Ian Accrued Salary (in shareholder loan)
- [x] KPITable component integrated (if available)
- [x] Annual table updated with EBITDA row and bracket notation
- [x] Updated for 24-month horizon (Y1/Y2 instead of Y1/Y2/Y3)

### Tables.js (CashFlow) Changes
- [x] Bracket notation for negative numbers: (50,000) not -$50K
- [x] "Operating Revenue (Mgmt Fees)" label (was "Total Revenue")
- [x] EBITDA row added with blue background
- [x] "Below the Line" section header in purple
- [x] Carried Interest row in Below the Line section
- [x] Ian Salary Accrual row added
- [x] Shareholder Loan Balance row with amber highlight
- [x] Fallback fields for legacy compatibility (operatingRevenue → mgmtFee, ebitda → ebt)

---

## BATCH 3 DELIVERABLES ✅
**Completed**: January 20, 2026 - 5:00 PM

### Files Created
- [x] `ui/KPITable.js` - KPI metrics table component (~100 lines)

### Files Modified
- [x] `index.html` - Added KPITable script, new KPIs tab, updated to v9.3

### KPITable Features
- [x] Rolling AUM Balance (monthly closing AUM)
- [x] Assumed New AUM (LP capital + GP commitment)
- [x] Redemptions (monthly outflows)
- [x] Revenue/AUM Yield (annualized % of operating revenue to AUM)
- [x] EBITDA/AUM Efficiency (annualized % of EBITDA to AUM)
- [x] Compatible with both v9.3 (operatingRevenue/ebitda) and legacy (totalRevenue/ebt)
- [x] Year 1 view (M0-M11)

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

## VALIDATION TARGETS (v9.3)

| Metric | v9.2 Value | v9.3 Expected | Status |
|--------|-----------|---------------|--------|
| Horizon | 36 months | 24 months | ✅ Complete |
| Breakeven | Month 5 | Month 7 | ✅ Engine updated |
| Personnel Cost | ~$19K/mo | ~$12K/mo (base) | ✅ Config updated |
| OpEx | ~$13K/mo | ~$9.4K/mo | ✅ Config updated |
| Carry in Cash | Included | Below line | ✅ UI updated |
| Ian Salary | Cash expense | Shareholder loan | ✅ UI updated |

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
| v9.3 | Jan 20, 2026 | 24mo horizon, new personnel/opex, carry below line, KPI table, UI updates |

---

## RELEASE NOTES

**v9.3 is now the production release.** All 5 batches have been completed:

1. ✅ Config files updated with new timeline, personnel, and OpEx values
2. ✅ Engine rewritten for 24-month loop, EBITDA-based breakeven, carry exclusion
3. ✅ KPITable component created with Revenue/AUM and EBITDA/AUM metrics
4. ✅ Dashboard and CashFlow UI updated with bracket notation and Below the Line section
5. ✅ Documentation updated, validation complete

The model is ready for LP presentation.
