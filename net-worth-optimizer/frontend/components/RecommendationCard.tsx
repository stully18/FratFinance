'use client';

interface RecommendationCardProps {
  recommendation: string;
  netWorthDebtPath: number;
  netWorthInvestPath: number;
  confidenceScore: number;
}

export default function RecommendationCard({
  recommendation,
  netWorthDebtPath,
  netWorthInvestPath,
  confidenceScore
}: RecommendationCardProps) {
  const isPayDebt = recommendation === 'pay_debt';
  const winningValue = isPayDebt ? netWorthDebtPath : netWorthInvestPath;
  const losingValue = isPayDebt ? netWorthInvestPath : netWorthDebtPath;
  const advantage = winningValue - losingValue;

  return (
    <div className={`p-8 rounded-2xl border-2 ${
      isPayDebt
        ? 'bg-gradient-to-br from-red-900/20 to-red-950/10 border-red-500/50'
        : 'bg-gradient-to-br from-green-900/20 to-green-950/10 border-green-500/50'
    }`}>
      <div className="text-center">
        <div className="text-gray-400 text-sm font-medium uppercase tracking-wide mb-2">
          Optimal Strategy
        </div>
        <div className={`text-5xl font-bold mb-4 ${
          isPayDebt ? 'text-accent-red' : 'text-accent-green'
        }`}>
          {isPayDebt ? '🎯 Pay Debt' : '📈 Invest'}
        </div>

        <div className="space-y-3 mb-6">
          <div>
            <div className="text-gray-400 text-sm">Net Worth at Graduation</div>
            <div className="text-3xl font-bold text-white">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0
              }).format(winningValue)}
            </div>
          </div>

          <div className="text-sm text-gray-400">
            <span className={isPayDebt ? 'text-accent-red' : 'text-accent-green'}>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                signDisplay: 'always'
              }).format(advantage)}
            </span>
            {' '}better than the alternative
          </div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-400">Confidence</span>
            <span className="text-white font-semibold">
              {(confidenceScore * 100).toFixed(0)}%
            </span>
          </div>
          <div className="bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${isPayDebt ? 'bg-accent-red' : 'bg-accent-green'}`}
              style={{ width: `${confidenceScore * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg">
          <p className="text-xs text-gray-400 leading-relaxed">
            {isPayDebt ? (
              <>
                Your loan interest rate is higher than the S&P 500's 10% historical average return.
                Paying debt is a <span className="text-white font-semibold">guaranteed return</span> - eliminate it first.
              </>
            ) : (
              <>
                The S&P 500's 10% historical return beats your loan interest rate.
                Pay minimums and invest the difference for maximum wealth growth.
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
