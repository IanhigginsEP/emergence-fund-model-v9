# PROGRESS: v10 Rebuild

**Last Updated**: January 21, 2026
**Current Version**: v10.12
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
- [x] Lewis: Add adjustment toggle (new amount at specified month)
- [x] Adrian: Change to $20K/year ($1,667/mo)
- [x] Verify personnel costs in Cash Flow Statement

### Batch 6: Marketing & Travel Roll-Up ✅ COMPLETE
- [x] Add toggle for marketing roll-up to SL
- [x] Add toggle for travel roll-up to SL
- [x] Update amounts: $1.5-2K pre-BE, $3K post-BE

### Batch 7: Shareholder Loan Display ✅ COMPLETE
- [x] Add Paul $100K to initial balance
- [x] Display as rolling balance sheet item
- [x] Verify no repayment logic (just accumulation)

### Batch 8: US Feeder Fund ✅ COMPLETE
- [x] Add as one-time configurable expense ($30K default)
- [x] Add month selector (null = not triggered, M0-M35)
- [x] Add GP/LP toggle (who bears the cost)

### Batch 9: BDM & Broker Fee Structure ✅ COMPLETE
- [x] Create fee configuration inputs (retainer + %)
- [x] Implement trailing commission calculation
- [x] Add to Cash Flow Statement as expense line

### Batch 10: Capital Raising Tab ✅ COMPLETE
- [x] Create dedicated tab for capital inputs
- [x] GP Organic, BDM, Broker raise inputs
- [x] Start month configurability for each

### Batch 11: Share Class Integration ✅ COMPLETE
- [x] config/share-classes.js - PPM definitions (Founder 0%, Class A/B/C 1.5%/17.5%)
- [x] model/engine.js - Lines 84-113: Fee calculation by share class
- [x] ui/ShareClasses.js - Full display component
- [x] index.html - Tab configured and loaded

**Verification**:
- Founder Class AUM generates $0 mgmt fee (0% rate applied)
- Class A AUM generates 1.5% annual / 12 monthly mgmt fee
- Weighted average fee rate calculated and displayed
- Share Classes tab shows cards, fee impact, annual breakdown, monthly AUM

### Batch 12: Validation & Reconciliation
- [ ] Add cash flow reconciliation check
- [ ] Add AUM reconciliation row
- [ ] Fix any discrepancies

---

## REMAINING BATCHES: 1

| Batch | Description | Status |
|-------|-------------|--------|
| **Batch 12** | Validation & Reconciliation | Not started |

---

## VALIDATION TARGETS

| Metric | Current | Target |
|--------|---------|--------|
| Pre-launch months | 12 | 12 (Mar 2025 - Feb 2026) |
| Projection months | 36 | 36 |
| Starting cash (M0) | $367K | $367K |
| Breakeven | M5 | ~M5 |
| Founder Funding | $182K | ~$182K |
| Y3 AUM | $140.58M | ~$140M |

---

## COMPLETED BATCHES

### Batch 11 (Jan 21, 2026)
- Verified share class integration in engine.js
- Files status:
  - config/share-classes.js: ✅ Complete - PPM definitions
  - model/engine.js: ✅ Complete - Fee calculation integrated
    - Lines 84-90: founderPct/classAPct from cumulative capital
    - Lines 92-93: AUM by class (founderAUM, classAAUM)
    - Lines 95-100: Mgmt fee by class (Founder 0%, Class A 1.5%)
    - Lines 107-113: Carry by class (Founder 0%, Class A 17.5%)
    - Lines 177-184: shareClasses object in monthly output
  - ui/ShareClasses.js: ✅ Complete - Display component
  - index.html: ✅ Complete - Tab configured

### Batch 10 (Jan 21, 2026)
- Created ui/CapitalTab.js with full capital configuration
- Files modified:
  - ui/CapitalTab.js: NEW - dedicated capital raising UI
  - config/capital.js: Updated to read from assumptions
  - config/assumptions.js: Added capital config fields
  - index.html: Added Capital tab to navigation

### Batch 9 (Jan 21, 2026)
- Added BDM & Broker fee structure configuration
- Files modified:
  - ui/Controls.js: Added "BDM Economics" and "Broker Economics" sections
  - model/engine.js: Implemented trailing commission calculation
  - ui/Tables.js: Added distinct expense lines in Cash Flow Statement
  - config/assumptions.js: Added BDM/Broker fields to DEFAULT_ASSUMPTIONS

### Batch 8 (Jan 21, 2026)
- Added US Feeder Fund as configurable one-time expense
- Month selector dropdown (Not Triggered, M0-M35)
- GP/LP toggle determines expense treatment

### Batch 7 (Jan 21, 2026)
- Created ui/BalanceSheet.js
- Added Balance Sheet tab to index.html
- SL balance accumulates without repayment

### Batch 5 (Jan 21, 2026)
- Tables.js updated with personnel breakdown (collapsible)

### Batch 4 (Jan 21, 2026)
- Founder salary toggles implemented

---

## NEXT BATCH: Batch 12 (Validation & Reconciliation)

**Objective**: Ensure all calculations reconcile correctly

Tasks:
1. Add AUM reconciliation row to Cash Flow Statement
   - Opening AUM + Net Capital + Investment Gain = Closing AUM
   - Flag any discrepancies

2. Add Cash reconciliation check
   - Opening Cash + Revenue - Expenses - Funding = Closing Cash
   - Display variance if any

3. Validate share class allocation
   - Founder AUM + Class A AUM = Total AUM
   - Verify weighted fee rate calculation

4. Cross-check with validation targets:
   - Breakeven: M5
   - Founder Funding: ~$182K
   - Y3 AUM: ~$140M

Files to modify:
- ui/Tables.js — Add reconciliation rows
- model/engine.js — Add validation flags if discrepancies found
- ui/Dashboard.js — Add validation status indicator

---

## BATCH 12 FOLLOW-ON PROMPT

```
Continue v10 rebuild. Execute Batch 12: Validation & Reconciliation

CONTEXT:
* Repo: https://github.com/IanhigginsEP/emergence-fund-model-v9
* Live: https://ianhigginsep.github.io/emergence-fund-model-v9/
* Batches 1-11 complete

BATCH 12 TASKS:
1. Add AUM reconciliation row to Cash Flow Statement
   - Opening AUM + Net Capital + Investment Gain = Closing AUM
   - Flag discrepancies in red

2. Add Cash reconciliation check
   - Opening Cash + Net Cash Flow = Closing Cash
   - Display variance if any

3. Validate share class totals
   - Founder AUM + Class A AUM = Total AUM
   - Add validation indicator to Share Classes tab

4. Add validation status to Dashboard
   - Green checkmark if all reconciliations pass
   - Red warning if any discrepancies

FILES TO MODIFY:
* ui/Tables.js — Add reconciliation rows
* ui/ShareClasses.js — Add validation check
* ui/Dashboard.js — Add validation status indicator

VALIDATION:
* All reconciliation rows should show $0 variance
* Validation indicator should be green
* No red flags in any tab

AFTER COMPLETING:
1. Test live site
2. Update PROGRESS_V10_REBUILD.md (mark Batch 12 complete)
3. Confirm v10 rebuild is COMPLETE
```
