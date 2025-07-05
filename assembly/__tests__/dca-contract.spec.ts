import { Args, stringToBytes, u64ToBytes, bytesToU64, bytesToString } from '@massalabs/as-types';
import { 
  constructor, 
  ADMIN_KEY,
  STRATEGY_COUNT_KEY
} from '../contracts/main';
import { setDeployContext, Storage } from '@massalabs/massa-as-sdk';

const ADMIN_ADDRESS = 'AU12345AdminAddress';

describe('ChronoVault DCA Contract Tests', () => {
  beforeAll(() => {
    setDeployContext();
    
    // Initialize contract with admin
    const args = new Args().add(ADMIN_ADDRESS);
    constructor(args.serialize());
  });

  describe('Contract Initialization', () => {
    test('should set admin correctly', () => {
      const admin = bytesToString(Storage.get(ADMIN_KEY));
      expect(admin).toBe(ADMIN_ADDRESS);
    });

    test('should initialize strategy count to zero', () => {
      const count = bytesToU64(Storage.get(STRATEGY_COUNT_KEY));
      expect(count).toBe(0);
    });
  });

  describe('Storage Helper Functions', () => {
    test('should store and retrieve string values', () => {
      const testKey = stringToBytes('test_key');
      const testValue = 'test_value';
      
      Storage.set(testKey, stringToBytes(testValue));
      const retrieved = bytesToString(Storage.get(testKey));
      
      expect(retrieved).toBe(testValue);
    });

    test('should store and retrieve u64 values', () => {
      const testKey = stringToBytes('test_u64_key');
      const testValue: u64 = 12345;
      
      Storage.set(testKey, u64ToBytes(testValue));
      const retrieved = bytesToU64(Storage.get(testKey));
      
      expect(retrieved).toBe(testValue);
    });
  });

  describe('Contract Constants', () => {
    test('should have correct storage key prefixes', () => {
      expect(ADMIN_KEY).toStrictEqual(stringToBytes('admin'));
      expect(STRATEGY_COUNT_KEY).toStrictEqual(stringToBytes('strategy_count'));
    });
  });

  describe('Args Serialization', () => {
    test('should serialize and deserialize strings', () => {
      const testString = 'test_data';
      const args = new Args().add(testString);
      const serialized = args.serialize();
      
      const deserializer = new Args(serialized);
      const result = deserializer.nextString().expect('String expected');
      
      expect(result).toBe(testString);
    });

    test('should serialize and deserialize u64 values', () => {
      const testValue: u64 = 987654321;
      const args = new Args().add(testValue);
      const serialized = args.serialize();
      
      const deserializer = new Args(serialized);
      const result = deserializer.nextU64().expect('U64 expected');
      
      expect(result).toBe(testValue);
    });

    test('should handle multiple arguments', () => {
      const testString = 'USDC';
      const testU64: u64 = 500000;
      const testU64_2: u64 = 86400000;
      
      const args = new Args()
        .add(testU64)
        .add(testU64_2)
        .add(testString)
        .add(testU64 + 3600000);
        
      const serialized = args.serialize();
      
      const deserializer = new Args(serialized);
      const amount = deserializer.nextU64().expect('Amount expected');
      const frequency = deserializer.nextU64().expect('Frequency expected');
      const token = deserializer.nextString().expect('Token expected');
      const nextExec = deserializer.nextU64().expect('Next execution expected');
      
      expect(amount).toBe(testU64);
      expect(frequency).toBe(testU64_2);
      expect(token).toBe(testString);
      expect(nextExec).toBe(testU64 + 3600000);
    });
  });

  describe('Basic Contract Validation', () => {
    test('should validate contract deployment context', () => {
      // This test ensures the contract was properly initialized
      expect(Storage.has(ADMIN_KEY)).toBe(true);
      expect(Storage.has(STRATEGY_COUNT_KEY)).toBe(true);
    });

    test('should have proper initial state', () => {
      const admin = bytesToString(Storage.get(ADMIN_KEY));
      const count = bytesToU64(Storage.get(STRATEGY_COUNT_KEY));
      
      expect(admin).toBe(ADMIN_ADDRESS);
      expect(count).toBe(0);
    });
  });
});