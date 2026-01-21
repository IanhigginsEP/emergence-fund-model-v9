# Emergence Partners Fund P&L Model v10.12

36-month P&L projection model for Emergence Partners, a DIFC-based investment fund.

**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

## Quick Start

Open `index.html` in a browser or visit the live site above. No build step required.

## Key Features

- **Bootstrapped Funding**: No external debt, founder funding tracked 50/50
- **PPM-Compliant Share Classes**: Founder, A, B, C with proper fee structures
- **Pre-Launch Costs**: M-11 to M-1 shown separately with personnel costs
- **BDM/Broker Economics**: Toggleable with configurable rev-share
- **Shareholder Loan Tracking**: Below-the-line accruals for founder salaries, marketing, travel
- **Scenario Analysis**: Base, Downside, Upside 1, Upside 2

## File Structure

```
emergence-fund-model-v9/
├── index.html              # Entry point (loads all scripts)
├── config/
│   ├── assumptions.js      # All editable inputs (timeline, salaries, opex)
│   ├── scenarios.js        # Preset scenarios (Base, Downside, etc.)
│   ├── capital.js          # Capital raise schedule by month
│   └── share-classes.js    # PPM class definitions
├── model/
│   ├── engine.js           # Core calculation loop (MOST LOGIC HERE)
│   ├── summaries.js        # Annual aggregation functions
│   ├── recoverables.js     # Recoverable cost tracking
│   └── formatters.js       # Number formatting (fmt, fmtPct)
├── ui/
│   ├── App.js              # Main shell, tab navigation
│   ├── Dashboard.js        # KPI cards, validation banner
│   ├── Tables.js           # Cash flow statement, AUM table
│   ├── Charts.js           # Visualizations
│   └── Controls.js         # Assumptions input controls
└── docs/
    └── BUG_LIST_V10.12.md  # Known issues and fixes
```

## Key Timeline

| Event | Date | Model Month |
|-------|------|-------------|
| Model Start | March 1, 2025 | M-11 |
| Lewis Starts | August 1, 2025 | M-6 |
| Fund Launch | February 1, 2026 | M0 |
| Projection End | January 2029 | M35 |

## Key Personnel

| Role | Monthly | Notes |
|------|---------|-------|
| Ian | $5K pre-BE / $10K post-BE | Accrued to shareholder loan |
| Paul | $5K pre-BE / $10K post-BE | Cash draw (configurable) |
| Lewis | $7,000 | 12 months including pre-launch (M-6 to M5) |
| EA | $1,000 | Starts M0 |
| Adrian | $1,667 | Starts M-6 |
| Chairman | $5,000 quarterly | Starts M4 |

## Default Assumptions

- **Starting Cash**: $367,000
- **Management Fee**: 1.5% annually
- **Carry Rate**: 17.5%
- **Annual Return**: 14%
- **GP Commitment**: 2%

## Editing

1. Config files are in `/config/` - edit assumptions.js for most changes
2. Model logic is in `/model/engine.js` - edit carefully, test after changes
3. UI components are in `/ui/` - each file handles one tab

**Rule**: No file over 150 lines. Keep changes surgical.

## Validation

After any change, verify on Dashboard:
- All reconciliations should pass (green checkmarks)
- AUM ✓ | Cash ✓ | Share Classes ✓

## License

Proprietary - Emergence Partners
