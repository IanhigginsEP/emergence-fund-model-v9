# Emergence Partners Fund P&L Model v10.16

36-month P&L projection model for Emergence Partners, a DIFC-based investment fund.

**Live Site**: https://ianhigginsep.github.io/emergence-fund-model-v9/

## Quick Start

Open `index.html` in a browser or visit the live site above. No build step required.

## ⚠️ Important: Financial Structure

**Read [docs/FINANCIAL_STRUCTURE.md](docs/FINANCIAL_STRUCTURE.md) before making changes.**

The model tracks TWO separate loan balances:

| Loan | Direction | Amount | Purpose |
|------|-----------|--------|--------|
| **Stone Park** | TO the fund | $367K | Starting cash at M0 |
| **Shareholder Loan** | TO founders | ~$126K+ | Pre-launch costs owed to Ian |

The $367K is NOT injected when needed — it's the starting cash. Cash CAN go negative as a warning output.

## Key Features

- **Bootstrapped Funding**: $367K starting capital, founder funding tracked 50/50
- **PPM-Compliant Share Classes**: Founder, A, B, C with proper fee structures
- **Pre-Launch Costs**: M-11 to M-1 shown separately (toggle in UI)
- **BDM/Broker Economics**: Toggleable with configurable rev-share
- **Shareholder Loan Tracking**: Below-the-line accruals for salaries, marketing, travel
- **Scenario Analysis**: Base, Downside, Upside 1, Upside 2

## Validation Targets

See [docs/VALIDATION_TARGETS.md](docs/VALIDATION_TARGETS.md) for full list.

| Metric | Base Case Target |
|--------|------------------|
| M0 Starting Cash | $367,000 (exact) |
| Breakeven | M5-M7 |
| Y3 AUM | ~$140M |
| Total Founder Funding | ~$182K |

## File Structure

```
emergence-fund-model-v9/
├── index.html              # Entry point (loads all scripts)
├── config/
│   ├── assumptions.js      # STONE_PARK, SHAREHOLDER_LOAN, personnel, opex
│   ├── scenarios.js        # Preset scenarios
│   ├── capital.js          # Capital raise schedule by month
│   └── share-classes.js    # PPM class definitions
├── model/
│   ├── engine.js           # Core calculation loop
│   ├── summaries.js        # Annual aggregation, loan status functions
│   ├── recoverables.js     # Recoverable cost tracking
│   └── formatters.js       # Number formatting
├── ui/
│   ├── App.js              # Main shell, tab navigation
│   ├── Dashboard.js        # KPI cards, validation banner
│   ├── Tables.js           # Cash flow statement, AUM table
│   ├── Charts.js           # Visualizations
│   └── Controls.js         # Assumptions input controls
└── docs/
    ├── FINANCIAL_STRUCTURE.md  # READ THIS FIRST
    ├── VALIDATION_TARGETS.md   # Expected outputs
    └── BUG_LIST_V10.12.md      # Known issues
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

## Editing Rules

1. **Read docs/FINANCIAL_STRUCTURE.md first**
2. Config files are in `/config/` — edit assumptions.js for most changes
3. Model logic is in `/model/engine.js` — edit carefully, test after changes
4. **No file over 150 lines** — keep changes surgical
5. After any change, verify all reconciliations pass (green checkmarks)

## After Any Change

1. Open live site or index.html
2. Verify M0 Cash = $367K
3. Verify all 3 reconciliation checks pass (AUM ✓ | Cash ✓ | Share Classes ✓)
4. Verify breakeven is M5-M7 (base case)
5. See [docs/VALIDATION_TARGETS.md](docs/VALIDATION_TARGETS.md) for full checklist

## License

Proprietary - Emergence Partners
