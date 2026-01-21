# PROGRESS: v10 Rebuild

**Last Updated**: January 21, 2026
**Current Version**: v10.9
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

### Batch 10: Capital Raising Tab
- [ ] Create dedicated tab for capital inputs
- [ ] GP Organic, BDM, Broker raise inputs
- [ ] Start month configurability for each

### Batch 11: Share Class Integration
- [x] Founder Class: 0% mgmt fee, 0% perf fee
- [x] Class A: 1.5% mgmt fee, 17.5% perf fee
- [x] Class B: 1.5% mgmt fee, 17.5% perf fee
- [x] Class C: 1.5% mgmt fee, 17.5% perf fee
- **STATUS: Config done, engine integration needed**

### Batch 12: Validation & Reconciliation
- [ ] Add cash flow reconciliation check
- [ ] Add AUM reconciliation row
- [ ] Fix any discrepancies

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

### Batch 9 (Jan 21, 2026)
- Added BDM & Broker fee structure configuration
- Files modified:
  - ui/Controls.js: Added "BDM Economics" and "Broker Economics" sections
    - BDM: Start month, retainer, rev share %
    - Broker: Start month, retainer, commission rate, trailing months
  - model/engine.js: Implemented trailing commission calculation
    - Broker raises tracked in history array
    - Commission applied for N months after each raise
    - BDM retainer tracked as monthly expense
    - BDM fee share calculated on proportion of BDM-raised AUM
  - ui/Tables.js: Added distinct expense lines in Cash Flow Statement
    - BDM Costs section: Retainer + Rev Share
    - Broker Costs section: Retainer + Trailing Commission
  - config/assumptions.js: Added BDM/Broker fields to DEFAULT_ASSUMPTIONS
    - bdmStartMonth, bdmRetainer, bdmRevSharePct
    - brokerStartMonth, brokerRetainer, brokerCommissionRate, brokerTrailingMonths

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

## SESSION LOG

### Session: January 21, 2026 (Batch 9)
- Batch 9 COMPLETE
- BDM Economics:
  - Configurable start month (default M7)
  - Monthly retainer option (default $0)
  - Revenue share % of mgmt fee on BDM-raised AUM
- Broker Economics:
  - Configurable start month (default M3)
  - Monthly retainer option (default $0)
  - Trailing commission rate (default 1%)
  - Trailing months (default 12)
  - Commission calculated as: raise amount × rate / 12 per month
- Cash Flow Statement shows:
  - BDM Costs (retainer + rev share)
  - Broker Costs (retainer + trailing commission)

---

## NEXT BATCH: Batch 10 (Capital Raising Tab)

Tasks:
1. Create dedicated Capital tab in navigation
2. Add GP Organic raise configuration:
   - Amount per month (Y1 vs Y2-3)
   - Start month
3. Add BDM raise configuration:
   - Monthly amount
   - Start month
4. Add Broker raise configuration:
   - Monthly amount
   - Start month
5. Wire inputs to capital generation

Files to modify:
- index.html — add Capital tab
- Create ui/CapitalTab.js — dedicated capital config UI
- model/capital.js — capital generation logic (if not exists)

Validation:
- Total 36-month capital should match current baseline
- Changes to start months should affect capital timing correctly
