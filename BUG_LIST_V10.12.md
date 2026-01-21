# BUG LIST: Emergence Fund Model v10.12

**Created**: January 21, 2026
**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## HOW TO USE THIS DOCUMENT

1. Read this file FIRST
2. Fix bugs in order listed
3. Update status to FIXED after each fix
4. Commit changes after each fix

---

## VERIFIABLE BUGS (Things that are objectively broken)

### BUG-001: Cash Reconciliation Failing
- **Severity**: CRITICAL
- **Evidence**: Red X on dashboard validation banner
- **Location**: model/engine.js, ui/Dashboard.js
- **What's Wrong**: Opening Cash + Net Cash Flow ≠ Closing Cash
- **Status**: OPEN

### BUG-002: Share Class Validation Failing  
- **Severity**: CRITICAL
- **Evidence**: Red X on dashboard validation banner
- **Location**: model/engine.js share class calculation
- **What's Wrong**: Founder AUM + Class A AUM ≠ Total AUM
- **Status**: OPEN

### BUG-003: Pre-Launch Months Not Displayed
- **Severity**: CRITICAL
- **Evidence**: Cash Flow tab shows only M0+, no M-11 to M-1
- **Location**: ui/Tables.js filter
- **What's Wrong**: `months.filter(m => !m.isPreLaunch)` excludes pre-launch
- **Status**: OPEN

### BUG-004: M0 Cash ≠ Starting Pot
- **Severity**: CRITICAL
- **Evidence**: Dashboard shows Starting Pot $367K but Cash Balance M0 = $241K
- **Location**: model/engine.js initialization
- **What's Wrong**: $126K discrepancy between config and displayed M0 cash
- **Status**: OPEN

### BUG-005: Ian Accrual Label Mismatch
- **Severity**: HIGH
- **Evidence**: Label says "Ian Accrued Salary" but shows $459K (total shareholder loan)
- **Location**: ui/Dashboard.js display
- **What's Wrong**: Displaying shareholderLoanBalance but labeling it as Ian's salary only
- **Status**: OPEN

### BUG-006: Founder Funding Shows $0
- **Severity**: HIGH
- **Evidence**: Dashboard shows Total Founder Funding = $0
- **Location**: model/engine.js founderFundingRequired logic
- **What's Wrong**: If cash went from $367K to $241K, someone funded the $126K gap. Model shows $0.
- **Status**: OPEN

---

## NOT BUGS (Model outputs - no "correct" value known)

- **Breakeven month**: Model shows M9. This is what the model calculates. No external target exists.
- **Founder funding amount**: Model shows $0 (which is wrong per BUG-006), but the "correct" amount is unknown.
- **Y3 AUM**: Model shows $140.58M. This is a model output, not a target.

---

## FIX ORDER

1. BUG-004 (M0 cash) - likely root cause
2. BUG-003 (pre-launch display) - need visibility
3. BUG-001 (cash reconciliation) - may auto-fix after 004
4. BUG-002 (share class validation)
5. BUG-005 (Ian label)
6. BUG-006 (founder funding)

---

## FILES TO MODIFY

| File | Bugs |
|------|------|
| model/engine.js | 001, 002, 004, 006 |
| ui/Tables.js | 003 |
| ui/Dashboard.js | 005 |

---

**Last Updated**: January 21, 2026 09:00 UTC
