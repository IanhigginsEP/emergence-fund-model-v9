# Config Files

Configuration files for the fund model. Edit these to change assumptions.

## Files

### assumptions.js
**Primary config file** - Contains all editable inputs:
- `TIMELINE`: Model start, launch date, projection months
- `FUNDING`: Starting cash ($367K)
- `PERSONNEL`: Salaries for Ian, Paul, Lewis, Emma, Adrian, Chairman
- `OPEX`: Marketing, travel, compliance, office costs
- `FUND_ECONOMICS`: Fee rates, returns, public weight
- `SHAREHOLDER_LOAN`: Initial items and repayment terms
- `CAPITAL`: GP organic raise schedule, BDM, Broker settings
- `REDEMPTIONS`: Schedule (when enabled)
- `DEFAULT_ASSUMPTIONS`: Flattened version consumed by engine.js

### scenarios.js
Preset scenarios with multipliers/overrides:
- **Base**: Standard assumptions (14% return)
- **Downside**: 50% capital multiplier, 7% return
- **Upside 1**: 25% more capital
- **Upside 2**: 50% more capital

### capital.js
Capital raise schedule by source and month:
- GP Organic: Different rates for M0-3, M4-11, M12+
- BDM: Start month, monthly amount
- Broker: Start month, monthly amount, commission rate

### share-classes.js
PPM-compliant share class definitions:
- Founder Class: 0% mgmt fee, 0% perf fee
- Class A: 1.5% mgmt, 17.5% carry, 60/40 public/private
- Class B: 1.5% mgmt, 17.5% carry, 100% private
- Class C: 1.5% mgmt, 17.5% carry, 100% public

## Making Changes

1. Edit the relevant config file
2. Test locally by refreshing the browser
3. Verify reconciliations pass on Dashboard
4. Commit with descriptive message
