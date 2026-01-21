# Model Directory

Core calculation engine for the Emergence Partners Fund P&L model.

## Files

### engine.js
**Main calculation loop** - Runs month-by-month P&L projection

**Key Functions:**
- `runModel(assumptions, capitalInputs, returnMult, bdmRevShare)` - Main entry point
- `shouldRollUp(mode, endMonth, currentMonth, breakEvenMonth)` - Determines founder salary treatment
- `getInitialShareholderLoan()` - Calculates initial shareholder loan balance

**Parameters:**
- `assumptions` - Flattened object from DEFAULT_ASSUMPTIONS
- `capitalInputs` - Array of monthly capital objects from config/capital.js
- `returnMult` - Multiplier for annual return (default 1.0)
- `bdmRevShare` - BDM revenue share percentage (default from assumptions)

**Output Object:**
```javascript
{
  months: [],           // Array of 47 month objects (M-11 to M35)
  preLaunchData: [],    // Pre-launch months only (M-11 to M-1)
  preLaunchCosts: 0,    // Total pre-launch expenses
  breakEvenMonth: null, // First month with 3 consecutive positive EBITDA
  cumulativeFounderFunding: 0,
  startingCashUSD: 367000
}
```

**Each Month Object Contains:**
- AUM: openingAUM, closingAUM, netCapital, investmentGain
- Revenue: grossMgmtFee, mgmtFee, carryRevenue, operatingRevenue
- Expenses: totalSalaries, totalOpex, totalExpenses
- Cash: closingCash, netCashFlow, founderFundingRequired
- Share Classes: founderAUM, classAAUM with fee calculations

### summaries.js
**Annual aggregation functions**

- `calculateAnnualSummaries(months)` - Groups months into Y1, Y2, Y3
- `formatCurrency(v)` - Formats numbers as $XXK or $XX.XXM
- `formatPct(v)` - Formats as percentage

### formatters.js
**Number formatting utilities** exposed on window.FundModel

- `fmt(v)` - Currency formatting
- `fmtPct(v)` - Percentage formatting

### recoverables.js
**Recoverable cost tracking** (if implemented)

## Calculation Logic

### Cash Flow Calculation
```
EBITDA = Operating Revenue - Cash Expenses
Closing Cash = Opening Cash + EBITDA
```

### Founder Funding Logic
1. At M0: If cash < startingCashUSD, founders inject difference
2. After M0: If cash < 0, founders inject to restore to $0

### Breakeven Detection
Breakeven = First month where 3 consecutive months have positive EBITDA

### BDM/Broker Trailing Commission
Both BDM and Broker can have trailing commissions:
```javascript
// For each historical raise in the trailing window:
trailingComm += raise.amount * commissionRate / 12
```
- `brokerTrailingMonths` default: 12
- `bdmTrailingMonths` default: 12

### Share Class Allocation
- **Founder Class**: GP Commitment portion (no fees)
- **Class A**: LP portion (1.5% mgmt fee, 17.5% carry)

```javascript
founderPct = cumulativeGPCommit / (cumulativeGPCommit + cumulativeLPCapital)
classAPct = 1 - founderPct
```

## Timeline

| Month | Date | Description |
|-------|------|-------------|
| M-11 | Mar 2025 | Model start |
| M-6 | Aug 2025 | Lewis starts |
| M0 | Feb 2026 | Fund launch |
| M35 | Jan 2029 | Projection end |
