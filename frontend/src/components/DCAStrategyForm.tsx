import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useWallet } from '../hooks/useWallet';
import type { DCAStrategy } from '../types';

export const DCAStrategyForm: React.FC = () => {
  const { currentAccount, CONTRACT_ADDRESS } = useWallet();
  const { addStrategy, addTransaction, addToast } = useAppStore();
  
  const [formData, setFormData] = useState({
    amount: '',
    frequency: '24',
    targetToken: 'USDC'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentAccount) {
      addToast({
        type: 'error',
        message: 'Please connect your wallet first'
      });
      return;
    }

    const amount = parseFloat(formData.amount);
    const frequency = parseInt(formData.frequency);

    if (amount <= 0 || frequency <= 0) {
      addToast({
        type: 'error',
        message: 'Please enter valid amounts'
      });
      return;
    }

    try {
      // Create strategy object
      const strategyId = Math.random().toString(36).substring(7);
      const strategy: DCAStrategy = {
        id: strategyId,
        amount,
        frequency,
        targetToken: formData.targetToken,
        nextExecution: new Date(Date.now() + frequency * 60 * 60 * 1000),
        isActive: true,
        createdAt: new Date(),
        totalSpent: 0,
        totalTokensReceived: 0,
        executionCount: 0
      };

      // For now, just add to local state - in future this will call the smart contract
      addStrategy(strategy);
      
      // Add transaction record
      addTransaction({
        id: Math.random().toString(36).substring(7),
        strategyId,
        type: 'create',
        amount,
        status: 'completed',
        timestamp: new Date()
      });
      
      addToast({
        type: 'success',
        message: `DCA strategy created: ${amount} MAS every ${frequency}h for ${formData.targetToken}`
      });

      // Reset form
      setFormData({
        amount: '',
        frequency: '24',
        targetToken: 'USDC'
      });

    } catch (error) {
      console.error('Error creating DCA strategy:', error);
      addToast({
        type: 'error',
        message: 'Failed to create DCA strategy'
      });
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Create DCA Strategy</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount (MAS)
          </label>
          <input
            type="number"
            id="amount"
            step="0.000001"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="input"
            placeholder="Enter amount in MAS"
            required
          />
        </div>

        <div>
          <label htmlFor="frequency" className="block text-sm font-medium mb-1">
            Frequency (hours)
          </label>
          <select
            id="frequency"
            value={formData.frequency}
            onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
            className="input"
            required
          >
            <option value="1">Every Hour</option>
            <option value="6">Every 6 Hours</option>
            <option value="12">Every 12 Hours</option>
            <option value="24">Daily</option>
            <option value="168">Weekly</option>
          </select>
        </div>

        <div>
          <label htmlFor="targetToken" className="block text-sm font-medium mb-1">
            Target Token
          </label>
          <select
            id="targetToken"
            value={formData.targetToken}
            onChange={(e) => setFormData({ ...formData, targetToken: e.target.value })}
            className="input"
            required
          >
            <option value="USDC">USDC</option>
            <option value="USDT">USDT</option>
            <option value="WETH">WETH</option>
            <option value="DAI">DAI</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={!currentAccount}
          className="btn-primary w-full disabled:opacity-50"
        >
          {!currentAccount ? 'Connect Wallet First' : 'Create Strategy'}
        </button>
      </form>

      {CONTRACT_ADDRESS === 'YOUR_CONTRACT_ADDRESS_HERE' && (
        <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            ⚠️ Contract address not configured. Update CONTRACT_ADDRESS in useWallet.ts
          </p>
        </div>
      )}
    </div>
  );
};