import React from 'react';
import { useWallet } from '../hooks/useWallet';

export const WalletConnector: React.FC = () => {
  const { currentAccount, isConnecting, balance, connectWallet, disconnectWallet, checkBalance } = useWallet();

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Wallet Connection</h2>
        <div className="flex items-center space-x-2">
          {currentAccount && (
            <span className="text-sm text-green-600 dark:text-green-400">
              {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {!currentAccount ? (
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Balance:</span>
              <span className="text-sm font-mono">
                {balance || 'Click to check'}
              </span>
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={checkBalance}
                className="btn-secondary flex-1"
              >
                Check Balance
              </button>
              <button
                onClick={disconnectWallet}
                className="btn-danger"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};