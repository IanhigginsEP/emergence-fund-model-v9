# Config Directory

All editable model inputs and configuration parameters.

## Files

### assumptions.js
**Main configuration file** - All model inputs in one place

**Structure:**
- `TIMELINE` - Model dates and projection length
- `FUNDING` - Starting cash
- `PERSONNEL` - All staff salaries and timing
- `OPEX` - Operating expenses
- `FUND_ECONOMICS` - Fee rates and returns
- `REVENUE` - Revenue recognition settings
- `SHAREHOLDER_LOAN` - Initial loan items and terms
- `CAPITAL` - Capital raise sources (GP, BDM, Broker)
- `SHARE_CLASSES` - Fee structures by class
- `REDEMPTIONS` - Redemption schedule
- `DEFAULT_ASSUMPTIONS` - Flattened version for engine

### Key Parameters

#### Timeline
| Parameter | Default | Description |
|-----------|---------|-------------|
| modelStartDate | 2025-03-01 | When cost tracking begins |
| launchDate | 2026-02-01 | Fund launch (M0) |
| projectionMonths | 36 | Post-launch months |
| preLaunchMonths | 11 | Pre-launch months |

#### Personnel
| Role | Pre-BE | Post-BE | Start Month |
|------|--------|---------|-------------|
| Ian | $5,000 | $10,000 | Always (roll-up) |
| Paul | $5,000 | $10,000 | Always (cash draw by default) |
| Lewis | $7,000 | - | M-6 (Aug 2025), 12 months |
| EA | $1,000 | $1,000 | M0 |
| Adrian | $1,667 | $1,667 | M-6 |
| Chairman | $5,000/qtr | $5,000/qtr | M4 |

#### Operating Expenses
| Item | Pre-BE | Post-BE |
|------|--------|---------|
| Marketing | $2,000 | $2,000 |
| Travel | $2,000 | $2,000 |
| Office/IT | $1,200 | $1,200 |
| Compliance | $6,500 | $6,500 |
| Setup Cost | $10,000 (M0 only) | - |

#### BDM Economics
| Parameter | Default | Description |
|-----------|---------|-------------|
| bdmCapitalStartMonth | 7 | When BDM starts raising |
| bdmMonthlyCapital | $500,000 | Monthly raise amount |
| bdmRetainer | $0 | Monthly retainer fee |
| bdmRevSharePct | 0% | Share of mgmt fee on BDM AUM |
| bdmCommissionRate | 0% | Trailing commission on raises |
| bdmTrailingMonths | 12 | Duration of trailing commission |

#### Broker Economics
| Parameter | Default | Description |
|-----------|---------|-------------|
| brokerCapitalStartMonth | 3 | When Broker starts |
| brokerMonthlyCapital | $500,000 | Monthly raise amount |
| brokerRetainer | $0 | Monthly retainer fee |
| brokerCommissionRate | 1% | Trailing commission rate |
| brokerTrailingMonths | 12 | Duration of trailing commission |

### scenarios.js
**Preset scenario definitions**

| Scenario | Description | Capital Mult | Return |
|----------|-------------|--------------|--------|
| Base | Standard case | 1.0 | 14% |
| Downside | Stressed | 0.5 | 7% |
| Upside 1 | BDM performs | 1.0 | 14% + BDM 10% |
| Upside 2 | BDM exceeds | 1.0 | 14% + BDM 20% |

### capital.js
**Monthly capital raise schedule**

Generates array of 47 objects (M-11 to M35):
```javascript
{
  month: 0,
  gpOrganic: 2000000,
  bdmRaise: 0,
  brokerRaise: 500000,
  redemption: 0
}
```

**Capital Sources by Period:**
- M0-M3: $2M/mo GP organic
- M4-M11: $3M/mo GP organic
- M12+: $2.5M/mo GP organic
- M3+: $500K/mo Broker
- M7+: $500K/mo BDM

**Default Redemptions (when enabled):**
- M25: $2M
- M31: $3M

### share-classes.js
**PPM-compliant share class definitions**

| Class | Mgmt Fee | Carry | Public Weight |
|-------|----------|-------|---------------|
| Founder | 0% | 0% | 60% |
| Class A | 1.5% | 17.5% | 60% |
| Class B | 1.5% | 17.5% | 0% (all private) |
| Class C | 1.5% | 17.5% | 100% (all public) |

## How to Edit

1. **Change a default value**: Edit the appropriate property in `assumptions.js`
2. **Add a new scenario**: Add entry to `presetScenarios` in `scenarios.js`
3. **Change capital schedule**: Modify logic in `generateCapitalInputs()` in `capital.js`
4. **Adjust redemptions**: Edit `REDEMPTIONS.schedule` array in `assumptions.js`

## Notes

- All months are relative to fund launch (M0 = February 2026)
- Negative months (M-11 to M-1) are pre-launch
- Lewis duration "12 months" includes pre-launch months
- Paul Cash Draw is ON by default (cash expense, not rolled up)
