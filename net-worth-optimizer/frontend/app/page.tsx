export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-semibold tracking-tight text-zinc-50 mb-4">
            College Wealth Builder
          </h1>
          <p className="text-2xl text-zinc-400 mb-3">
            Financial tools built for students and new grads
          </p>
          <p className="text-zinc-500 max-w-2xl mx-auto">
            Optimize your debt payoff, maximize your 401(k) match, and build a personalized investment strategy
          </p>
        </div>

        <a
          href="/tools"
          className="inline-block px-12 py-5 bg-blue-500 hover:bg-blue-600 rounded-xl text-2xl font-semibold transition-colors active:scale-[0.98]"
        >
          Get Started
        </a>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="text-3xl mb-2">💳</div>
            <div className="font-semibold text-zinc-100 mb-1">Debt Optimizer</div>
            <div className="text-xs text-zinc-500">Pay debt or invest?</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="text-3xl mb-2">🏦</div>
            <div className="font-semibold text-zinc-100 mb-1">401(k) Calculator</div>
            <div className="text-xs text-zinc-500">Max your match</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="text-3xl mb-2">🛡️</div>
            <div className="font-semibold text-zinc-100 mb-1">Roth IRA</div>
            <div className="text-xs text-zinc-500">Tax-free growth</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold text-zinc-100 mb-1">Investment Plan</div>
            <div className="text-xs text-zinc-500">Build your portfolio</div>
          </div>
        </div>

        <div className="mt-12 text-sm text-zinc-600">
          <p>Not financial advice. Consult a professional for personalized guidance.</p>
        </div>
      </div>
    </div>
  );
}
