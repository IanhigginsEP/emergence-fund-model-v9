# PROGRESS: v10 Rebuild

**Last Updated**: January 21, 2026 12:00 UTC
**Current Version**: v10.16
**Status**: ✅ COMPLETE + DOCUMENTED

## Repository
https://github.com/IanhigginsEP/emergence-fund-model-v9

## Live Site
https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## v10.15-v10.16 UPDATES (January 21, 2026)

### Batch 13: Cash & Loan Tracking Fix ✅ COMPLETE
- [x] Separated Stone Park ($367K starting cash) from Shareholder Loan (~$126K owed to founders)
- [x] config/assumptions.js - STONE_PARK and SHAREHOLDER_LOAN now clearly separated
- [x] model/engine.js - Cash initialization fixed at $367K
- [x] model/summaries.js - Added getStoneParkStatus(), getShareholderLoanStatus()
- [x] ui/Dashboard.js - KPI cards now show correct loan balances

### Batch 14: Documentation ✅ COMPLETE
- [x] docs/FINANCIAL_STRUCTURE.md - Explains two-loan structure
- [x] docs/VALIDATION_TARGETS.md - Expected outputs for testing
- [x] README.md - Updated with financial structure reference
- [x] BUG_LIST_V10.12.md - Updated with fix status

---

## THE FINANCIAL STRUCTURE (MEMORIZE THIS)

**Two separate loan balances that should NEVER be confused:**

| Loan | Direction | Amount | Purpose |
|------|-----------|--------|--------|
| **Stone Park** | TO the fund | $367K | Starting cash at M0 |
| **Shareholder Loan** | TO founders | ~$126K+ | Pre-launch costs owed to Ian |

**Key principle**: The $367K is the starting cash. It's not injected when needed — it's there from M0. Cash CAN go negative as a warning output.

See `docs/FINANCIAL_STRUCTURE.md` for full explanation.

---

## VALIDATION TARGETS

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Pre-launch months | 12 | 12 (Mar 2025 - Feb 2026) | ✅ |
| Projection months | 36 | 36 | ✅ |
| Starting cash (M0) | $367K | $367K | ✅ |
| Breakeven | M5-M7 | ~M5-M7 | ✅ |
| Founder Funding | ~$182K | ~$182K | ✅ |
| Shareholder Loan | ~$126K | ~$126K | ✅ |
| Y3 AUM | $140.58M | ~$140M | ✅ |
| AUM Reconciliation | $0 variance | $0 variance | ✅ |
| Cash Reconciliation | $0 variance | $0 variance | ✅ |
| Share Class Validation | Passes | Passes | ✅ |
| Financial Structure Documented | Yes | Yes | ✅ |

---

## ALL BATCHES COMPLETE

### Phase 1: Core Model (v10.0-v10.12)
- Batch 1-3: Initial setup and engine
- Batch 4: Founder salary toggles
- Batch 5: Lewis & Adrian corrections
- Batch 6: Marketing & Travel roll-up
- Batch 7: Shareholder Loan display
- Batch 8: US Feeder Fund
- Batch 9: BDM & Broker fee structure
- Batch 10: Capital Raising tab
- Batch 11: Share Class integration
- Batch 12: Validation & Reconciliation

### Phase 2: Cash & Loan Fix (v10.13-v10.15)
- Batch 13: Cash & Loan tracking separation

### Phase 3: Documentation (v10.16)
- Batch 14: Full documentation
  - docs/FINANCIAL_STRUCTURE.md
  - docs/VALIDATION_TARGETS.md
  - README.md update
  - Bug list update

---

## REMAINING ISSUE

### BUG-003: Pre-Launch Months Display
- **Status**: Needs verification on live site
- **Description**: Toggle may exist but needs to be tested
- **Priority**: Medium (core model is correct)

---

## FOR FUTURE SESSIONS

1. **Always read docs/FINANCIAL_STRUCTURE.md first** - It explains the two-loan structure
2. **Check docs/VALIDATION_TARGETS.md** - Verify outputs match targets
3. **M0 cash MUST equal $367K** - This is the starting pot from Stone Park
4. **Shareholder Loan starts at ~$126K** - Pre-launch costs owed to Ian
5. **Cash CAN go negative** - This is a warning, not a hard limit

---

## v10.16 COMPLETE ✅

All batches implemented and documented:
- Core calculation engine with share class fees
- Comprehensive validation and reconciliation
- Full UI with all tabs functional
- Financial structure clearly documented
- Validation targets documented

**Final Version**: v10.16
**Status**: Production Ready
