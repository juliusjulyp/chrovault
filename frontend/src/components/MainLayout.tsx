import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { PortfolioOverview } from './PortfolioOverview';
import { StrategyList } from './StrategyList';
import { DCAStrategyForm } from './DCAStrategyForm';
import { TransactionHistory } from './TransactionHistory';
import { AutonomousTestPanel } from './AutonomousTestPanel';
import { HeaderWallet } from './HeaderWallet';
import { ThemeToggle } from './ThemeToggle';
import { DexIntegration } from './DexIntegration';

// Settings Component (placeholder for now)
const Settings: React.FC = () => (
  <div className="h-full flex flex-col space-y-8">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Platform Settings</h1>
    
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-96">
      <div className="card p-8 h-full">
        <h3 className="text-xl font-semibold mb-6">Preferences</h3>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-lg">Theme</div>
              <div className="text-gray-600 dark:text-gray-300">Choose your preferred theme</div>
            </div>
            <ThemeToggle />
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-lg">Notifications</div>
              <div className="text-gray-600 dark:text-gray-300">Strategy execution alerts</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <div className="font-medium text-lg">Auto-refresh</div>
              <div className="text-gray-600 dark:text-gray-300">Automatically refresh portfolio data</div>
            </div>
            <select className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2">
              <option>Every 30s</option>
              <option>Every 1min</option>
              <option>Every 5min</option>
              <option>Manual</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="card p-8 h-full">
        <h3 className="text-xl font-semibold mb-6">Account Information</h3>
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-medium text-lg mb-2">Connected Wallet</div>
            <div className="text-gray-600 dark:text-gray-300 font-mono text-sm break-all">
              AU1sAZ7pmWCCKr322PWVaYoH5JqKpgNtHXJDSF5MoMDDyzeFEjuK
            </div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-medium text-lg mb-2">Network</div>
            <div className="text-gray-600 dark:text-gray-300">Massa Buildnet</div>
          </div>
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="font-medium text-lg mb-2">Contract Version</div>
            <div className="text-gray-600 dark:text-gray-300">v1.0.0 - AI-Powered Autonomous DCA</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Analytics Component (placeholder for now)
const Analytics: React.FC = () => (
  <div className="h-full flex flex-col space-y-8">
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Analytics</h1>
      <div className="flex space-x-3">
        <button className="btn-secondary text-sm">Last 7 days</button>
        <button className="btn-secondary text-sm">Last 30 days</button>
        <button className="btn-primary text-sm">All time</button>
      </div>
    </div>
    
    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-96">
      <div className="card p-8 h-full">
        <h3 className="text-xl font-semibold mb-6">Portfolio Performance</h3>
        <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📈</div>
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Interactive Charts Coming Soon</div>
            <div className="text-gray-600 dark:text-gray-400">Portfolio growth • Asset allocation • Performance metrics</div>
          </div>
        </div>
      </div>
      
      <div className="card p-8 h-full">
        <h3 className="text-xl font-semibold mb-6">Strategy Analytics</h3>
        <div className="h-80 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📊</div>
            <div className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Advanced Metrics Dashboard</div>
            <div className="text-gray-600 dark:text-gray-400">Strategy comparison • ROI analysis • Success rates</div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Additional metrics row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="card p-6 text-center">
        <div className="text-3xl mb-3">🎯</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">0%</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Success Rate</div>
      </div>
      <div className="card p-6 text-center">
        <div className="text-3xl mb-3">💹</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">0.00</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Average ROI</div>
      </div>
      <div className="card p-6 text-center">
        <div className="text-3xl mb-3">⏱️</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">0</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Active Strategies</div>
      </div>
      <div className="card p-6 text-center">
        <div className="text-3xl mb-3">💰</div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">0.00 MAS</div>
        <div className="text-sm text-gray-600 dark:text-gray-300">Total Invested</div>
      </div>
    </div>
  </div>
);

export const MainLayout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'strategies':
        return (
          <div className="h-full flex flex-col space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI-Powered DCA Strategies</h1>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-96">
              <div className="h-full">
                <DCAStrategyForm />
              </div>
              <div className="h-full">
                <StrategyList />
              </div>
            </div>
          </div>
        );
      case 'portfolio':
        return (
          <div className="h-full flex flex-col space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Portfolio Analytics</h1>
            <div className="flex-1 space-y-8">
              <PortfolioOverview />
              <TransactionHistory />
            </div>
          </div>
        );
      case 'analytics':
        return <Analytics />;
      case 'dex':
        return <DexIntegration />;
      case 'testing':
        return (
          <div className="h-full flex flex-col space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Autonomous Contract Testing</h1>
            <div className="flex-1">
              <AutonomousTestPanel />
            </div>
          </div>
        );
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300 capitalize">
                {activeSection === 'strategies' ? 'AI-Powered DCA Strategies' : 
                 activeSection === 'dashboard' ? 'Dashboard' :
                 activeSection === 'portfolio' ? 'AI Portfolio Analytics' :
                 activeSection === 'analytics' ? 'AI Analytics' :
                 activeSection === 'dex' ? 'DEX Integration' :
                 activeSection === 'testing' ? 'Autonomous Contract Testing' :
                 activeSection}
              </h2>
            </div>
            <HeaderWallet />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};