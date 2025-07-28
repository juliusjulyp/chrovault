import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useWallet } from '../hooks/useWallet';
import { ContractService } from '../services/contractService';
import type { ContractStrategy } from '../types';

export const AutonomousTestPanel: React.FC = () => {
  const { addToast } = useAppStore();
  const { currentAccount, balance, CONTRACT_ADDRESS } = useWallet();
  const [loading, setLoading] = useState(false);
  const [vaultBalance, setVaultBalance] = useState<string>('');
  const [contractStrategies, setContractStrategies] = useState<ContractStrategy[]>([]);
  const [contractService, setContractService] = useState<ContractService | null>(null);

  // Initialize contract service when account is available
  useEffect(() => {
    if (currentAccount) {
      setContractService(new ContractService(currentAccount));
    } else {
      setContractService(null);
    }
  }, [currentAccount]);

  // Load initial data
  useEffect(() => {
    if (contractService) {
      // checkVaultBalance(); // Disabled until parameter format is resolved
      // loadStrategies(); // Disabled until parameter format is resolved
    }
  }, [contractService]);

  const checkVaultBalance = async () => {
    if (!contractService) return;

    try {
      const balance = await contractService.getVaultBalance();
      // Convert from nanoMAS to MAS
      const balanceInMAS = (parseInt(balance) / 1_000_000_000).toFixed(6);
      setVaultBalance(balanceInMAS);
      
      addToast({
        type: 'info',
        message: `Vault balance: ${balanceInMAS} MAS`
      });
    } catch (error) {
      console.error('Failed to check vault balance:', error);
      addToast({
        type: 'error',
        message: `Failed to check balance: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const depositToVault = async (amount: number) => {
    if (!contractService) {
      addToast({ type: 'error', message: 'Please connect wallet first' });
      return;
    }

    setLoading(true);
    try {
      const txId = await contractService.depositToVault(amount);
      
      addToast({
        type: 'success',
        message: `Successfully deposited ${amount} MAS to vault! TX: ${txId.slice(0, 8)}...`
      });
      
      // Refresh vault balance after a delay
      setTimeout(() => {
        checkVaultBalance();
      }, 3000);
    } catch (error) {
      console.error('Deposit failed:', error);
      addToast({
        type: 'error',
        message: `Failed to deposit: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const setTokenPrice = async (token: string, price: number) => {
    if (!contractService) {
      addToast({ type: 'error', message: 'Please connect wallet first' });
      return;
    }

    setLoading(true);
    try {
      const txId = await contractService.updatePrice(token, price);
      
      addToast({
        type: 'success',
        message: `Successfully set ${token} price to ${(price / 1_000_000).toFixed(6)} MAS per token! TX: ${txId.slice(0, 8)}...`
      });
    } catch (error) {
      console.error('Price update failed:', error);
      addToast({
        type: 'error',
        message: `Failed to set price: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const createDCAStrategy = async (amount: number, frequency: number, targetToken: string) => {
    if (!contractService) {
      addToast({ type: 'error', message: 'Please connect wallet first' });
      return;
    }

    setLoading(true);
    try {
      const txId = await contractService.createStrategy(amount, frequency, targetToken, 1);
      
      addToast({
        type: 'success',
        message: `Successfully created DCA strategy! TX: ${txId.slice(0, 8)}...`
      });
      
      // Refresh strategies after a delay
      setTimeout(() => {
        loadStrategies();
        checkVaultBalance();
      }, 3000);
    } catch (error) {
      console.error('Strategy creation failed:', error);
      addToast({
        type: 'error',
        message: `Failed to create strategy: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const enableAutonomousExecution = async (strategyId: string) => {
    if (!contractService) {
      addToast({ type: 'error', message: 'Please connect wallet first' });
      return;
    }

    setLoading(true);
    try {
      const txId = await contractService.enableAutonomousExecution(strategyId);
      
      addToast({
        type: 'success',
        message: `🤖 Autonomous execution enabled! TX: ${txId.slice(0, 8)}...`
      });
      
      // Refresh strategies after a delay
      setTimeout(() => {
        loadStrategies();
      }, 3000);
    } catch (error) {
      console.error('Enable autonomous failed:', error);
      addToast({
        type: 'error',
        message: `Failed to enable autonomous execution: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setLoading(false);
    }
  };

  const loadStrategies = async () => {
    if (!contractService || !currentAccount) return;

    try {
      // Try to load the first strategy (assumes strategy count starts at 0)
      const strategyId = contractService.generateStrategyId(0);
      
      try {
        const strategy = await contractService.getStrategy(strategyId);
        setContractStrategies([strategy]);
      } catch (error) {
        // Strategy doesn't exist yet
        setContractStrategies([]);
      }
    } catch (error) {
      console.error('Failed to load strategies:', error);
    }
  };

  if (!currentAccount) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">🤖 Autonomous DCA Testing</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Please connect your wallet to test autonomous DCA functionality</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        🤖 Autonomous DCA Testing Panel
        <span className="ml-2 px-2 py-1 text-xs bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 rounded-full">
          Live Contract
        </span>
      </h2>
      
      <div className="space-y-6">
        {/* Contract Info */}
        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-medium mb-2">Contract Information</h3>
          <div className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
            <div>Address: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">{CONTRACT_ADDRESS}</code></div>
            <div>Network: Massa Testnet</div>
            <div>Connected Wallet: <code className="bg-gray-200 dark:bg-gray-600 px-1 rounded text-xs">{currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}</code></div>
            <div>Vault Balance: {vaultBalance ? `${vaultBalance} MAS` : 'Loading...'}</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vault Operations */}
          <div className="space-y-3">
            <h3 className="font-medium">Vault Operations</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => depositToVault(3)}
                disabled={loading}
                className="btn-primary text-sm flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Deposit 3 MAS
              </button>
              <button
                onClick={checkVaultBalance}
                disabled={loading}
                className="btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Refresh Balance
              </button>
            </div>
          </div>

          {/* Price Management */}
          <div className="space-y-3">
            <h3 className="font-medium">Price Oracle</h3>
            <button
              onClick={() => setTokenPrice('USDC', 500000)}
              disabled={loading}
              className="btn-secondary text-sm w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Set USDC Price (0.5 MAS)
            </button>
          </div>
        </div>

        {/* Strategy Creation */}
        <div className="space-y-3">
          <h3 className="font-medium">Create Test Strategy</h3>
          <button
            onClick={() => createDCAStrategy(1, 1, 'USDC')}
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create 1 MAS/hour → USDC Strategy
          </button>
        </div>

        {/* Contract Strategies */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Live Contract Strategies</h3>
            <button
              onClick={loadStrategies}
              disabled={loading}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
            >
              Refresh
            </button>
          </div>
          
          {contractStrategies.length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <p>No strategies found on contract</p>
              <p className="text-sm">Create one above to test autonomous execution</p>
            </div>
          ) : (
            <div className="space-y-3">
              {contractStrategies.map((strategy) => (
                <div
                  key={strategy.id}
                  className="border border-gray-200 dark:border-gray-600 rounded-lg p-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-medium text-sm">
                      {strategy.amount} MAS → {strategy.targetToken}
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        strategy.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {strategy.isActive ? 'Active' : 'Paused'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        strategy.isAutonomous 
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                      }`}>
                        {strategy.isAutonomous ? '🤖 Autonomous' : 'Manual'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                    <div>Frequency: Every {strategy.frequency} hour(s)</div>
                    <div>Executions: {strategy.executions}</div>
                    <div>Total Invested: {(strategy.totalInvested / 1_000_000_000).toFixed(6)} MAS</div>
                    <div>Next: {new Date(strategy.nextExec).toLocaleString()}</div>
                    <div className="font-mono">ID: {strategy.id}</div>
                  </div>
                  
                  {!strategy.isAutonomous && (
                    <button
                      onClick={() => enableAutonomousExecution(strategy.id)}
                      disabled={loading}
                      className="btn-primary text-xs mt-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🚀 Enable Autonomous Execution
                    </button>
                  )}

                  {strategy.isAutonomous && (
                    <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-xs text-blue-700 dark:text-blue-300">
                      ✅ Autonomous mode active! This strategy will execute automatically.
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Current Status */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
          <h3 className="font-medium text-yellow-800 dark:text-yellow-400 mb-2">⚠️ Contract Integration Status</h3>
          <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
            <p><strong>✅ Wallet Connection:</strong> Working perfectly (Balance: {balance || 'Loading...'})</p>
            <p><strong>✅ Contract Deployment:</strong> Successfully deployed at {CONTRACT_ADDRESS.slice(0, 10)}...</p>
            <p><strong>⚠️ Contract Interaction:</strong> Parameter format compatibility issue with wallet provider</p>
            <p><strong>🔧 Status:</strong> Contract testing temporarily disabled while resolving parameter serialization</p>
          </div>
        </div>

        {/* Testing Instructions */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 dark:text-blue-400 mb-2">When Contract Integration is Ready</h3>
          <ol className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-decimal list-inside">
            <li>Connect your Massa wallet above ✅</li>
            <li>Deposit MAS to vault for strategy funding</li>
            <li>Set token prices using the price oracle</li>
            <li>Create a DCA strategy with your desired parameters</li>
            <li>Enable autonomous execution to activate self-scheduling</li>
            <li>🎉 Monitor the strategy - it will execute automatically!</li>
          </ol>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-sm">Processing transaction...</span>
          </div>
        )}
      </div>
    </div>
  );
};