# EXHAUSTIVE BUG FIX PROMPT - Emergence Fund Model v10.12

**Copy this ENTIRE document into a new Claude session.**

---

## PROJECT OVERVIEW

**What this is**: A 36-month P&L projection model for Emergence Partners, a DIFC-based investment fund.

**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/
**Architecture**: Modular React app, no file over 150 lines, uses window.FundModel namespace

**Key files**:
```
config/assumptions.js    - All editable inputs (startingCashUSD: 367000)
config/scenarios.js      - Preset scenarios (Base, Downside, Upside 1, Upside 2)
config/capital.js        - Capital raise schedule by month
model/engine.js          - Core calculation loop (MOST BUGS ARE HERE)
model/summaries.js       - Annual aggregation functions
model/formatters.js      - Number formatting (fmt, fmtPct)
ui/Dashboard.js          - KPI cards, validation banner
ui/Tables.js             - Cash flow statement, AUM table
ui/Charts.js             - Visualizations
ui/App.js                - Main shell, tab navigation
```

---

## MANDATORY WORKFLOW

For EVERY bug fix, you MUST follow this exact sequence:

### Step 1: FETCH
```
Fetch the file from GitHub using github:get_file_contents
```

### Step 2: UNDERSTAND
```
Read the relevant code section
Identify the exact lines causing the bug
Write down what the code currently does vs what it should do
```

### Step 3: FIX
```
Write the corrected code
Keep the fix minimal - don't rewrite unrelated code
Ensure file stays under 150 lines
```

### Step 4: PUSH
```
Push to GitHub using github:create_or_update_file
Include the SHA from the fetch
Use descriptive commit message: "Fix BUG-XXX: [description]"
```

### Step 5: WAIT
```
GitHub Pages deploys in ~2 minutes
Say "Waiting for deploy..." and actually wait
```

### Step 6: TEST
```
Use browser tools to take screenshot of live site
Verify the specific bug is fixed using the TEST CRITERIA for that bug
```

### Step 7: DOCUMENT
```
Update BUG_LIST_V10.12.md in the repository:
- Change status from OPEN to FIXED
- Add "Fixed in commit: [sha]"
- Add "Verified: [what you checked]"
```

### Step 8: NEXT
```
Only after documenting, move to the next bug
```

---

## BUG LIST WITH EXACT DETAILS

### BUG-004: M0 Cash Does Not Match Starting Pot [FIX FIRST]

**File**: model/engine.js
**Evidence**: Dashboard shows "Starting Pot: $367K" but "Cash Balance (M0): $241K"
**Discrepancy**: $126K

**What's happening**:
The engine initializes with startingCashUSD = 367000 (from config/assumptions.js).
But before M0, the pre-launch loop runs and deducts expenses.
By the time M0 starts, closingCash has already been reduced.

**What should happen**:
Either:
(a) M0 should start with $367K and pre-launch costs shown separately, OR
(b) Founder funding should cover the $126K gap during pre-launch

**TEST CRITERIA**:
- Screenshot Dashboard tab
- "Cash Balance (M0)" should equal "Starting Pot" ($367K)
- OR if pre-launch depletes cash, "Founder Funding" should show ~$126K

---

### BUG-003: Pre-Launch Months Not Displayed

**File**: ui/Tables.js
**Evidence**: Cash Flow tab shows only M0 through M35. No M-11 to M-1 visible.
**Line to find**: Look for `filter(m => !m.isPreLaunch)` or similar

**What's happening**:
The CashflowStatement component filters out pre-launch months before rendering.

**What should happen**:
Pre-launch months (M-11 to M-1) should be visible, either:
(a) In a collapsible section above the main table, OR
(b) Integrated into the main table with visual distinction

**TEST CRITERIA**:
- Screenshot Cash Flow tab
- Should see months M-11, M-10, M-9... M-1 before M0
- Pre-launch months should show Lewis salary ($7K/mo) and other setup costs

---

### BUG-001: Cash Reconciliation Failing

**File**: model/engine.js and/or ui/Dashboard.js
**Evidence**: Red X next to "Cash" in validation banner on Dashboard

**What's happening**:
The validation checks: `previousClosingCash + netCashFlow === closingCash`
This is failing for at least one month.

**Likely cause**: Related to BUG-004. If M0 opening cash doesn't match the previous closing cash (from pre-launch or initialization), reconciliation fails.

**TEST CRITERIA**:
- Screenshot Dashboard tab
- Validation banner should show green checkmark (✓) next to "Cash"
- NOT red X (✗)

---

### BUG-002: Share Class Validation Failing

**File**: model/engine.js
**Evidence**: Red X next to "Share Classes" in validation banner on Dashboard

**What's happening**:
The validation checks: `founderAUM + classAAUM + classBUM + classCAUM === totalAUM`
This sum doesn't equal total AUM.

**Likely cause**: Share class AUM is calculated from openingAUM but validation compares to closingAUM, which includes new capital and gains.

**What should happen**:
Share class percentages should be applied to closingAUM, not openingAUM.

**TEST CRITERIA**:
- Screenshot Dashboard tab
- Validation banner should show green checkmark (✓) next to "Share Classes"
- NOT red X (✗)

---

### BUG-005: Ian Accrual Label Shows Wrong Value

**File**: ui/Dashboard.js
**Evidence**: "Ian Accrued Salary" displays $459K. Ian's salary is $5K/mo pre-breakeven. Even at 36 months that's only $180K max.

**What's happening**:
The label says "Ian Accrued Salary" but the code displays `shareholderLoanBalance` which includes:
- Ian's accrued salary
- Paul's accrued salary  
- Marketing accruals
- Travel accruals
- Initial shareholder loan items

**What should happen**:
Either:
(a) Change the label to "Total Shareholder Loan Balance", OR
(b) Track and display Ian's accrual separately

**TEST CRITERIA**:
- Screenshot Dashboard "Below the Line" section
- Either label matches the value shown, OR
- Value shown is reasonable for Ian's salary alone (~$45K for 9 months at $5K/mo)

---

### BUG-006: Founder Funding Shows $0

**File**: model/engine.js
**Evidence**: Dashboard shows "Total Founder Funding: $0" but cash dropped from $367K to $241K

**What's happening**:
The founderFundingRequired logic only triggers when closingCash < 0.
But cash is being reduced by pre-launch expenses without triggering founder funding.
The $126K gap is not being tracked as founder funding.

**What should happen**:
When pre-launch expenses exceed available cash, founder funding should be recorded.
The cumulative founder funding should reflect all cash injections needed.

**TEST CRITERIA**:
- Screenshot Dashboard tab
- "Total Founder Funding" should NOT be $0 if cash was needed during pre-launch
- Value should approximately equal the gap between starting pot and M0 cash

---

## FIX ORDER

1. BUG-004 (M0 cash) - Root cause, fix first
2. BUG-003 (pre-launch display) - Need visibility to debug
3. BUG-006 (founder funding) - Depends on understanding pre-launch
4. BUG-001 (cash reconciliation) - May auto-fix after 004
5. BUG-002 (share class validation) - Independent issue
6. BUG-005 (Ian label) - Display-only fix

---

## RULES

1. **Do NOT invent validation targets** - There is no "correct" breakeven month or AUM target. Only fix verifiable bugs.

2. **Do NOT rewrite working code** - Make minimal, surgical fixes.

3. **Do NOT skip documentation** - Update BUG_LIST_V10.12.md after EACH fix.

4. **Do NOT claim something is fixed without testing** - Take a screenshot and verify.

5. **Keep files under 150 lines** - This is a hard architectural constraint.

6. **Use window.FundModel namespace** - No ES6 import/export in UI files.

---

## STARTING INSTRUCTIONS

1. Fetch `BUG_LIST_V10.12.md` from the repository to see current status
2. Fetch `model/engine.js` from the repository
3. Find where startingCashUSD is used and trace how it becomes $241K at M0
4. Fix BUG-004
5. Follow the MANDATORY WORKFLOW for each subsequent bug

**BEGIN NOW.**
