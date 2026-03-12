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
  const strategyDescriptions = {
    aggressive: 'High growth potential, suitable for 3+ years until graduation',
    moderate: 'Balanced approach for 2-3 year timeline',
    conservative: 'Capital preservation for near-term graduation'
  };

  const riskColors = {
    low: 'bg-zinc-800 border-zinc-700 text-green-400',
    medium: 'bg-zinc-800 border-zinc-700 text-amber-400',
    high: 'bg-zinc-800 border-zinc-700 text-red-400'
  };

  return (
    <div className="bg-zinc-900 p-8 rounded-xl border border-zinc-800">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-semibold text-zinc-50">Investment Plan</h3>
          <div className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-200 text-xs font-medium uppercase tracking-wider">
            {strategy} Strategy
          </div>
        </div>
        <p className="text-zinc-500 text-sm">
          {strategyDescriptions[strategy as keyof typeof strategyDescriptions]}
        </p>
      </div>

      {/* Total Monthly Investment */}
      <div className="mb-6 p-4 bg-zinc-800/50 border border-zinc-800 rounded-lg">
        <div className="text-sm text-zinc-500 mb-1">Total Monthly Investment</div>
        <div className="text-3xl font-semibold text-zinc-50 tracking-tight">
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
            className="bg-zinc-800/30 p-5 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-base font-semibold text-zinc-100">
                    {allocation.name}
                  </h4>
                  <span className={`px-2 py-0.5 text-xs rounded border ${riskColors[allocation.risk_level as keyof typeof riskColors]}`}>
                    {allocation.risk_level} risk
                  </span>
                </div>
                <div className="text-sm text-zinc-500 mb-1">
                  Ticker: <span className="text-blue-400 font-mono">{allocation.ticker}</span>
                </div>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  {allocation.description}
                </p>
              </div>
            </div>

            {/* Allocation Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-500">Allocation</span>
                <span className="text-sm font-medium text-zinc-200">
                  {allocation.percentage}%
                </span>
              </div>
              <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${allocation.percentage}%` }}
                />
              </div>
              <div className="mt-2 text-right">
                <span className="text-lg font-semibold text-green-400">
                  {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(allocation.monthly_amount)}
                </span>
                <span className="text-sm text-zinc-600 ml-1">per month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* How to Invest Section */}
      <div className="mt-8 p-6 bg-zinc-800/30 border border-zinc-800 rounded-xl">
        <h4 className="text-base font-semibold text-zinc-100 mb-4">
          How to Get Started
        </h4>
        <div className="space-y-3 text-sm text-zinc-400">
          <div className="flex items-start">
            <span className="text-blue-400 font-medium mr-3">1.</span>
            <div>
              <span className="font-medium text-zinc-200">Open a brokerage account:</span>
              <span className="text-zinc-500"> Choose Fidelity, Vanguard, or Schwab (commission-free trading)</span>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-blue-400 font-medium mr-3">2.</span>
            <div>
              <span className="font-medium text-zinc-200">Set up automatic investing:</span>
              <span className="text-zinc-500"> Schedule monthly transfers on payday</span>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-blue-400 font-medium mr-3">3.</span>
            <div>
              <span className="font-medium text-zinc-200">Buy the ETFs listed above:</span>
              <span className="text-zinc-500"> Use the exact percentages shown</span>
            </div>
          </div>
          <div className="flex items-start">
            <span className="text-blue-400 font-medium mr-3">4.</span>
            <div>
              <span className="font-medium text-zinc-200">Don't panic sell:</span>
              <span className="text-zinc-500"> Markets go up and down. Stay invested through graduation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
