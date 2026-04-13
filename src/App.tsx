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
            className="fixed top-4 right-4 z-[60] px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-secondary/10 text-[10px] text-secondary/30 hover:text-secondary/80 hover:bg-white/10 transition-all uppercase tracking-widest font-bold"
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
