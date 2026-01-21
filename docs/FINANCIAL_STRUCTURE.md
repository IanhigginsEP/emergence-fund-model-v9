# Financial Structure

**Version**: v10.16 | **Last Updated**: January 21, 2026

This document explains the two-loan structure that underpins the Emergence Partners Fund Model.

---

## Overview: Two Separate Loan Balances

The model tracks **two distinct loan balances** that should never be confused:

| Loan | Direction | Amount | Purpose |
|------|-----------|--------|--------|
| Stone Park Loan | TO the fund | $367K | Starting cash at M0 |
| Shareholder Loan | TO the founders | ~$126K+ | Pre-launch costs + salary foregone |

---

## 1. Stone Park Loan ($367K)

### Source
- Stone Park = entity owned by Paul, Ian Higgins, and their sister
- Held at Davy Stockbrokers (Ireland): €550K total
- Paul & Ian's 2/3 share: €367K × 1.27 FX ≈ **$467K**
- Available balance after prior use: **$367K**

### Treatment in Model
- This is the **Starting Cash at M0** — not injected when needed
- Cash balance starts at $367K and moves based on revenue vs expenses
- Cash **CAN go negative** — this is a warning output, not a hard limit
- If cash goes negative, it signals founders need to manage costs

### Config Location
```javascript
window.FundModel.STONE_PARK = {
  totalEUR: 550000,
  founderSharePct: 0.6667,
  fxRate: 1.27,
  availableUSD: 367000,  // THIS IS M0 STARTING CASH
};
```

---

## 2. Shareholder Loan (To Founders)

### What It Captures
Money owed **TO** Ian and Paul for costs they've personally absorbed:

1. **Pre-launch costs (M-11 to M-1)**: ~$126K
   - Lewis salary: $84K ($7K × 12 months)
   - Setup costs: $10K
   - Legal: $15K
   - Other: $17K

2. **Salary foregone** (accumulates during model run)
   - If Ian takes $0 instead of $5K, difference accrues here
   - Tracked separately per founder

3. **Other shareholder items** (configurable)
   - Marketing (if tagged)
   - Travel (if tagged)

### Treatment in Model
- Starts at ~$126K at M0 (pre-launch costs)
- Grows if founders take reduced salaries
- Recovery trigger: Configurable (default M24)
- Recovery rate: 50% of excess cash flow

### Config Location
```javascript
window.FundModel.SHAREHOLDER_LOAN = {
  preLaunchCosts: {
    lewisSalary: 84000,
    setupCosts: 10000,
    legal: 15000,
    other: 17000,
    total: 126000,
  },
  recovery: { triggerMonth: 24, rate: 0.5 },
};
```

---

## Cash Flow Logic

### At M0
- Opening Cash = $367K (Stone Park)
- Shareholder Loan Balance = $126K (pre-launch costs)

### Each Month (M0 to M35)
```
Opening Cash
+ Revenue (Mgmt Fees + Carry after BDM/Broker share)
- Operating Expenses (Salaries, OpEx)
- BDM/Broker Trailing Commissions
= Closing Cash
```

### If Cash Goes Negative
- This is an **OUTPUT** showing a deficit
- It is NOT automatically covered by "founder funding injection"
- The deficit tells founders they need to cut costs or find additional funding
- The $367K is sized to be sufficient in base case

---

## Pre-Launch Period (M-11 to M-1)

### Definition
- Model Start: March 1, 2025 (M-11)
- Fund Launch: February 1, 2026 (M0)
- Pre-launch period: 11 months before launch

### Costs During Pre-Launch
- Lewis salary (starts M-6, Aug 2025)
- Adrian salary (starts M-6)
- Setup costs, legal, etc.

### How Pre-Launch Is Handled
- Pre-launch costs are absorbed by Ian personally
- They become the initial Shareholder Loan balance
- M0 starts fresh with $367K cash
- UI has toggle to show/hide pre-launch months

---

## Key Principle

> **The $367K is the funding. It's not injected when needed — it's there from day one. The model shows whether it's sufficient.**

If the base case shows cash going negative, the model is revealing that either:
1. Assumptions are too aggressive (costs too high, revenue too low)
2. Additional funding would be needed
3. Founders need to adjust their cost structure

---

## Related Files

- `config/assumptions.js` — STONE_PARK and SHAREHOLDER_LOAN configs
- `model/engine.js` — Cash flow calculation logic
- `model/summaries.js` — getStoneParkStatus(), getShareholderLoanStatus()
- `ui/Dashboard.js` — KPI cards showing loan balances
- `docs/VALIDATION_TARGETS.md` — Expected outputs for testing
