export interface LoanData {
  loan_name: string;
  principal: number;
  interest_rate: number;
  minimum_payment: number;
}

export interface MarketAssumptions {
  expected_annual_return: number;
  volatility: number;
  risk_free_rate: number;
}

export interface MonthlyBreakdown {
  month: number;
  debt_path_net_worth: number;
  invest_path_net_worth: number;
  debt_path_loan_balance: number;
  invest_path_loan_balance: number;
  invest_path_portfolio_value: number;
}

export interface InvestmentAllocation {
  name: string;
  ticker: string;
  percentage: number;
  monthly_amount: number;
  description: string;
  risk_level: string;
}

export interface OptimizationResult {
  recommendation: string;
  net_worth_debt_path: number;
  net_worth_invest_path: number;
  monthly_breakdown: MonthlyBreakdown[];
  crossover_month: number | null;
  confidence_score: number;
  investment_allocations?: InvestmentAllocation[];
  investment_strategy?: string;
}

export interface OptimizationRequest {
  loan: LoanData;
  monthly_budget: number;
  months_until_graduation: number;
  market_assumptions: MarketAssumptions;
}
