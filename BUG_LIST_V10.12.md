# BUG LIST: Emergence Fund Model v10.12

**Created**: January 21, 2026
**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## CRITICAL BUGS (Model Output Wrong)

### BUG-001: Cash Balance at M0 Does Not Match Starting Pot
- **Severity**: CRITICAL
- **Location**: model/engine.js, ui/Dashboard.js
- **Expected**: M0 Cash Balance = $367K (same as Starting Pot)
- **Actual**: M0 Cash Balance = $241K
- **Impact**: $126K discrepancy - entire cash flow trajectory is wrong
- **Root Cause**: TBD - likely engine.js initialization or pre-launch cost deduction
- **Status**: OPEN

### BUG-002: No Pre-Launch Months Displayed (M-11 to M-1)
- **Severity**: CRITICAL
- **Location**: ui/Tables.js, model/engine.js
- **Expected**: Cash Flow shows M-11 through M35 (47 months total)
- **Actual**: Only M0+ displayed
- **Impact**: Cannot see pre-launch costs, Lewis salary during setup, etc.
- **Root Cause**: TBD - filter excluding isPreLaunch months
- **Status**: OPEN

### BUG-003: Cash Reconciliation Failing
- **Severity**: CRITICAL
- **Location**: ui/Dashboard.js calculateValidationStatus()
- **Expected**: Opening Cash + Net Cash Flow = Closing Cash (green checkmark)
- **Actual**: Red X on Cash validation
- **Impact**: Model integrity compromised
- **Root Cause**: TBD - likely related to BUG-001
- **Status**: OPEN

### BUG-004: Share Class Validation Failing
- **Severity**: CRITICAL
- **Location**: ui/Dashboard.js, model/engine.js (share class allocation)
- **Expected**: Founder AUM + Class A AUM = Total AUM
- **Actual**: Red X on Share Classes validation
- **Impact**: Fee calculations may be wrong
- **Root Cause**: TBD - share class allocation logic
- **Status**: OPEN

### BUG-005: Shareholder Loan Balance Wrong
- **Severity**: CRITICAL
- **Location**: model/engine.js, config/assumptions.js SHAREHOLDER_LOAN
- **Expected**: Initial balance from config items, then accumulates accruals
- **Actual**: Shows $369K at M0, growing to $459K - seems to include too much
- **Observed Values**:
  - M0: $369K
  - M7: $459K (plateau)
  - Config initial items sum: ~$269K (10K+15K+8K+6K+30K+100K+100K)
- **Impact**: Below-the-line reporting is wrong
- **Root Cause**: TBD - may be double-counting or wrong initial calculation
- **Status**: OPEN

### BUG-006: Ian Salary Accrual Showing $459K (Way Too High)
- **Severity**: CRITICAL  
- **Location**: ui/Dashboard.js "Ian Accrued Salary" display
- **Expected**: ~$45K (9 months × $5K pre-breakeven)
- **Actual**: $459K displayed
- **Impact**: Misleading founder liability display
- **Root Cause**: Displaying shareholderLoanBalance instead of just Ian's accrual
- **Status**: OPEN

### BUG-007: Total Founder Funding Shows $0
- **Severity**: CRITICAL
- **Location**: model/engine.js, ui/Dashboard.js
- **Expected**: ~$182K total founder funding required
- **Actual**: $0 displayed
- **Impact**: Key validation target not met
- **Root Cause**: TBD - founderFundingRequired calculation or accumulation
- **Status**: OPEN

---

## HIGH PRIORITY BUGS (Display/UX Issues)

### BUG-008: Breakeven Shows Month 9 But Target is Month 5
- **Severity**: HIGH
- **Location**: model/engine.js breakeven detection
- **Expected**: Breakeven at ~M5 per validation targets
- **Actual**: Breakeven at M9
- **Impact**: Key validation target not met
- **Root Cause**: May be consequence of other bugs affecting EBITDA
- **Status**: OPEN

### BUG-009: Y3 AUM Target Mismatch
- **Severity**: HIGH
- **Location**: model/engine.js
- **Expected**: Y3 AUM ~$140.58M per validation targets
- **Actual**: NAV (M35) shows $140.58M - need to verify this is correct
- **Impact**: Need to confirm if this matches after other fixes
- **Status**: VERIFY AFTER FIXES

---

## MEDIUM PRIORITY BUGS (Cosmetic/Display)

### BUG-010: Operating Revenue Shows "-" at M0
- **Severity**: MEDIUM
- **Location**: ui/Tables.js
- **Expected**: $0 displayed (not dash)
- **Actual**: "-" displayed
- **Impact**: Minor - just formatting preference
- **Status**: OPEN

### BUG-011: EBITDA Negative Formatting Inconsistent
- **Severity**: MEDIUM
- **Location**: Various UI components
- **Expected**: All negatives in red with brackets $(30K)
- **Actual**: Some showing correctly, some not
- **Impact**: Visual consistency
- **Status**: OPEN

---

## VALIDATION TARGETS (From PROGRESS_V10_REBUILD.md)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Pre-launch months | 12 | 0 visible | ❌ FAIL |
| Starting cash (M0) | $367K | $241K | ❌ FAIL |
| Breakeven | ~M5 | M9 | ❌ FAIL |
| Founder Funding | ~$182K | $0 | ❌ FAIL |
| Y3 AUM | ~$140M | $140.58M | ✅ PASS (verify) |
| AUM Reconciliation | Pass | Pass | ✅ PASS |
| Cash Reconciliation | Pass | FAIL | ❌ FAIL |
| Share Class Validation | Pass | FAIL | ❌ FAIL |

---

## FIX PRIORITY ORDER

1. BUG-001 (Cash M0) - This is the root cause of many other issues
2. BUG-002 (Pre-launch months) - Required to see full picture
3. BUG-005 (Shareholder Loan) - Affects BUG-006
4. BUG-006 (Ian Accrual display) - May be fixed by BUG-005
5. BUG-007 (Founder Funding) - Critical validation target
6. BUG-003 & BUG-004 (Reconciliation) - Should auto-fix after above
7. BUG-008 (Breakeven) - Should improve after cash fixes

---

## FILES TO MODIFY

1. **model/engine.js** - Core calculation loop
   - Starting cash initialization
   - Pre-launch month generation
   - Shareholder loan accumulation
   - Founder funding calculation

2. **config/assumptions.js** - Check SHAREHOLDER_LOAN config

3. **ui/Tables.js** - Pre-launch month display

4. **ui/Dashboard.js** - Ian Accrued Salary display (uses wrong field)

---

## INVESTIGATION NOTES

### From Screenshot Analysis:
- Cash Balance trajectory: $241K → $223K → $208K → $195K → $180K → $174K → $172K → $176K → $190K → $206K → $212K → $224K → $235K → $256K → $282K → $308K
- This suggests cash is INCREASING over time (good) but starting point is wrong
- Pre-launch costs may have been deducted from $367K to get $241K ($126K difference)
- Lewis at $7K × 12 months = $84K, plus other pre-launch = could explain gap

### From Code Review:
- engine.js line: `const startingCashUSD = assumptions.startingCashUSD || 367000;`
- But cash at M0 doesn't match - where is it being reduced?
- Need to trace preLaunchData calculation

---

**Last Updated**: January 21, 2026 08:50 UTC
