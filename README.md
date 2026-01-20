# Emergence Partners Fund Model v9

36-month P&L projection model for Emergence Partners, a DIFC-based investment fund.

## 🚀 Live Demo
**https://ianhigginsep.github.io/emergence-fund-model-v9/**

## ✅ Validated Outputs (Jan 20, 2026)

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Breakeven | M5 | M5 | ✅ |
| Founder Funding | ~$182K | $182K | ✅ |
| Y3 AUM | ~$140.58M | $140.58M | ✅ |

## Features

- **Bootstrapped Funding** — No external debt, founder funding tracked 50/50
- **Stone Park Capital** — EUR-based starting capital with FX conversion
- **PPM-Compliant Share Classes** — Founder, A, B, C with proper fee structures
- **Scenario Analysis** — 4 preset scenarios (Downside, Base, Upside 1, Upside 2)
- **BDM Revenue Share** — Configurable % of management fee
- **Recoverable Costs** — Tagged by item with configurable trigger
- **Interactive Charts** — AUM trajectory, cash flow waterfall, sensitivity tornado

## Architecture

```
emergence-fund-model-v9/
├── index.html              # Entry point (loads all modules)
├── config/                 # 6 files
│   ├── assumptions.js      # Editable inputs
│   ├── scenarios.js        # Preset scenarios
│   ├── capital.js          # Capital raise schedule
│   ├── constants.js        # Fund constants
│   ├── presets.js          # Scenario presets
│   └── timeline.js         # Timeline configuration
├── model/                  # 4 files
│   ├── engine.js           # Core calculation loop
│   ├── formatters.js       # Number/currency formatting
│   ├── recoverables.js     # Recoverable cost tracking
│   └── summaries.js        # Annual aggregations
└── ui/                     # 11 files
    ├── Charts.js           # AUM & cash flow charts
    ├── Controls.js         # Input controls & assumptions
    ├── Dashboard.js        # KPI cards & annual summary
    ├── FundingSchedule.js  # Monthly funding breakdown
    ├── PrintView.js        # Printer-friendly summary
    ├── Scenarios.js        # Scenario comparison table
    ├── Sensitivity.js      # Tornado diagram
    ├── Tables.js           # Data tables
    ├── Timeline.js         # Visual milestone timeline
    ├── Waterfall.js        # Revenue/expense bridge
    └── WhatIf.js           # Quick scenario sliders
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

### Validation

After any model changes, verify:
- Breakeven month = M5 (Base scenario)
- Founder Funding = ~$182K (Base scenario)
- Y3 AUM = ~$140.58M (Base scenario)

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v9.0 | Jan 20, 2026 | Clean modular repo migrated from v8.5 |
| v8.5 | Jan 20, 2026 | All UI components converted to window namespace |
| v8.4 | Jan 20, 2026 | Fixed Dashboard NaN issues |
| v8.3 | Jan 17, 2026 | Initial modular architecture |
| v8.0 | Jan 16, 2026 | Major rewrite — bootstrapped model |

## Related Repos

- [emergence-fund-model](https://github.com/IanhigginsEP/emergence-fund-model) — Original repo (deprecated monolithic + working modular)

## License

Proprietary - Emergence Partners
