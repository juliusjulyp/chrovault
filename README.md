# ChronoVault
*AI-Powered Autonomous DCA Platform on Massa Blockchain*

## 🎯 Project Title Definition

**ChronoVault: AI-Powered Autonomous Dollar-Cost Averaging with Self-Executing Smart Contracts**

### 🚀 Tagline
*"Where AI Meets Time - Autonomous DCA with Intelligent Optimization"*

### 📋 Official Description
ChronoVault is  AI-powered autonomous Dollar-Cost Averaging platform that combines Massa's unique self-scheduling smart contracts with  machine learning to eliminate keeper bots and optimize investment strategies. Users can set up DCA strategies that not only execute themselves on-chain but also adapt intelligently to market conditions using AI-driven insights.

### 🔥 Key Differentiators
- **AI-Powered Optimization**: Machine learning algorithms optimize DCA timing and amounts
- **Autonomous Execution**: No keeper bots, no external triggers - pure on-chain automation
- **Massa-Native AI**: Built specifically for Massa's self-scheduling capabilities with AI integration
- **DeWeb Integration**: Fully decentralized frontend hosted on-chain with AI dashboard
- **Zero Dependencies**: Pure on-chain automation with AI intelligence


---

## Development Roadmap

### 🌊 Wave 1: Minimal Viable Proof 
**Status**: ✅ Complete | **Goal**: Prove DCA execution works on Massa

- **Manual Execution MVP** - Smart contract with vault system and DCA logic
- **Demo Interface** - CLI tools for interaction and testing
- **Foundation Architecture** - Scalable contract design for AI integration

### 🌊 Wave 2: AI-Native Foundation
**Status**: ✅ Complete | **Goal**: Core autonomous DCA with AI integration foundation

- ✅ **Autonomous Smart Contract Scheduling** - Implemented Massa's `sendMessage` API for true self-execution
  - 📁 [`scheduleNextExecution()`](assembly/contracts/main.ts#L287) - Self-scheduling via Massa ASCs
  - 📁 [`autonomousExecuteDCA()`](assembly/contracts/main.ts#L212) - Autonomous execution function
- ✅ **Professional React Frontend** - Modern dashboard with professional UI/UX design

- ✅ **Real Wallet Integration** - Massa wallet provider integration with balance management

- ✅ **True Autonomous Execution** - Working autonomous DCA execution without keeper bots
  - 📁 [`enableAutonomousExecution()`](assembly/contracts/main.ts#L327) - Enable autonomous mode
  - 📁 [`disableAutonomousExecution()`](assembly/contracts/main.ts#L369) - Disable autonomous mode
- ✅ **Contract Parameter Management** - Fixed wallet provider serialization for seamless interaction
- ✅ **Professional Dashboard Architecture** - Modular sidebar navigation with multiple sections
- ✅ **DEX Integration Foundation** - Added DEX integration placeholder for future Dusa DEX connectivity
- ✅ **Error Handling & User Experience** - Comprehensive error boundaries and user feedback systems

### 🌊 Wave 3:  AI Analytics and Deweb testing
**Status**: 📋 Planned | **Goal**: Full AI-powered insights and recommendations

- **Strategy Performance Analytics** - Real-time ROI tracking with AI market intelligence
- **AI Strategy Recommendations** - Deep learning models for optimal DCA timing
- **Market Sentiment Analysis** - AI-powered market condition assessment
- **Predictive Modeling** - ML algorithms for price movement prediction
- **Enhanced DeWeb Interface** - AI dashboard with real-time insights

### 🌊 Wave 4: Cross-Chain AI Intelligence and Token Metrics
**Status**: 🔮 Future | **Goal**: Expand AI capabilities across chains
-**Dex Integration** - Integrating dex and get analytics based on the connected wallet
- **Data-visualisation** - Show real time analtics of different tokens.
- **Cross-Chain AI Bridge** - Multi-chain DCA optimization via AI
- **Advanced Risk Management** - AI-powered insurance and liquidation protection
- **Social AI Trading** - Community-driven AI strategy sharing
- **Cross-Protocol Intelligence** - AI arbitrage and optimization across Massa DeFi

### 🌊 Wave 5: Mainet testing
**Status**: 🔮 Future | **Goal**: Flagship AI-powered autonomous DeFi platform
-**DEFI Optimization features**
- **AI Strategy Marketplace** - Decentralized marketplace for AI-optimized DCA strategies
- **Cross-Protocol AI Intelligence** - Advanced arbitrage and optimization

## 🤖 AI Integration Features



### Future AI Features (Wave 3+)
- **Deep Learning Models** - Advanced neural networks for market prediction
- **Sentiment Analysis** - AI analysis of market sentiment from multiple sources
- **Adaptive Strategies** - Self-learning DCA strategies that evolve with markets
- **Cross-Chain Intelligence** - AI optimization across multiple blockchain networks

## 🏗️ Technical Architecture

### Smart Contract Features (Massa Blockchain)
- **Autonomous Smart Contracts (ASCs)** - Self-executing contracts using Massa's `sendMessage` API
- **Time-Based Scheduling** - DCA executions triggered autonomously at preset intervals
- **AI-Enhanced Scheduling** - Machine learning optimization for execution timing
- **Intelligent Vault System** - AI-managed fund allocation and risk assessment
- **AI Price Oracle** - Machine learning-powered real-time pricing with autonomous updates
- **Zero External Dependencies** - Pure on-chain automation without keeper bots
- **Gas Optimization** - Efficient autonomous execution with minimal gas costs

### Frontend Features (Massa DeWeb)
- **Fully On-Chain Hosting** - Frontend deployed to Massa blockchain via DeWeb
- **chronovault.massa Domain** - Decentralized domain through Massa Name Service (MNS)
- **AI Dashboard** - Real-time AI insights and strategy recommendations
- **Multi-Wallet Support** - Massa Station, Bearby, Massa Extension
- **Mobile AI Interface** - Responsive AI dashboard for all devices
- **Censorship-Resistant** - No centralized servers, 100% decentralized hosting

## 🚀 Getting Started

### Prerequisites
- **Massa Wallet** (Massa Station, Bearby, or Extension)
- **Testnet MAS** tokens for testing and autonomous execution gas
- **Node.js 16+** for local development
- **@massalabs/massa-as-sdk** for autonomous smart contract features

### Development Setup
```bash
# Install dependencies
npm install

# Build smart contract with autonomous features
npm run build

# Deploy autonomous DCA contract
npm run deploy

# Test autonomous execution locally
npm run interact
```

### DeWeb Deployment
```bash
# Build frontend for decentralized hosting
cd frontend && npm run build

# Deploy to Massa DeWeb (requires chronovault.massa MNS domain)
npx @massalabs/deweb-cli upload ./dist

# Access via: chronovault.massa or chronovault.localhost:8080
```

### Autonomous Execution
```bash
# Enable autonomous mode for existing DCA strategy
npm run interact -- enableAutonomousExecution <strategyId>

# Monitor autonomous executions
npm run interact -- getStrategy <strategyId>
```

## 📊 Project Identity

**Name**: ChronoVault  
**Tagline**: "AI-Powered Autonomous DCA Without Keepers"  
**Category**: AI-DeFi / Autonomous Finance  
**Blockchain**: Massa  
**Status**: Wave 3 AI Analytics Development  
**License**: MIT

---

## 🔧 Massa Blockchain Features

### Autonomous Smart Contracts (ASCs)
ChronoVault leverages Massa's unique autonomous smart contract capabilities:

- **Self-Executing Contracts**: DCA strategies execute automatically using Massa's `sendMessage` API
- **No External Dependencies**: Eliminates need for keeper bots or external triggers
- **Time-Based Scheduling**: Contracts wake themselves up at specified intervals
- **Gas Efficiency**: Autonomous execution optimized for minimal gas consumption
- **Atomic Operations**: DCA trades execute atomically preventing front-running

### Massa DeWeb Integration
- **Fully Decentralized Frontend**: Website hosted entirely on Massa blockchain
- **MNS Domain**: `chronovault.massa` - tradeable NFT domain with lifetime ownership
- **Censorship-Resistant**: No centralized servers or single points of failure
- **100% Uptime**: Website replicated across all Massa nodes globally

### Development Resources
- **Official Docs**: [docs.massa.net](https://docs.massa.net)
- **ASC Examples**: [massa-sc-examples](https://github.com/massalabs/massa-sc-examples)
- **DeWeb CLI**: `@massalabs/deweb-cli` for decentralized deployment

---

**⚠️ Testnet Only**: Current implementation is for Massa testnet. Mainnet deployment planned for future waves with full AI capabilities and autonomous execution.
