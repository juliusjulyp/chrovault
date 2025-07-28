// ChronoVault Frontend - Wave 2: Professional Dashboard - COMPLETED ✅
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { MainLayout } from './components/MainLayout';
import { Toast } from './components/Toast';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  const { theme } = useAppStore();

  // Initialize theme on mount
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <ErrorBoundary>
      <MainLayout />
      <Toast />
    </ErrorBoundary>
  );
}

export default App;
