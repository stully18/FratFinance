'use client';

import { useState } from 'react';
import InputForm from '@/components/InputForm';
import RecommendationCard from '@/components/RecommendationCard';
import ResultsVisualization from '@/components/ResultsVisualization';
import InvestmentBreakdown from '@/components/InvestmentBreakdown';
import { optimizeFinancialPath } from '@/lib/api';
import { OptimizationRequest, OptimizationResult } from '@/types';

export default function Home() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOptimize = async (request: OptimizationRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const optimizationResult = await optimizeFinancialPath(request);
      setResult(optimizationResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to optimize');
      console.error('Optimization error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6">
          <a
            href="/dashboard"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Unified Dashboard
          </a>
          <div className="flex gap-3">
            <a
              href="/plan"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Create Investment Plan
            </a>
            <a
              href="/investments"
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analyze Investments
            </a>
            <a
              href="/roth-ira"
              className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Learn: Roth IRA
            </a>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Net Worth Optimizer
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Should you pay off debt or invest? Let the math decide.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Built for college students who want to maximize their wealth
          </p>
        </div>

        {/* Input Form - Full Width */}
        <div className="mb-8">
          <InputForm onSubmit={handleOptimize} isLoading={isLoading} />

          {error && (
            <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {result ? (
          <div className="space-y-8">
            {/* Top Row: Recommendation and Chart side by side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <RecommendationCard
                recommendation={result.recommendation}
                netWorthDebtPath={result.net_worth_debt_path}
                netWorthInvestPath={result.net_worth_invest_path}
                confidenceScore={result.confidence_score}
              />

              <ResultsVisualization
                monthlyBreakdown={result.monthly_breakdown}
                recommendation={result.recommendation}
              />
            </div>

            {/* Bottom Row: Investment Breakdown (full width when present) */}
            {result.recommendation === 'invest' && result.investment_allocations && (
              <InvestmentBreakdown
                allocations={result.investment_allocations}
                strategy={result.investment_strategy || 'moderate'}
                totalMonthly={result.investment_allocations.reduce((sum, a) => sum + a.monthly_amount, 0)}
              />
            )}
          </div>
        ) : (
          <div className="bg-card-bg p-16 rounded-2xl border border-gray-800 border-dashed flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">💡</div>
              <p className="text-gray-400 text-lg">
                Enter your details above to see your optimal strategy
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>
            This tool uses mathematical modeling to compare debt repayment vs. investing.
            <br />
            Not financial advice. Consult a professional for personalized guidance.
          </p>
        </footer>
      </div>
    </main>
  );
}
