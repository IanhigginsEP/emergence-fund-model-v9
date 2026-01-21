# UI Files

React components for the fund model interface.

**Important**: All components use `window.FundModel` namespace (no ES6 imports).

## Files

### App.js
Main application shell:
- Tab navigation (Dashboard, Scenarios, Capital, etc.)
- Scenario selector dropdown
- State management for assumptions
- Calls engine.js to run model

### Dashboard.js
Summary view with KPI cards:
- LP Return Metrics (IRR, MOIC, TVPI, DPI)
- Validation banner (AUM, Cash, Share Classes)
- Key metrics: Starting Pot, Breakeven, Founder Funding
- Below the Line section (Carry, Shareholder Loan)
- Year 1 preview tables

### Tables.js
Detailed monthly views:
- `CashflowStatement`: Full M-11 to M35 cash flow
- `PreLaunchTable`: M-11 to M-1 setup costs
- `AUMTable`: Rolling AUM by source
- `KPITable`: Monthly metrics

Features:
- Toggle "Hide Pre-Launch" button
- Show Details / Show Recon options
- Color coding (Green=revenue, Red=expenses, Amber=funding)

### Charts.js
Visualizations:
- AUM Growth chart
- Cash Balance chart
- Expense breakdown
- Revenue composition

### Controls.js
Input controls for Assumptions tab:
- Timeline section (Model Start, Fund Launch)
- Founder Salaries (with Paul Cash Draw toggle)
- Staff Costs (Lewis, EA, Chairman)
- BDM Economics (with enable toggle)
- Broker Economics (with enable toggle)
- Operating Expenses (Marketing, Travel, etc.)
- Redemptions section
- US Feeder Fund trigger

### Scenarios.js
Scenario comparison table:
- Shows all presets side-by-side
- Key metrics for each: AUM, Breakeven, Funding
- Click to apply scenario

## Component Pattern

Each component follows this pattern:
```javascript
window.FundModel = window.FundModel || {};
window.FundModel.ComponentName = function ComponentName({ props }) {
  // Component code
};
```

## Styling

Uses Tailwind CSS utility classes. Color conventions:
- Blue: Capital/AUM
- Green: Revenue
- Red: Expenses
- Amber: Funding/Shareholder Loan
- Purple: Founder Class
