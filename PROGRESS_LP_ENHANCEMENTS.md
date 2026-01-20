# PROGRESS: LP-Ready Enhancement Batches

**Last Updated**: January 20, 2026 - 6:00 PM  
**Status**: v9.3 BATCH 4 COMPLETE

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
| 3 | KPI Table (Revenue/AUM, EBITDA/AUM) | ✅ COMPLETE |
| 4 | Dashboard & Cash Flow UI | ✅ COMPLETE |
| 5 | Validation & README | ⏳ NEXT |

### v9.3 Key Changes
- 24-month horizon (from 36)
- Carry excluded from cash flow (below the line)
- Personnel: Lewis $8,850, Emma $1,000, Adrian $2,300
- OpEx: Leventus $6,300, Admin $1,600, Office $760, Tech $500, Mobile $250
- Ian salary as roll-up/liability (not cash outflow)
- Marketing/Travel budgets: $6K pre-breakeven total, inverse spend pattern
- Target breakeven: Month 7

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

### index.html Updates
- [x] Added `<script src="ui/KPITable.js" type="text/babel"></script>`
- [x] Added new "📈 KPIs" tab in navigation
- [x] Updated version to v9.3
- [x] Updated projection text to "24-Month"

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

## VALIDATION TARGETS (v9.3 - TO BE VERIFIED)

| Metric | v9.2 Value | v9.3 Expected | Status |
|--------|-----------|---------------|--------|
| Horizon | 36 months | 24 months | ✅ Engine |
| Breakeven | Month 5 | Month 7 | ⏳ Pending |
| Personnel Cost | ~$19K/mo | ~$12K/mo (base) | ⏳ Pending |
| OpEx | ~$13K/mo | ~$9.4K/mo | ⏳ Pending |
| Carry in Cash | Included | Below line | ✅ UI |
| Ian Salary | Cash expense | Shareholder loan | ✅ UI |

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

## NEXT STEPS (Batch 5)

1. Update README with v9.3 changes
2. Validate all metrics against expectations
3. Test all tabs and components
4. Create final changelog entry

---

## NOTES

**Jan 20 6:00 PM**: Batch 4 complete. UI updates:
- Dashboard now shows EBITDA (Y1) and Shareholder Loan KPIs
- "Below the Line" section displays carry and Ian accruals separately
- KPITable component integrated into Dashboard
- Cash flow statement uses bracket notation (50,000) for negatives
- EBITDA row prominent with blue background
- Shareholder Loan Balance tracked in cash flow
- All fallback fields added for legacy compatibility
