'use client';

import { useEffect, useState } from 'react';

interface InvestmentDashboardProps {
  accessToken: string;
}

interface AnalysisData {
  holdings_summary: {
    total_value: number;
    holdings_count: number;
    accounts: any[];
  };
  holdings: any[];
  recent_transactions: any[];
  analysis: {
    health_score: number;
    recommendations: string[];
    strengths: string[];
    warnings: string[];
    asset_allocation?: {
      stocks: number;
      bonds: number;
      other: number;
    };
    recurring_deposits?: {
      detected: boolean;
      average_monthly?: number;
      months_active?: number;
    };
    fee_analysis?: {
      total_fees: number;
      average_per_trade: number;
    };
  };
}

export default function InvestmentDashboard({ accessToken }: InvestmentDashboardProps) {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvestmentData = async () => {
      try {
        setIsLoading(true);
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${API_BASE_URL}/api/investments/analyze`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken, days_back: 365 })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch investment data');
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvestmentData();
  }, [accessToken]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 mx-auto mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-zinc-400">Analyzing your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-zinc-900 border-l-4 border-red-500 rounded-lg p-6 text-center">
        <p className="text-red-400">Error: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { holdings_summary, holdings, recent_transactions, analysis } = data;

  return (
    <div className="space-y-6">
      {/* Health Score Card */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-50 mb-1">Investment Health Score</h2>
            <p className="text-zinc-500 text-sm">Based on diversification, allocation, and investing habits</p>
          </div>
          <div className="text-center">
            <div className={`text-6xl font-semibold tracking-tight ${
              analysis.health_score >= 80 ? 'text-green-400' :
              analysis.health_score >= 60 ? 'text-amber-400' :
              'text-red-400'
            }`}>
              {analysis.health_score}
            </div>
            <div className="text-zinc-500 text-sm">/ 100</div>
          </div>
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-zinc-500 text-sm mb-1">Total Portfolio Value</div>
          <div className="text-3xl font-semibold tracking-tight text-green-400">
            ${holdings_summary.total_value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-zinc-500 text-sm mb-1">Total Holdings</div>
          <div className="text-3xl font-semibold tracking-tight text-zinc-50">{holdings_summary.holdings_count}</div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="text-zinc-500 text-sm mb-1">Accounts</div>
          <div className="text-3xl font-semibold tracking-tight text-zinc-50">{holdings_summary.accounts.length}</div>
        </div>
      </div>

      {/* Asset Allocation */}
      {analysis.asset_allocation && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-50 mb-4">Asset Allocation</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-300">Stocks & ETFs</span>
                <span className="font-semibold text-zinc-200">{analysis.asset_allocation.stocks}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${analysis.asset_allocation.stocks}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-300">Bonds</span>
                <span className="font-semibold text-zinc-200">{analysis.asset_allocation.bonds}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${analysis.asset_allocation.bonds}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-zinc-300">Other</span>
                <span className="font-semibold text-zinc-200">{analysis.asset_allocation.other}%</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1.5">
                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${analysis.asset_allocation.other}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recurring Deposits */}
      {analysis.recurring_deposits && analysis.recurring_deposits.detected && (
        <div className="bg-zinc-900 border-l-4 border-green-500 border-t border-r border-b border-t-zinc-800 border-r-zinc-800 border-b-zinc-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold tracking-tight mb-2 text-green-400">Recurring Deposits Detected</h3>
          <p className="text-zinc-300">
            You're consistently investing <span className="font-semibold text-green-400">
              ${analysis.recurring_deposits.average_monthly?.toLocaleString()}/month
            </span> across {analysis.recurring_deposits.months_active} months.
          </p>
          <p className="text-sm text-zinc-500 mt-2">
            Keep it up! Dollar-cost averaging is a proven strategy for long-term growth.
          </p>
        </div>
      )}

      {/* Strengths, Warnings, Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {analysis.strengths.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-green-400">Strengths</h3>
            <ul className="space-y-2 text-sm">
              {analysis.strengths.map((strength, idx) => (
                <li key={idx} className="text-zinc-300 flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">+</span>
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.warnings.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-red-400">Warnings</h3>
            <ul className="space-y-2 text-sm">
              {analysis.warnings.map((warning, idx) => (
                <li key={idx} className="text-zinc-300 flex items-start gap-2">
                  <span className="text-red-500 mt-0.5">-</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.recommendations.length > 0 && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-3 text-amber-400">Recommendations</h3>
            <ul className="space-y-2 text-sm">
              {analysis.recommendations.map((rec, idx) => (
                <li key={idx} className="text-zinc-300 flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">+</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Holdings Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h3 className="text-xl font-semibold tracking-tight text-zinc-50 mb-4">Your Holdings</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800">
                <th className="text-left py-2 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Ticker</th>
                <th className="text-left py-2 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Name</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Quantity</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Price</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Value</th>
                <th className="text-right py-2 px-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, idx) => (
                <tr key={idx} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="py-3 px-4 font-semibold text-zinc-100">{holding.ticker || 'N/A'}</td>
                  <td className="py-3 px-4 text-sm text-zinc-400">{holding.name}</td>
                  <td className="py-3 px-4 text-right text-zinc-300">{holding.quantity.toFixed(4)}</td>
                  <td className="py-3 px-4 text-right text-zinc-300">${holding.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-zinc-100">
                    ${holding.value.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                  </td>
                  <td className={`py-3 px-4 text-right font-semibold ${
                    holding.gain_loss ? (holding.gain_loss > 0 ? 'text-green-400' : 'text-red-400') : 'text-zinc-500'
                  }`}>
                    {holding.gain_loss ? (
                      <>
                        ${Math.abs(holding.gain_loss).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                        <span className="text-xs ml-1">
                          ({holding.gain_loss_percent > 0 ? '+' : ''}{holding.gain_loss_percent.toFixed(1)}%)
                        </span>
                      </>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions */}
      {recent_transactions.length > 0 && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h3 className="text-xl font-semibold tracking-tight text-zinc-50 mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {recent_transactions.map((txn, idx) => (
              <div key={idx} className="flex justify-between items-center border-b border-zinc-800/50 pb-3">
                <div>
                  <div className="font-semibold text-zinc-100">{txn.ticker || 'N/A'} - {txn.type.toUpperCase()}</div>
                  <div className="text-sm text-zinc-500">{txn.date}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-zinc-100">${Math.abs(txn.amount).toLocaleString()}</div>
                  {txn.quantity > 0 && (
                    <div className="text-sm text-zinc-500">{txn.quantity} shares @ ${txn.price.toFixed(2)}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
