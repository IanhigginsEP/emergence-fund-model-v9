# FOLLOW-ON PROMPT: Fix v10.12 Bugs

Copy and paste this entire prompt into a new Claude session to continue fixing bugs.

---

## CONTEXT

I have a fund P&L model at:
- **Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
- **Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

The model has 8 critical bugs documented in `BUG_LIST_V10.12.md` in the repository.

## YOUR TASK

1. **First**: Read `BUG_LIST_V10.12.md` from the repository to see all open bugs and fix instructions
2. **Fix bugs in order**: BUG-001 → BUG-002 → BUG-007 → BUG-005 → BUG-006 → BUG-004 → BUG-003 → BUG-008
3. **For each bug**:
   - Fetch the relevant file from GitHub
   - Make the specific fix described in the bug list
   - Push the fix to GitHub
   - Update BUG_LIST_V10.12.md to mark as FIXED
   - Verify on live site (wait 2 min for GitHub Pages deploy)

## KEY FILES

- `model/engine.js` - Core calculation (most bugs are here)
- `ui/Tables.js` - Cash flow display (BUG-002: pre-launch months)
- `ui/Dashboard.js` - KPI display (BUG-006: Ian accrual)
- `config/assumptions.js` - Starting values

## VALIDATION TARGETS

After all fixes, the model should show:
- Starting cash M0: $367K
- Pre-launch months: M-11 to M-1 visible
- Breakeven: ~M5
- Founder Funding: ~$182K
- Y3 AUM: ~$140.58M
- All reconciliation checks: GREEN

## RULES

1. **Read the bug list first** - don't rediscover problems
2. **One bug at a time** - fix, commit, verify, then next
3. **Update bug list** - mark each bug FIXED after confirming
4. **Keep files under 150 lines** - modular architecture rule
5. **Test on live site** - GitHub Pages deploys in ~2 minutes

## START NOW

Begin by fetching BUG_LIST_V10.12.md from the repository, then start fixing BUG-001.
