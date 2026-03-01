export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <div className="text-7xl mb-6">💰</div>
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            College Wealth Builder
          </h1>
          <p className="text-2xl text-gray-300 mb-3">
            Financial tools built for students and new grads
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Optimize your debt payoff, maximize your 401(k) match, and build a personalized investment strategy
          </p>
        </div>

        <a
          href="/tools"
          className="inline-block px-12 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl text-2xl font-bold transition-all transform hover:scale-105 shadow-lg"
        >
          Get Started
        </a>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
            <div className="text-3xl mb-2">💳</div>
            <div className="font-bold mb-1">Debt Optimizer</div>
            <div className="text-xs text-gray-400">Pay debt or invest?</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
            <div className="text-3xl mb-2">🏦</div>
            <div className="font-bold mb-1">401(k) Calculator</div>
            <div className="text-xs text-gray-400">Max your match</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
            <div className="text-3xl mb-2">🛡️</div>
            <div className="font-bold mb-1">Roth IRA</div>
            <div className="text-xs text-gray-400">Tax-free growth</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-5">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-bold mb-1">Investment Plan</div>
            <div className="text-xs text-gray-400">Build your portfolio</div>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Not financial advice. Consult a professional for personalized guidance.</p>
        </div>
      </div>
    </div>
  );
}
