import React from 'react';
import { useWallet } from '../hooks/useWallet';

export const Dashboard: React.FC = () => {
  const { currentAccount, balance } = useWallet();

  const stats = [
    {
      title: 'Total Portfolio Value',
      value: balance ? `${parseFloat(balance).toFixed(2)} MAS` : 'Loading...',
      change: '+5.2%',
      changeType: 'positive' as const,
      icon: '💰',
    },
    {
      title: 'Active Strategies',
      value: '0',
      change: '+0',
      changeType: 'neutral' as const,
      icon: '🔄',
    },
    {
      title: 'Total Invested',
      value: '0.00 MAS',
      change: '+0%',
      changeType: 'neutral' as const,
      icon: '📈',
    },
    {
      title: 'Average Performance',
      value: 'N/A',
      change: 'N/A',
      changeType: 'neutral' as const,
      icon: '⭐',
    },
  ];

  const recentActivity = [
    { type: 'Wallet Connected', time: 'Just now', status: 'success' },
    { type: 'Contract Deployed', time: '5 minutes ago', status: 'success' },
    { type: 'System Ready', time: '5 minutes ago', status: 'info' },
  ];

  if (!currentAccount) {
    return (
      <div className="h-full flex flex-col space-y-8">
        {/* Welcome Section - Takes more vertical space */}
        <div className="flex-1 flex items-center justify-center min-h-96">
          <div className="text-center max-w-2xl mx-auto">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-8 flex items-center justify-center">
              <span className="text-white text-5xl">🔗</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to ChronoVault
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4 max-w-2xl mx-auto">
              <span className="font-semibold text-blue-600 dark:text-blue-400">AI-Powered Autonomous DCA Platform</span> on Massa Blockchain
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-lg mx-auto">
              Connect your Massa wallet to start creating intelligent, self-executing DCA strategies that run without keeper bots.
            </p>
            <div className="inline-flex items-center space-x-3 text-lg text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-6 py-3 rounded-lg">
              <span className="text-2xl">👆</span>
              <span>Connect your wallet in the top right corner to get started</span>
            </div>
          </div>
        </div>

        {/* Feature Highlights - Larger cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="card p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-6">🤖</div>
            <h3 className="text-xl font-semibold mb-4">AI-Powered Autonomous Execution</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Intelligent DCA strategies that execute themselves on Massa's autonomous smart contracts. No keeper bots, no external triggers - pure AI-driven automation.
            </p>
          </div>
          <div className="card p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-6">🧠</div>
            <h3 className="text-xl font-semibold mb-4">AI Strategy Optimization</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Machine learning algorithms analyze market conditions and optimize your DCA timing and amounts for maximum efficiency.
            </p>
          </div>
          <div className="card p-8 text-center hover:shadow-lg transition-shadow">
            <div className="text-6xl mb-6">⚡</div>
            <h3 className="text-xl font-semibold mb-4">Massa Blockchain Powered</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Built on Massa's revolutionary autonomous smart contracts with zero external dependencies. True decentralization meets AI intelligence.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8">
      {/* Welcome Header - Larger */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Your AI-powered autonomous DCA portfolio on Massa blockchain
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Connected as</div>
          <div className="font-mono text-lg text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg">
            {currentAccount.address.slice(0, 8)}...{currentAccount.address.slice(-6)}
          </div>
        </div>
      </div>

      {/* Stats Grid - Larger cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="card p-8 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-6">
              <div className="text-4xl">{stat.icon}</div>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${
                stat.changeType === 'positive' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : stat.changeType === 'negative'
                  ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {stat.value}
            </div>
            <div className="text-gray-600 dark:text-gray-300">
              {stat.title}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions & Recent Activity - Taller sections */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-96">
        {/* Quick Actions */}
        <div className="card p-8 h-full">
          <h3 className="text-xl font-semibold mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button className="w-full flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl">➕</span>
              <div className="text-left">
                <div className="font-medium text-lg">Create New Strategy</div>
                <div className="text-gray-600 dark:text-gray-300">Set up automated DCA</div>
              </div>
            </button>
            <button className="w-full flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl">💰</span>
              <div className="text-left">
                <div className="font-medium text-lg">Fund Wallet</div>
                <div className="text-gray-600 dark:text-gray-300">Add MAS to your wallet</div>
              </div>
            </button>
            <button className="w-full flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <span className="text-2xl">📊</span>
              <div className="text-left">
                <div className="font-medium text-lg">View Analytics</div>
                <div className="text-gray-600 dark:text-gray-300">Check performance metrics</div>
              </div>
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card p-8 h-full">
          <h3 className="text-xl font-semibold mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' 
                    ? 'bg-green-500'
                    : activity.status === 'error'
                    ? 'bg-red-500'
                    : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <div className="font-medium text-lg">{activity.type}</div>
                  <div className="text-gray-600 dark:text-gray-300">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};