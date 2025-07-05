import 'dotenv/config';
import {
  Account,
  Args,
  Mas,
  SmartContract,
  JsonRpcProvider,
} from '@massalabs/massa-web3';
import { getScByteCode } from './utils';

const account = await Account.fromEnv();
const provider = JsonRpcProvider.buildnet(account);

console.log('🚀 Deploying ChronoVault DCA Contract...');
console.log('📍 Admin Address:', account.address.toString());

const byteCode = getScByteCode('build', 'main.wasm');

// Deploy with admin address as constructor argument
const constructorArgs = new Args().addString(account.address.toString());

const contract = await SmartContract.deploy(
  provider,
  byteCode,
  constructorArgs,
  { coins: Mas.fromString('0.01') },
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
