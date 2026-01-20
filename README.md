# Emergence Partners Fund Model v9

36-month P&L projection model for Emergence Partners, a DIFC-based investment fund.

## Live Demo
https://ianhigginsep.github.io/emergence-fund-model-v9/

## Features

- **Bootstrapped Funding** — No external debt, founder funding tracked 50/50
- **Stone Park Capital** — EUR-based starting capital with FX conversion
- **PPM-Compliant Share Classes** — Founder, A, B, C with proper fee structures
- **Scenario Analysis** — 7 preset scenarios including return sensitivity
- **BDM Revenue Share** — Configurable % of management fee
- **Recoverable Costs** — Tagged by item with configurable trigger

## Architecture

```
emergence-fund-model-v9/
├── index.html              # Entry point, loads modules
├── config/
│   ├── assumptions.js      # Editable inputs
│   ├── scenarios.js        # Preset scenarios
│   ├── capital.js          # Capital raise schedule
│   ├── constants.js        # Fund constants
│   ├── presets.js          # Scenario presets
│   └── timeline.js         # Timeline configuration
├── model/
│   ├── engine.js           # Core calculation loop
│   ├── formatters.js       # Number/currency formatting
│   ├── recoverables.js     # Recoverable cost tracking
│   └── summaries.js        # Annual aggregations
└── ui/
    ├── Dashboard.js        # KPI cards
    ├── Charts.js           # Visualizations
    ├── Scenarios.js        # Scenario comparison
    ├── Controls.js         # Input controls
    ├── Tables.js           # Data tables
    └── ... (other UI components)
```

**Rule: No file over 150 lines**

## Tech Stack

- React 18 (CDN)
- Babel Standalone (JSX compilation)
- Tailwind CSS (CDN)
- GitHub Pages (hosting)

No build step required — uses `window.FundModel` namespace for browser compatibility.

## Key People

| Role | Person | Compensation |
|------|--------|--------------|
| Founders | Ian & Paul | $5K pre-breakeven, $10K post (each) |
| COO | Lewis | $3K/mo for 12 months |
| EA | Emma | £1K/mo |
| Chairman | - | $5K quarterly (post-prepaid) |

## Scenarios

| Scenario | Return | Founder Salary | BDM Share |
|----------|--------|----------------|-----------|
| Base | 14% | $5K | 0% |
| Founder $0 | 14% | $0 | 0% |
| Down | 7% | $5K | 0% (50% capital) |
| Zero Return | 0% | $5K | 0% |
| Partial (7%) | 7% | $5K | 0% |
| BDM 10% | 14% | $5K | 10% |
| BDM 20% | 14% | $5K | 20% |

## Validation Targets

| Metric | Base Case |
|--------|----------|
| Y1 AUM | ~$30M |
| Y3 AUM | ~$140.58M |
| Breakeven | M5 |
| Founder Funding | ~$182K total (~$91K each) |

## Development

### Making Changes

1. Edit the appropriate module file
2. Test locally by opening `index.html`
3. Push to GitHub for deployment

### Editing Rules

- Keep files under 150 lines
- Use `window.FundModel` namespace for globals
- Don't break the modular structure
- Test all scenarios after changes

## Version History

- **v9.0** (Jan 20, 2026) — Clean modular repo from v8.5
- **v8.5** (Jan 20, 2026) — All UI components converted to window namespace
- **v8.4** (Jan 20, 2026) — Fixed Dashboard NaN issues
- **v8.3** (Jan 17, 2026) — Initial modular architecture
- **v8.0** (Jan 16, 2026) — Major rewrite, bootstrapped

## License

Proprietary - Emergence Partners
