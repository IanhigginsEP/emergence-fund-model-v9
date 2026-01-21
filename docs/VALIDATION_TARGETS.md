# Validation Targets

**Version**: v10.16 | **Last Updated**: January 21, 2026

Use these targets to verify the model is working correctly after any changes.

---

## Critical Targets (Must Pass)

| Metric | Target Value | Tolerance | Location to Check |
|--------|-------------|-----------|------------------|
| M0 Starting Cash | $367,000 | Exact | Dashboard > Cash KPI or Tables > Cash Flow M0 |
| Pre-launch costs | ~$126,000 | ±$5K | Dashboard > Shareholder Loan Balance |
| Breakeven Month | M5-M7 | ±2 months | Dashboard > Breakeven KPI |
| Y1 AUM | ~$35-40M | ±$5M | Dashboard > Y1 AUM or Tables > AUM M11 |
| Y2 AUM | ~$95M | ±$10M | Dashboard > Y2 AUM |
| Y3 AUM | ~$140M | ±$10M | Dashboard > Y3 AUM |
| Founder Funding Total | ~$180-185K | ±$10K | Dashboard > Total Founder Funding |

---

## Reconciliation Checks (All Must Show Green ✓)

| Check | Formula | Dashboard Location |
|-------|---------|-------------------|
| AUM Reconciliation | Opening AUM + Net Capital + Gains = Closing AUM | Validation Banner |
| Cash Reconciliation | Opening Cash + Net Cash Flow = Closing Cash | Validation Banner |
| Share Class Validation | Founder AUM + Class A AUM = Total AUM | Validation Banner |

---

## Scenario-Specific Targets

### Base Case (default scenario)
| Metric | Target |
|--------|--------|
| Breakeven | M5-M7 |
| Y3 Cash | Positive (>$200K) |
| Total Founder Funding | ~$182K |

### Downside Scenario (50% capital)
| Metric | Target |
|--------|--------|
| Breakeven | M10-M15 or Never |
| Y3 Cash | May be negative |
| Total Spend | $350-400K |

### Upside Scenarios (BDM 10%/20%)
| Metric | Target |
|--------|--------|
| Breakeven | M4-M6 |
| Y3 Cash | Higher than base |
| BDM Revenue Share | Visible in EBITDA breakdown |

---

## Pre-Launch Verification

When "Show Pre-Launch" toggle is ON:

| Month | Lewis Salary | Adrian Salary | Total Cost |
|-------|-------------|---------------|------------|
| M-11 to M-7 | $0 | $0 | $0 |
| M-6 | $7,000 | $1,667 | $8,667 |
| M-5 to M-1 | $7,000 | $1,667 | $8,667/mo |

**Pre-launch total**: ~$52K (6 months × ~$8.7K)

---

## Personnel Cost Verification

### Pre-Breakeven (M0 to ~M5)
| Person | Monthly | Notes |
|--------|---------|-------|
| Ian | $5,000 | Accrued to shareholder loan |
| Paul | $5,000 | Cash draw (if enabled) |
| Lewis | $7,000 | Cash expense |
| EA | $1,000 | Cash expense |
| Adrian | $1,667 | Cash expense |
| **Total** | **$19,667** | |

### Post-Breakeven
| Person | Monthly | Notes |
|--------|---------|-------|
| Ian | $10,000 | Now paid in cash |
| Paul | $10,000 | Cash draw |
| Lewis | $7,000 | (if still employed) |
| EA | $1,000 | |
| Adrian | $1,667 | |
| **Total** | **$29,667** | |

---

## OpEx Verification

| Category | Monthly | Notes |
|----------|---------|-------|
| Marketing | $2,000 | Default value |
| Travel | $2,000 | Default value |
| Compliance | $11,000 | |
| Office/IT | $1,000 | |
| **Total** | **$16,000** | |

---

## Quick Test Checklist

After any code change:

1. [ ] Open live site or index.html
2. [ ] Dashboard loads without console errors
3. [ ] M0 Cash shows $367K
4. [ ] All 3 reconciliation checks show green ✓
5. [ ] Breakeven is between M5-M7 (base case)
6. [ ] Y3 AUM is ~$140M
7. [ ] Toggle pre-launch ON — months M-11 to M-1 appear
8. [ ] Run Downside scenario — breakeven moves later
9. [ ] Run Upside scenario — BDM revenue share visible

---

## Known Issues

See `BUG_LIST_V10.12.md` for current known issues and their status.
