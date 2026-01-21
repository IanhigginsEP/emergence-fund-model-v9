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

### Batch 5: Lewis & Adrian Corrections (IN PROGRESS)
- [ ] Lewis: Add adjustment toggle (new amount at specified month)
- [ ] Adrian: Change to $20K/year ($1,667/mo) ← DONE in assumptions.js
- [ ] Verify personnel costs in Cash Flow Statement

### Batch 6: Marketing & Travel Roll-Up
- [ ] Add toggle for marketing roll-up to SL
- [ ] Add toggle for travel roll-up to SL
- [ ] Update amounts: $1.5-2K pre-BE, $3K post-BE

### Batch 7: Shareholder Loan Display
- [ ] Add Paul $100K to initial balance ← DONE in assumptions.js
- [ ] Display as rolling balance sheet item
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
- [ ] Founder Class: 0% mgmt fee, 0% perf fee
- [ ] Class A: 1.5% mgmt fee, 17.5% perf fee
- [ ] Class B: 1.5% mgmt fee, 17.5% perf fee
- [ ] Class C: 1.5% mgmt fee, 17.5% perf fee

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

### Session: January 21, 2026
- Created PROGRESS_V10_REBUILD.md
- Batch 4 COMPLETE: Founder salary toggles
- assumptions.js updated with rollUpMode config for Ian/Paul
- engine.js updated with shouldRollUp() helper function
- Also made progress on Batches 5, 6, 7, 11 via config updates
