import React, { useState, useEffect } from 'react';
import { PublicPortal } from './components/PublicPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { ViewMode } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>('public');

  // Restore view from session storage to survive refresh (optional nice-to-have)
  useEffect(() => {
    const savedView = sessionStorage.getItem('currentView') as ViewMode;
    if (savedView) setView(savedView);
  }, []);

  const handleLogin = () => {
    // Simulate a simple login check or just switch view as requested "Local Only" without complex auth
    const password = prompt("Enter Admin Password (use 'admin'):");
    if (password === 'admin') {
      setView('admin');
      sessionStorage.setItem('currentView', 'admin');
    } else if (password !== null) {
      alert("Invalid Password");
    }
  };

  const handleLogout = () => {
    setView('public');
    sessionStorage.setItem('currentView', 'public');
  };

  return (
    <div className="font-sans">
      {view === 'public' ? (
        <PublicPortal onLoginClick={handleLogin} />
      ) : (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
};

export default App;
