# FratFinance

**Smart financial tools built for college students.** Connect your real accounts, optimize your debt, and invest with confidence — all in one place.

---

## What It Does

Most students have the same question every month: *"Should I pay down my loan or put this extra cash in the market?"* FratFinance gives you a mathematically grounded answer, not a guess.

It connects to your actual bank and investment accounts, pulls live market data, and runs optimization algorithms to tell you exactly what to do with your money — and why.

---

## Core Tools

### Debt vs. Invest Optimizer
Enter a loan and your monthly spare cash. The engine compares the guaranteed return of paying down debt against the expected market return, then gives you a clear recommendation with a confidence score and a projected net worth chart for both paths.

### Multi-Loan Optimizer
Managing multiple loans? The debt avalanche algorithm prioritizes your payoff order to minimize total interest paid. Visualize your debt-free date and see the monthly payoff schedule.

### Investment Planner
Get a personalized ETF portfolio built around your graduation timeline and risk tolerance — with specific ticker allocations (VOO, VXUS, BND) and step-by-step instructions for executing the plan.

### Plaid Bank Integration
Connect real checking, savings, investment, and loan accounts. Financial data populates automatically — no manual entry.

---

## Key Capabilities

| Capability | Detail |
|---|---|
| Live market data | S&P 500 rates via yfinance, cached every 30 minutes |
| Real bank connections | Plaid API — supports checking, savings, investments, loans |
| Personalized portfolios | ETF allocations adjust by time horizon and risk profile |
| Debt avalanche engine | Multi-loan payoff optimization via NumPy |
| Secure accounts | Supabase auth with JWT, PKCE flow, and Row Level Security |
| Plan history | Save and revisit past optimization runs |

---

## Example Outcomes

**High-interest loan (9%)** — $25k at 9%, $100/month spare cash
> Recommendation: **Pay debt** — the guaranteed 9% savings beats expected market returns.

**Low-interest loan (3%)** — $25k at 3%, $100/month spare cash
> Recommendation: **Invest** — market's historical 10% return outpaces the 3% loan cost.

---

## Tech Stack

**Frontend** — Next.js 14, React 18, TypeScript, Tailwind CSS, Chart.js

**Backend** — FastAPI (Python), NumPy, Pydantic v2

**Data & Auth** — Supabase (PostgreSQL + RLS), Plaid API, yfinance

---

## Running Locally

```bash
cd net-worth-optimizer
./start.sh
```

See [QUICKSTART.md](net-worth-optimizer/QUICKSTART.md) for environment variable setup and troubleshooting.

---

> This tool is for educational purposes only and does not constitute financial advice.
