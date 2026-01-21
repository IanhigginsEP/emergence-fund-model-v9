# BUG LIST: Emergence Fund Model v10.12

**Created**: January 21, 2026
**Last Updated**: January 21, 2026 09:30 UTC
**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## SUMMARY

| Bug | Description | Status |
|-----|-------------|--------|
| BUG-001 | Cash Reconciliation Failing | ✅ FIXED |
| BUG-002 | Share Class Validation Failing | ✅ FIXED |
| BUG-003 | Pre-Launch Months Not Displayed | ⏳ OPEN |
| BUG-004 | M0 Cash ≠ Starting Pot | ✅ FIXED |
| BUG-005 | Ian Accrual Label Mismatch | ✅ FIXED |
| BUG-006 | Founder Funding Shows $0 | ✅ FIXED |

---

## FIXED BUGS

### BUG-004: M0 Cash ≠ Starting Pot — FIXED ✅
- **Commit**: fb7d8b67f488f7dcee4f494dd7847f97743dd517
- **File**: model/engine.js (lines 230-242)
- **Fix**: At M0, founders inject funding to restore cash to startingCashUSD
- **Verification**: M0 cash now equals $367K (Starting Pot)

### BUG-006: Founder Funding Shows $0 — FIXED ✅
- **Commit**: fb7d8b67f488f7dcee4f494dd7847f97743dd517
- **File**: model/engine.js
- **Fix**: Same as BUG-004 - founder funding now tracks pre-launch deficit
- **Verification**: Dashboard shows $123K total ($62K Ian, $62K Paul)

### BUG-002: Share Class Validation Failing — FIXED ✅
- **Commit**: fb7d8b67f488f7dcee4f494dd7847f97743dd517
- **File**: model/engine.js (line 113)
- **Fix**: Share class percentages now applied to closingAUM (was openingAUM)
- **Verification**: Green checkmark on Share Classes validation

### BUG-001: Cash Reconciliation Failing — FIXED ✅
- **Commit**: 7c685a66b659ff476195c53d339729ad952b75e6
- **File**: ui/Dashboard.js (line 73)
- **Fix**: Validation formula now: `closingCash = prevCash + netCashFlow + founderFunding`
- **Verification**: Green checkmark on Cash validation

### BUG-005: Ian Accrual Label Mismatch — FIXED ✅
- **Commit**: 7c685a66b659ff476195c53d339729ad952b75e6
- **File**: ui/Dashboard.js (line 56)
- **Fix**: Changed label from "Ian Accrued Salary" to "Shareholder Loan Balance"
- **Verification**: Label now matches displayed value

---

## OPEN BUGS

### BUG-003: Pre-Launch Months Not Displayed — OPEN ⏳
- **Severity**: HIGH
- **Evidence**: Cash Flow tab shows only M0+, no M-11 to M-1 visible
- **Location**: ui/Tables.js
- **Root Cause**: Filter `months.filter(m => !m.isPreLaunch)` excludes pre-launch months
- **Fix Required**: Remove or modify the filter to include pre-launch months
- **Status**: OPEN - Next to fix

---

## VALIDATION STATUS (Post-Fixes)

| Metric | Status |
|--------|--------|
| ✓ AUM Reconciliation | PASS |
| ✓ Cash Reconciliation | PASS |
| ✓ Share Classes | PASS |
| Starting Pot = M0 Cash | PASS ($367K) |
| Founder Funding Tracked | PASS ($123K) |
| Pre-launch months visible | FAIL (BUG-003) |

---

## FILES MODIFIED

| File | SHA | Bugs Fixed |
|------|-----|------------|
| model/engine.js | 7ea6ca0baa55aa19de777cade4c2e0c78b158e1f | 002, 004, 006 |
| ui/Dashboard.js | cea5889709ee5a86bc08dbe0a76e46208b47169b | 001, 005 |

---

## NEXT STEPS

1. Fix BUG-003: Modify ui/Tables.js to display pre-launch months M-11 to M-1
2. Verify all reconciliations pass after fix
3. Close bug list
