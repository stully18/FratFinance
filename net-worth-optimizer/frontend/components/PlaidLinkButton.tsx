'use client';

import { useCallback, useState } from 'react';
import { usePlaidLink } from 'react-plaid-link';

interface PlaidLinkButtonProps {
  onSuccess: (balance: number) => void;
}

export default function PlaidLinkButton({ onSuccess }: PlaidLinkButtonProps) {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch link token from backend
  const fetchLinkToken = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/plaid/create-link-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: 'user-' + Date.now() })
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
    try {
      console.log('Exchanging public token...');
      // Exchange public token for access token
      const exchangeResponse = await fetch('http://localhost:8000/api/plaid/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_token })
      });

      if (!exchangeResponse.ok) {
        throw new Error(`Exchange failed: ${exchangeResponse.status}`);
      }

      const exchangeData = await exchangeResponse.json();
      console.log('Token exchanged successfully:', exchangeData);

      if (!exchangeData.access_token) {
        console.error('No access_token in response:', exchangeData);
        throw new Error('No access token received from server');
      }

      const { access_token } = exchangeData;

      console.log('Fetching account balance...');
      // Fetch account balance
      const balanceResponse = await fetch('http://localhost:8000/api/plaid/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ access_token })
      });

      if (!balanceResponse.ok) {
        const errorText = await balanceResponse.text();
        console.error('Balance fetch error:', errorText);
        throw new Error(`Balance fetch failed: ${balanceResponse.status} - ${errorText}`);
      }

      const balanceData = await balanceResponse.json();
      console.log('Balance data:', balanceData);

      if (!balanceData.total_balance && balanceData.total_balance !== 0) {
        console.error('No total_balance in response:', balanceData);
      }

      // Calculate suggested spare cash (25% of total balance)
      const totalBalance = balanceData.total_balance || 0;
      const suggestedSpare = Math.round(totalBalance * 0.25);

      console.log(`Total balance: $${totalBalance}, Suggested spare: $${suggestedSpare}`);
      onSuccess(suggestedSpare);
    } catch (error) {
      console.error('Error processing bank connection:', error);
      alert('Connected successfully, but couldn\'t fetch balance. Please enter manually.');
    }
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
      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white text-sm font-medium rounded-lg transition-colors"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Connecting...
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Connect Bank
        </>
      )}
    </button>
  );
}
