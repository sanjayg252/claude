# CBOE S&P 500 PutWrite Index (PUT) Replication Plan

## Overview

This document outlines a plan to replicate the CBOE S&P 500 PutWrite Index (ticker: PUT), a benchmark that measures the performance of a hypothetical portfolio that sells S&P 500 Index (SPX) put options against collateralized cash reserves held in Treasury bills.

**Goal**: Build an accurate replication to:
1. Deeply understand the mechanics of systematic put writing
2. Validate the methodology before testing other short volatility strategies
3. Create a foundation for testing variations (different strikes, frequencies, underlyings)

---

## Part 1: Understanding the PUT Index Methodology

### 1.1 Core Strategy Rules

| Component | PUT Index Specification |
|-----------|------------------------|
| **Underlying** | S&P 500 Index (SPX) |
| **Option Type** | SPX Put Options (European, cash-settled) |
| **Strike Selection** | At-the-money (ATM) |
| **Expiration** | Monthly (standard 3rd Friday expiration) |
| **Roll Frequency** | Monthly on 3rd Friday |
| **Collateral** | 100% cash-secured with T-bills |
| **Settlement** | AM-settled (SOQ - Special Opening Quotation) |

### 1.2 Detailed Roll Mechanics

#### Roll Date
- **When**: 3rd Friday of each month
- **Holiday Handling**: If 3rd Friday is a holiday, roll on preceding business day
- **Time**: Options sold between 11:30 AM - 12:00 PM ET using VWAP

#### Strike Selection Process
1. At roll time, identify SPX level
2. Select first available put strike **below** the current SPX level
3. This ensures the put is slightly OTM (typically within 5 points of ATM)

#### Premium Collection
- New put premium = VWAP of traded prices between 11:30 AM - 12:00 PM ET
- Uses OPRA (Options Price Reporting Authority) transaction data

#### Settlement of Expiring Options
- Uses SOQ (Special Opening Quotation) as final settlement price
- Settlement value = max(0, Strike - SOQ)
- AM-settled options stop trading Thursday before expiration

### 1.3 Collateral & Interest

#### Treasury Bill Investment
- Notional amount equal to put strike price invested in T-bills
- Interest accrues at 4-week Bank Discount Rate
- Provides the "cash-secured" aspect of the strategy

#### Position Sizing
- Number of puts sold is limited so T-bill holdings can cover maximum loss
- Maximum loss = Strike price (if SPX goes to zero)
- This means: `Notional = Strike Price × Number of Contracts × 100`

### 1.4 Index Value Calculation

The index value is calculated as:

```
Index(t) = Index(t-1) × (1 + Daily Return)

Daily Return = (Change in Put Value + T-bill Interest) / Previous Day's Investment
```

On roll dates, the calculation is split into two parts:
1. Settlement of expiring option (using SOQ)
2. Sale of new option (using VWAP premium)

---

## Part 2: Data Requirements

### 2.1 Essential Data Sources

| Data Type | Source Options | Notes |
|-----------|---------------|-------|
| **SPX Daily Prices** | Yahoo Finance, FRED, Bloomberg | Free options available |
| **SPX Options (Historical)** | ORATS, OptionMetrics, CBOE DataShop | Paid; OptionMetrics is industry standard |
| **T-bill Rates** | FRED (DTB4WK) | Free via FRED API |
| **SPX Dividend Yields** | S&P Global, Bloomberg | For validation |
| **VIX (optional)** | Yahoo Finance, CBOE | For context/analysis |

### 2.2 Minimum Data Fields Needed

For each roll date, you need:
```
- Roll Date
- SPX Level at roll time (~11:30-12:00 ET)
- ATM Put Strike (nearest strike below SPX)
- Put Premium (bid price or VWAP if available)
- Days to Expiration
- Previous Option Settlement Value
- 4-week T-bill rate
```

### 2.3 Data Source Recommendations

#### Budget Option (Free/Low Cost)
- **SPX Prices**: Yahoo Finance (`yfinance` Python library)
- **T-bill Rates**: FRED API (`fredapi` Python library)
- **Options Data**: Estimate using Black-Scholes + VIX as IV proxy
- **Limitation**: Won't capture real bid/ask spreads or VWAP

#### Professional Option (Paid)
- **ORATS** (~$100-300/month): High-quality SPX options data back to 2007
- **OptionMetrics** (Academic/Institutional): Gold standard, back to 1996
- **CBOE DataShop**: Official source, various packages available

### 2.4 Historical PUT Index Values (for Validation)
- Download official PUT index values from CBOE or Bloomberg
- Use for comparing your replication accuracy

---

## Part 3: Implementation Architecture

### 3.1 Recommended Tech Stack

```
Language:       Python 3.10+
Data Handling:  pandas, numpy
Options Pricing: scipy (for Black-Scholes), py_vollib (optional)
Data Sources:   yfinance, fredapi, requests
Visualization:  matplotlib, plotly
Testing:        pytest
```

### 3.2 Project Structure

```
cboe-putwrite-replication/
├── PLAN.md                    # This document
├── README.md                  # Project documentation
├── requirements.txt           # Python dependencies
├── config/
│   └── settings.py           # Configuration parameters
├── data/
│   ├── raw/                  # Raw downloaded data
│   ├── processed/            # Cleaned data
│   └── validation/           # Official PUT index values
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── spx_data.py       # SPX price fetching
│   │   ├── options_data.py   # Options data handling
│   │   └── treasury_data.py  # T-bill rate fetching
│   ├── pricing/
│   │   ├── __init__.py
│   │   └── black_scholes.py  # Options pricing model
│   ├── strategy/
│   │   ├── __init__.py
│   │   ├── put_write.py      # Core PUT strategy logic
│   │   ├── roll_dates.py     # Roll date calculation
│   │   └── position.py       # Position management
│   ├── backtest/
│   │   ├── __init__.py
│   │   ├── engine.py         # Backtesting engine
│   │   └── metrics.py        # Performance metrics
│   └── utils/
│       ├── __init__.py
│       └── dates.py          # Date utilities
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_strategy_development.ipynb
│   ├── 03_backtest_analysis.ipynb
│   └── 04_validation.ipynb
├── tests/
│   ├── test_roll_dates.py
│   ├── test_pricing.py
│   └── test_strategy.py
└── scripts/
    ├── download_data.py
    └── run_backtest.py
```

### 3.3 Core Components to Build

#### Component 1: Roll Date Calculator
```python
# Determines 3rd Friday of each month
# Handles holiday adjustments
# Returns list of roll dates for date range
```

#### Component 2: Strike Selector
```python
# Given SPX level, find ATM put strike
# SPX options have 5-point strike increments (mostly)
# Select first strike below current level
```

#### Component 3: Options Pricer
```python
# Black-Scholes put pricing
# Inputs: S, K, T, r, sigma (IV)
# Can use VIX as IV proxy for budget approach
```

#### Component 4: T-bill Accrual Calculator
```python
# Daily interest accrual
# Uses 4-week T-bill bank discount rate
# Convert bank discount to actual yield
```

#### Component 5: Strategy Engine
```python
# Manages positions over time
# Handles rolls (close old, open new)
# Tracks P&L daily
```

#### Component 6: Performance Analytics
```python
# Total return, CAGR
# Sharpe ratio, Sortino ratio
# Maximum drawdown
# Comparison vs SPX buy-and-hold
```

---

## Part 4: Implementation Phases

### Phase 1: Foundation (Week 1)

**Objectives:**
- [ ] Set up project structure
- [ ] Implement roll date calculator
- [ ] Fetch SPX historical data
- [ ] Fetch T-bill rate data
- [ ] Download official PUT index values for validation

**Deliverables:**
- Working data pipeline
- Roll dates for 2006-present
- Basic data validation notebook

### Phase 2: Options Pricing (Week 2)

**Objectives:**
- [ ] Implement Black-Scholes pricing
- [ ] Create strike selection logic
- [ ] Estimate historical option prices (using VIX as IV)
- [ ] Compare estimates vs real data (if available)

**Deliverables:**
- Options pricing module
- Historical put premium estimates
- Accuracy analysis

### Phase 3: Strategy Logic (Week 3)

**Objectives:**
- [ ] Implement core put-write strategy
- [ ] Handle monthly rolls correctly
- [ ] Track daily P&L
- [ ] Implement T-bill interest accrual

**Deliverables:**
- Working strategy engine
- Daily index values
- Position tracking

### Phase 4: Backtesting & Validation (Week 4)

**Objectives:**
- [ ] Run full historical backtest
- [ ] Compare vs official PUT index
- [ ] Calculate tracking error
- [ ] Identify discrepancies and refine

**Deliverables:**
- Full backtest results
- Validation report
- Tracking error analysis

### Phase 5: Analysis & Extensions (Week 5+)

**Objectives:**
- [ ] Performance attribution
- [ ] Scenario analysis
- [ ] Document learnings
- [ ] Prepare for testing variations

**Deliverables:**
- Comprehensive analysis report
- Framework ready for modifications

---

## Part 5: Validation Approach

### 5.1 Primary Validation

Compare your replicated index to official CBOE PUT index:

| Metric | Target |
|--------|--------|
| Correlation | > 0.99 |
| Tracking Error (annualized) | < 1% |
| Monthly Return Difference | < 0.5% |

### 5.2 Sanity Checks

1. **Roll Date Accuracy**: Verify all rolls happen on 3rd Fridays
2. **Strike Selection**: Confirm strikes are consistently just below SPX
3. **Premium Reasonableness**: Put premium should be ~1-3% of notional typically
4. **Drawdown Events**: Major drawdowns should align with market crashes

### 5.3 Known Sources of Tracking Error

1. **Execution Timing**: VWAP vs point-in-time pricing
2. **Bid/Ask Spread**: Real data has spread, estimates may not
3. **IV Estimation**: VIX proxy vs actual option IV
4. **T-bill Rate Interpolation**: Daily vs actual auction rates
5. **Holiday Handling**: Edge cases in roll date calculation

---

## Part 6: Key Considerations

### 6.1 Why This Strategy Works (Historically)

1. **Volatility Risk Premium**: Implied volatility > realized volatility on average
2. **Time Decay (Theta)**: Options lose value daily, benefiting sellers
3. **Cash Yield**: T-bill collateral earns interest
4. **Diversification**: Different return profile than long equity

### 6.2 Risks to Understand

1. **Tail Risk**: Uncapped downside in crashes (2008, 2020 March)
2. **Volatility Spikes**: Large losses when IV spikes
3. **Gap Risk**: Weekend/overnight moves can cause losses
4. **Opportunity Cost**: May underperform in strong bull markets

### 6.3 Comparison Benchmarks

Compare your replication against:
- SPX Total Return (SPY)
- 60/40 Portfolio
- CBOE BuyWrite Index (BXM)
- Risk-free rate (T-bills only)

---

## Part 7: Future Extensions

Once the base PUT replication is validated, consider testing:

### 7.1 Strike Variations
- **PUTY**: 2% OTM puts (less premium, less risk)
- **Deep OTM**: 5-10% OTM puts
- **ITM**: Slightly in-the-money puts

### 7.2 Frequency Variations
- **Weekly**: Roll every Friday (WPUT index)
- **0DTE**: Daily expirations (very different profile)
- **Bi-weekly**: Every 2 weeks

### 7.3 Underlying Variations
- **PUTR**: Russell 2000 puts
- **QQQ/NDX**: Nasdaq puts
- **Individual stocks**: Higher IV, more idiosyncratic risk

### 7.4 Dynamic Approaches
- **PUTD (Validus)**: Dynamic strike based on IV levels
- **VIX-based sizing**: Reduce exposure in high IV
- **Delta targeting**: Consistent delta rather than ATM

---

## Part 8: Resources & References

### Official Documentation
- [CBOE PUT Index Dashboard](https://www.cboe.com/us/indices/dashboard/put/)
- [CBOE S&P 500 PutWrite Indices Methodology](https://cdn.cboe.com/api/global/us_indices/governance/Cboe_SP_500_PutWrite_Indices_Methodology.pdf)

### Data Providers
- [ORATS - Options Backtesting](https://orats.com/blog/backtest-weekly-options-in-spx)
- [OptionMetrics - Historical Options Data](https://optionmetrics.com/)
- [FRED - Treasury Rates](https://fred.stlouisfed.org/series/DTB4WK)

### Research & Analysis
- [Spintwig SPX Put Backtests](https://spintwig.com/short-spx-put-45-dte-s1-signal-options-backtest/)
- [Early Retirement Now - Option Writing Series](https://earlyretirementnow.com/2021/11/10/passive-income-through-option-writing-part-9-2016-2021-backtest-guest-post-by-spintwig/)
- [ORATS Research via IBKR](https://www.interactivebrokers.com/campus/ibkr-quant-news/backtesting-180-million-options-strategies-insights-from-orats-latest-research/)

### Tools & Platforms
- [Option Alpha Backtester](https://optionalpha.com/backtester)
- [GitHub: Options Backtester](https://github.com/lambdaclass/options_backtester)

---

## Appendix A: Quick Start Checklist

```
[ ] 1. Create project directory structure
[ ] 2. Install Python dependencies
[ ] 3. Download SPX data (Yahoo Finance)
[ ] 4. Download T-bill rates (FRED)
[ ] 5. Download official PUT index values (validation)
[ ] 6. Implement roll date calculator
[ ] 7. Implement Black-Scholes pricer
[ ] 8. Implement strike selector
[ ] 9. Implement daily P&L calculator
[ ] 10. Run backtest
[ ] 11. Compare vs official PUT index
[ ] 12. Analyze tracking error
[ ] 13. Document findings
```

---

## Appendix B: Sample Roll Date Output

Example roll dates for 2024:
```
2024-01-19 (3rd Friday January)
2024-02-16 (3rd Friday February)
2024-03-15 (3rd Friday March)
2024-04-19 (3rd Friday April)
2024-05-17 (3rd Friday May)
2024-06-21 (3rd Friday June)
2024-07-19 (3rd Friday July)
2024-08-16 (3rd Friday August)
2024-09-20 (3rd Friday September)
2024-10-18 (3rd Friday October)
2024-11-15 (3rd Friday November)
2024-12-20 (3rd Friday December)
```

---

## Appendix C: Black-Scholes Put Formula

```python
from scipy.stats import norm
import numpy as np

def black_scholes_put(S, K, T, r, sigma):
    """
    Calculate Black-Scholes put option price.

    Parameters:
    S: Current stock price
    K: Strike price
    T: Time to expiration (years)
    r: Risk-free rate
    sigma: Volatility (annualized)

    Returns:
    Put option price
    """
    d1 = (np.log(S / K) + (r + 0.5 * sigma**2) * T) / (sigma * np.sqrt(T))
    d2 = d1 - sigma * np.sqrt(T)

    put_price = K * np.exp(-r * T) * norm.cdf(-d2) - S * norm.cdf(-d1)
    return put_price
```

---

*Plan created: 2026-02-03*
*Last updated: 2026-02-03*
