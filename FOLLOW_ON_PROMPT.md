# FOLLOW-ON PROMPT: Fix v10.12 Bugs

Copy and paste this entire prompt into a new Claude session.

---

## CONTEXT

Fund P&L model with bugs:
- **Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
- **Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/
- **Bug List**: `BUG_LIST_V10.12.md` in repository

## YOUR TASK

1. Fetch and read `BUG_LIST_V10.12.md` from the repository
2. Fix bugs in the order listed
3. For each bug: fetch file → fix → push → update bug list status → verify on live site
4. Keep files under 150 lines

## VERIFIABLE BUGS TO FIX

1. **BUG-004**: M0 cash shows $241K but Starting Pot is $367K (file: model/engine.js)
2. **BUG-003**: Pre-launch months M-11 to M-1 not displayed (file: ui/Tables.js)
3. **BUG-001**: Cash reconciliation failing - red X on dashboard (file: model/engine.js)
4. **BUG-002**: Share class validation failing - red X on dashboard (file: model/engine.js)
5. **BUG-005**: "Ian Accrued Salary" label shows $459K total SL balance (file: ui/Dashboard.js)
6. **BUG-006**: Founder Funding shows $0 but $126K gap exists (file: model/engine.js)

## WHAT SUCCESS LOOKS LIKE

- All validation checks GREEN (AUM ✓, Cash ✓, Share Classes ✓)
- Pre-launch months visible in Cash Flow tab
- M0 Cash Balance = Starting Pot ($367K)
- Labels match what they display

## START

Fetch `BUG_LIST_V10.12.md` and begin fixing BUG-004.
