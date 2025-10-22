import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Header from './components/Header.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Maintenance from './pages/Maintenance.tsx';
import Equipment from './pages/Equipment.tsx';
import Inventory from './pages/Inventory.tsx';
import Purchasing from './pages/Purchasing.tsx';
import Users from './pages/Users.tsx';
import MaintenanceDetail from './pages/MaintenanceDetail.tsx';
import EquipmentDetail from './pages/EquipmentDetail.tsx';
import Planimetrie from './pages/Planimetrie.tsx';
import Settings from './pages/Settings.tsx';
import AuthPage from './pages/Auth.tsx';
import { DataProvider } from './contexts/DataContext.tsx';
import { useAuth } from './contexts/AuthContext.tsx';

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