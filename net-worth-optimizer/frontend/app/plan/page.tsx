'use client';

import { useState } from 'react';

interface InvestmentPlan {
  risk_profile: string;
  risk_tolerance: number;
  allocation: {
    stocks: number;
    bonds: number;
    cash: number;
  };
  allocation_dollars: {
    stocks: number;
    bonds: number;
    cash: number;
  };
  recommendations: Array<{
    category: string;
    ticker: string;
    name: string;
    allocation_percent: number;
    dollar_amount: number;
    expense_ratio: number;
    reason: string;
  }>;
  monthly_allocation: Array<{
    ticker: string;
    name: string;
    monthly_amount: number;
  }>;
  advice: string[];
  projections: {
    expected_annual_return: number;
    years: number;
    current_value: number;
    future_value: number;
    total_gain: number;
  };
  next_steps: string[];
}

export default function InvestmentPlanPage() {
  const [portfolioValue, setPortfolioValue] = useState('');
  const [riskTolerance, setRiskTolerance] = useState(5);
  const [monthlyContribution, setMonthlyContribution] = useState('');
  const [plan, setPlan] = useState<InvestmentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/investments/create-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total_portfolio_value: parseFloat(portfolioValue) || 0,
          risk_tolerance: riskTolerance,
          monthly_contribution: parseFloat(monthlyContribution) || 0
        })
      });

      if (!response.ok) throw new Error('Failed to generate plan');

      const data = await response.json();
      setPlan(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate investment plan');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLabel = (risk: number) => {
    if (risk <= 3) return 'Conservative';
    if (risk <= 6) return 'Moderate';
    return 'Aggressive';
  };

  const getRiskColor = (risk: number) => {
    if (risk <= 3) return 'text-blue-400';
    if (risk <= 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <a
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Optimizer
          </a>
        </div>

        <h1 className="text-4xl font-bold mb-2">Investment Plan Generator</h1>
        <p className="text-gray-400 mb-8">
          Get a personalized investment strategy based on your money and risk tolerance
        </p>

        {/* Input Form */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
          <form onSubmit={handleGeneratePlan}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  How much money do you have to invest? ($)
                </label>
                <input
                  type="number"
                  value={portfolioValue}
                  onChange={(e) => setPortfolioValue(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10000"
                  required
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Monthly Contribution ($)
                </label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="500"
                  min="0"
                  step="0.01"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Risk Tolerance: <span className={getRiskColor(riskTolerance)}>{riskTolerance}/10 - {getRiskLabel(riskTolerance)}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={riskTolerance}
                  onChange={(e) => setRiskTolerance(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative</span>
                  <span>Aggressive</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors"
            >
              {isLoading ? 'Generating Plan...' : 'Generate My Investment Plan'}
            </button>
          </form>
        </div>

        {/* Results */}
        {plan && (
          <div className="space-y-6">
            {/* Risk Profile & Allocation */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">Your Investment Strategy: {plan.risk_profile.toUpperCase()}</h2>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-blue-400">{plan.allocation.stocks}%</div>
                  <div className="text-sm text-gray-400">Stocks</div>
                  <div className="text-lg font-semibold mt-2">${plan.allocation_dollars.stocks.toLocaleString()}</div>
                </div>
                <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400">{plan.allocation.bonds}%</div>
                  <div className="text-sm text-gray-400">Bonds</div>
                  <div className="text-lg font-semibold mt-2">${plan.allocation_dollars.bonds.toLocaleString()}</div>
                </div>
                <div className="bg-purple-900/20 border border-purple-700 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-purple-400">{plan.allocation.cash}%</div>
                  <div className="text-sm text-gray-400">Cash</div>
                  <div className="text-lg font-semibold mt-2">${plan.allocation_dollars.cash.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Specific Recommendations */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">What To Buy</h3>
              <div className="space-y-4">
                {plan.recommendations.map((rec, idx) => (
                  <div key={idx} className="bg-gray-700/50 border border-gray-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="text-lg font-bold">{rec.ticker} - {rec.name}</div>
                        <div className="text-sm text-gray-400">{rec.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-400">${rec.dollar_amount.toLocaleString()}</div>
                        <div className="text-sm text-gray-400">{rec.allocation_percent.toFixed(1)}% of portfolio</div>
                      </div>
                    </div>

                    {/* Market Data Section */}
                    {rec.market_data && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3 p-3 bg-gray-800/50 rounded">
                        <div>
                          <div className="text-xs text-gray-500">Current Price</div>
                          <div className="text-sm font-semibold">${rec.market_data.current_price.toFixed(2)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">1-Year Return</div>
                          <div className={`text-sm font-semibold ${rec.market_data['1yr_return'] >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {rec.market_data['1yr_return']?.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">5-Year Return</div>
                          <div className={`text-sm font-semibold ${rec.market_data['5yr_return'] >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {rec.market_data['5yr_return']?.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Dividend Yield</div>
                          <div className="text-sm font-semibold text-blue-400">{rec.market_data.dividend_yield.toFixed(2)}%</div>
                        </div>
                      </div>
                    )}

                    <div className="text-sm text-gray-300 mb-2">{rec.reason}</div>
                    <div className="text-xs text-gray-500">Expense Ratio: {rec.expense_ratio}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Contributions */}
            {plan.monthly_allocation.length > 0 && (
              <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Monthly Auto-Invest Plan</h3>
                <div className="space-y-2">
                  {plan.monthly_allocation.map((alloc, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-gray-700/50 border border-gray-600 rounded-lg p-3">
                      <div>
                        <span className="font-bold">{alloc.ticker}</span> - {alloc.name}
                      </div>
                      <div className="text-lg font-bold text-green-400">
                        ${alloc.monthly_amount.toFixed(2)}/month
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projections */}
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">10-Year Projection</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-gray-400 text-sm mb-1">Starting Value</div>
                  <div className="text-3xl font-bold">${plan.projections.current_value.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-400 text-sm mb-1">Expected Value in {plan.projections.years} Years</div>
                  <div className="text-3xl font-bold text-green-400">${plan.projections.future_value.toLocaleString()}</div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-700">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Gain:</span>
                  <span className="text-2xl font-bold text-green-400">${plan.projections.total_gain.toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-500 mt-2">
                  Based on {plan.projections.expected_annual_return}% average annual return
                </div>
              </div>
            </div>

            {/* Personalized Advice */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Personalized Advice</h3>
              <ul className="space-y-2">
                {plan.advice.map((tip, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-yellow-400">💡</span>
                    <span className="text-gray-300">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Next Steps</h3>
              <ol className="space-y-2">
                {plan.next_steps.map((step, idx) => (
                  <li key={idx} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
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
