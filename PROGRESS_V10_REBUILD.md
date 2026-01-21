# PROGRESS: v10 Rebuild

**Last Updated**: January 21, 2026
**Current Version**: v10.8
**Target Version**: v10.0+

## Repository
https://github.com/IanhigginsEP/emergence-fund-model-v9

## Live Site
https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## BATCH STATUS

### Batch 4: Founder Salary Toggles ✅ COMPLETE
- [x] Add Ian toggle (roll-up until date OR breakeven, then cash)
- [x] Add Paul toggle (same structure)
- [x] Update engine.js to read toggle dates

### Batch 5: Lewis & Adrian Corrections ✅ COMPLETE
- [x] Lewis: Add adjustment toggle (new amount at specified month) - in engine.js
- [x] Adrian: Change to $20K/year ($1,667/mo) - in assumptions.js
- [x] Verify personnel costs in Cash Flow Statement - added collapsible breakdown

### Batch 6: Marketing & Travel Roll-Up ✅ COMPLETE
- [x] Add toggle for marketing roll-up to SL - DONE in assumptions.js
- [x] Add toggle for travel roll-up to SL - DONE in assumptions.js
- [x] Update amounts: $1.5-2K pre-BE, $3K post-BE - DONE

### Batch 7: Shareholder Loan Display ✅ COMPLETE
- [x] Add Paul $100K to initial balance - DONE in assumptions.js
- [x] Display as rolling balance sheet item - BalanceSheet.js created
- [x] Verify no repayment logic (just accumulation) - confirmed in engine.js

### Batch 8: US Feeder Fund ✅ COMPLETE
- [x] Add as one-time configurable expense ($30K default)
- [x] Add month selector (null = not triggered, M0-M35)
- [x] Add GP/LP toggle (who bears the cost)
- [x] Engine processes expense at selected month
- [x] Distinct tracking: usFeederExpense (GP) vs usFeederLpExpense (LP)

### Batch 9: BDM & Broker Fee Structure
- [ ] Create fee configuration inputs (retainer + %)
- [ ] Implement trailing commission calculation
- [ ] Add to Cash Flow Statement as expense line

### Batch 10: Capital Raising Tab
- [ ] Create dedicated tab for capital inputs
- [ ] GP Organic, BDM, Broker raise inputs
- [ ] Start month configurability for each

### Batch 11: Share Class Integration
- [x] Founder Class: 0% mgmt fee, 0% perf fee - DONE in assumptions.js
- [x] Class A: 1.5% mgmt fee, 17.5% perf fee - DONE
- [x] Class B: 1.5% mgmt fee, 17.5% perf fee - DONE
- [x] Class C: 1.5% mgmt fee, 17.5% perf fee - DONE
- **STATUS: Config done, engine integration needed**

### Batch 12: Validation & Reconciliation
- [ ] Add cash flow reconciliation check
- [ ] Add AUM reconciliation row
- [ ] Fix any discrepancies

### Batch 13: COO/CFO Tools
- [ ] Runway indicator
- [ ] Cash bridge waterfall
- [ ] Sensitivity flags

### Batch 14: Reporting Enhancements
- [ ] Scenario comparison side-by-side
- [ ] Board-ready summary view
- [ ] What-if sliders

---

## VALIDATION TARGETS

| Metric | Current | Target |
|--------|---------|--------|
| Pre-launch months | 12 | 12 (Mar 2025 - Feb 2026) |
| Projection months | 36 | 36 |
| Starting cash (M0) | $367K | $367K |
| Breakeven | OUTPUT | OUTPUT (not forced) |

---

## COMPLETED BATCHES

### Batch 8 (Jan 21, 2026)
- Added US Feeder Fund as configurable one-time expense
- Files modified:
  - config/assumptions.js: Added US_FEEDER config block, usFeederMonth/Amount/IsGpExpense to DEFAULT_ASSUMPTIONS
  - model/engine.js: Added usFeederExpense/usFeederLpExpense processing at selected month
  - ui/Controls.js: Added "US Feeder Fund" section with month dropdown, amount input, GP/LP toggle
- Features:
  - Month selector dropdown (Not Triggered, M0-M35)
  - Amount configurable (default $30K)
  - GP Expense toggle (ON = hits GP cash flow, OFF = LP/Fund expense)
  - Visual confirmation when active
  - Excluded from initial shareholder loan (only triggered at selected month)

### Batch 7 (Jan 21, 2026)
- Created ui/BalanceSheet.js with:
  - Initial items breakdown table (from SHAREHOLDER_LOAN.initialItems)
  - Summary KPI cards (Initial, Accumulated, Current balance)
  - Rolling monthly SL balance display (24 months)
  - Monthly accrual rows (Ian, Paul, Marketing, Travel)
  - Structure notes (interest from Year 3, repayment from Year 3)
- Updated index.html:
  - Added Balance Sheet tab to navigation
  - Added script tag for BalanceSheet.js
  - Bumped version to v10.0
- Verified engine.js: No repayment logic exists - pure accumulation ✓

### Batch 5 (Jan 21, 2026)
- Lewis adjustment toggle implemented in engine.js (reads lewisAdjustmentMonth, lewisAdjustedSalary)
- Adrian confirmed at $1,667/mo ($20K/year)
- CashflowStatement in Tables.js now has collapsible personnel breakdown:
  - Ian (cash), Paul (cash), Lewis, Emma, Adrian, Chairman
  - Marketing, Travel, Office/IT, Compliance, Broker Comm
  - Shows accruals below the line (Ian, Paul, Marketing, Travel)

### Batch 4 (Jan 21, 2026)
- Added founder salary toggle modes: 'untilBreakeven' | 'untilMonth' | 'always' | 'never'
- Ian and Paul both configurable with rollUpMode and rollUpEndMonth
- Engine reads and applies toggle logic correctly
- Also added: marketing/travel roll-up toggles in config (Batch 6 partial)
- Also added: Paul $100K to shareholder loan initial items (Batch 7 partial)
- Also added: Adrian corrected to $1,667/mo (Batch 5 partial)
- Also added: Lewis adjustment fields (adjustmentMonth, adjustedSalary)
- Also added: SHARE_CLASSES from PPM (Batch 11 partial)

---

## SESSION LOG

### Session: January 21, 2026 (Batch 8)
- Batch 8 COMPLETE
- US Feeder Fund expense implementation:
  - Month selector in UI (Controls.js)
  - GP/LP toggle determines expense treatment
  - Engine processes at selected month
  - Excluded from initial SL balance (separate triggering)

### Session: January 21, 2026 (Batch 7)
- Batch 7 COMPLETE
- Created BalanceSheet.js (113 lines)
- Added Balance Sheet tab to index.html
- Verified no repayment logic in engine.js
- SL balance accumulates: initial + ianAccrual + paulAccrual + marketingAccrual + travelAccrual

### Session: January 21, 2026 (Batch 5)
- Batch 5 COMPLETE
- Tables.js updated with personnel breakdown (collapsible)
- Shows all salary line items for verification
- Paul salary accrual now shows below the line

### Session: January 21, 2026 (Batch 4)
- Created PROGRESS_V10_REBUILD.md
- Batch 4 COMPLETE: Founder salary toggles
- assumptions.js updated with rollUpMode config for Ian/Paul
- engine.js updated with shouldRollUp() helper function
- Also made progress on Batches 5, 6, 7, 11 via config updates

---

## NEXT BATCH: Batch 9 (BDM & Broker Fee Structure)

Tasks:
1. Create fee configuration inputs in Controls.js
   - BDM: retainer amount + rev share % + start month
   - Broker: retainer + trailing commission rate + trailing months
2. Implement trailing commission calculation in engine.js
3. Add to Cash Flow Statement as distinct expense lines
4. Consider broker commission attribution (12-month trailing)

Files to modify:
- ui/Controls.js — add BDM/Broker config section
- model/engine.js — implement commission logic
- config/assumptions.js — verify structure supports new fields

Validation:
- Broker commission should show for 12 months after capital raised
- BDM rev share % should reduce effective mgmt fee on BDM-raised AUM
