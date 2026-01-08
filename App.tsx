
import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Trials from './views/Trials';
import Clients from './views/Clients';
import Sales from './views/Sales';
import Billing from './views/Billing';
import AffiliateLinks from './views/AffiliateLinks';
import Profile from './views/Profile';
import Auth from './views/Auth';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('uny_auth') === 'true';
  });
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('uny_auth');
    localStorage.removeItem('uny_user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={() => setIsAuthenticated(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'trials': return <Trials />;
      case 'clients': return <Clients />;
      case 'sales': return <Sales />;
      case 'billing': return <Billing />;
      case 'links': return <AffiliateLinks />;
      case 'profile': return <Profile onLogout={handleLogout} />;
      default: return <Dashboard />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen flex bg-[#0a0a0b] text-slate-100 overflow-hidden">
        {/* Sidebar for Desktop */}
        <div className="hidden md:block">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64 bg-[#111114] border-r border-white/5 shadow-xl">
              <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header onMenuClick={() => setIsSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
              {renderContent()}
            </div>
          </main>
        </div>
      </div>
    </AppProvider>
  );
};

export default App;
