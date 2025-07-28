import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';

export const HeaderWallet: React.FC = () => {
  const { currentAccount, isConnecting, balance, connectWallet, disconnectWallet, checkBalance } = useWallet();
  const [showDropdown, setShowDropdown] = useState(false);

  // Auto-check balance when wallet connects
  React.useEffect(() => {
    if (currentAccount && !balance) {
      checkBalance();
    }
  }, [currentAccount, balance, checkBalance]);

  return (
    <div className="relative">
      {!currentAccount ? (
        <button
          onClick={connectWallet}
          disabled={isConnecting}
          className="btn-primary disabled:opacity-50 text-sm px-4 py-2"
        >
          {isConnecting ? 'Connecting...' : 'Connect Wallet'}
        </button>
      ) : (
        <div className="text-right">
          {/* Wallet Address Button */}
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
            >
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium">
                {currentAccount.address.slice(0, 6)}...{currentAccount.address.slice(-4)}
              </span>
              <svg 
                className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-4 space-y-3">
                  {/* Address */}
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400">Wallet Address</label>
                    <div className="font-mono text-sm bg-gray-50 dark:bg-gray-700 p-2 rounded">
                      {currentAccount.address}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
                    <button
                      onClick={() => {
                        disconnectWallet();
                        setShowDropdown(false);
                      }}
                      className="w-full text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Balance Display - Always Visible */}
          <div className="mt-2 flex items-center justify-end space-x-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Balance:</span>
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
              {balance || 'Loading...'}
            </span>
            <button
              onClick={checkBalance}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              Refresh
            </button>
          </div>
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowDropdown(false)}
        />
      )}
    </div>
  );
};