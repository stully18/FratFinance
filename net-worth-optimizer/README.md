# Net Worth Optimizer

A web application that helps college students make mathematically optimal financial decisions: should they pay off debt or invest their spare cash?

## The Problem

Students often face the dilemma: "I have $100 extra this month. Should I pay down my student loan or invest it?"

This app solves that by comparing:
- **Scenario A**: Paying extra toward debt (guaranteed return = loan interest saved)
- **Scenario B**: Investing in the market (expected return = 10% annually - S&P 500 historical average)

## Features

- **Debt-Aware Investing**: Compares loan interest rates vs. market returns
- **Specific Investment Recommendations**: Get exact ETF allocations with ticker symbols (VOO, VXUS, BND)
- **Risk-Adjusted Portfolios**: Automatic strategy adjustment based on time until graduation
- **Visual Projections**: See your net worth trajectory over time for both strategies
- **How-to-Invest Guide**: Step-by-step instructions for executing the investment plan
- **Clear Recommendations**: Get a definitive answer with confidence scoring
- **College-Optimized**: Designed for 4-year graduation timelines

## Tech Stack

### Backend
- **FastAPI**: Python web framework for the API
- **NumPy**: Financial calculations and optimization engine
- **Pydantic**: Data validation

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern, dark-mode UI
- **Chart.js**: Interactive data visualizations

## Getting Started

### Prerequisites

- Python 3.9+ (for backend)
- Node.js 18+ (for frontend)
- npm or yarn

### Installation

#### 1. Clone the repository

```bash
cd net-worth-optimizer
```

#### 2. Set up the Backend

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the FastAPI server
uvicorn app.main:app --reload
```

The backend will start at `http://localhost:8000`

To verify it's running, visit `http://localhost:8000` in your browser.

#### 3. Set up the Frontend

Open a **new terminal window** (keep the backend running), then:

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will start at `http://localhost:3000`

### Usage

1. Open your browser to `http://localhost:3000`
2. Enter your loan details:
   - Principal amount
   - Interest rate
   - Minimum monthly payment
   - Monthly spare cash
   - Months until graduation
3. Click "Optimize My Money"
4. View your personalized recommendation and projections

## Example Scenarios

### Scenario 1: High-Interest Loan (9%)
- **Loan**: $25,000 at 9% interest
- **Spare Cash**: $100/month
- **Result**: ✅ Pay Debt (guaranteed 9% return beats market's 7%)

### Scenario 2: Low-Interest Loan (3%)
- **Loan**: $25,000 at 3% interest
- **Spare Cash**: $100/month
- **Result**: ✅ Invest (market's 7% beats loan's 3%)

## Project Structure

```
net-worth-optimizer/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application
│   │   ├── models/
│   │   │   └── schemas.py       # Pydantic models
│   │   └── services/
│   │       └── optimization_engine.py  # Core calculation logic
│   └── requirements.txt
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Main dashboard
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── InputForm.tsx        # User input form
│   │   ├── RecommendationCard.tsx
│   │   └── ResultsVisualization.tsx
│   ├── lib/
│   │   └── api.ts               # API client
│   └── types/
│       └── index.ts             # TypeScript types
└── README.md
```

## API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

### Main Endpoint

**POST** `/api/optimize`

Request body:
```json
{
  "loan": {
    "principal": 25000,
    "interest_rate": 0.09,
    "minimum_payment": 200,
    "loan_name": "Student Loan"
  },
  "monthly_budget": 100,
  "months_until_graduation": 48,
  "market_assumptions": {
    "expected_annual_return": 0.07,
    "volatility": 0.15,
    "risk_free_rate": 0.04
  }
}
```

Response:
```json
{
  "recommendation": "pay_debt",
  "net_worth_debt_path": -15234.56,
  "net_worth_invest_path": -18567.89,
  "monthly_breakdown": [...],
  "crossover_month": null,
  "confidence_score": 0.85
}
```

## Future Enhancements

### Phase 1 (MVP) ✅
- [x] Basic debt vs. invest comparison
- [x] Single loan support
- [x] Fixed market assumptions

### Phase 2 (ML Integration)
- [ ] Machine learning model for market forecasting
- [ ] Dynamic risk adjustment based on graduation timeline
- [ ] Volatility predictions

### Phase 3 (Advanced Features)
- [ ] Multiple loan support
- [ ] Semester-based cash flow predictions
- [ ] Social comparison (peer benchmarking)
- [ ] User accounts and history tracking

## Contributing

This is a startup concept/prototype. If you're interested in collaborating, please reach out!

## Disclaimer

This tool is for educational purposes only and does not constitute financial advice. Consult a licensed financial advisor for personalized guidance.

## License

MIT License - feel free to use this for your own projects!

---

**Built with ❤️ for college students who want to make smarter financial decisions**
