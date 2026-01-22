'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import PlaidInvestmentButton from '@/components/PlaidInvestmentButton';
import InvestmentDashboard from '@/components/InvestmentDashboard';

export default function InvestmentsPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Redirect to login only AFTER auth finishes loading and there's truly no user
  useEffect(() => {
    if (authLoading === false && user === null) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const handleInvestmentConnection = async (publicToken: string) => {
    try {
      // Exchange public token for access token
      const response = await fetch('http://localhost:8000/api/plaid/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token: publicToken })
      });

      const data = await response.json();
      setAccessToken(data.access_token);
      setIsConnected(true);
    } catch (error) {
      console.error('Error connecting investment account:', error);
      alert('Failed to connect investment account. Please try again.');
    }
  };

  // Show loading while checking authentication, or if not authenticated
  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400"></div>
          <p className="text-slate-400 mt-4">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <a
            href="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Optimizer
          </a>
        </div>

        <h1 className="text-4xl font-bold mb-2">Investment Analysis</h1>
        <p className="text-gray-400 mb-8">
          Connect your Fidelity account to analyze your portfolio and get personalized recommendations
        </p>

        {!isConnected ? (
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-8 text-center">
            <div className="max-w-md mx-auto">
              <svg
                className="w-24 h-24 mx-auto mb-4 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <h2 className="text-2xl font-bold mb-2">Connect Your Investment Account</h2>
              <p className="text-gray-400 mb-6">
                Securely connect your Fidelity, Robinhood, or other brokerage account to get started
              </p>

              <PlaidInvestmentButton
                onSuccess={handleInvestmentConnection}
              />

              <div className="mt-6 pt-6 border-t border-gray-700">
                <h3 className="font-semibold mb-2">What you'll get:</h3>
                <ul className="text-left text-sm text-gray-400 space-y-1">
                  <li>✓ Portfolio diversification analysis</li>
                  <li>✓ Asset allocation breakdown</li>
                  <li>✓ Recurring deposit detection</li>
                  <li>✓ Investment health score</li>
                  <li>✓ Personalized recommendations</li>
                  <li>✓ Fee analysis</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <InvestmentDashboard accessToken={accessToken!} />
        )}
      </div>
    </div>
  );
}
