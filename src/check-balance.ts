import { Account, JsonRpcProvider } from '@massalabs/massa-web3';
import 'dotenv/config';

// Get the private key from environment variables
const privateKey = process.env.WALLET_PRIVATE_KEY;

if (!privateKey) {
  console.error('❌ WALLET_PRIVATE_KEY not found in .env file');
  process.exit(1);
}

async function checkBalance() {
  try {
    // Create account from private key
    const account = await Account.fromPrivateKey(privateKey!);
    const walletAddress = account.address.toString();
    
    // Connect to Massa testnet with account
    const provider = JsonRpcProvider.buildnet(account);
    
    // Get wallet balance using provider
    const balance = await provider.balance();
    
    console.log('📍 Wallet Address:', walletAddress);
    console.log('💰 Balance:', balance.toString(), 'MAS');
    
    // Check if balance is sufficient for operations
    if (balance.toString() === '0') {
      console.log('⚠️  No tokens found. Request testnet tokens from Massa Discord faucet.');
    } else if (parseFloat(balance.toString()) >= 100) {
      console.log('✅ Balance is sufficient for staking (100+ MAS)');
    } else {
      console.log('⚠️  Balance is low. Consider requesting more tokens for staking.');
    }
    
  } catch (error) {
    console.error('❌ Error checking balance:', error);
    process.exit(1);
  }
}

checkBalance();