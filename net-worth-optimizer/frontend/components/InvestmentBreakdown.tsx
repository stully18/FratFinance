'use client';

import { InvestmentAllocation } from '@/types';

interface InvestmentBreakdownProps {
  allocations: InvestmentAllocation[];
  strategy: string;
  totalMonthly: number;
}

export default function InvestmentBreakdown({
  allocations,
  strategy,
  totalMonthly
}: InvestmentBreakdownProps) {
  const strategyColors = {
    aggressive: 'from-orange-600 to-red-600',
    moderate: 'from-blue-600 to-cyan-600',
    conservative: 'from-green-600 to-emerald-600'
  };

  const strategyDescriptions = {
    aggressive: 'High growth potential, suitable for 3+ years until graduation',
    moderate: 'Balanced approach for 2-3 year timeline',
    conservative: 'Capital preservation for near-term graduation'
  };

  const riskColors = {
    low: 'bg-green-500/20 border-green-500/30 text-green-400',
    medium: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400',
    high: 'bg-red-500/20 border-red-500/30 text-red-400'
  };

  return (
    <div className="bg-card-bg p-8 rounded-2xl border border-gray-800">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-2xl font-bold text-white">Investment Plan</h3>
          <div className={`px-4 py-2 rounded-full bg-gradient-to-r ${strategyColors[strategy as keyof typeof strategyColors]} text-white text-sm font-semibold uppercase tracking-wide`}>
            {strategy} Strategy
          </div>
        </div>
        <p className="text-gray-400 text-sm">
          {strategyDescriptions[strategy as keyof typeof strategyDescriptions]}
        </p>
      </div>

      {/* Total Monthly Investment */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30 rounded-lg">
        <div className="text-sm text-gray-400 mb-1">Total Monthly Investment</div>
        <div className="text-3xl font-bold text-white">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(totalMonthly)}
        </div>
      </div>

      {/* Allocation Cards */}
      <div className="space-y-4">
        {allocations.map((allocation, index) => (
          <div
            key={index}
            className="bg-gray-800/50 p-5 rounded-xl border border-gray-700 hover:border-gray-600 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-semibold text-white">
                    {allocation.name}
                  </h4>
                  <span className={`px-2 py-1 text-xs rounded-full border ${riskColors[allocation.risk_level as keyof typeof riskColors]}`}>
                    {allocation.risk_level} risk
                  </span>
                </div>
                <div className="text-sm text-gray-400 mb-1">
                  Ticker: <span className="text-blue-400 font-mono">{allocation.ticker}</span>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {allocation.description}
                </p>
              </div>
            </div>

            {/* Allocation Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">Allocation</span>
                <span className="text-sm font-semibold text-white">
                  {allocation.percentage}%
                </span>
              </div>
              <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${allocation.percentage}%` }}
                />
              </div>
              <div className="mt-2 text-right">
                <span className="text-lg font-bold text-green-400">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(allocation.monthly_amount)}
                </span>
                <span className="text-sm text-gray-500 ml-1">per month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How to Invest Section */}
      <div className="mt-8 p-6 bg-gradient-to-br from-blue-900/10 to-purple-900/10 border border-blue-500/20 rounded-xl">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <span className="mr-2">💡</span>
          How to Get Started
        </h4>
        <div className="space-y-3 text-sm text-gray-300">
          <div className="flex items-start">
            <span className="text-blue-400 font-bold mr-3">1.</span>
            <div>
              <span className="font-semibold text-white">Open a brokerage account:</span>
              <span className="text-gray-400"> Choose Fidelity, Vanguard, or Schwab (commission-free trading)</span>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-blue-400 font-bold mr-3">2.</span>
            <div>
              <span className="font-semibold text-white">Set up automatic investing:</span>
              <span className="text-gray-400"> Schedule monthly transfers on payday</span>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-blue-400 font-bold mr-3">3.</span>
            <div>
              <span className="font-semibold text-white">Buy the ETFs listed above:</span>
              <span className="text-gray-400"> Use the exact percentages shown</span>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-blue-400 font-bold mr-3">4.</span>
            <div>
              <span className="font-semibold text-white">Don't panic sell:</span>
              <span className="text-gray-400"> Markets go up and down. Stay invested through graduation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
