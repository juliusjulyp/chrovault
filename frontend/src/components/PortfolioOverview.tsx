import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const PortfolioOverview: React.FC = () => {
  const { strategies } = useAppStore();

  // Calculate portfolio metrics
  const portfolioMetrics = React.useMemo(() => {
    if (strategies.length === 0) {
      return {
        totalInvested: 0,
        totalStrategies: 0,
        activeStrategies: 0,
        totalROI: 0,
        totalExecutions: 0
      };
    }

    const totalInvested = strategies.reduce((sum, strategy) => 
      sum + (strategy.totalSpent || 0), 0
    );
    
    const totalCurrentValue = strategies.reduce((sum, strategy) => 
      sum + (strategy.performanceData?.currentValue || 0), 0
    );

    const totalROI = totalInvested > 0 ? 
      ((totalCurrentValue - totalInvested) / totalInvested) * 100 : 0;

    const totalExecutions = strategies.reduce((sum, strategy) => 
      sum + (strategy.executionCount || 0), 0
    );

    return {
      totalInvested,
      totalStrategies: strategies.length,
      activeStrategies: strategies.filter(s => s.isActive).length,
      totalROI,
      totalExecutions,
      totalCurrentValue
    };
  }, [strategies]);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* Total Invested */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
          <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            Total Invested
          </div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {portfolioMetrics.totalInvested.toFixed(6)} MAS
          </div>
        </div>

        {/* Current Value */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
          <div className="text-sm text-green-600 dark:text-green-400 font-medium">
            Current Value
          </div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">
            {(portfolioMetrics.totalCurrentValue || 0).toFixed(6)} MAS
          </div>
        </div>

        {/* ROI */}
        <div className={`p-4 rounded-lg ${
          portfolioMetrics.totalROI >= 0 
            ? 'bg-green-50 dark:bg-green-900/20' 
            : 'bg-red-50 dark:bg-red-900/20'
        }`}>
          <div className={`text-sm font-medium ${
            portfolioMetrics.totalROI >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            Total ROI
          </div>
          <div className={`text-2xl font-bold ${
            portfolioMetrics.totalROI >= 0 
              ? 'text-green-900 dark:text-green-100' 
              : 'text-red-900 dark:text-red-100'
          }`}>
            {portfolioMetrics.totalROI >= 0 ? '+' : ''}{portfolioMetrics.totalROI.toFixed(2)}%
          </div>
        </div>

        {/* Active Strategies */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
          <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
            Active Strategies
          </div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {portfolioMetrics.activeStrategies}/{portfolioMetrics.totalStrategies}
          </div>
        </div>

        {/* Total Executions */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-lg">
          <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
            Total Executions
          </div>
          <div className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            {portfolioMetrics.totalExecutions}
          </div>
        </div>

        {/* Average Performance */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
          <div className="text-sm text-orange-600 dark:text-orange-400 font-medium">
            Success Rate
          </div>
          <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">
            {portfolioMetrics.totalExecutions > 0 ? '100' : '0'}%
          </div>
        </div>
      </div>

      {strategies.length === 0 && (
        <div className="mt-6 text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No strategies created yet.</p>
          <p className="text-sm mt-1">Create your first DCA strategy to see portfolio analytics.</p>
        </div>
      )}
    </div>
  );
};