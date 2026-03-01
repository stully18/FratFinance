"""
Personalized Financial Plan Generator

Creates customized investment portfolios based on:
- Risk tolerance (conservative, moderate, aggressive)
- Financial goals (wealth building, income, capital preservation, debt freedom)
- Time horizon
- Current financial situation

Uses real market data to show actual ETF performance and build realistic portfolios.
"""

from typing import List, Dict
from app.models.schemas import (
    PersonalizedPlanRequest,
    PersonalizedPlanResult,
    ETFAllocation,
    RiskTolerance,
    FinancialGoal
)
from app.services import market_data_fetcher


# Portfolio templates based on risk tolerance
PORTFOLIO_TEMPLATES = {
    RiskTolerance.CONSERVATIVE: {
        "name": "Conservative Growth Portfolio",
        "description": "Focuses on stability and capital preservation with modest growth",
        "allocation": {
            "VOO": 30,  # US Large Cap
            "BND": 50,  # US Bonds
            "VXUS": 10,  # International
            "AGG": 10   # Additional bonds for stability
        },
        "expected_return": 0.06,  # 6% annually
        "rebalance": "Quarterly"
    },
    RiskTolerance.MODERATE: {
        "name": "Balanced Growth Portfolio",
        "description": "Balanced mix of growth and stability for long-term wealth building",
        "allocation": {
            "VOO": 50,   # US Large Cap
            "VXUS": 20,  # International
            "BND": 25,   # Bonds
            "VNQ": 5     # Real Estate for diversification
        },
        "expected_return": 0.08,  # 8% annually
        "rebalance": "Quarterly"
    },
    RiskTolerance.AGGRESSIVE: {
        "name": "Aggressive Growth Portfolio",
        "description": "Maximum growth potential with higher volatility",
        "allocation": {
            "VOO": 50,   # US Large Cap
            "QQQ": 20,   # Tech-heavy growth
            "VXUS": 15,  # International
            "VWO": 10,   # Emerging markets
            "BND": 5     # Small bond position
        },
        "expected_return": 0.10,  # 10% annually
        "rebalance": "Semi-annually"
    }
}

# Goal-based adjustments
GOAL_ADJUSTMENTS = {
    FinancialGoal.WEALTH_BUILDING: {
        "description": "Focus on long-term capital appreciation",
        "adjustments": {}  # Use base allocation
    },
    FinancialGoal.INCOME_GENERATION: {
        "description": "Emphasize dividend-paying investments",
        "adjustments": {
            "BND": +10,  # More bonds for income
            "VNQ": +5,   # REITs for dividends
            "VOO": -15   # Less growth stocks
        }
    },
    FinancialGoal.CAPITAL_PRESERVATION: {
        "description": "Protect existing wealth with minimal risk",
        "adjustments": {
            "BND": +20,   # Much more bonds
            "AGG": +10,   # Additional bond diversification
            "VOO": -20,   # Less stocks
            "VXUS": -10
        }
    },
    FinancialGoal.DEBT_FREEDOM: {
        "description": "Build emergency fund while minimizing investment risk",
        "adjustments": {
            "BND": +15,  # More stable investments
            "VOO": -10,  # Less equity exposure
            "VXUS": -5
        }
    }
}


def generate_personalized_plan(request: PersonalizedPlanRequest) -> PersonalizedPlanResult:
    """
    Generate a personalized investment plan based on user's profile.

    Args:
        request: User's financial situation and preferences

    Returns:
        Detailed investment plan with real ETF data and projections
    """
    print(f"[DEBUG] Generating personalized plan: ${request.monthly_investment_amount}/mo, {request.risk_tolerance.value} risk, {request.financial_goal.value} goal")

    # Get base portfolio template
    template = PORTFOLIO_TEMPLATES[request.risk_tolerance]
    allocation = template["allocation"].copy()

    # Apply goal-based adjustments
    goal_config = GOAL_ADJUSTMENTS[request.financial_goal]
    for ticker, adjustment in goal_config["adjustments"].items():
        if ticker in allocation:
            allocation[ticker] = allocation[ticker] + adjustment
        else:
            allocation[ticker] = adjustment

    # Normalize to 100%
    total = sum(allocation.values())
    allocation = {k: (v / total) * 100 for k, v in allocation.items()}

    # Get list of tickers with positive allocation
    active_tickers = [t for t, pct in allocation.items() if pct > 0]

    # Fetch all ETF data in a single batch request (avoids rate limiting)
    all_etf_data = market_data_fetcher.get_multiple_etf_data(active_tickers)

    # Build ETF allocations from cached data
    etf_allocations = []
    total_expense_ratio = 0.0

    for ticker, percentage in allocation.items():
        if percentage <= 0:
            continue

        # Get market data from batch result
        etf_data = all_etf_data.get(ticker, market_data_fetcher.get_demo_etf_data(ticker))
        monthly_amount = (percentage / 100) * request.monthly_investment_amount

        # Get ETF metadata
        etf_info = get_etf_metadata(ticker)

        etf_allocation = ETFAllocation(
            ticker=ticker,
            name=etf_info["name"],
            category=etf_info["category"],
            percentage=round(percentage, 1),
            monthly_amount=round(monthly_amount, 2),
            current_price=etf_data["price"],
            ytd_return=etf_data.get("ytd_return"),
            one_year_return=etf_data.get("one_year_return"),
            expense_ratio=etf_data["expense_ratio"],
            description=etf_info["description"],
            risk_level=etf_info["risk_level"]
        )
        etf_allocations.append(etf_allocation)

        # Calculate weighted expense ratio
        total_expense_ratio += (percentage / 100) * etf_data["expense_ratio"]

    # Calculate projections
    expected_return = template["expected_return"]

    # Adjust expected return based on goal
    if request.financial_goal == FinancialGoal.CAPITAL_PRESERVATION:
        expected_return *= 0.7  # Lower return expectation
    elif request.financial_goal == FinancialGoal.INCOME_GENERATION:
        expected_return *= 0.85

    current_value = request.current_savings
    monthly_investment = request.monthly_investment_amount

    # Future value calculations (compound interest with monthly contributions)
    projected_1yr = calculate_future_value(current_value, monthly_investment, expected_return, 1)
    projected_5yr = calculate_future_value(current_value, monthly_investment, expected_return, 5)
    projected_10yr = calculate_future_value(current_value, monthly_investment, expected_return, 10)
    projected_20yr = calculate_future_value(current_value, monthly_investment, expected_return, 20)
    projected_30yr = calculate_future_value(current_value, monthly_investment, expected_return, 30)

    # Generate reasoning
    reasoning = generate_reasoning(request, template, goal_config, expected_return)

    # Generate next steps
    next_steps = generate_next_steps(request, etf_allocations)

    # Generate warnings if needed
    warnings = generate_warnings(request)

    # Monthly breakdown
    monthly_breakdown = {
        ticker: round((pct / 100) * monthly_investment, 2)
        for ticker, pct in allocation.items()
        if pct > 0
    }

    result = PersonalizedPlanResult(
        portfolio_name=template["name"],
        risk_profile=request.risk_tolerance.value.title(),
        target_allocation=etf_allocations,
        monthly_investment_breakdown=monthly_breakdown,
        projected_value_1yr=round(projected_1yr, 2),
        projected_value_5yr=round(projected_5yr, 2),
        projected_value_10yr=round(projected_10yr, 2),
        projected_value_20yr=round(projected_20yr, 2),
        projected_value_30yr=round(projected_30yr, 2),
        expected_annual_return=round(expected_return * 100, 1),
        portfolio_expense_ratio=round(total_expense_ratio, 3),
        rebalancing_frequency=template["rebalance"],
        reasoning=reasoning,
        next_steps=next_steps,
        warnings=warnings
    )

    print(f"[DEBUG] Plan generated: {template['name']}, {len(etf_allocations)} ETFs, {expected_return * 100:.1f}% expected return")
    return result


def calculate_future_value(current: float, monthly: float, annual_return: float, years: int) -> float:
    """
    Calculate future value with monthly contributions.

    FV = PV(1+r)^n + PMT * [((1+r)^n - 1) / r]
    """
    if annual_return == 0:
        return current + (monthly * 12 * years)

    monthly_rate = annual_return / 12
    months = years * 12

    # Future value of current savings
    fv_current = current * ((1 + monthly_rate) ** months)

    # Future value of monthly contributions
    fv_contributions = monthly * (((1 + monthly_rate) ** months - 1) / monthly_rate)

    return fv_current + fv_contributions


def get_etf_metadata(ticker: str) -> Dict:
    """
    Get ETF names, categories, and descriptions.
    """
    metadata = {
        "VOO": {
            "name": "Vanguard S&P 500 ETF",
            "category": "US Large Cap Stocks",
            "description": "Tracks the S&P 500 - 500 largest US companies. Core holding for long-term growth.",
            "risk_level": "Medium"
        },
        "VTI": {
            "name": "Vanguard Total Stock Market ETF",
            "category": "US Total Market",
            "description": "Entire US stock market - large, mid, and small cap stocks. Ultimate diversification.",
            "risk_level": "Medium"
        },
        "VXUS": {
            "name": "Vanguard Total International Stock ETF",
            "category": "International Stocks",
            "description": "International diversification across developed and emerging markets.",
            "risk_level": "Medium-High"
        },
        "BND": {
            "name": "Vanguard Total Bond Market ETF",
            "category": "US Bonds",
            "description": "Broad US bond exposure for stability and income. Lower volatility than stocks.",
            "risk_level": "Low"
        },
        "AGG": {
            "name": "iShares Core US Aggregate Bond ETF",
            "category": "US Bonds",
            "description": "Investment-grade US bonds for capital preservation and steady income.",
            "risk_level": "Low"
        },
        "VNQ": {
            "name": "Vanguard Real Estate ETF",
            "category": "Real Estate (REITs)",
            "description": "Real estate investment trusts for diversification and dividend income.",
            "risk_level": "Medium-High"
        },
        "QQQ": {
            "name": "Invesco QQQ Trust",
            "category": "US Technology Stocks",
            "description": "Nasdaq-100 tech-heavy index. High growth potential with higher volatility.",
            "risk_level": "High"
        },
        "VWO": {
            "name": "Vanguard Emerging Markets ETF",
            "category": "Emerging Markets",
            "description": "Emerging market stocks for high growth potential. Higher risk and volatility.",
            "risk_level": "High"
        }
    }

    return metadata.get(ticker, {
        "name": ticker,
        "category": "Unknown",
        "description": "ETF details not available",
        "risk_level": "Medium"
    })


def generate_reasoning(request: PersonalizedPlanRequest, template: Dict, goal_config: Dict, expected_return: float) -> List[str]:
    """Generate clear reasoning for the portfolio recommendation."""
    reasoning = []

    # Risk tolerance reasoning
    risk_desc = {
        RiskTolerance.CONSERVATIVE: "You selected conservative risk tolerance, so this portfolio emphasizes stability with bonds and large-cap stocks.",
        RiskTolerance.MODERATE: "You selected moderate risk tolerance, so this portfolio balances growth potential with stability.",
        RiskTolerance.AGGRESSIVE: "You selected aggressive risk tolerance, so this portfolio maximizes growth potential with higher stock allocation."
    }
    reasoning.append(risk_desc[request.risk_tolerance])

    # Goal reasoning
    reasoning.append(f"Your goal is {request.financial_goal.value.replace('_', ' ')} - {goal_config['description'].lower()}")

    # Time horizon reasoning
    if request.time_horizon_years >= 20:
        reasoning.append(f"With a {request.time_horizon_years}-year time horizon, you can weather market volatility and focus on long-term growth.")
    elif request.time_horizon_years >= 10:
        reasoning.append(f"Your {request.time_horizon_years}-year timeline allows for solid growth while managing risk appropriately.")
    else:
        reasoning.append(f"With a {request.time_horizon_years}-year timeline, we balance growth with some stability to protect your capital.")

    # Expected return
    reasoning.append(f"This portfolio targets ~{expected_return * 100:.1f}% annual return based on historical performance of these ETFs.")

    # Monthly investment power
    total_10yr = calculate_future_value(request.current_savings, request.monthly_investment_amount, expected_return, 10)
    reasoning.append(f"Investing ${request.monthly_investment_amount:.0f}/month could grow to ${total_10yr:,.0f} in 10 years.")

    return reasoning


def generate_next_steps(request: PersonalizedPlanRequest, allocations: List[ETFAllocation]) -> List[str]:
    """Generate actionable next steps."""
    steps = []

    if not request.has_emergency_fund:
        steps.append("⚠️ FIRST: Build 3-6 months emergency fund in a high-yield savings account before investing")

    steps.append("Open a brokerage account (Fidelity, Vanguard, or Schwab are excellent choices)")

    steps.append(f"Set up automatic monthly investment of ${request.monthly_investment_amount:.0f}")

    for alloc in allocations:
        steps.append(f"Buy ${alloc.monthly_amount:.0f} of {alloc.ticker} ({alloc.name}) each month")

    steps.append(f"Rebalance your portfolio quarterly or semi-annually")

    steps.append("Review and adjust your plan annually or after major life changes")

    steps.append("Don't panic sell during market downturns - stay the course!")

    return steps


def generate_warnings(request: PersonalizedPlanRequest) -> List[str]:
    """Generate warnings based on user's situation."""
    warnings = []

    if not request.has_emergency_fund:
        warnings.append("You indicated no emergency fund. Consider building 3-6 months of expenses in savings BEFORE investing.")

    if request.monthly_investment_amount > 1000 and request.current_savings < 5000:
        warnings.append("High monthly investment with low savings - ensure you have emergency funds first.")

    if request.time_horizon_years < 5 and request.risk_tolerance == RiskTolerance.AGGRESSIVE:
        warnings.append("Aggressive portfolio with short time horizon is risky. Consider moderate risk instead.")

    if request.financial_goal == FinancialGoal.DEBT_FREEDOM:
        warnings.append("Focus on paying off high-interest debt (>6%) before aggressive investing.")

    return warnings if warnings else None
