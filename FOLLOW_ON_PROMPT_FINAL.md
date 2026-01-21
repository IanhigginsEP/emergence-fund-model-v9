# FOLLOW-ON PROMPT: Emergence Fund Model v10 - COMPLETE FIX LIST

**Repository**: https://github.com/IanhigginsEP/emergence-fund-model-v9
**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

## CRITICAL: READ THIS FIRST

This model has been through multiple sessions where bugs were "fixed" but features were never actually built. The user has been lied to repeatedly. DO NOT claim something is done until you have:
1. Written the code
2. Pushed it to GitHub
3. Verified it works on the live site
4. Taken a screenshot showing the feature working

---

## OUTSTANDING ISSUES (ALL MUST BE FIXED)

### ISSUE 1: Cash Position Chart - "Max Utilization $471K" is WRONG/CONFUSING

**Location**: ui/Charts.js (Cash Position chart)
**Problem**: Shows "Max Utilization $471K" which confusingly adds Starting Cash ($367K) + Founder Funding ($104K). This is NOT how much was burned - it's misleading.
**Fix Required**: 
- Show clearly: "Starting Pot: $367K" 
- Show: "Max Draw on Pot: $XXX" (lowest cash balance)
- Show: "Additional Founder Funding Needed: $104K"
- Do NOT combine these into a single confusing number

---

### ISSUE 2: Revenue Waterfall - Y1/Y2/Y3 Tiles Have NO FUNCTIONALITY

**Location**: ui/Dashboard.js or wherever revenue waterfall is
**Problem**: There are tiles showing "Year 1", "Year 2", "Year 3", and "36 Months" but clicking them does nothing
**Fix Required**:
- Clicking Y1 should filter/highlight Year 1 data (M0-M11)
- Clicking Y2 should filter/highlight Year 2 data (M12-M23)
- Clicking Y3 should filter/highlight Year 3 data (M24-M35)
- Clicking 36M should show all months
- Update charts and tables to reflect the selected period

---

### ISSUE 3: Expense Waterfall - Same Problem as Revenue

**Location**: Same as above
**Problem**: Y1/Y2/Y3 tiles exist but have no functionality
**Fix Required**: Same as Issue 2 - make them actually filter the data

---

### ISSUE 4: Custom Scenario with Monthly/Quarterly AUM Input - NOT BUILT

**Location**: ui/Scenarios.js, config/scenarios.js
**Problem**: User has repeatedly asked for ability to input custom AUM by month or quarter. This was never built.
**Fix Required**:
- Add "Custom" scenario option
- When Custom is selected, show input fields for:
  - Monthly AUM targets (M0-M35), OR
  - Quarterly AUM targets (Q1-Q12), with interpolation
- Model should use these custom inputs instead of calculated AUM

---

### ISSUE 5: Redemptions NOT EDITABLE in UI - Config File Only

**Location**: config/assumptions.js has `REDEMPTIONS`, but NO UI exists
**Current State**: 
```javascript
window.FundModel.REDEMPTIONS = { 
  enabled: false, 
  schedule: [
    { month: 25, amount: 2000000 }, 
    { month: 31, amount: 3000000 }
  ] 
};
```
**Problem**: User cannot edit redemption schedule in the UI. Must edit config file.
**Fix Required**:
- Add Redemptions section to Assumptions tab OR create dedicated Redemptions tab
- Toggle to enable/disable redemptions
- Editable table showing: Month | Amount | [Delete button]
- "Add Redemption" button to add new rows
- Changes should immediately update the model

---

### ISSUE 6: AUM Breakdown by Source (GP/Broker/BDM) - IN MODEL, NOT IN UI

**Location**: model/engine.js calculates this, but UI doesn't show it
**Problem**: User needs to see AUM broken down by:
- GP Organic fundraising
- Broker-raised capital
- BDM-raised capital
**Fix Required**:
- Add AUM breakdown chart or table to Dashboard or Capital tab
- Show cumulative AUM by source over time
- Show percentage contribution of each source

---

### ISSUE 7: BDM/Broker Revenue Share NOT CONFIGURED CORRECTLY

**Location**: config/assumptions.js, model/engine.js
**Problem**: BDM and Broker economics are not set to the correct rev share
**Required Configuration**:
- Management fee: 1.5% per annum (150 bps)
- BDM rev share: 50-60 bps on their raised AUM (i.e., 33-40% of the 1.5% mgmt fee)
- Broker rev share: 50-60 bps on their raised AUM (same)
- This should be TRAILING commission, not upfront
- User should be able to adjust the bps in the UI

**Current broken state**: 
```javascript
bdmCommissionRate: 0,
brokerCommissionRate: 0.01, // This is 1% upfront, NOT trailing rev share
```

**Fix Required**:
- Change to trailing rev share model
- BDM: ~0.005 (50 bps) on AUM annually, paid monthly
- Broker: ~0.005 (50 bps) on AUM annually, paid monthly
- Make these editable in UI (Assumptions tab or dedicated Economics tab)

---

### ISSUE 8: Capital Tab and Scenarios Tab Need SAME FUNCTIONALITY

**Location**: ui/Capital.js, ui/Scenarios.js
**Problem**: Scenarios tab has scenario selection, Capital tab doesn't integrate with it
**Fix Required**:
- When user selects a scenario, Capital tab should update to show that scenario's capital assumptions
- Alternatively, combine the tabs or add scenario selector to Capital tab
- Capital inputs should flow through to scenario calculations

---

### ISSUE 9: Assumptions vs Capital Tab CONFLICT - No Validation

**Location**: config/assumptions.js, ui/Assumptions.js, ui/Capital.js
**Problem**: User can set values in Assumptions tab that conflict with Capital tab. No warning.
**Fix Required**:
- Add validation check when model runs
- If Assumptions.brokerMonthlyCapital ≠ Capital.brokerRaise, show warning flag
- Same for BDM values
- Either auto-sync the values OR require user to resolve conflict

---

### ISSUE 10: Scenario Dashboard Should Show AUM Comparison

**Location**: ui/Scenarios.js
**Problem**: User wants to see AUM trajectory comparison across scenarios (Base, Down, etc.)
**Fix Required**:
- Add AUM comparison chart to Scenarios tab
- Show AUM over 36 months for each preset scenario
- Allow visual comparison of Base vs Down vs Custom

---

## VALIDATION TARGETS

After ALL fixes are applied, verify:

| Metric | Expected Value |
|--------|----------------|
| Starting Cash (M0) | $367K |
| Breakeven Month | M5-M7 |
| Total Founder Funding | ~$104-182K |
| Y2 AUM | ~$95M |
| Y3 AUM (NAV M35) | ~$140M |
| BDM Rev Share | 50-60 bps trailing |
| Broker Rev Share | 50-60 bps trailing |
| Redemptions UI | Editable in dashboard |
| AUM by Source | Visible breakdown |

---

## FILE LOCATIONS

**Config files** (edit for defaults):
- `config/assumptions.js` - All model inputs
- `config/scenarios.js` - Preset scenarios
- `config/capital.js` - Capital raise schedule

**Model files** (edit for calculations):
- `model/engine.js` - Core calculation loop
- `model/summaries.js` - Aggregations

**UI files** (edit for display):
- `ui/Dashboard.js` - Main dashboard
- `ui/Scenarios.js` - Scenario comparison
- `ui/Capital.js` - Capital inputs
- `ui/Charts.js` - All charts
- `ui/Tables.js` - Cash flow tables
- `ui/Assumptions.js` - Input editors

---

## RULES FOR NEXT SESSION

1. **DO NOT CLAIM SOMETHING IS FIXED WITHOUT PROOF** - Take screenshots
2. **Push to GitHub after EACH fix** - Don't batch everything at the end
3. **Test on live site** - GitHub Pages can cache, use hard refresh
4. **Keep files under 150 lines** - Modular architecture
5. **Update version number** - Currently showing v10.16, code is v10.18
6. **If running low on tokens** - Create handoff document BEFORE ending

---

## PRIORITY ORDER

1. **BDM/Broker Economics** (Issue 7) - Core calculation is wrong
2. **Redemptions UI** (Issue 5) - Repeatedly requested
3. **AUM by Source** (Issue 6) - Needed for understanding capital
4. **Revenue/Expense Waterfall** (Issues 2, 3) - Broken UI
5. **Custom Scenario** (Issue 4) - Power user feature
6. **Cash Position Chart** (Issue 1) - Confusing display
7. **Scenarios + Capital Integration** (Issues 8, 9, 10) - UX improvements

---

## COPY THIS ENTIRE DOCUMENT TO START NEXT SESSION
