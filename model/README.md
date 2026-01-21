# Model Files

Core calculation logic for the fund P&L model.

## Files

### engine.js (MAIN FILE)
**The heart of the model** - Contains the main calculation loop.

Key functions:
- `runModel(assumptions, scenarioKey)`: Main entry point
- Pre-launch loop: M-11 to M-1 (setup costs, Lewis salary)
- Post-launch loop: M0 to M35 (full P&L)
- Calculates: AUM, revenue, expenses, cash flow, founder funding
- Returns complete month-by-month data for UI rendering

**Edit with caution** - Bugs here affect everything.

### summaries.js
Annual aggregation and formatting functions:
- `calculateAnnualSummaries(months)`: Y1, Y2, Y3 totals
- `calculateValidationStatus(model)`: AUM/Cash/ShareClass checks
- Helper functions for formatting

### recoverables.js
Tracks recoverable costs:
- Setup costs, marketing, travel that can be recovered later
- Triggered at configurable month (default M24)
- Configurable recovery rate (default 50% of excess cash)

### formatters.js
Number formatting utilities:
- `fmt(value)`: Currency formatting ($1.2M, $50K, $500)
- `fmtPct(value)`: Percentage formatting (14.5%)

## Key Concepts

### Cash Flow Calculation
```
Net Cash Flow = Operating Revenue - Cash Expenses + Founder Funding
Cash Balance = Previous Cash Balance + Net Cash Flow
```

### Shareholder Loan (Below the Line)
- Ian's salary accrues to shareholder loan
- Marketing and travel (if configured) accrue to shareholder loan
- Not in cash flow, tracked separately

### Founder Funding
- When cash would go negative, founders inject capital
- Split 50/50 between Ian and Paul
- Tracked cumulatively

## Testing

After any change to engine.js:
1. Refresh browser
2. Check Dashboard reconciliations (all should be green)
3. Verify Cash Balance matches expected trajectory
