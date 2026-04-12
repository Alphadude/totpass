import React from 'react';
import { WaitlistPage } from './pages/WaitlistPage';
import { CheckInDashboard } from './pages/CheckInDashboard';

function App() {
  const [currentView, setCurrentView] = React.useState<'waitlist' | 'admin'>('waitlist');

  return (
    <div className="min-h-screen">
      {currentView === 'waitlist' ? (
        <>
          <WaitlistPage />
          {/* Subtle admin access for demo purposes */}
          <button 
            onClick={() => setCurrentView('admin')}
            className="fixed bottom-4 right-4 text-[10px] text-secondary/20 hover:text-secondary/60 transition-colors uppercase tracking-widest font-bold"
          >
            Admin Access
          </button>
        </>
      ) : (
        <CheckInDashboard onBack={() => setCurrentView('waitlist')} />
      )}
    </div>
  );
}

export default App;
