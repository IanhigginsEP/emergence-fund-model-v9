# BUG LIST: Emergence Fund Model v10.16

**Created**: January 21, 2026
**Last Updated**: January 21, 2026 12:00 UTC
**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## SUMMARY

| Bug | Description | Status |
|-----|-------------|--------|
| BUG-001 | Cash Reconciliation Failing | ✅ FIXED (v10.12) |
| BUG-002 | Share Class Validation Failing | ✅ FIXED (v10.12) |
| BUG-003 | Pre-Launch Months Not Displayed | ⏳ OPEN |
| BUG-004 | M0 Cash ≠ Starting Pot | ✅ FIXED (v10.12) |
| BUG-005 | Ian Accrual Label Mismatch | ✅ FIXED (v10.15) |
| BUG-006 | Founder Funding Shows $0 | ✅ FIXED (v10.15) |
| BUG-007 | Loan Structure Confusion | ✅ FIXED (v10.15) |

---

## FIXED BUGS

### BUG-007: Loan Structure Confusion — FIXED ✅ (v10.15)
- **Issue**: Stone Park ($367K starting cash) and Shareholder Loan (~$126K owed to founders) were being confused/merged
- **Fix**: config/assumptions.js now clearly separates STONE_PARK and SHAREHOLDER_LOAN
- **Documentation**: Added docs/FINANCIAL_STRUCTURE.md explaining the two-loan structure
- **Verification**: M0 cash = $367K, Shareholder Loan shows correct ~$126K balance

### BUG-004: M0 Cash ≠ Starting Pot — FIXED ✅
- **Commit**: fb7d8b67f488f7dcee4f494dd7847f97743dd517
- **File**: model/engine.js (lines 230-242)
- **Fix**: At M0, cash initializes to startingCashUSD ($367K)
- **Verification**: M0 cash now equals $367K (Starting Pot)

### BUG-006: Founder Funding Shows $0 — FIXED ✅
- **Commit**: fb7d8b67f488f7dcee4f494dd7847f97743dd517
- **File**: model/engine.js
- **Fix**: Founder funding now correctly tracks cumulative requirements
- **Verification**: Dashboard shows ~$182K total

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
- **Severity**: MEDIUM (pre-launch toggle exists, may just need UI adjustment)
- **Evidence**: Cash Flow tab may not show M-11 to M-1 by default
- **Location**: ui/Tables.js
- **Root Cause**: Filter may exclude pre-launch months unless toggled
- **Fix Required**: Verify toggle works, ensure M-11 to M-1 visible when enabled
- **Status**: Needs verification on live site

---

## VALIDATION STATUS (v10.16)

| Metric | Status |
|--------|---------|
| ✓ AUM Reconciliation | PASS |
| ✓ Cash Reconciliation | PASS |
| ✓ Share Classes | PASS |
| Starting Pot = M0 Cash | PASS ($367K) |
| Founder Funding Tracked | PASS (~$182K) |
| Shareholder Loan Balance | PASS (~$126K) |
| Financial Structure Documented | PASS (docs/FINANCIAL_STRUCTURE.md) |
| Validation Targets Documented | PASS (docs/VALIDATION_TARGETS.md) |

---

## DOCUMENTATION ADDED (v10.16)

1. **docs/FINANCIAL_STRUCTURE.md** - Explains Stone Park vs Shareholder Loan
2. **docs/VALIDATION_TARGETS.md** - Expected outputs for testing
3. **README.md** - Updated with financial structure reference

---

## NEXT STEPS

1. Verify BUG-003 on live site (pre-launch toggle functionality)
2. Close bug list if all issues resolved
3. Model is production-ready for LP presentations
