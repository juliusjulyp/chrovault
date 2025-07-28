import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';

export const StrategyList: React.FC = () => {
  const { strategies, updateStrategy, deleteStrategy, addTransaction, addToast } = useAppStore();
  const [editingStrategy, setEditingStrategy] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ amount: '', frequency: '' });

  const handlePauseResume = (strategy: any) => {
    const newStatus = !strategy.isActive;
    updateStrategy(strategy.id!, { isActive: newStatus });
    
    // Add transaction record
    addTransaction({
      id: Math.random().toString(36).substring(7),
      strategyId: strategy.id!,
      type: newStatus ? 'resume' : 'pause',
      amount: strategy.amount,
      status: 'completed',
      timestamp: new Date()
    });

    addToast({
      type: 'success',
      message: `Strategy ${newStatus ? 'resumed' : 'paused'} successfully`
    });
  };

  const handleDelete = (strategy: any) => {
    if (window.confirm('Are you sure you want to delete this strategy? This action cannot be undone.')) {
      deleteStrategy(strategy.id!);
      
      // Add transaction record
      addTransaction({
        id: Math.random().toString(36).substring(7),
        strategyId: strategy.id!,
        type: 'delete',
        amount: strategy.amount,
        status: 'completed',
        timestamp: new Date()
      });

      addToast({
        type: 'info',
        message: 'Strategy deleted successfully'
      });
    }
  };

  const handleEdit = (strategy: any) => {
    setEditingStrategy(strategy.id!);
    setEditForm({
      amount: strategy.amount.toString(),
      frequency: strategy.frequency.toString()
    });
  };

  const handleSaveEdit = (strategyId: string) => {
    const amount = parseFloat(editForm.amount);
    const frequency = parseInt(editForm.frequency);

    if (amount <= 0 || frequency <= 0) {
      addToast({
        type: 'error',
        message: 'Please enter valid amounts'
      });
      return;
    }

    updateStrategy(strategyId, {
      amount,
      frequency,
      nextExecution: new Date(Date.now() + frequency * 60 * 60 * 1000)
    });

    setEditingStrategy(null);
    addToast({
      type: 'success',
      message: 'Strategy updated successfully'
    });
  };

  const calculatePerformance = (strategy: any) => {
    // Mock performance calculation - in real app this would come from blockchain data
    const executionCount = strategy.executionCount || 0;
    const totalSpent = strategy.totalSpent || (executionCount * strategy.amount);
    const mockROI = Math.random() * 10 - 5; // Random ROI between -5% and +5%
    
    return {
      executionCount,
      totalSpent,
      roi: mockROI
    };
  };

  if (strategies.length === 0) {
    return (
      <div className="card p-6">
        <h2 className="text-xl font-semibold mb-4">Your DCA Strategies</h2>
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No strategies created yet.</p>
          <p className="text-sm mt-1">Create your first DCA strategy above to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <h2 className="text-xl font-semibold mb-4">Your DCA Strategies</h2>
      
      <div className="space-y-4">
        {strategies.map((strategy) => {
          const performance = calculatePerformance(strategy);
          const isEditing = editingStrategy === strategy.id;
          
          return (
            <div
              key={strategy.id}
              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4"
            >
              {isEditing ? (
                // Edit Mode
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Amount (MAS)</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={editForm.amount}
                        onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                        className="input text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Frequency (hours)</label>
                      <select
                        value={editForm.frequency}
                        onChange={(e) => setEditForm({ ...editForm, frequency: e.target.value })}
                        className="input text-sm"
                      >
                        <option value="1">Every Hour</option>
                        <option value="6">Every 6 Hours</option>
                        <option value="12">Every 12 Hours</option>
                        <option value="24">Daily</option>
                        <option value="168">Weekly</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleSaveEdit(strategy.id!)}
                      className="btn-primary text-sm py-1 px-3"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingStrategy(null)}
                      className="btn-secondary text-sm py-1 px-3"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{strategy.amount} MAS → {strategy.targetToken}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        strategy.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                      }`}>
                        {strategy.isActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Every {strategy.frequency}h
                    </div>
                  </div>
                  
                  {/* Performance Metrics */}
                  <div className="grid grid-cols-3 gap-4 my-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Executions</div>
                      <div className="font-semibold">{performance.executionCount}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Spent</div>
                      <div className="font-semibold">{performance.totalSpent.toFixed(4)} MAS</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500 dark:text-gray-400">ROI</div>
                      <div className={`font-semibold ${
                        performance.roi >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {performance.roi >= 0 ? '+' : ''}{performance.roi.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                    <div>Next execution: {strategy.nextExecution.toLocaleString()}</div>
                    <div>Created: {strategy.createdAt.toLocaleDateString()}</div>
                  </div>
                  
                  <div className="flex space-x-2 mt-3">
                    <button
                      className="btn-secondary text-sm py-1 px-3"
                      onClick={() => handlePauseResume(strategy)}
                    >
                      {strategy.isActive ? 'Pause' : 'Resume'}
                    </button>
                    
                    <button
                      className="btn-secondary text-sm py-1 px-3"
                      onClick={() => handleEdit(strategy)}
                    >
                      Edit
                    </button>
                    
                    <button
                      className="btn-danger text-sm py-1 px-3"
                      onClick={() => handleDelete(strategy)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};