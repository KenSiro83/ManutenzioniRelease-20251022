import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
// FIX: Add default export to pages files to fix module resolution errors.
import Dashboard from './pages/Dashboard';
// FIX: Add default export to pages files to fix module resolution errors.
import Maintenance from './pages/Maintenance';
import Equipment from './pages/Equipment';
// FIX: Add default export to pages files to fix module resolution errors.
import Inventory from './pages/Inventory';
// FIX: Add default export to pages files to fix module resolution errors.
import Purchasing from './pages/Purchasing';
import Users from './pages/Users';
// FIX: Add default export to pages files to fix module resolution errors.
import MaintenanceDetail from './pages/MaintenanceDetail';
import EquipmentDetail from './pages/EquipmentDetail';
// FIX: Add default export to pages files to fix module resolution errors.
import Planimetrie from './pages/Planimetrie';
import Settings from './pages/Settings';
import AuthPage from './pages/Auth';
// FIX: Add default export to DataContext to fix module resolution errors.
import { DataProvider } from './contexts/DataContext';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const [route, setRoute] = useState(window.location.hash);
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    if (!window.location.hash) {
      window.location.hash = '#/dashboard';
    }
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    const path = route.replace(/^#\/?|\/$/g, '').split('/');
    const page = path[0] || 'dashboard';
    const id = path[1];

    switch (page) {
      case 'dashboard':
        return <Dashboard />;
      case 'maintenance':
        return id ? <MaintenanceDetail id={id} /> : <Maintenance />;
      case 'equipment':
        return id ? <EquipmentDetail id={id} /> : <Equipment />;
      case 'planimetrie':
        return <Planimetrie />;
      case 'inventory':
        return <Inventory />;
      case 'purchasing':
        return <Purchasing />;
      case 'users':
        return <Users />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  const activePage = route.replace(/^#\/?|\/$/g, '').split('/')[0] || 'dashboard';

  return (
    <DataProvider>
      <div className="flex h-screen bg-gray-50 text-gray-800">
        <Sidebar activePage={activePage} isOpen={isSidebarOpen} setOpen={setSidebarOpen} />
        <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <Header sidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6 md:p-8">
            {renderPage()}
          </main>
        </div>
      </div>
    </DataProvider>
  );
};

const App: React.FC = () => {
  const { session } = useAuth();

  return (
    <>
      {!session ? <AuthPage /> : <AppContent />}
    </>
  );
};

export default App;
