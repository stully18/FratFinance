from pydantic import BaseModel, Field
from typing import List, Optional


class LoanData(BaseModel):
    principal: float = Field(..., gt=0, description="Loan principal amount")
    interest_rate: float = Field(..., ge=0, le=1, description="Annual interest rate as decimal (e.g., 0.09)")
    minimum_payment: float = Field(..., gt=0, description="Minimum monthly payment")
    loan_name: str = Field(default="Student Loan", description="Name of the loan")


class MarketAssumptions(BaseModel):
    expected_annual_return: float = Field(default=0.10, ge=0, le=1, description="Expected annual return as decimal")
    volatility: float = Field(default=0.15, ge=0, le=1, description="Standard deviation of returns")
    risk_free_rate: float = Field(default=0.04, ge=0, le=1, description="Risk-free rate")


class MonthlyBreakdown(BaseModel):
    month: int
    debt_path_net_worth: float
    invest_path_net_worth: float
    debt_path_loan_balance: float
    invest_path_loan_balance: float
    invest_path_portfolio_value: float


class InvestmentAllocation(BaseModel):
    name: str
    ticker: str
    percentage: float
    monthly_amount: float
    description: str
    risk_level: str  # 'low', 'medium', 'high'


class OptimizationResult(BaseModel):
    recommendation: str  # 'pay_debt' or 'invest'
    net_worth_debt_path: float
    net_worth_invest_path: float
    monthly_breakdown: List[MonthlyBreakdown]
    crossover_month: Optional[int] = None
    confidence_score: float
    investment_allocations: Optional[List[InvestmentAllocation]] = None
    investment_strategy: Optional[str] = None


class OptimizationRequest(BaseModel):
    loan: LoanData
    monthly_budget: float = Field(..., gt=0, description="Monthly spare cash available")
    months_until_graduation: int = Field(default=48, gt=0, le=120, description="Months until graduation")
    market_assumptions: MarketAssumptions = Field(default_factory=MarketAssumptions)
