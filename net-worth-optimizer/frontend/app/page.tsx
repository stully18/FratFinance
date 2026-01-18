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
            Smart debt payoff vs investing optimizer for students
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Add your loans, see which debts to tackle first, and get personalized recommendations on whether to pay debt or invest in VOO
          </p>
        </div>

        <a
          href="/dashboard"
          className="inline-block px-12 py-5 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 rounded-xl text-2xl font-bold transition-all transform hover:scale-105 shadow-lg"
        >
          Get Started →
        </a>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="text-4xl mb-3">📊</div>
            <div className="font-bold text-lg mb-2">Multiple Loans</div>
            <div className="text-sm text-gray-400">Student loans, car loans, credit cards - add them all</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="text-4xl mb-3">🎯</div>
            <div className="font-bold text-lg mb-2">Smart Priorities</div>
            <div className="text-sm text-gray-400">Debt avalanche method - highest interest rate first</div>
          </div>
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <div className="text-4xl mb-3">📈</div>
            <div className="font-bold text-lg mb-2">VOO vs Debt</div>
            <div className="text-sm text-gray-400">Compare guaranteed debt returns vs S&P 500 investing</div>
          </div>
        </div>

        <div className="mt-12 text-sm text-gray-500">
          <p>Not financial advice. Consult a professional for personalized guidance.</p>
        </div>
      </div>
    </div>
  );
}
