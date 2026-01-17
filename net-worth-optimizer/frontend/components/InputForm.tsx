'use client';

import { useState } from 'react';
import { OptimizationRequest } from '@/types';
import PlaidLinkButton from './PlaidLinkButton';

interface InputFormProps {
  onSubmit: (data: OptimizationRequest) => void;
  isLoading: boolean;
}

export default function InputForm({ onSubmit, isLoading }: InputFormProps) {
  const [formData, setFormData] = useState({
    loanName: 'Student Loan',
    principal: '25000',
    interestRate: '9.0',
    minimumPayment: '200',
    monthlyBudget: '100',
    monthsUntilGraduation: '48'
  });

  const handlePlaidSuccess = (suggestedAmount: number) => {
    setFormData({ ...formData, monthlyBudget: suggestedAmount.toString() });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const request: OptimizationRequest = {
      loan: {
        loan_name: formData.loanName,
        principal: parseFloat(formData.principal),
        interest_rate: parseFloat(formData.interestRate) / 100,
        minimum_payment: parseFloat(formData.minimumPayment)
      },
      monthly_budget: parseFloat(formData.monthlyBudget),
      months_until_graduation: parseInt(formData.monthsUntilGraduation),
      market_assumptions: {
        expected_annual_return: 0.10,
        volatility: 0.15,
        risk_free_rate: 0.04
      }
    };

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card-bg p-6 rounded-2xl border border-gray-800">
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-white mb-1">Your Financial Snapshot</h2>
        <p className="text-gray-400 text-xs">Enter your details to get personalized recommendations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Loan Principal ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.principal}
            onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="25000"
            required
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Interest (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.interestRate}
            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="9.0"
            required
          />
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Min Payment/Mo ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={formData.minimumPayment}
            onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="200"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Spare Cash/Month ($)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.01"
              value={formData.monthlyBudget}
              onChange={(e) => setFormData({ ...formData, monthlyBudget: e.target.value })}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="100"
              required
            />
            <PlaidLinkButton onSuccess={handlePlaidSuccess} />
          </div>
        </div>

        <div className="md:col-span-1">
          <label className="block text-xs font-medium text-gray-300 mb-1">
            Months Left
          </label>
          <input
            type="number"
            value={formData.monthsUntilGraduation}
            onChange={(e) => setFormData({ ...formData, monthsUntilGraduation: e.target.value })}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-blue-500 transition-all"
            placeholder="48"
            required
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-accent-blue hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Calculating...
            </span>
          ) : (
            'Optimize My Money'
          )}
        </button>
        <div className="px-4 py-3 bg-gray-800/50 rounded-lg border border-gray-700">
          <p className="text-xs text-gray-400 whitespace-nowrap">
            Market: 10% S&P 500 avg
          </p>
        </div>
      </div>
    </form>
  );
}
