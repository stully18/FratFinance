'use client';

import { useState, useEffect } from 'react';
import { useFinancialData } from '../context/FinancialContext';

interface ETFAllocation {
  ticker: string;
  name: string;
  category: string;
  percentage: number;
  monthly_amount: number;
  current_price: number;
  ytd_return: number | null;
  one_year_return: number | null;
  expense_ratio: number;
  description: string;
  risk_level: string;
}

interface PersonalizedPlanResult {
  portfolio_name: string;
  risk_profile: string;
  target_allocation: ETFAllocation[];
  monthly_investment_breakdown: { [key: string]: number };
  projected_value_1yr: number;
  projected_value_5yr: number;
  projected_value_10yr: number;
  projected_value_20yr: number;
  projected_value_30yr: number;
  expected_annual_return: number;
  portfolio_expense_ratio: number;
  rebalancing_frequency: string;
  reasoning: string[];
  next_steps: string[];
  warnings: string[] | null;
}

export default function PersonalizedPlanPage() {
  const { financialData, updateFinancialData } = useFinancialData();

  const [formData, setFormData] = useState({
    monthly_investment_amount: financialData.monthlyBudget,
    risk_tolerance: financialData.riskTolerance,
    financial_goal: financialData.financialGoal,
    time_horizon_years: financialData.timeHorizon,
    current_savings: financialData.currentSavings,
    has_emergency_fund: financialData.hasEmergencyFund
  });

  const [plan, setPlan] = useState<PersonalizedPlanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoGenerate, setAutoGenerate] = useState(true);

  // Auto-generate plan on first load if coming from dashboard with data
  useEffect(() => {
    if (autoGenerate && financialData.monthlyBudget > 0) {
      setAutoGenerate(false);
      handleSubmit();
    }
  }, []);

  // Update form when context changes
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      monthly_investment_amount: financialData.monthlyBudget,
      current_savings: financialData.currentSavings,
      has_emergency_fund: financialData.hasEmergencyFund,
      risk_tolerance: financialData.riskTolerance,
      financial_goal: financialData.financialGoal,
      time_horizon_years: financialData.timeHorizon,
    }));
  }, [financialData]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/api/plan/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await response.json();
      setPlan(data);

      // Sync form data back to context
      updateFinancialData({
        monthlyBudget: formData.monthly_investment_amount,
        currentSavings: formData.current_savings,
        hasEmergencyFund: formData.has_emergency_fund,
        riskTolerance: formData.risk_tolerance as any,
        financialGoal: formData.financial_goal as any,
        timeHorizon: formData.time_horizon_years,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          Personalized Investment Plan
        </h1>
        <p className="text-gray-400 mb-8">
          Get a customized portfolio based on your financial goals, risk tolerance, and real market data
        </p>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Monthly Investment Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Investment Amount
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">$</span>
                <input
                  type="number"
                  name="monthly_investment_amount"
                  value={formData.monthly_investment_amount}
                  onChange={handleChange}
                  min="1"
                  step="1"
                  className="w-full pl-8 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            {/* Current Savings */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Current Savings
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400">$</span>
                <input
                  type="number"
                  name="current_savings"
                  value={formData.current_savings}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  className="w-full pl-8 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>
            </div>

            {/* Time Horizon */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Time Horizon (Years)
              </label>
              <input
                type="number"
                name="time_horizon_years"
                value={formData.time_horizon_years}
                onChange={handleChange}
                min="1"
                max="50"
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>

            {/* Risk Tolerance */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Risk Tolerance
              </label>
              <select
                name="risk_tolerance"
                value={formData.risk_tolerance}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="conservative">Conservative - Stability First</option>
                <option value="moderate">Moderate - Balanced Growth</option>
                <option value="aggressive">Aggressive - Maximum Growth</option>
              </select>
            </div>

            {/* Financial Goal */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Primary Financial Goal
              </label>
              <select
                name="financial_goal"
                value={formData.financial_goal}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="wealth_building">Wealth Building - Long-term Growth</option>
                <option value="income_generation">Income Generation - Dividends</option>
                <option value="capital_preservation">Capital Preservation - Protect Assets</option>
                <option value="debt_freedom">Debt Freedom - Build Emergency Fund</option>
              </select>
            </div>

            {/* Emergency Fund */}
            <div className="flex items-center pt-8">
              <input
                type="checkbox"
                name="has_emergency_fund"
                checked={formData.has_emergency_fund}
                onChange={handleChange}
                className="w-5 h-5 bg-gray-900/50 border border-gray-600 rounded text-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
              <label className="ml-3 text-sm font-medium text-gray-300">
                I have a 3-6 month emergency fund
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg font-semibold text-white hover:from-green-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Generating Plan...' : 'Generate My Investment Plan'}
          </button>
        </form>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 mb-8">
            <p className="text-red-400">Error: {error}</p>
          </div>
        )}

        {/* Results Display */}
        {plan && (
          <div className="space-y-6">
            {/* Portfolio Overview */}
            <div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border border-green-500/30 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-2">{plan.portfolio_name}</h2>
              <p className="text-gray-300 mb-4">Risk Profile: {plan.risk_profile}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Expected Annual Return</div>
                  <div className="text-2xl font-bold text-green-400">{plan.expected_annual_return}%</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Portfolio Expense Ratio</div>
                  <div className="text-2xl font-bold text-blue-400">{plan.portfolio_expense_ratio}%</div>
                </div>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="text-sm text-gray-400">Rebalancing</div>
                  <div className="text-2xl font-bold text-purple-400">{plan.rebalancing_frequency}</div>
                </div>
              </div>
            </div>

            {/* Warnings */}
            {plan.warnings && plan.warnings.length > 0 && (
              <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3 text-yellow-400">Important Warnings</h3>
                <ul className="space-y-2">
                  {plan.warnings.map((warning, idx) => (
                    <li key={idx} className="text-yellow-200 flex items-start">
                      <span className="mr-2">⚠️</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ETF Allocations */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Your Portfolio Allocation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.target_allocation.map((etf) => (
                  <div key={etf.ticker} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 hover:border-green-500/50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-bold text-lg">{etf.ticker}</h4>
                        <p className="text-sm text-gray-400">{etf.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-green-400">{etf.percentage}%</div>
                        <div className="text-sm text-gray-400">${etf.monthly_amount}/mo</div>
                      </div>
                    </div>
                    <div className="text-sm text-gray-300 mb-2">{etf.category}</div>
                    <div className="text-xs text-gray-400 mb-3">{etf.description}</div>
                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="text-gray-400">Price: </span>
                        <span className="text-white">${etf.current_price}</span>
                      </div>
                      {etf.one_year_return !== null && (
                        <div>
                          <span className="text-gray-400">1-Yr: </span>
                          <span className={etf.one_year_return >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {etf.one_year_return > 0 ? '+' : ''}{etf.one_year_return}%
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-400">Expense: </span>
                        <span className="text-white">{etf.expense_ratio}%</span>
                      </div>
                    </div>
                    <div className="mt-2 text-xs">
                      <span className="px-2 py-1 bg-gray-800 rounded text-gray-300">
                        Risk: {etf.risk_level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Projections - Extended */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Projected Portfolio Value</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-gradient-to-br from-green-900/30 to-green-800/30 border border-green-500/30 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-1">1 Year</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${plan.projected_value_1yr.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-teal-900/30 to-teal-800/30 border border-teal-500/30 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-1">5 Years</div>
                  <div className="text-2xl font-bold text-teal-400">
                    ${plan.projected_value_5yr.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border border-blue-500/30 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-1">10 Years</div>
                  <div className="text-2xl font-bold text-blue-400">
                    ${plan.projected_value_10yr.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border border-purple-500/30 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-1">20 Years</div>
                  <div className="text-2xl font-bold text-purple-400">
                    ${plan.projected_value_20yr.toLocaleString()}
                  </div>
                </div>
                <div className="bg-gradient-to-br from-pink-900/30 to-pink-800/30 border border-pink-500/30 rounded-lg p-4">
                  <div className="text-sm text-gray-300 mb-1">30 Years</div>
                  <div className="text-2xl font-bold text-pink-400">
                    ${plan.projected_value_30yr.toLocaleString()}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4">
                * Projections assume consistent monthly contributions and historical average returns. Actual results may vary.
              </p>
            </div>

            {/* Reasoning */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Why This Portfolio?</h3>
              <ul className="space-y-3">
                {plan.reasoning.map((reason, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-green-400 mr-3">✓</span>
                    <span className="text-gray-300">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Next Steps</h3>
              <ol className="space-y-3">
                {plan.next_steps.map((step, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-400 font-bold mr-3">{idx + 1}.</span>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
