import 'dotenv/config';
import {
  Account,
  Args,
  Mas,
  SmartContract,
  JsonRpcProvider,
} from '@massalabs/massa-web3';
import { getScByteCode } from './utils';

// Get private key from environment
const privateKey = process.env.WALLET_PRIVATE_KEY;
if (!privateKey) {
  console.error('❌ WALLET_PRIVATE_KEY not found in .env file');
  process.exit(1);
}

const account = await Account.fromPrivateKey(privateKey);
const provider = JsonRpcProvider.buildnet(account);

console.log('🚀 Deploying ChronoVault DCA Contract...');
console.log('📍 Admin Address:', account.address.toString());

// Check balance before deployment
const balance = await provider.balance();
console.log('💰 Wallet Balance:', balance.toString(), 'MAS');

if (parseFloat(balance.toString()) < 0.01) {
  console.error('❌ Insufficient balance for deployment. Need at least 0.01 MAS');
  console.error('💡 Current balance:', balance.toString(), 'MAS');
  process.exit(1);
}

const byteCode = getScByteCode('build', 'main.wasm');

// Deploy with admin address as constructor argument
const constructorArgs = new Args().addString(account.address.toString());

const contract = await SmartContract.deploy(
  provider,
  byteCode,
  constructorArgs,
  { 
    coins: Mas.fromString('10'),      // Same as before
    fee: Mas.fromString('10'),       // Same as before  
    maxGas: BigInt(1000000000),      // 1B gas - what worked initially
  },
);

console.log('✅ Contract deployed successfully!');
console.log('📄 Contract Address:', contract.address);
console.log('💰 Admin Address:', account.address.toString());

console.log('\n📋 Contract Functions Available:');
console.log('• createStrategy(amount, frequency, targetToken, nextExecution)');
console.log('• depositToVault() - send MAS coins');
console.log('• getVaultBalance()');
console.log('• updatePrice(token, price) - admin only');
console.log('• executeDCA(strategyId)');
console.log('• getStrategy(strategyId)');

// Get deployment events
const events = await provider.getEvents({
  smartContractAddress: contract.address,
});

console.log('\n📝 Deployment Events:');
for (const event of events) {
  console.log('•', event.data);
}

// Save contract address to .env for future interactions
console.log('\n💡 Add this to your .env file:');
console.log(`DCA_CONTRACT_ADDRESS=${contract.address}`);
console.log('\n🎯 Ready for DCA operations!');
