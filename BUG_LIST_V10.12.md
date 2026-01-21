# BUG LIST: Emergence Fund Model v10.12

**Created**: January 21, 2026
**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## HOW TO USE THIS DOCUMENT

This is a persistent bug tracking document. When starting a new session:
1. Read this file FIRST
2. Check which bugs are still OPEN
3. Fix bugs in priority order
4. Update status to FIXED after each fix
5. Commit changes to this file after each fix

---

## CRITICAL BUGS (Model Output Wrong)

### BUG-001: Cash Balance at M0 Does Not Match Starting Pot
- **Severity**: CRITICAL
- **Location**: model/engine.js
- **Expected**: M0 Cash Balance = $367K (same as Starting Pot)
- **Actual**: M0 Cash Balance = $241K
- **Impact**: $126K discrepancy - entire cash flow trajectory is wrong
- **Root Cause**: The engine starts with startingCashUSD but pre-launch expenses reduce it before M0. The $126K gap = pre-launch costs not being separately funded.
- **FIX INSTRUCTIONS**:
  1. In engine.js, the loop processes capitalInputs which include pre-launch months
  2. Pre-launch expenses reduce closingCash BEFORE M0
  3. Either: (a) Start M0 with full $367K and show pre-launch as separate, OR (b) Track founder funding during pre-launch to cover the gap
  4. The `founderFundingRequired` logic should trigger when cash goes negative during pre-launch
- **Status**: OPEN

### BUG-002: No Pre-Launch Months Displayed (M-11 to M-1)
- **Severity**: CRITICAL
- **Location**: ui/Tables.js CashflowStatement function, line ~45
- **Expected**: Cash Flow shows M-11 through M35 (47 months total)
- **Actual**: Only M0+ displayed (filter: `months.filter(m => !m.isPreLaunch)`)
- **Impact**: Cannot see pre-launch costs, Lewis salary during setup, etc.
- **FIX INSTRUCTIONS**:
  1. In ui/Tables.js, CashflowStatement filters out pre-launch: `const postLaunch = months.filter(m => !m.isPreLaunch)`
  2. Add a collapsible section ABOVE postLaunch that shows preLaunchData
  3. Or change filter to show all months and mark pre-launch visually
  4. Reference: model already generates preLaunchData array with month, expenses, closingCash, founderFundingRequired
- **Status**: OPEN

### BUG-003: Cash Reconciliation Failing
- **Severity**: CRITICAL
- **Location**: ui/Dashboard.js calculateValidationStatus(), ui/Tables.js ReconRow
- **Expected**: Opening Cash + Net Cash Flow = Closing Cash (green checkmark)
- **Actual**: Red X on Cash validation
- **FIX INSTRUCTIONS**:
  1. This is a SYMPTOM of BUG-001
  2. The reconciliation checks `prevCash + netCashFlow = closingCash`
  3. At M0, prevCash should be startingCashUSD ($367K) but the engine has already reduced it
  4. Fix BUG-001 first, then verify this passes
- **Status**: OPEN (fix BUG-001 first)

### BUG-004: Share Class Validation Failing
- **Severity**: CRITICAL
- **Location**: model/engine.js lines 84-113, ui/Dashboard.js
- **Expected**: Founder AUM + Class A AUM = Total AUM
- **Actual**: Red X on Share Classes validation
- **FIX INSTRUCTIONS**:
  1. In engine.js, share classes are calculated from openingAUM:
     - `founderAUM = openingAUM * founderPct`
     - `classAAUM = openingAUM * classAPct`
  2. But closingAUM != openingAUM (it includes netCapital + investmentGain)
  3. The validation in Dashboard.js checks: `sumClasses = founder.aum + classA.aum + classB.aum + classC.aum`
  4. This sum equals openingAUM, not closingAUM
  5. FIX: Either validate against openingAUM, OR calculate share class AUM from closingAUM
- **Status**: OPEN

### BUG-005: Shareholder Loan Balance Wrong
- **Severity**: CRITICAL
- **Location**: model/engine.js getInitialShareholderLoan(), line ~260
- **Expected**: Initial = sum of config items (~$269K), then accumulates accruals
- **Actual**: Shows $369K at M0, growing to $459K
- **Config items**: 10K+15K+8K+6K+30K+100K+100K = $269K
- **FIX INSTRUCTIONS**:
  1. Check getInitialShareholderLoan() - it filters OUT "US Feeder Fund" correctly
  2. Initial should be: 10K + 15K + 8K + 6K + 100K + 100K = $239K (no US Feeder)
  3. BUT if US Feeder month is null, the 30K shouldn't be included anyway
  4. The extra $100K+ may be from pre-launch accruals being added twice
  5. Trace: `shareholderLoanBalance = prev.shareholderLoanBalance + ianAccrual + paulAccrual + marketingAccrual + travelAccrual`
  6. During pre-launch, these accruals are happening but may not be correctly initialized
- **Status**: OPEN

### BUG-006: Ian Accrued Salary Display Wrong ($459K)
- **Severity**: CRITICAL  
- **Location**: ui/Dashboard.js "Below the Line" section, line ~50
- **Expected**: Show Ian's salary accrual only (~$45K for 9 months)
- **Actual**: $459K displayed (showing shareholderLoanBalance)
- **FIX INSTRUCTIONS**:
  1. In Dashboard.js, the display shows: `{fmt(lastMonth.shareholderLoanBalance || 0)}`
  2. But label says "Ian Accrued Salary"
  3. This is WRONG - shareholderLoanBalance includes Ian + Paul + Marketing + Travel
  4. FIX: Track ianAccrualCumulative separately in engine.js, OR
  5. Sum ianAccrual field across all months in Dashboard.js
- **Status**: OPEN

### BUG-007: Total Founder Funding Shows $0
- **Severity**: CRITICAL
- **Location**: model/engine.js founderFundingRequired logic
- **Expected**: ~$182K total founder funding required
- **Actual**: $0 displayed
- **FIX INSTRUCTIONS**:
  1. In engine.js, founderFundingRequired only triggers when `closingCash < 0`
  2. With $367K starting cash and accruals rolling to SL, cash may never go negative
  3. BUT the model shows cash at M0 = $241K, suggesting $126K was needed
  4. Check: Is founderFundingRequired being calculated during pre-launch?
  5. The preLaunchData array has founderFundingRequired field - check if it's being set
  6. The cumulativeFounderFunding should accumulate from pre-launch through post-launch
- **Status**: OPEN

---

## HIGH PRIORITY BUGS

### BUG-008: Breakeven Shows Month 9 But Target is Month 5
- **Severity**: HIGH
- **Location**: model/engine.js breakeven detection, line ~200
- **Expected**: Breakeven at ~M5 per validation targets
- **Actual**: Breakeven at M9
- **FIX INSTRUCTIONS**:
  1. Breakeven = first month where 3-month rolling EBITDA > 0
  2. Current EBITDA trajectory: ($30K) → ($18K) → ($15K) → ($13K) → ($15K) → ($6K) → ($2K) → $4K...
  3. This depends on revenue vs expenses balance
  4. May be consequence of other bugs - fix BUG-001 through BUG-007 first
  5. Then verify if breakeven timing improves
- **Status**: OPEN (verify after other fixes)

---

## VALIDATION TARGETS

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Pre-launch months visible | 12 | 0 | ❌ FAIL |
| Starting cash (M0) | $367K | $241K | ❌ FAIL |
| Breakeven | ~M5 | M9 | ❌ FAIL |
| Founder Funding | ~$182K | $0 | ❌ FAIL |
| Y3 AUM | ~$140M | $140.58M | ✅ PASS |
| AUM Reconciliation | Pass | Pass | ✅ PASS |
| Cash Reconciliation | Pass | FAIL | ❌ FAIL |
| Share Class Validation | Pass | FAIL | ❌ FAIL |

---

## FIX ORDER (Do in this sequence)

1. **BUG-001** - Fix cash initialization (root cause)
2. **BUG-002** - Show pre-launch months
3. **BUG-007** - Fix founder funding tracking
4. **BUG-005** - Fix shareholder loan calculation
5. **BUG-006** - Fix Ian accrual display
6. **BUG-004** - Fix share class validation
7. **BUG-003** - Verify cash reconciliation (should auto-fix)
8. **BUG-008** - Verify breakeven (should improve)

---

## FILES TO MODIFY

| File | Bugs | Changes Needed |
|------|------|----------------|
| model/engine.js | 001, 003, 004, 005, 007, 008 | Cash init, SL calc, founder funding, share class AUM |
| ui/Tables.js | 002 | Add pre-launch section |
| ui/Dashboard.js | 006 | Fix Ian accrual display field |

---

## TESTING AFTER FIXES

After each fix:
1. Refresh live site
2. Check validation banner (should turn green)
3. Verify specific bug is resolved
4. Update this document with FIXED status
5. Commit updated bug list

---

**Last Updated**: January 21, 2026 08:55 UTC
