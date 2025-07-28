// Wallet types
export interface WalletAccount {
  address: string;
  balance?: (final?: boolean) => Promise<bigint>;
  callSC?: (params: ContractCallParams) => Promise<string>;
  readSC?: (params: ContractReadParams) => Promise<any>;
  transfer?: (params: TransferParams) => Promise<string>;
}

export interface Wallet {
  name: () => string;
  connect: () => Promise<boolean>;
  disconnect: () => Promise<boolean>;
  accounts: () => Promise<WalletAccount[]>;
  listenAccountChanges: (callback: (address: string) => void) => void;
  networkInfos: () => Promise<NetworkInfo>;
}

export interface NetworkInfo {
  name: string;
  chainId: bigint;
  minimalFee: bigint;
}

// Contract interaction types
export interface ContractCallParams {
  targetAddress: string;
  targetFunction: string;
  parameter: any[];
  coins: number;
}

export interface ContractReadParams {
  targetAddress: string;
  targetFunction: string;
  parameter: any[];
}

export interface TransferParams {
  recipientAddress: string;
  amount: bigint;
}

// DCA Strategy types
export interface DCAStrategy {
  id?: string;
  amount: number; // in MAS
  frequency: number; // in hours
  targetToken: string;
  nextExecution: Date;
  isActive: boolean;
  isAutonomous?: boolean; // NEW: Autonomous execution status
  createdAt: Date;
  totalSpent?: number;
  totalTokensReceived?: number;
  averagePrice?: number;
  executionCount?: number;
  lastExecution?: Date;
  performanceData?: StrategyPerformance;
}

// Contract Strategy - data from actual smart contract
export interface ContractStrategy {
  id: string;
  owner: string;
  amount: number;
  frequency: number;
  targetToken: string;
  totalInvested: number;
  totalTokens: number;
  executions: number;
  nextExec: number;
  isActive: boolean;
  isAutonomous: boolean;
}

export interface StrategyPerformance {
  totalInvested: number;
  currentValue: number;
  roi: number; // Return on Investment percentage
  totalExecutions: number;
  successfulExecutions: number;
  failedExecutions: number;
  averageExecutionPrice: number;
}

export interface Transaction {
  id: string;
  strategyId: string;
  type: 'buy' | 'sell' | 'pause' | 'resume' | 'create' | 'delete';
  amount: number;
  tokenPrice?: number;
  tokensReceived?: number;
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  txHash?: string;
}

// UI State types
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
}

export type Theme = 'light' | 'dark';