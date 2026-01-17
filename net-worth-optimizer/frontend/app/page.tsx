'use client';

import { useState } from 'react';
import PlaidInvestmentButton from '@/components/PlaidInvestmentButton';

interface FinancialData {
  net_worth: number;
  liquid_net_worth?: number;
  total_assets: number;
  liquid_assets?: number;
  total_liabilities: number;
  bank_accounts: {
    total_balance: number;
    accounts: any[];
  };
  investments: {
    total_value: number;
    total_retirement_value?: number;
    total_taxable_value?: number;
    holdings: any[];
    retirement_accounts?: any[];
    taxable_accounts?: any[];
  };
  liabilities: {
    student_loans: any[];
    credit_cards: any[];
    total_student_loan_debt: number;
    total_credit_card_debt: number;
    total_debt: number;
  };
}

interface ActionPlan {
  actions: Array<{
    priority: number;
    action: string;
    account?: string;
    amount?: number;
    type?: string;
    reason: string;
    recommended_allocation?: any[];
    max_contribution?: number;
    remaining?: number;
    current_contribution?: number;
  }>;
  reasoning: string[];
  summary: {
    total_actions: number;
    emergency_fund_status: string;
  };
  projections: {
    current_net_worth: number;
    projected_1yr: number;
    projected_5yr: number;
    gain_1yr: number;
    gain_5yr: number;
  };
}

export default function UnifiedDashboard() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState(7);

  const handleConnection = async (publicToken: string) => {
    try {
      setIsLoading(true);

      // Exchange token
      const exchangeResponse = await fetch('http://localhost:8000/api/plaid/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token: publicToken })
      });
      const { access_token } = await exchangeResponse.json();
      setAccessToken(access_token);

      // Get complete financial picture
      const pictureResponse = await fetch('http://localhost:8000/api/dashboard/complete-picture', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token })
      });
      const pictureData = await pictureResponse.json();
      setFinancialData(pictureData);

      // Generate action plan
      const planResponse = await fetch('http://localhost:8000/api/dashboard/action-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token, risk_tolerance: riskTolerance })
      });
      const planData = await planResponse.json();
      setActionPlan(planData);

    } catch (error) {
      console.error('Error:', error);
      alert('Failed to fetch financial data');
    } finally {
      setIsLoading(false);
    }
  };

  if (!financialData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              College Wealth Builder
            </h1>
            <p className="text-xl text-gray-400">
              Your complete financial picture in one place
            </p>
          </div>

          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-12 text-center">
            <svg
              className="w-24 h-24 mx-auto mb-6 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>

            <h2 className="text-3xl font-bold mb-4">Connect All Your Accounts</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              One connection gets everything: bank accounts, investments, student loans, and credit cards
            </p>

            {isLoading ? (
              <div className="text-gray-400">Loading your financial data...</div>
            ) : (
              <PlaidInvestmentButton onSuccess={handleConnection} />
            )}

            <div className="mt-10 grid grid-cols-2 gap-4 text-left max-w-lg mx-auto">
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-green-400 font-bold mb-1">✓ Bank Accounts</div>
                <div className="text-sm text-gray-400">Checking & savings balances</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-green-400 font-bold mb-1">✓ Investments</div>
                <div className="text-sm text-gray-400">Fidelity, Robinhood, 401k, IRA</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-green-400 font-bold mb-1">✓ Student Loans</div>
                <div className="text-sm text-gray-400">Balances & interest rates</div>
              </div>
              <div className="bg-gray-700/30 rounded-lg p-4">
                <div className="text-green-400 font-bold mb-1">✓ Credit Cards</div>
                <div className="text-sm text-gray-400">Balances & APRs</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const netWorthColor = financialData.net_worth >= 0 ? 'text-green-500' : 'text-red-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-1">College Wealth Builder</h1>
            <p className="text-sm text-gray-400">Your complete financial picture</p>
          </div>
          <div className="flex gap-2">
            <a href="/calculator" className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 rounded transition-colors">
              💰 Calculator
            </a>
            <a href="/plan" className="px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 rounded transition-colors">
              📊 Plan
            </a>
            <a href="/investments" className="px-3 py-1.5 text-sm bg-purple-600 hover:bg-purple-700 rounded transition-colors">
              📈 Analyze
            </a>
            <a href="/roth-ira" className="px-3 py-1.5 text-sm bg-yellow-600 hover:bg-yellow-700 rounded transition-colors">
              🎓 Learn
            </a>
          </div>
        </div>

        {/* Net Worth Hero */}
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Liquid Net Worth (Main Focus) */}
            <div className="text-center md:border-r border-gray-700">
              <div className="text-gray-400 text-xs mb-1">LIQUID NET WORTH</div>
              <div className={`text-5xl font-bold ${(financialData.liquid_net_worth ?? financialData.net_worth) >= 0 ? 'text-green-400' : 'text-red-400'} mb-2`}>
                ${Math.abs(financialData.liquid_net_worth ?? financialData.net_worth ?? 0).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Money you can access now (excludes retirement)</div>
            </div>

            {/* Total Net Worth */}
            <div className="text-center">
              <div className="text-gray-400 text-xs mb-1">TOTAL NET WORTH</div>
              <div className={`text-4xl font-bold ${netWorthColor} mb-2`}>
                ${Math.abs(financialData.net_worth).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Includes retirement accounts</div>
            </div>
          </div>

          <div className="flex justify-center gap-6 text-xs mt-4 pt-4 border-t border-gray-700">
            <div>
              <span className="text-gray-400">Liquid Assets:</span>
              <span className="ml-2 font-semibold text-green-400">
                ${((financialData.liquid_assets ?? financialData.total_assets) || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Retirement:</span>
              <span className="ml-2 font-semibold text-blue-400">
                ${(financialData.investments?.total_retirement_value ?? 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-400">Debt:</span>
              <span className="ml-2 font-semibold text-red-400">
                ${(financialData.total_liabilities || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        {actionPlan && actionPlan.actions && actionPlan.actions.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">💡 Your Action Plan</h2>
            <div className="space-y-4">
              {actionPlan.actions.map((action, idx) => (
                <div key={idx} className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-yellow-600 text-white px-2 py-1 rounded text-xs font-bold">
                          PRIORITY {action.priority}
                        </span>
                        <span className="text-lg font-bold">
                          {action.action === 'pay_debt' && '💳 Pay Off Debt'}
                          {action.action === 'invest' && '📈 Invest'}
                          {action.action === 'build_emergency_fund' && '🏦 Build Emergency Fund'}
                          {action.action === 'open_roth_ira' && '🎯 Open Roth IRA'}
                        </span>
                      </div>
                      {action.account && (
                        <div className="text-gray-300 mb-1">Account: {action.account}</div>
                      )}

                      {/* Display amount for actions that have it */}
                      {action.amount !== undefined && (
                        <div className="text-2xl font-bold text-green-400 mb-2">
                          ${action.amount.toLocaleString()}
                        </div>
                      )}

                      {/* Roth IRA specific display */}
                      {action.action === 'open_roth_ira' && (
                        <div className="mb-2">
                          <div className="text-gray-300">Max Contribution: <span className="text-green-400 font-bold">${action.max_contribution?.toLocaleString()}</span></div>
                          {action.remaining && (
                            <div className="text-sm text-gray-400">Remaining this year: ${action.remaining.toLocaleString()}</div>
                          )}
                        </div>
                      )}

                      <div className="text-sm text-gray-400">{action.reason}</div>

                      {action.recommended_allocation && action.recommended_allocation.length > 0 && (
                        <div className="mt-4 bg-gray-700/50 rounded p-3">
                          <div className="text-sm font-semibold mb-2">Buy these ETFs:</div>
                          <div className="space-y-1">
                            {action.recommended_allocation.map((alloc: any, i: number) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span>{alloc.ticker} - {alloc.name}</span>
                                <span className="font-semibold">${alloc.amount.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
              <h3 className="font-bold mb-2">Why This Plan?</h3>
              <ul className="space-y-1 text-sm text-gray-300">
                {actionPlan.reasoning.map((reason, idx) => (
                  <li key={idx}>• {reason}</li>
                ))}
              </ul>
            </div>

            {/* Projections */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-gray-400 text-xs mb-1">CURRENT</div>
                <div className="text-2xl font-bold">${actionPlan.projections.current_net_worth.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-gray-400 text-xs mb-1">IN 1 YEAR</div>
                <div className="text-2xl font-bold text-green-400">${actionPlan.projections.projected_1yr.toLocaleString()}</div>
                <div className="text-xs text-gray-500">+${actionPlan.projections.gain_1yr.toLocaleString()}</div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="text-gray-400 text-xs mb-1">IN 5 YEARS</div>
                <div className="text-2xl font-bold text-green-400">${actionPlan.projections.projected_5yr.toLocaleString()}</div>
                <div className="text-xs text-gray-500">+${actionPlan.projections.gain_5yr.toLocaleString()}</div>
              </div>
            </div>
          </div>
        )}

        {/* Account Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Bank Accounts */}
          {financialData.bank_accounts && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">🏦 Bank Accounts</h3>
              <div className="text-3xl font-bold text-green-400 mb-4">
                ${(financialData.bank_accounts.total_balance || 0).toLocaleString()}
              </div>
              <div className="space-y-2">
                {financialData.bank_accounts.accounts?.map((acc: any, idx: number) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-400">{acc.name}</span>
                    <span className="font-semibold">${(acc.balance || 0).toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Investments */}
          {financialData.investments && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">📈 Investments</h3>
              <div className="text-3xl font-bold text-blue-400 mb-4">
                ${(financialData.investments.total_value || 0).toLocaleString()}
              </div>
              <div className="text-sm text-gray-400">
                {financialData.investments.holdings?.length || 0} holdings
              </div>
            </div>
          )}

          {/* Student Loans */}
          {financialData.liabilities?.student_loans?.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">🎓 Student Loans</h3>
              <div className="text-3xl font-bold text-red-400 mb-4">
                ${(financialData.liabilities.total_student_loan_debt || 0).toLocaleString()}
              </div>
              <div className="space-y-2">
                {financialData.liabilities.student_loans.map((loan: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{loan.loan_name || `Loan ${idx + 1}`}</span>
                      <span className="font-semibold">${(loan.balance || 0).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">APR: {loan.interest_rate || 0}%</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Credit Cards */}
          {financialData.liabilities?.credit_cards?.length > 0 && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">💳 Credit Cards</h3>
              <div className="text-3xl font-bold text-red-400 mb-4">
                ${(financialData.liabilities.total_credit_card_debt || 0).toLocaleString()}
              </div>
              <div className="space-y-2">
                {financialData.liabilities.credit_cards.map((card: any, idx: number) => (
                  <div key={idx} className="text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{card.name}</span>
                      <span className="font-semibold">${(card.balance || 0).toLocaleString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      APR: {card.apr || 0}% | Utilization: {(card.utilization || 0).toFixed(0)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
