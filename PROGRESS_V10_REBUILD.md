# PROGRESS: v10 Rebuild

**Last Updated**: January 21, 2026
**Current Version**: v10.10
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

### Batch 11: Share Class Integration
- [x] Founder Class: 0% mgmt fee, 0% perf fee (config done)
- [x] Class A: 1.5% mgmt fee, 17.5% perf fee (config done)
- [x] Class B: 1.5% mgmt fee, 17.5% perf fee (config done)
- [x] Class C: 1.5% mgmt fee, 17.5% perf fee (config done)
- [ ] **ENGINE INTEGRATION NEEDED**: Apply share class fees to revenue calculations

### Batch 12: Validation & Reconciliation
- [ ] Add cash flow reconciliation check
- [ ] Add AUM reconciliation row
- [ ] Fix any discrepancies

---

## REMAINING BATCHES: 2

| Batch | Description | Status |
|-------|-------------|--------|
| **Batch 11** | Share Class Integration | Engine work needed |
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

### Batch 10 (Jan 21, 2026)
- Created ui/CapitalTab.js with full capital configuration
- Files modified:
  - ui/CapitalTab.js: NEW - dedicated capital raising UI
    - Summary cards: GP Organic, BDM, Broker, Redemptions, Net
    - GP Organic config: M0-M3, M4-M11, M12+ amounts
    - BDM config: Start month, monthly amount
    - Broker config: Start month, monthly amount
    - Capital schedule table (Year 1 view)
    - Redemption schedule display
  - config/capital.js: Updated to read from assumptions
    - gpOrganicM0to3, gpOrganicM4to11, gpOrganicM12plus
    - bdmCapitalStartMonth, bdmMonthlyCapital
    - brokerCapitalStartMonth, brokerMonthlyCapital
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

## NEXT BATCH: Batch 11 (Share Class Integration)

**Status**: Config exists in config/share-classes.js, engine integration needed

Tasks:
1. Integrate share class definitions into engine.js revenue calculation
2. Track AUM by share class (or weighted approach)
3. Apply correct mgmt fee rate per class
4. Apply correct carry rate per class
5. Display per-class breakdown in Dashboard or dedicated tab

Files to modify:
- model/engine.js — apply share class fees to revenue
- ui/Dashboard.js or new ui/ShareClasses.js — display breakdown
- Potentially config/share-classes.js — verify structure

Share Class Reference (from PPM):
| Class | Mgmt Fee | Carry | Public Weight |
|-------|----------|-------|---------------|
| Founder | 0% | 0% | 60% |
| Class A | 1.5% | 17.5% | 60% |
| Class B | 1.5% | 17.5% | 0% (private) |
| Class C | 1.5% | 17.5% | 100% (public) |

Validation:
- Founder class AUM should generate $0 mgmt fee
- Weighted average fee should match current model (if all Class A)
