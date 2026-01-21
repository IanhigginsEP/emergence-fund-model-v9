# PROGRESS: v10 Rebuild

**Last Updated**: January 21, 2026
**Current Version**: v10.0-beta
**Target Version**: v10.0

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

### Batch 6: Marketing & Travel Roll-Up
- [x] Add toggle for marketing roll-up to SL - DONE in assumptions.js
- [x] Add toggle for travel roll-up to SL - DONE in assumptions.js
- [x] Update amounts: $1.5-2K pre-BE, $3K post-BE - DONE
- **STATUS: COMPLETE (done during earlier config updates)**

### Batch 7: Shareholder Loan Display
- [x] Add Paul $100K to initial balance - DONE in assumptions.js
- [ ] Display as rolling balance sheet item - shows in Cash Flow, needs Balance Sheet tab
- [ ] Remove any repayment logic (just accumulation)

### Batch 8: US Feeder Fund
- [ ] Add as one-time configurable expense
- [ ] Add month selector
- [ ] Add GP/LP toggle (who bears the cost)

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

### Session: January 21, 2026 (continued)
- Batch 5 COMPLETE
- Tables.js updated with personnel breakdown (collapsible)
- Shows all salary line items for verification
- Paul salary accrual now shows below the line

### Session: January 21, 2026
- Created PROGRESS_V10_REBUILD.md
- Batch 4 COMPLETE: Founder salary toggles
- assumptions.js updated with rollUpMode config for Ian/Paul
- engine.js updated with shouldRollUp() helper function
- Also made progress on Batches 5, 6, 7, 11 via config updates

---

## NEXT BATCH: Batch 7 (remaining tasks)

Tasks:
1. Create Balance Sheet tab to display Shareholder Loan balance
2. Verify no repayment logic exists (accumulation only)
3. Test SL balance accumulates with rolled-up salaries
