'use client';

import { useCallback, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface PlaidInvestmentButtonProps {
  onSuccess: (publicToken: string) => void;
}

export default function PlaidInvestmentButton({ onSuccess }: PlaidInvestmentButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch link token from backend
  const fetchLinkToken = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/plaid/create-link-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: 'user-' + Date.now(),
          account_type: 'investment'
        })
      });
      const data = await response.json();
      setLinkToken(data.link_token);
    } catch (error) {
      console.error('Error fetching link token:', error);
      alert('Failed to connect to Plaid. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle successful connection
  const onPlaidSuccess = useCallback(async (public_token: string) => {
    console.log('Investment account connected!');
    onSuccess(public_token);
  }, [onSuccess]);

  // Initialize Plaid Link
  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: onPlaidSuccess,
  });

  // Handle button click
  const handleClick = () => {
    if (linkToken) {
      open();
    } else {
      fetchLinkToken().then(() => {
        // Will open automatically once token is fetched
      });
    }
  };

  // Auto-open when token is ready
  if (linkToken && ready && !isLoading) {
    open();
    setLinkToken(null); // Prevent auto-opening again
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLoading}
      className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-medium rounded-lg transition-colors"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Connect Investment Account
        </>
      )}
    </button>
  );
}
