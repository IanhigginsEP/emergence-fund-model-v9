# BUG LIST: Emergence Fund Model v10.17

**Created**: January 21, 2026
**Last Updated**: January 21, 2026 13:00 UTC
**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## CRITICAL BUGS (v10.17)

### BUG-101: Cumulative Founder Funding Shows €1.12M (WRONG)
- **Severity**: CRITICAL
- **Location**: model/engine.js
- **Expected**: ~$182K total founder funding
- **Actual**: €1.12M displayed
- **Root Cause**: `cumulativeFounderFunding` accumulates the FULL deficit each month, not the DELTA
- **Current Code**:
  ```javascript
  cumulativeFounderFunding = prev.cumulativeFounderFunding + founderFundingRequired;
  ```
- **Fix Required**: Track delta of deficit, not absolute value:
  ```javascript
  const prevDeficit = prev.closingCash < 0 ? Math.abs(prev.closingCash) : 0;
  const currDeficit = closingCash < 0 ? Math.abs(closingCash) : 0;
  founderFundingRequired = currDeficit > prevDeficit ? currDeficit - prevDeficit : 0;
  cumulativeFounderFunding = prev.cumulativeFounderFunding + founderFundingRequired;
  ```
- **Status**: OPEN

### BUG-102: Adrian Cost Duplication (FIFTH TIME REPORTED!)
- **Severity**: CRITICAL
- **Location**: config/assumptions.js
- **Issue**: Adrian is the Chairman. He is defined TWICE:
  - Line ~X: `adrian: { monthlySalary: 1667, startMonth: -6 }` (WRONG - DELETE THIS)
  - Line ~Y: `chairman: { quarterlyAmount: 5000, startMonth: 4 }` (CORRECT - KEEP)
- **Impact**: ~$2K/month extra expense incorrectly added
- **Fix Required**:
  1. DELETE the `adrian` object entirely from assumptions.js
  2. DELETE `adrianSalary` calculation from engine.js
  3. Keep ONLY the `chairman` quarterly payment
- **Status**: OPEN

### BUG-103: Rounding Precision Wrong
- **Severity**: HIGH
- **Location**: utils/formatters.js or similar
- **Expected**: Numbers rounded to one decimal place (e.g., $182.5K)
- **Actual**: Numbers rounded to nearest thousand (e.g., $183K)
- **Impact**: Cash movement visibility compromised, inaccuracies compound
- **Fix Required**: Change from `Math.round(v/1000)` to `(v/1000).toFixed(1)`
- **Status**: OPEN

---

## HIGH PRIORITY BUGS (Charts)

### BUG-104: AUM Chart Missing Milestone Annotations
- **Severity**: HIGH
- **Location**: ui/Charts.js
- **Expected**: Target AUM values annotated directly on curve at M12, M24, M36
- **Actual**: No annotations
- **Fix Required**: Add text labels at M12 (~$30M), M24 (~$95M), M36 (~$140M)
- **Status**: OPEN

### BUG-105: Cash Position Chart Broken
- **Severity**: HIGH
- **Location**: ui/Charts.js or ui/JCurve.js
- **Issues**:
  1. Shows -$114K with no context
  2. No clear start point (should show $367K at M0)
  3. No projected minimum balance marker
  4. No recovery point marker
  5. "Maximum utilization of 481K" makes no sense
  6. Weird/unclear X and Y axes
- **Fix Required**:
  - Add annotation at M0: "$367K Start"
  - Calculate and mark minimum cash point
  - Calculate and mark breakeven/recovery point
  - Fix axis labels and grid
- **Status**: OPEN

---

## MEDIUM PRIORITY BUGS (UI/UX)

### BUG-106: Cash Flow Table Presentation Confusing
- **Severity**: MEDIUM
- **Location**: ui/Tables.js
- **Issues**:
  1. "Cumulative Funding" shows as positive number (confusing - is it deficit or funding?)
  2. Balance increasing until month 15 (why?)
  3. Missing "Opening Balance" row showing $367K at M0
- **Fix Required**:
  - Add "Opening Balance" row at M0 = $367K
  - Rename "Cumulative Funding" to "Cash Deficit" or show as negative
  - Or clearly label as "Funding Required (if negative)"
- **Status**: OPEN

### BUG-107: No Custom Scenario Feature
- **Severity**: MEDIUM
- **Location**: ui/Scenarios.js
- **Expected**: 5th scenario type: "Custom" where user sets AUM month-by-month for 36 months
- **Actual**: Only preset scenarios available
- **Fix Required**: Add custom scenario with 36 AUM input fields or import
- **Status**: OPEN

### BUG-108: Redemptions Not Editable in UI
- **Severity**: MEDIUM
- **Location**: ui/Controls.js or ui/Assumptions.js
- **Issue**: Redemptions can be toggled on/off but not edited
- **Message says**: "edit in config" but user doesn't speak Markdown
- **Fix Required**: Add UI controls for redemption schedule (month/amount pairs)
- **Status**: OPEN

---

## PREVIOUSLY FIXED (Reference)

| Bug | Description | Fixed In |
|-----|-------------|----------|
| BUG-001 | Cash Reconciliation | v10.12 |
| BUG-002 | Share Class Validation | v10.12 |
| BUG-004 | M0 Cash ≠ Starting Pot | v10.12 |
| BUG-005 | Ian Accrual Label | v10.15 |
| BUG-006 | Founder Funding Shows $0 | v10.15 |
| BUG-007 | Loan Structure Confusion | v10.15 |

---

## FIX PRIORITY ORDER

1. **BUG-102** (Adrian duplication) - Simple delete, prevents ongoing cost error
2. **BUG-101** (Cumulative funding) - Core calculation fix
3. **BUG-103** (Rounding) - Affects all number displays
4. **BUG-105** (Cash chart) - High visibility, confusing
5. **BUG-104** (AUM annotations) - User requested
6. **BUG-106** (Cash flow table) - Presentation fix
7. **BUG-107** (Custom scenario) - Feature request
8. **BUG-108** (Redemptions UI) - Feature request

---

## VALIDATION TARGETS (Must Pass After Fixes)

| Metric | Target |
|--------|--------|
| M0 Starting Cash | $367,000 (exact) |
| Pre-launch costs | ~$126,000 |
| Breakeven | M5-M7 |
| Total Founder Funding | ~$182K |
| Y2 AUM | ~$95M |
| Y3 AUM | ~$140M |
| All reconciliations | Green ✓ |
| Adrian cost | £5K quarterly ONLY |

---

## FILES TO MODIFY

| File | Bugs |
|------|------|
| config/assumptions.js | BUG-102 |
| model/engine.js | BUG-101, BUG-102 |
| utils/formatters.js | BUG-103 |
| ui/Charts.js | BUG-104, BUG-105 |
| ui/Tables.js | BUG-106 |
| ui/Scenarios.js | BUG-107 |
| ui/Controls.js | BUG-108 |
