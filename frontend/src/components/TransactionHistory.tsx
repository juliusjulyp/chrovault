import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const TransactionHistory: React.FC = () => {
  const { transactions } = useAppStore();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'failed':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return '📈';
      case 'sell':
        return '📉';
      case 'pause':
        return '⏸️';
      case 'resume':
        return '▶️';
      case 'create':
        return '✨';
      case 'delete':
        return '🗑️';
      default:
        return '📋';
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No transactions yet.</p>
          <p className="text-sm mt-1">Your strategy executions and actions will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.slice(0, 10).map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{getTypeIcon(transaction.type)}</span>
                <div>
                  <div className="font-medium capitalize">
                    {transaction.type} Transaction
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {transaction.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="font-medium">
                  {transaction.amount.toFixed(6)} MAS
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {transactions.length > 10 && (
            <div className="text-center pt-4">
              <button className="text-blue-600 dark:text-blue-400 hover:underline text-sm">
                View All {transactions.length} Transactions
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};