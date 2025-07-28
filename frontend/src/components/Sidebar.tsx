import React from 'react';
import { useAppStore } from '../store/useAppStore';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { theme } = useAppStore();

  const sections = [
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'strategies', name: 'DCA Strategies', icon: '🔄' },
    { id: 'portfolio', name: 'Portfolio', icon: '💰' },
    { id: 'dex', name: 'DEX Integration', icon: '🔗' },
    { id: 'analytics', name: 'Analytics', icon: '📈' },
    { id: 'testing', name: 'Contract Testing', icon: '🧪' },
    { id: 'settings', name: 'Settings', icon: '⚙️' },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">ChronoVault</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">AI-Powered Autonomous DCA</p>
          </div>
        </div>

        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-lg">{section.icon}</span>
              <span className="font-medium">{section.name}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};