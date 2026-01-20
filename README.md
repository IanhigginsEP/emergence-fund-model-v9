# Emergence Partners Fund Model v9.3

24-month P&L projection model for Emergence Partners, a DIFC-based fund.

## 🚀 Live Demo
**https://ianhigginsep.github.io/emergence-fund-model-v9/**

## v9.3 Key Changes (January 20, 2026)

- **24-month horizon** (reduced from 36)
- **Launch Date**: February 23, 2026
- **Carry below the line** — excluded from cash flow and breakeven calculations
- **EBITDA tracking** — Operating Revenue minus Cash Expenses
- **Ian salary as roll-up** — accrues to Shareholder Loan, not deducted from cash
- **New personnel costs**: Lewis $8,850/mo, Emma $1,000/mo, Adrian $2,300/mo
- **New OpEx**: Leventus $6,300, Admin $1,600, Office $760, Tech $500, Mobile $250
- **KPI Table**: Revenue/AUM Yield, EBITDA/AUM Efficiency
- **Target breakeven**: Month 7

## Architecture

```
emergence-fund-model-v9/
├── index.html              # Entry point
├── config/
│   ├── assumptions.js      # Timeline, Personnel, OpEx, Revenue config
│   ├── scenarios.js        # Preset scenarios
│   └── share-classes.js    # PPM share class definitions
├── model/
│   ├── engine.js           # Core calculation (24-month loop)
│   ├── cashflow.js         # Monthly calculations
│   ├── summaries.js        # Annual aggregations
│   ├── metrics.js          # IRR, MOIC, TVPI, DPI
│   └── shareholderLoan.js  # "The Pot" tracking
└── ui/
    ├── App.js              # Main shell
    ├── Dashboard.js        # KPIs with Below the Line section
    ├── CashFlow.js         # Monthly statement with EBITDA
    ├── KPITable.js         # Revenue/AUM, EBITDA/AUM metrics
    ├── Charts.js           # Visualizations
    └── [other components]
```

**Rule: No file over 150 lines**

## Tech Stack

- React 18 (CDN)
- Babel Standalone (JSX compilation)
- Tailwind CSS (CDN)
- GitHub Pages (hosting)

No build step required — uses `window.FundModel` namespace for browser compatibility.

## Personnel (Monthly USD)

| Role | Amount | Notes |
|------|--------|-------|
| Ian | $5K pre-BE / $10K post-BE | Roll-up (Shareholder Loan) |
| Paul | $5K pre-BE / $10K post-BE | Cash draw (toggleable) |
| Lewis | $8,850 | 12 months from M-5 |
| Emma | $1,000 | EA from launch |
| Adrian | $2,300 | From M-6 |

## Operating Expenses (Monthly USD)

| Item | Amount |
|------|--------|
| Leventus (Compliance) | $6,300 |
| Admin/Custodial | $1,600 |
| Office | $760 |
| Tech | $500 |
| Mobile | $250 |
| Marketing | $0 pre-BE / $1K post-BE |
| Travel | $500 pre-BE / $1K post-BE |

## Key Metrics

| Metric | Target |
|--------|--------|
| Breakeven | Month 7 |
| Y1 AUM (Downside) | $30M |

## Scenarios

| Scenario | Return | Capital | Description |
|----------|--------|---------|-------------|
| Downside | 7% | 50% | Stressed case |
| Base | 14% | 100% | Expected case |
| Upside 1 | 14% | 100% | With BDM revenue share |
| Upside 2 | 14% | 100% | Higher BDM share |

## Development

### Making Changes

1. Edit the appropriate module file
2. Test locally by opening `index.html`
3. Push to GitHub — auto-deploys via GitHub Pages

### Editing Rules

- Keep files under 150 lines
- Use `window.FundModel` namespace for globals
- Don't break the modular structure
- Test all scenarios after changes

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v9.3 | Jan 20, 2026 | 24mo horizon, carry below line, new expenses |
| v9.2 | Jan 20, 2026 | LP metrics (IRR, MOIC, TVPI, DPI) |
| v9.1 | Jan 20, 2026 | J-Curve, waterfalls |
| v9.0 | Jan 19, 2026 | Modular architecture |

## Related Repos

- [emergence-fund-model](https://github.com/IanhigginsEP/emergence-fund-model) — Original repo (deprecated monolithic + working modular)

## License

Proprietary - Emergence Partners
