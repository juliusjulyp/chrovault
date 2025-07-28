import { useCallback } from 'react';
import { getWallets } from '@massalabs/wallet-provider';
import { useAppStore } from '../store/useAppStore';

const CONTRACT_ADDRESS = 'AS1snFSM5oryDFNrDkPTQhBgbaAbByNCogtUz9uYzRM2s1hQbRRW'; // Deployed autonomous DCA contract

export const useWallet = () => {
  const {
    currentWallet,
    currentAccount,
    isConnecting,
    setWallet,
    setConnecting,
    addToast,
    balance,
    setBalance,
  } = useAppStore();

  // Get available wallets - ported from original code
  const getAvailableWallets = useCallback(async () => {
    try {
      console.log('🔍 Checking for available wallets...');
      const wallets = await getWallets();
      
      if (wallets.length === 0) {
        console.log('❌ No wallets found');
        return [];
      }
      
      console.log(`✅ Found ${wallets.length} wallet(s):`, wallets.map(w => w.name()));
      return wallets;
    } catch (error) {
      console.error('Error getting wallets:', error);
      return [];
    }
  }, []);

  // Connect wallet - ported from original working code
  const connectWallet = useCallback(async () => {
    try {
      console.log('🔌 Starting wallet connection...');
      setConnecting(true);
      
      // Get available wallets
      const availableWallets = await getAvailableWallets();
      
      if (availableWallets.length === 0) {
        console.log('No wallets found');
        addToast({
          type: 'error',
          message: 'No wallets found. Please install Bearby or Massa wallet.',
        });
        return;
      }
      
      // Use the first available wallet
      const wallet = availableWallets[0];
      console.log(`Attempting to connect to ${wallet.name()}`);
      
      // Connect to the wallet
      const connected = await wallet.connect();
      if (!connected) {
        throw new Error(`Failed to connect to ${wallet.name()}`);
      }
      
      // Get accounts
      const accounts = await wallet.accounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found in wallet');
      }
      
      const account = accounts[0];
      
      // Set up wallet and account (cast to our interface)
      setWallet(wallet as any, account as any);
      
      // Listen for account changes - preserve full account object
      wallet.listenAccountChanges(async (address: string) => {
        console.log('Account changed:', address);
        try {
          const newAccounts = await wallet.accounts();
          const newAccount = newAccounts.find(acc => acc.address === address);
          if (newAccount) {
            setWallet(wallet as any, newAccount as any);
            console.log('Updated currentAccount object:', newAccount);
          } else {
            console.warn('Could not find account object for address:', address);
            setWallet(wallet as any, { address } as any); // Fallback to plain object
          }
        } catch (error) {
          console.error('Error getting new account object:', error);
          setWallet(wallet as any, { address } as any); // Fallback to plain object
        }
      });
      
      // Get network info for debugging
      try {
        const networkInfo = await wallet.networkInfos();
        console.log('Network info:', networkInfo);
      } catch (error) {
        console.warn('Could not get network info:', error);
      }
      
      addToast({
        type: 'success',
        message: 'Wallet connected successfully!',
      });
      
      console.log('✅ Wallet connected successfully:', account.address);
      
    } catch (error) {
      console.error('Wallet connection error:', error);
      addToast({
        type: 'error',
        message: `Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    } finally {
      setConnecting(false);
    }
  }, [getAvailableWallets, setWallet, setConnecting, addToast]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    try {
      if (currentWallet) {
        await currentWallet.disconnect();
      }
      setWallet(null, null);
      setBalance(null);
      
      addToast({
        type: 'info',
        message: 'Wallet disconnected',
      });
    } catch (error) {
      console.error('Disconnect error:', error);
      addToast({
        type: 'error',
        message: 'Error disconnecting wallet',
      });
    }
  }, [currentWallet, setWallet, setBalance, addToast]);

  // Check balance - ported from working balance logic
  const checkBalance = useCallback(async () => {
    if (!currentAccount) {
      addToast({
        type: 'error',
        message: 'Please connect wallet first',
      });
      return;
    }

    try {
      console.log('Checking balance for account:', currentAccount.address);
      
      // Debug what balance actually is
      console.log('Debugging currentAccount.balance:');
      console.log('Type of currentAccount.balance:', typeof currentAccount.balance);
      console.log('Is it a function?', typeof currentAccount.balance === 'function');
      
      let balance = null;
      
      if (typeof currentAccount.balance === 'function') {
        console.log('Calling currentAccount.balance() as function');
        balance = await currentAccount.balance();
      } else {
        // Fallback: show connected status
        console.log('No balance method available, showing connected status');
        setBalance('Connected ✓');
        addToast({
          type: 'success',
          message: `Wallet connected: ${currentAccount.address.slice(0, 8)}...${currentAccount.address.slice(-6)}`,
        });
        return;
      }
      
      console.log('Raw balance response:', balance);
      console.log('Final balance type:', typeof balance);
      
      // Handle BigInt conversion properly
      let balanceInMAS: number;
      if (typeof balance === 'bigint') {
        // Convert BigInt to regular number for display
        balanceInMAS = Number(balance) / 1000000000;
      } else {
        // Handle regular numbers
        balanceInMAS = Number(balance) / 1000000000;
      }
      
      console.log('Balance in MAS:', balanceInMAS);
      
      setBalance(`${balanceInMAS.toFixed(6)} MAS`);
      addToast({
        type: 'success',
        message: 'Balance retrieved successfully! ✅',
      });
      
    } catch (error) {
      console.error('Check balance error:', error);
      addToast({
        type: 'error',
        message: `Failed to check balance: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }, [currentAccount, setBalance, addToast]);

  return {
    currentWallet,
    currentAccount,
    isConnecting,
    balance,
    connectWallet,
    disconnectWallet,
    checkBalance,
    CONTRACT_ADDRESS,
  };
};