import { Account } from '@massalabs/massa-web3';
import 'dotenv/config';

// Get the private key from environment variables
const privateKey = process.env.WALLET_PRIVATE_KEY;

if (!privateKey) {
  console.error('❌ WALLET_PRIVATE_KEY not found in .env file');
  process.exit(1);
}

try {
  // Create account from private key
  const account = await Account.fromPrivateKey(privateKey);
  
  // Get the wallet address
  const walletAddress = account.address.toString();
  
  console.log('🔑 Private Key:', privateKey);
  console.log('📍 Wallet Address:', walletAddress);
  console.log('\n💡 Use this address to request testnet tokens from Massa Discord faucet');
  
} catch (error) {
  console.error('❌ Error deriving address from private key:', error);
  process.exit(1);
}