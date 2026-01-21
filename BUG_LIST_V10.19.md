# BUG LIST: Emergence Fund Model v10.19

**Updated**: January 21, 2026 15:00 UTC
**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

---

## FIXES COMPLETED THIS SESSION (v10.19)

### ✅ FIXED: Issue #7 - BDM/Broker Trailing Rev Share
- **File**: config/assumptions.js
- **Commit**: 9fc902aa53d98cee41bbfbaa61453808e6e9b176
- **Change**: Set bdmCommissionRate and brokerCommissionRate to 0.005 (50bps trailing)
- **Previous**: bdmCommissionRate: 0, brokerCommissionRate: 0.01 (wrong)
- **Now**: Both at 50bps (0.5%) trailing on AUM raised, 24-month duration

### ✅ FIXED: Issue #5 - Redemptions UI Editor
- **File**: ui/Controls.js
- **Commit**: 6e281f46365cc9a64c942ffd34b3812288cfefbe
- **Change**: Added full redemption schedule editor with add/edit/delete
- **Previous**: Just showed "(edit in config)" text
- **Now**: Toggle, editable table with Month/Amount, Add button, Delete buttons

### ✅ FIXED: Issue #6 - AUM by Source Visualization
- **File**: ui/Charts.js
- **Commit**: 0e488578db5cd829f6055d5319965c472b057002
- **Change**: Added AUMBySourceChart showing GP/BDM/Broker breakdown
- **Shows**: Cumulative capital by source, percentage breakdown, stacked line chart

### ✅ FIXED: BUG-102 - Adrian Duplication (ALREADY DONE)
- **Verified**: Adrian object removed from assumptions.js
- **Verified**: No adrianSalary in engine.js
- **Status**: Chairman quarterly payment ($5K) is the ONLY Adrian cost

---

## STILL OPEN (For Next Session)

### Issue #4: Custom Scenario with Monthly AUM Input
- **Priority**: MEDIUM
- **Location**: ui/Scenarios.js, config/scenarios.js
- **Required**: "Custom" scenario where user inputs monthly AUM targets (M0-M35)
- **Status**: NOT STARTED

### Issues #8, #9, #10: Capital/Scenarios Integration
- **Priority**: LOW
- **Location**: ui/CapitalTab.js, ui/Scenarios.js
- **Required**: 
  - Scenario selector on Capital tab
  - Validation when Assumptions vs Capital conflict
  - AUM comparison chart across scenarios
- **Status**: NOT STARTED

### BUG-101: Cumulative Founder Funding Calculation
- **Priority**: CHECK - May be fixed by earlier sessions
- **Required**: Track delta of deficit, not absolute value
- **Status**: NEEDS VERIFICATION

### BUG-103: Rounding Precision
- **Priority**: LOW
- **Required**: One decimal place (e.g., $182.5K not $183K)
- **Status**: NOT STARTED

---

## VALIDATION TARGETS

| Metric | Target | Status |
|--------|--------|--------|
| M0 Starting Cash | $367,000 | VERIFY |
| Pre-launch costs | ~$126,000 | VERIFY |
| Breakeven | M5-M7 | VERIFY |
| Total Founder Funding | ~$182K | VERIFY |
| Y2 AUM | ~$95M | VERIFY |
| Y3 AUM | ~$140M | VERIFY |
| BDM Commission | 50bps trailing | ✅ FIXED |
| Broker Commission | 50bps trailing | ✅ FIXED |
| Redemptions UI | Editable | ✅ FIXED |
| AUM by Source | Visible | ✅ FIXED |

---

## FILES MODIFIED THIS SESSION

| File | Change | Commit |
|------|--------|--------|
| config/assumptions.js | BDM/Broker 50bps trailing | 9fc902aa |
| ui/Controls.js | Redemptions editor UI | 6e281f46 |
| ui/Charts.js | AUM by Source chart | 0e488578 |

---

## DEPLOYMENT NOTE

If seeing old version (v10.6):
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Wait 2-5 minutes for GitHub Pages to deploy
4. Check commit history: https://github.com/IanhigginsEP/emergence-fund-model-v9/commits/main

---

**Last Updated**: January 21, 2026 15:00 UTC
