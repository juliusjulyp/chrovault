// ChronoVault DCA Smart Contract
import { Context, generateEvent, Storage } from '@massalabs/massa-as-sdk';
import { Args, stringToBytes, u64ToBytes, bytesToU64, bytesToString } from '@massalabs/as-types';

// Storage keys - using StaticArray<u8> for type consistency
export const ADMIN_KEY = stringToBytes('admin');
export const STRATEGY_PREFIX = stringToBytes('strategy_');
export const VAULT_PREFIX = stringToBytes('vault_');
export const PRICE_PREFIX = stringToBytes('price_');
export const STRATEGY_COUNT_KEY = stringToBytes('strategy_count');
export const MIN_DCA_AMOUNT_KEY = stringToBytes('min_dca_amount');
export const MAX_DCA_AMOUNT_KEY = stringToBytes('max_dca_amount');
export const PAUSED_KEY = stringToBytes('paused');

/**
 * Initialize DCA contract
 *
 * @param binaryArgs - Arguments serialized with Args
 */
export function constructor(binaryArgs: StaticArray<u8>): void {
  assert(Context.isDeployingContract());

  const argsDeser = new Args(binaryArgs);
  const admin = argsDeser
    .nextString()
    .expect('Admin address argument is missing or invalid');

  // Initialize contract configuration
  setStringValue(ADMIN_KEY, admin);
  setU64Value(STRATEGY_COUNT_KEY, 0);
  setU64Value(MIN_DCA_AMOUNT_KEY, 1000000); // 1 MAS minimum
  setU64Value(MAX_DCA_AMOUNT_KEY, 1000000000); // 1000 MAS maximum
  setStringValue(PAUSED_KEY, 'false');

  generateEvent(`ChronoVault DCA contract initialized with admin: ${admin}`);
}

/**
 * Create a new DCA strategy
 *
 * @param binaryArgs - Serialized arguments (amount, frequency, targetToken, nextExecution)
 * @returns Strategy ID
 */
export function createStrategy(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  assert(!isPaused(), 'Contract is paused');

  const argsDeser = new Args(binaryArgs);
  const amount = argsDeser.nextU64().expect('Amount argument missing');
  const frequency = argsDeser.nextU64().expect('Frequency argument missing');
  const targetToken = argsDeser.nextString().expect('Target token argument missing');
  const nextExecution = argsDeser.nextU64().expect('Next execution timestamp missing');

  // Validate parameters
  const minAmount = getU64Value(MIN_DCA_AMOUNT_KEY);
  const maxAmount = getU64Value(MAX_DCA_AMOUNT_KEY);
  assert(amount >= minAmount, 'Amount below minimum');
  assert(amount <= maxAmount, 'Amount above maximum');
  assert(frequency >= 3600000, 'Frequency below minimum (1 hour)');
  assert(frequency <= 2592000000, 'Frequency above maximum (30 days)');

  const caller = Context.caller().toString();
  
  // Generate strategy ID
  const strategyCount = getU64Value(STRATEGY_COUNT_KEY);
  const strategyId = `${caller}_${strategyCount}`;
  
  // Store strategy data
  setU64Value(getStrategyKey(strategyId, 'amount'), amount);
  setU64Value(getStrategyKey(strategyId, 'frequency'), frequency);
  setStringValue(getStrategyKey(strategyId, 'target'), targetToken);
  setU64Value(getStrategyKey(strategyId, 'next_exec'), nextExecution);
  setStringValue(getStrategyKey(strategyId, 'owner'), caller);
  setStringValue(getStrategyKey(strategyId, 'active'), 'true');
  setU64Value(getStrategyKey(strategyId, 'invested'), 0);
  setU64Value(getStrategyKey(strategyId, 'tokens'), 0);
  setU64Value(getStrategyKey(strategyId, 'executions'), 0);
  
  // Increment strategy counter
  setU64Value(STRATEGY_COUNT_KEY, strategyCount + 1);

  // Lock funds in vault
  lockFundsForStrategy(caller, amount);

  generateEvent(`DCA strategy created: ${strategyId}`);
  return stringToBytes(strategyId);
}

/**
 * Deposit MAS tokens to vault
 *
 * @param _ - not used
 * @returns Success confirmation
 */
export function depositToVault(_: StaticArray<u8>): StaticArray<u8> {
  const caller = Context.caller().toString();
  const transferredAmount = Context.transferredCoins();
  
  assert(transferredAmount > 0, 'No coins transferred');

  const vaultKey = getVaultKey(caller);
  let currentBalance: u64 = 0;
  
  if (Storage.has(vaultKey)) {
    currentBalance = getU64Value(vaultKey);
  }
  
  const newBalance = currentBalance + transferredAmount;
  setU64Value(vaultKey, newBalance);
  
  generateEvent(`Deposited ${transferredAmount} MAS to vault for ${caller}`);
  return stringToBytes(`Deposited ${transferredAmount} MAS`);
}

/**
 * Get vault balance for caller
 *
 * @param _ - not used
 * @returns Vault balance as string
 */
export function getVaultBalance(_: StaticArray<u8>): StaticArray<u8> {
  const caller = Context.caller().toString();
  const vaultKey = getVaultKey(caller);
  
  let balance: u64 = 0;
  if (Storage.has(vaultKey)) {
    balance = getU64Value(vaultKey);
  }
  
  return stringToBytes(balance.toString());
}

/**
 * Update token price (admin only)
 *
 * @param binaryArgs - Serialized arguments (token, price)
 * @returns Success confirmation
 */
export function updatePrice(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const caller = Context.caller().toString();
  const admin = getStringValue(ADMIN_KEY);
  
  assert(caller === admin, 'Only admin can update prices');

  const argsDeser = new Args(binaryArgs);
  const token = argsDeser.nextString().expect('Token argument missing');
  const price = argsDeser.nextU64().expect('Price argument missing');

  assert(price > 0, 'Price must be positive');

  setU64Value(getPriceKey(token), price);

  generateEvent(`Price updated for ${token}: ${price}`);
  return stringToBytes(`Price updated for ${token}`);
}

/**
 * Execute a DCA strategy (manual execution for Wave 1)
 *
 * @param binaryArgs - Serialized arguments (strategyId)
 * @returns Execution result
 */
export function executeDCA(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const argsDeser = new Args(binaryArgs);
  const strategyId = argsDeser.nextString().expect('Strategy ID argument missing');

  // Verify strategy exists and is active
  const ownerKey = getStrategyKey(strategyId, 'owner');
  const activeKey = getStrategyKey(strategyId, 'active');
  
  assert(Storage.has(ownerKey), 'Strategy does not exist');
  assert(getStringValue(activeKey) === 'true', 'Strategy is not active');

  const owner = getStringValue(ownerKey);
  const amount = getU64Value(getStrategyKey(strategyId, 'amount'));
  const targetToken = getStringValue(getStrategyKey(strategyId, 'target'));

  // Get token price
  const priceKey = getPriceKey(targetToken);
  assert(Storage.has(priceKey), 'Price not available for target token');
  const price = getU64Value(priceKey);

  // Calculate tokens to receive
  const tokensToReceive = amount / price;

  // Update strategy statistics
  const currentInvested = getU64Value(getStrategyKey(strategyId, 'invested'));
  const currentTokens = getU64Value(getStrategyKey(strategyId, 'tokens'));
  const currentExecutions = getU64Value(getStrategyKey(strategyId, 'executions'));

  setU64Value(getStrategyKey(strategyId, 'invested'), currentInvested + amount);
  setU64Value(getStrategyKey(strategyId, 'tokens'), currentTokens + tokensToReceive);
  setU64Value(getStrategyKey(strategyId, 'executions'), currentExecutions + 1);

  // Update next execution time
  const frequency = getU64Value(getStrategyKey(strategyId, 'frequency'));
  const nextExecution = u64(Date.now()) + frequency;
  setU64Value(getStrategyKey(strategyId, 'next_exec'), nextExecution);

  generateEvent(`DCA executed for ${strategyId}: ${amount} MAS -> ${tokensToReceive} ${targetToken}`);
  return stringToBytes(`Executed: ${amount} MAS -> ${tokensToReceive} tokens`);
}

/**
 * Get strategy info
 *
 * @param binaryArgs - Serialized arguments (strategyId)
 * @returns Strategy information
 */
export function getStrategy(binaryArgs: StaticArray<u8>): StaticArray<u8> {
  const argsDeser = new Args(binaryArgs);
  const strategyId = argsDeser.nextString().expect('Strategy ID argument missing');

  const ownerKey = getStrategyKey(strategyId, 'owner');
  assert(Storage.has(ownerKey), 'Strategy does not exist');

  const owner = getStringValue(ownerKey);
  const amount = getU64Value(getStrategyKey(strategyId, 'amount'));
  const frequency = getU64Value(getStrategyKey(strategyId, 'frequency'));
  const targetToken = getStringValue(getStrategyKey(strategyId, 'target'));
  const totalInvested = getU64Value(getStrategyKey(strategyId, 'invested'));
  const totalTokens = getU64Value(getStrategyKey(strategyId, 'tokens'));
  const executions = getU64Value(getStrategyKey(strategyId, 'executions'));

  const result = `Strategy: ${strategyId}, Owner: ${owner}, Amount: ${amount}, Frequency: ${frequency}, Target: ${targetToken}, Invested: ${totalInvested}, Tokens: ${totalTokens}, Executions: ${executions}`;
  
  return stringToBytes(result);
}

// Helper functions for storage operations

function setStringValue(key: StaticArray<u8>, value: string): void {
  Storage.set(key, stringToBytes(value));
}

function getStringValue(key: StaticArray<u8>): string {
  return bytesToString(Storage.get(key));
}

function setU64Value(key: StaticArray<u8>, value: u64): void {
  Storage.set(key, u64ToBytes(value));
}

function getU64Value(key: StaticArray<u8>): u64 {
  return bytesToU64(Storage.get(key));
}

function getStrategyKey(strategyId: string, suffix: string): StaticArray<u8> {
  return stringToBytes(bytesToString(STRATEGY_PREFIX) + strategyId + '_' + suffix);
}

function getVaultKey(owner: string): StaticArray<u8> {
  return stringToBytes(bytesToString(VAULT_PREFIX) + owner);
}

function getPriceKey(token: string): StaticArray<u8> {
  return stringToBytes(bytesToString(PRICE_PREFIX) + token);
}

function isPaused(): boolean {
  if (!Storage.has(PAUSED_KEY)) {
    return false;
  }
  return bytesToString(Storage.get(PAUSED_KEY)) === 'true';
}

function lockFundsForStrategy(owner: string, amount: u64): void {
  const vaultKey = getVaultKey(owner);
  assert(Storage.has(vaultKey), 'No vault balance found');
  
  const currentBalance = getU64Value(vaultKey);
  assert(currentBalance >= amount, 'Insufficient vault balance');
  
  const newBalance = currentBalance - amount;
  setU64Value(vaultKey, newBalance);
}




