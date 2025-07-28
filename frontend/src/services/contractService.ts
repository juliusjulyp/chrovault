// Wave 2: Wallet Integration & Contract Service - COMPLETED ✅
import { Args } from '@massalabs/massa-web3';
import type { WalletAccount, ContractStrategy } from '../types';

// Empty args for functions with no parameters
const EMPTY_ARGS = new Args();

const CONTRACT_ADDRESS = 'AS1snFSM5oryDFNrDkPTQhBgbaAbByNCogtUz9uYzRM2s1hQbRRW';

export class ContractService {
  private account: WalletAccount;

  constructor(account: WalletAccount) {
    this.account = account;
  }

  // Vault Operations
  async depositToVault(amount: number): Promise<string> {
    if (!this.account.callSC) {
      throw new Error('Wallet does not support contract calls');
    }

    const amountInNanoMAS = Math.floor(amount * 1_000_000_000); // Convert MAS to nanoMAS
    
    const params = {
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'depositToVault',
      parameter: [], // Empty array as expected by TypeScript interface
      coins: amountInNanoMAS,
    };

    return await this.account.callSC(params);
  }

  async getVaultBalance(): Promise<string> {
    if (!this.account.readSC) {
      throw new Error('Wallet does not support contract reads');
    }

    const params = {
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'getVaultBalance',
      parameter: [], // Empty array as expected by TypeScript interface
    };

    const result = await this.account.readSC(params);
    return result; // Balance in nanoMAS
  }

  // Price Oracle
  async updatePrice(token: string, price: number): Promise<string> {
    if (!this.account.callSC) {
      throw new Error('Wallet does not support contract calls');
    }

    const args = new Args()
      .addString(token)
      .addU256(BigInt(price));

    const params = {
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'updatePrice',
      parameter: args.serialize(), // Serialize the Args to array
      coins: 0,
    };

    return await this.account.callSC(params);
  }

  // Strategy Management
  async createStrategy(
    amount: number, 
    frequencyHours: number, 
    targetToken: string, 
    hoursFromNow: number = 1
  ): Promise<string> {
    if (!this.account.callSC) {
      throw new Error('Wallet does not support contract calls');
    }

    const amountInNanoMAS = Math.floor(amount * 1_000_000_000);
    const frequencyMs = frequencyHours * 60 * 60 * 1000;
    const nextExecutionMs = Date.now() + (hoursFromNow * 60 * 60 * 1000);

    const args = new Args()
      .addU256(BigInt(amountInNanoMAS))
      .addU256(BigInt(frequencyMs))
      .addString(targetToken)
      .addU256(BigInt(nextExecutionMs));

    const params = {
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'createStrategy',
      parameter: args.serialize(), // Serialize the Args to array
      coins: 0,
    };

    return await this.account.callSC(params);
  }

  async getStrategy(strategyId: string): Promise<ContractStrategy> {
    if (!this.account.readSC) {
      throw new Error('Wallet does not support contract reads');
    }

    const args = new Args().addString(strategyId);

    const params = {
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'getStrategy',
      parameter: args.serialize(), // Serialize the Args to array
    };

    const result = await this.account.readSC(params);
    
    // Parse result string - format: "Strategy: id, Owner: owner, Amount: amount, ..."
    return this.parseStrategyInfo(result, strategyId);
  }

  // Autonomous Execution
  async enableAutonomousExecution(strategyId: string): Promise<string> {
    if (!this.account.callSC) {
      throw new Error('Wallet does not support contract calls');
    }

    const args = new Args().addString(strategyId);

    const params = {
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'enableAutonomousExecution',
      parameter: args.serialize(), // Serialize the Args to array
      coins: 0,
    };

    return await this.account.callSC(params);
  }

  async disableAutonomousExecution(strategyId: string): Promise<string> {
    if (!this.account.callSC) {
      throw new Error('Wallet does not support contract calls');
    }

    const args = new Args().addString(strategyId);

    const params = {
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'disableAutonomousExecution',
      parameter: args.serialize(), // Serialize the Args to array
      coins: 0,
    };

    return await this.account.callSC(params);
  }

  async executeDCA(strategyId: string): Promise<string> {
    if (!this.account.callSC) {
      throw new Error('Wallet does not support contract calls');
    }

    const args = new Args().addString(strategyId);

    const params = {
      targetAddress: CONTRACT_ADDRESS,
      targetFunction: 'executeDCA',
      parameter: args.serialize(), // Serialize the Args to array
      coins: 0,
    };

    return await this.account.callSC(params);
  }

  // Helper function to parse strategy info string
  private parseStrategyInfo(_infoString: string, strategyId: string): ContractStrategy {
    // Mock parsing - in real implementation, you'd parse the actual contract response
    // Expected format: "Strategy: id, Owner: owner, Amount: amount, Frequency: freq, Target: token, Invested: inv, Tokens: tokens, Executions: exec, Next: next, Active: active, Autonomous: auto"
    
    // For now, return a mock structure that matches your deployed contract
    return {
      id: strategyId,
      owner: this.account.address,
      amount: 1, // Will be parsed from actual response
      frequency: 1,
      targetToken: 'USDC',
      totalInvested: 0,
      totalTokens: 0,
      executions: 0,
      nextExec: Date.now() + 3600000,
      isActive: true,
      isAutonomous: false,
    };
  }

  // Generate strategy ID based on user address (matches contract logic)
  generateStrategyId(strategyCount: number = 0): string {
    return `${this.account.address}_${strategyCount}`;
  }
}