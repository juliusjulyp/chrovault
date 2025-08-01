import 'dotenv/config';
import {
  Account,
  Args,
  Mas,
  SmartContract,
  JsonRpcProvider,
} from '@massalabs/massa-web3';

// Load environment variables
const contractAddress = process.env.DCA_CONTRACT_ADDRESS || '';
if (!contractAddress) {
  console.error('❌ DCA_CONTRACT_ADDRESS not found in .env file');
  console.log('💡 Deploy the contract first with: npm run deploy');
  process.exit(1);
}

// Get private key from environment
const privateKey = process.env.WALLET_PRIVATE_KEY;
if (!privateKey) {
  console.error('❌ WALLET_PRIVATE_KEY not found in .env file');
  process.exit(1);
}

const account = await Account.fromPrivateKey(privateKey);
const provider = JsonRpcProvider.buildnet(account);

console.log('🔗 ChronoVault DCA Contract Interaction');
console.log('📄 Contract Address:', contractAddress);
console.log('👤 User Address:', account.address.toString());

// Helper function to call contract
async function callContract(functionName: string, args: Args, coins = 0): Promise<any> {
  const contract = new SmartContract(provider, contractAddress);
  
  try {
    const result = await contract.call(
      functionName,
      args,
      { coins: Mas.fromString(coins.toString()) }
    );
    
    console.log(`✅ ${functionName} completed`);
    console.log(`📝 Operation ID: ${result.id}`);
    
    return result;
  } catch (error) {
    console.error(`❌ ${functionName} failed:`, error);
    throw error;
  }
}

// Helper function to read contract state
async function readContract(functionName: string, args: Args): Promise<string> {
  const contract = new SmartContract(provider, contractAddress);
  
  try {
    const result = await contract.read(functionName, args);
    
    // Extract the actual return value from the result
    if (result && result.value) {
      // Convert byte array to string
      const bytes = Object.values(result.value) as number[];
      const text = String.fromCharCode(...bytes);
      return text;
    }
    
    return '0';
  } catch (error) {
    console.error(`❌ ${functionName} read failed:`, error);
    throw error;
  }
}

// Deposit MAS to vault
export async function depositToVault(amount: number): Promise<void> {
  console.log(`\n💰 Depositing ${amount} MAS to vault...`);
  
  const args = new Args();
  await callContract('depositToVault', args, amount);
}

// Check vault balance
export async function checkVaultBalance(): Promise<string> {
  console.log('\n💼 Checking vault balance...');
  
  const args = new Args();
  const balance = await readContract('getVaultBalance', args);
  console.log('💰 Vault Balance:', balance, 'MAS');
  return balance;
}

// Update token price (admin only)
export async function updateTokenPrice(token: string, price: number): Promise<void> {
  console.log(`\n📈 Updating ${token} price to ${price} MAS per token...`);
  
  const args = new Args().addString(token).addU64(BigInt(price));
  await callContract('updatePrice', args);
}

// Create DCA strategy
export async function createDCAStrategy(
  amount: number,
  frequencyHours: number,
  targetToken: string,
  hoursFromNow = 1
): Promise<string> {
  console.log(`\n🎯 Creating DCA strategy...`);
  console.log(`• Amount: ${amount} MAS`);
  console.log(`• Frequency: ${frequencyHours} hours`);
  console.log(`• Target Token: ${targetToken}`);
  console.log(`• First execution: ${hoursFromNow} hours from now`);
  
  const frequencyMs = frequencyHours * 60 * 60 * 1000;
  const nextExecutionMs = Date.now() + (hoursFromNow * 60 * 60 * 1000);
  
  const args = new Args()
    .addU64(BigInt(Math.floor(amount * 1000000))) // Convert to microMAS
    .addU64(BigInt(frequencyMs))
    .addString(targetToken)
    .addU64(BigInt(nextExecutionMs));
  
  await callContract('createStrategy', args);
  
  const userAddress = account.address.toString();
  
  // Strategy ID format: {user_address}_{count}
  // Since we just created it, the strategy ID should be user_address_0 for first strategy
  const strategyId = `${userAddress}_0`;
  console.log(`📋 Strategy ID: ${strategyId}`);
  
  return strategyId;
}

// Execute DCA strategy
export async function executeDCA(strategyId: string): Promise<void> {
  console.log(`\n⚡ Executing DCA strategy: ${strategyId}`);
  
  const args = new Args().addString(strategyId);
  await callContract('executeDCA', args);
}

// Get strategy information
export async function getStrategyInfo(strategyId: string): Promise<string> {
  console.log(`\n📊 Getting strategy info: ${strategyId}`);
  
  const args = new Args().addString(strategyId);
  const info = await readContract('getStrategy', args);
  console.log('📋 Strategy Info:', info);
  return info;
}

// Enable autonomous execution for a strategy
export async function enableAutonomousExecution(strategyId: string): Promise<void> {
  console.log(`\n🤖 Enabling autonomous execution for strategy: ${strategyId}`);
  
  const args = new Args().addString(strategyId);
  await callContract('enableAutonomousExecution', args);
}

// Disable autonomous execution for a strategy
export async function disableAutonomousExecution(strategyId: string): Promise<void> {
  console.log(`\n⏹️ Disabling autonomous execution for strategy: ${strategyId}`);
  
  const args = new Args().addString(strategyId);
  await callContract('disableAutonomousExecution', args);
}

// Demo workflow
export async function runDemo(): Promise<void> {
  console.log('\n🚀 Running ChronoVault DCA Demo...\n');
  
  try {
    // Step 1: Check initial balance
    await checkVaultBalance();
    
    // Step 2: Deposit funds
    await depositToVault(100); // 100 MAS
    
    // Step 3: Check balance after deposit
    await checkVaultBalance();
    
    // Step 4: Set token price (admin operation)
    await updateTokenPrice('USDC', 500000); // 0.5 MAS per USDC
    
    // Step 5: Create DCA strategy
    const strategyId = await createDCAStrategy(
      10,      // 10 MAS per execution
      24,      // Every 24 hours
      'USDC',  // Target token
      1        // First execution in 1 hour
    );
    
    // Step 6: Get strategy info
    await getStrategyInfo(strategyId);
    
    // Step 7: Execute DCA manually
    await executeDCA(strategyId);
    
    // Step 8: Check updated strategy info
    await getStrategyInfo(strategyId);
    
    // Step 9: Check remaining vault balance
    await checkVaultBalance();
    
    console.log('\n✅ Demo completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Demo failed:', error);
  }
}

// CLI interface
const command = process.argv[2];
const args = process.argv.slice(3);

switch (command) {
  case 'demo':
    await runDemo();
    break;
    
  case 'deposit':
    if (!args[0]) {
      console.error('Usage: npm run interact deposit <amount>');
      process.exit(1);
    }
    await depositToVault(parseFloat(args[0]));
    break;
    
  case 'balance':
    await checkVaultBalance();
    break;
    
  case 'price':
    if (!args[0] || !args[1]) {
      console.error('Usage: npm run interact price <token> <price>');
      process.exit(1);
    }
    await updateTokenPrice(args[0], parseFloat(args[1]));
    break;
    
  case 'create':
    if (!args[0] || !args[1] || !args[2]) {
      console.error('Usage: npm run interact create <amount> <frequency_hours> <target_token> [hours_from_now]');
      process.exit(1);
    }
    await createDCAStrategy(
      parseFloat(args[0]),
      parseFloat(args[1]),
      args[2],
      args[3] ? parseFloat(args[3]) : 1
    );
    break;
    
  case 'execute':
    if (!args[0]) {
      console.error('Usage: npm run interact execute <strategy_id>');
      process.exit(1);
    }
    await executeDCA(args[0]);
    break;
    
  case 'info':
    if (!args[0]) {
      console.error('Usage: npm run interact info <strategy_id>');
      process.exit(1);
    }
    await getStrategyInfo(args[0]);
    break;
    
  case 'enable-auto':
    if (!args[0]) {
      console.error('Usage: npm run interact enable-auto <strategy_id>');
      process.exit(1);
    }
    await enableAutonomousExecution(args[0]);
    break;
    
  case 'disable-auto':
    if (!args[0]) {
      console.error('Usage: npm run interact disable-auto <strategy_id>');
      process.exit(1);
    }
    await disableAutonomousExecution(args[0]);
    break;
    
  default:
    console.log('🔧 ChronoVault DCA Interaction Commands:');
    console.log('• npm run interact demo                                   - Run full demo');
    console.log('• npm run interact deposit <amount>                       - Deposit MAS to vault');
    console.log('• npm run interact balance                                - Check vault balance');
    console.log('• npm run interact price <token> <price>                  - Update token price (admin)');
    console.log('• npm run interact create <amount> <freq_hours> <token>   - Create DCA strategy');
    console.log('• npm run interact execute <strategy_id>                  - Execute DCA strategy');
    console.log('• npm run interact info <strategy_id>                     - Get strategy info');
    console.log('• npm run interact enable-auto <strategy_id>              - Enable autonomous execution');
    console.log('• npm run interact disable-auto <strategy_id>             - Disable autonomous execution');
    break;
}