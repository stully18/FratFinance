'use client';

import { useState } from 'react';

export default function RothIRAPage() {
  const [age, setAge] = useState(20);
  const [annualContribution, setAnnualContribution] = useState(7500);
  const [yearsToRetirement, setYearsToRetirement] = useState(45);
  const [expectedReturn, setExpectedReturn] = useState(10);

  // Calculate Roth IRA growth
  const calculateGrowth = () => {
    const years = yearsToRetirement;
    const rate = expectedReturn / 100;

    // Future value of annuity formula
    const futureValue = annualContribution * (((Math.pow(1 + rate, years) - 1) / rate));

    const totalContributed = annualContribution * years;
    const taxFreeGains = futureValue - totalContributed;

    return {
      futureValue: Math.round(futureValue),
      totalContributed: Math.round(totalContributed),
      taxFreeGains: Math.round(taxFreeGains)
    };
  };

  const results = calculateGrowth();

  // Calculate tax savings (assuming 24% tax bracket)
  const taxSavings = Math.round(results.taxFreeGains * 0.24);

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
            Back to Home
          </a>
        </div>

        <h1 className="text-4xl font-bold mb-2">Why Roth IRA is a Superpower for College Students</h1>
        <p className="text-gray-400 mb-8">
          The earlier you start, the more powerful it becomes. Let the math convince you.
        </p>

        {/* Key Benefits */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-900/20 to-green-700/20 border border-green-700 rounded-lg p-6">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-xl font-bold mb-2">Tax-Free Forever</h3>
            <p className="text-gray-300 text-sm">
              All your gains grow TAX-FREE. When you withdraw at retirement, you pay $0 in taxes. Not 1%. Zero.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-blue-700/20 border border-blue-700 rounded-lg p-6">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-bold mb-2">Time is Your Weapon</h3>
            <p className="text-gray-300 text-sm">
              Starting at 20 vs 30 means an extra 10 years of compound growth. That's the difference between $1M and $2M+.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-900/20 to-purple-700/20 border border-purple-700 rounded-lg p-6">
            <div className="text-3xl mb-3">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Flexibility</h3>
            <p className="text-gray-300 text-sm">
              You can withdraw contributions (not gains) anytime penalty-free. Emergency fund + retirement in one.
            </p>
          </div>
        </div>

        {/* Calculator */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Roth IRA Growth Calculator</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Your Current Age: {age}
              </label>
              <input
                type="range"
                min="18"
                max="30"
                value={age}
                onChange={(e) => {
                  const newAge = parseInt(e.target.value);
                  setAge(newAge);
                  setYearsToRetirement(65 - newAge);
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Annual Contribution: ${annualContribution.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="7500"
                step="500"
                value={annualContribution}
                onChange={(e) => setAnnualContribution(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">Max contribution: $7,500/year (2026 limit)</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Years Until Retirement (65): {yearsToRetirement}
              </label>
              <input
                type="range"
                min="20"
                max="50"
                value={yearsToRetirement}
                onChange={(e) => setYearsToRetirement(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Expected Annual Return: {expectedReturn}%
              </label>
              <input
                type="range"
                min="5"
                max="12"
                step="0.5"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="text-xs text-gray-500 mt-1">S&P 500 historical average: ~10%</div>
            </div>
          </div>

          {/* Results */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-700 rounded-lg p-6">
            <h3 className="text-xl font-bold mb-4">Your Roth IRA at Age {age + yearsToRetirement}</h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-gray-400 text-sm mb-1">Total You Contributed</div>
                <div className="text-2xl font-bold text-blue-400">
                  ${results.totalContributed.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Tax-Free Gains</div>
                <div className="text-2xl font-bold text-green-400">
                  ${results.taxFreeGains.toLocaleString()}
                </div>
              </div>

              <div>
                <div className="text-gray-400 text-sm mb-1">Total Value</div>
                <div className="text-3xl font-bold text-purple-400">
                  ${results.futureValue.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Tax Savings (vs taxable account):</span>
                <span className="text-2xl font-bold text-yellow-400">${taxSavings.toLocaleString()}</span>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                This is money you'd pay to the IRS if this was a regular brokerage account. With a Roth IRA, you keep it all.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">How Roth IRA Works</h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-bold mb-1">Contribute After-Tax Money</h4>
                <p className="text-gray-400 text-sm">
                  You contribute money you've already paid taxes on. Up to $7,500/year (2026 limit).
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-bold mb-1">Invest Inside the Roth IRA</h4>
                <p className="text-gray-400 text-sm">
                  Buy ETFs like VOO, VTI, VXUS inside your Roth IRA. Same investing, but tax-advantaged.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold">3</div>
              <div>
                <h4 className="font-bold mb-1">Growth is 100% Tax-Free</h4>
                <p className="text-gray-400 text-sm">
                  Your money grows for decades. Dividends, capital gains, everything compounds tax-free.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold">4</div>
              <div>
                <h4 className="font-bold mb-1">Withdraw Tax-Free at Retirement (59½)</h4>
                <p className="text-gray-400 text-sm">
                  After age 59½, withdraw it all tax-free. Your $315,000 (from example above) becomes $315,000 in your pocket, not $239,400.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Common Questions */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Common Questions</h2>

          <div className="space-y-4">
            <div>
              <h4 className="font-bold mb-2 text-blue-400">Can I withdraw my money if I need it?</h4>
              <p className="text-gray-300 text-sm">
                Yes! You can withdraw your <strong>contributions</strong> (not gains) anytime, tax and penalty-free.
                If you contribute $7,000 this year, you can take that $7,000 out later if needed. The gains must stay until 59½.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2 text-blue-400">Do I qualify?</h4>
              <p className="text-gray-300 text-sm">
                You must have earned income (job, internship, self-employment). Income limits: Single filers making less than $161,000 can contribute the full amount (2024).
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2 text-blue-400">Which is better: Roth IRA or 401(k)?</h4>
              <p className="text-gray-300 text-sm">
                Do <strong>both</strong> if you can. 401(k) gets company match (free money). Roth IRA has more investment options and tax-free withdrawals.
                Priority: 401(k) to match → Roth IRA max → More 401(k).
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-2 text-blue-400">What if I don't have $7,500/year?</h4>
              <p className="text-gray-300 text-sm">
                That's okay! Even $100/month ($1,200/year) is powerful. The key is starting early and being consistent.
                $1,200/year from age 20-65 at 10% = $895,000.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-700 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Ready to Start?</h2>

          <ol className="space-y-3 mb-6">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
              <span className="text-gray-300">Open a Roth IRA at Fidelity, Vanguard, or Schwab (all free, no minimums)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
              <span className="text-gray-300">Link your bank account and transfer your first contribution</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
              <span className="text-gray-300">Buy your first ETF (VOO or VTI - can't go wrong)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
              <span className="text-gray-300">Set up automatic monthly contributions and forget about it</span>
            </li>
          </ol>

          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4">
            <p className="text-yellow-400 font-semibold mb-2">The Best Time to Start Was Yesterday</p>
            <p className="text-gray-300 text-sm">
              The second best time is today. Every year you wait costs you tens of thousands in lost growth.
              Even if you can only contribute $1,000 this year, that's $1,000 growing tax-free for 45 years.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
