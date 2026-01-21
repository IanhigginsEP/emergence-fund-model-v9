# FOLLOW-ON PROMPT: Emergence Fund Model v10.19

**Updated**: January 21, 2026 15:01 UTC
**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/
**Current Version**: v10.19

---

## SESSION SUMMARY (Jan 21, 2026)

### ✅ COMPLETED THIS SESSION

| Issue | Description | File Modified | Commit |
|-------|-------------|---------------|--------|
| #7 | BDM/Broker trailing rev share 50bps | config/assumptions.js | 9fc902aa |
| #5 | Redemptions UI editor | ui/Controls.js | 6e281f46 |
| #6 | AUM by Source chart | ui/Charts.js | 0e488578 |
| - | Version bump to v10.19 | index.html | 0461bfc4 |

### DETAILS OF FIXES

**Issue #7: BDM/Broker Trailing Rev Share**
- Changed `bdmCommissionRate` from 0 to 0.005 (50bps)
- Changed `brokerCommissionRate` from 0.01 (upfront) to 0.005 (trailing)
- Set `trailingPeriod` to 24 months
- Economics: Mgmt fee = 1.5% (150bps), BDM/Broker each get 50bps = 33% of mgmt fee

**Issue #5: Redemptions UI Editor**
- Added `RedemptionScheduleEditor` component in Controls.js
- Features: Toggle enable/disable, editable table, add/delete buttons
- Uses useState for new redemption month/amount inputs
- Real-time updates to model

**Issue #6: AUM by Source Visualization**
- Added `AUMBySourceChart` component in Charts.js
- Shows cumulative capital by source (GP/BDM/Broker)
- Includes percentage breakdown at final month
- Stacked line chart with color legend

---

## STILL OPEN (Priority Order)

### HIGH PRIORITY

**Issue #4: Custom Scenario with Monthly AUM Input**
- Location: ui/Scenarios.js, config/scenarios.js
- Required: 5th scenario "Custom" with M0-M35 monthly AUM fields
- Status: NOT STARTED

**BUG-101: Cumulative Founder Funding Shows €1.12M**
- Location: model/engine.js
- Expected: ~$182K total
- Root cause: May accumulate full deficit instead of delta
- Status: NEEDS VERIFICATION - may already be fixed

### MEDIUM PRIORITY

**Issues #8, #9, #10: Capital/Scenarios Integration**
- #8: Scenario selector on Capital tab
- #9: Validation warning when Assumptions vs Capital conflict
- #10: AUM comparison chart across scenarios
- Status: NOT STARTED

**BUG-103: Rounding Precision**
- Location: utils/formatters.js (or model/formatters.js)
- Required: One decimal place (e.g., $182.5K not $183K)
- Status: NOT STARTED

### LOW PRIORITY

**BUG-105: Cash Position Chart Clarity**
- May already be improved - needs verification
- Required: Clear start point, min balance marker, recovery point

---

## VALIDATION CHECKLIST

After deploying, verify these metrics:

| Metric | Expected | Location |
|--------|----------|----------|
| Version Number | v10.19 | Header top-left |
| M0 Starting Cash | $367K | Dashboard KPI |
| Breakeven | M5-M7 | Dashboard KPI |
| Founder Funding | ~$182K | Dashboard KPI |
| BDM Commission | 50bps | Assumptions tab |
| Broker Commission | 50bps | Assumptions tab |
| Redemptions Editor | Visible | Assumptions tab |
| AUM by Source Chart | Visible | Charts tab |

---

## DEPLOYMENT NOTES

If you see old version (v10.6, v10.16, etc):
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Open DevTools > Network > "Disable cache" checkbox
3. Clear site data: DevTools > Application > Storage > Clear site data
4. Wait 2-5 minutes for GitHub Pages cache

---

## COMMITS THIS SESSION

1. `9fc902aa` - FIX Issue #7: BDM/Broker trailing rev share 50bps
2. `6e281f46` - FIX Issue #5: Redemptions UI editor with add/delete
3. `0e488578` - FIX Issue #6: AUM by Source chart
4. `13e2e837` - UPDATE: BUG_LIST to v10.19
5. `0461bfc4` - UPDATE: Version to v10.19, add AUM by Source to Charts tab

---

## FOR NEXT CLAUDE SESSION

Copy this prompt:

```
I'm continuing work on the Emergence Partners Fund Model.

Repository: https://github.com/IanhigginsEP/emergence-fund-model-v9
Current Version: v10.19
Docs: Read BUG_LIST_V10.19.md and FOLLOW_ON_PROMPT_FINAL.md FIRST

Remaining tasks in priority order:
1. Issue #4: Custom Scenario with monthly AUM input
2. Verify BUG-101: Founder funding should be ~$182K (not €1.12M)
3. Issues #8-10: Capital/Scenarios integration
4. BUG-103: Rounding precision to one decimal

Rules:
- Read the docs BEFORE making changes
- Update version number in index.html with each fix
- Update BUG_LIST_V10.19.md after each fix
- Push to GitHub after each individual fix
- Test on live site with hard refresh
```

---

**Last Updated**: January 21, 2026 15:01 UTC
