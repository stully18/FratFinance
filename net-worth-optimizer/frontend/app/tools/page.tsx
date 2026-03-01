'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import ToolCard from '@/components/ToolCard';

export default function ToolsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (authLoading === false && user === null) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          <p className="text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const tools = [
    {
      href: '/tools/debt-optimizer',
      icon: '💳',
      title: 'Debt Optimizer',
      description: 'Add all your loans and find the optimal payoff strategy vs investing',
      features: [
        'Multi-loan support (student, car, credit card)',
        'Avalanche vs snowball comparison',
        'Live VOO market data',
        'Pay debt or invest recommendation',
      ],
      gradientFrom: 'from-orange-900/20',
      gradientTo: 'to-red-900/20',
      borderColor: 'border-orange-700/50',
    },
    {
      href: '/tools/401k',
      icon: '🏦',
      title: '401(k) Calculator',
      description: 'Calculate your 401(k) growth with employer matching contributions',
      features: [
        'Employer match calculator',
        'Contribution optimization',
        'Retirement projections',
        'Traditional vs Roth 401(k) comparison',
      ],
      gradientFrom: 'from-blue-900/20',
      gradientTo: 'to-indigo-900/20',
      borderColor: 'border-blue-700/50',
    },
    {
      href: '/tools/investment-plan',
      icon: '📊',
      title: 'Investment Plan',
      description: 'Get a personalized ETF portfolio based on your goals and risk tolerance',
      features: [
        'Risk-adjusted portfolios',
        'Live ETF prices',
        '10-30 year projections',
        'Actionable next steps',
      ],
      gradientFrom: 'from-green-900/20',
      gradientTo: 'to-teal-900/20',
      borderColor: 'border-green-700/50',
    },
    {
      href: '/tools/roth-ira',
      icon: '🛡️',
      title: 'Roth IRA Calculator',
      description: 'See why starting a Roth IRA in college is your financial superpower',
      features: [
        'Tax-free growth calculator',
        'Early starter advantage',
        'Contribution flexibility',
        'Step-by-step guide',
      ],
      gradientFrom: 'from-purple-900/20',
      gradientTo: 'to-pink-900/20',
      borderColor: 'border-purple-700/50',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Financial Tools
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to optimize your finances as a college student or new grad.
            Start with debt optimization, then build your investment strategy.
          </p>
        </div>

        {/* Tool Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>

        {/* Quick Tips */}
        <div className="mt-12 bg-gray-800/30 border border-gray-700/50 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span> Recommended Order
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center font-bold">1</span>
              <div>
                <div className="font-semibold">Debt Optimizer</div>
                <div className="text-sm text-gray-400">See if you should pay debt first</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-bold">2</span>
              <div>
                <div className="font-semibold">401(k) Calculator</div>
                <div className="text-sm text-gray-400">Max your employer match</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold">3</span>
              <div>
                <div className="font-semibold">Roth IRA</div>
                <div className="text-sm text-gray-400">Tax-free retirement savings</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center font-bold">4</span>
              <div>
                <div className="font-semibold">Investment Plan</div>
                <div className="text-sm text-gray-400">Build your portfolio</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
