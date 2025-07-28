import { create } from 'zustand';
import type { WalletAccount, Wallet, ToastMessage, Theme, DCAStrategy, Transaction } from '../types';

interface AppState {
  // Theme
  theme: Theme;
  toggleTheme: () => void;
  
  // Wallet
  currentWallet: Wallet | null;
  currentAccount: WalletAccount | null;
  isConnecting: boolean;
  setWallet: (wallet: Wallet | null, account: WalletAccount | null) => void;
  setConnecting: (connecting: boolean) => void;
  
  // DCA Strategies
  strategies: DCAStrategy[];
  addStrategy: (strategy: DCAStrategy) => void;
  updateStrategy: (id: string, updates: Partial<DCAStrategy>) => void;
  deleteStrategy: (id: string) => void;
  
  // Transactions
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  
  // Balance
  balance: string | null;
  setBalance: (balance: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Theme
  theme: 'light',
  toggleTheme: () => {
    const newTheme = get().theme === 'light' ? 'dark' : 'light';
    set({ theme: newTheme });
    
    // Update document class for Tailwind dark mode
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
  
  // Wallet
  currentWallet: null,
  currentAccount: null,
  isConnecting: false,
  setWallet: (wallet, account) => set({ currentWallet: wallet, currentAccount: account }),
  setConnecting: (connecting) => set({ isConnecting: connecting }),
  
  // DCA Strategies
  strategies: [],
  addStrategy: (strategy) => set((state) => ({ strategies: [...state.strategies, strategy] })),
  updateStrategy: (id, updates) => set((state) => ({
    strategies: state.strategies.map(strategy => 
      strategy.id === id ? { ...strategy, ...updates } : strategy
    )
  })),
  deleteStrategy: (id) => set((state) => ({
    strategies: state.strategies.filter(strategy => strategy.id !== id)
  })),
  
  // Transactions
  transactions: [],
  addTransaction: (transaction) => set((state) => ({ 
    transactions: [transaction, ...state.transactions] 
  })),
  
  // Toasts
  toasts: [],
  addToast: (toast) => {
    const id = Math.random().toString(36).substring(7);
    const newToast = { ...toast, id };
    set((state) => ({ toasts: [...state.toasts, newToast] }));
    
    // Auto remove toast
    setTimeout(() => {
      get().removeToast(id);
    }, toast.duration || 5000);
  },
  removeToast: (id) => set((state) => ({ 
    toasts: state.toasts.filter(toast => toast.id !== id) 
  })),
  
  // Balance
  balance: null,
  setBalance: (balance) => set({ balance }),
}));