import React from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import { useData } from '../contexts/DataContext.tsx';
import { IconBell, IconChevronDown, IconMenu } from './icons.tsx';

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user: authUser } = useAuth();
  const { findUserById, loading: dataLoading } = useData();
  
  // Find the full user profile from DataContext using the id from AuthContext
  const currentUser = authUser ? findUserById(authUser.id) : null;
  const isLoading = dataLoading && !currentUser;

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <IconMenu className="h-6 w-6" />
            </button>
        </div>

      <div className="flex items-center space-x-5">
        <div className="relative w-full max-w-xs">
          <input
            type="search"
            placeholder="Cerca manutenzione, attrezzatura..."
            className="w-full pl-4 pr-4 py-2 text-sm text-gray-700 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>

        <button className="relative text-gray-500 hover:text-gray-700">
          <IconBell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        <div className="relative">
          <button className="flex items-center space-x-2">
            {!isLoading && currentUser?.avatar_url && (
              <img className="h-9 w-9 rounded-full object-cover" src={currentUser.avatar_url} alt={currentUser.name} />
            )}
            <div className="text-left hidden md:block">
              <div className="text-sm font-medium text-gray-800">{isLoading ? 'Caricamento...' : currentUser?.name || 'Utente'}</div>
              <div className="text-xs text-gray-500">{isLoading ? '' : (currentUser?.roles[0] || '')}</div>
            </div>
            <IconChevronDown className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;