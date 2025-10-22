import React from 'react';
import { IconDashboard, IconWrench, IconHardDrive, IconArchive, IconShoppingCart, IconUsers, IconSettings, IconLogOut, IconMap } from './icons.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';

interface SidebarProps {
  activePage: string;
  isOpen: boolean;
  setOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{ icon: React.ReactElement<{ className?: string }>; label: string; isActive: boolean; onClick: () => void; isSidebarOpen: boolean }> = ({ icon, label, isActive, onClick, isSidebarOpen }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white shadow-lg'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {React.cloneElement(icon, { className: "h-5 w-5"})}
    <span className={`ml-4 transition-opacity duration-200 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ activePage, isOpen }) => {
  const { signOut } = useAuth();
  
  const navItems = [
    { id: 'dashboard', icon: <IconDashboard />, label: 'Dashboard' },
    { id: 'maintenance', icon: <IconWrench />, label: 'Manutenzioni' },
    { id: 'equipment', icon: <IconHardDrive />, label: 'Attrezzature' },
    { id: 'planimetrie', icon: <IconMap />, label: 'Planimetrie' },
    { id: 'inventory', icon: <IconArchive />, label: 'Magazzino' },
    { id: 'purchasing', icon: <IconShoppingCart />, label: 'Acquisti' },
    { id: 'users', icon: <IconUsers />, label: 'Utenti e Ruoli' },
  ];

  return (
    <aside className={`fixed top-0 left-0 h-full bg-gray-800 text-white flex flex-col z-30 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
        <div className={`flex items-center border-b border-gray-700 transition-all duration-300 ${isOpen ? 'justify-between px-4' : 'justify-center'} h-16`}>
            <div className="flex items-center">
                <IconWrench className="h-8 w-8 text-indigo-400" />
                <span className={`ml-3 text-xl font-bold transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>Manutenzioni</span>
            </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map(item => (
                <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activePage === item.id}
                onClick={() => window.location.hash = `/${item.id}`}
                isSidebarOpen={isOpen}
                />
            ))}
        </nav>

        <div className="px-4 py-4 border-t border-gray-700">
            <NavItem icon={<IconSettings />} label="Impostazioni" isActive={activePage === 'settings'} onClick={() => window.location.hash = '/settings'} isSidebarOpen={isOpen} />
            <NavItem icon={<IconLogOut />} label="Logout" isActive={false} onClick={signOut} isSidebarOpen={isOpen} />
        </div>
    </aside>
  );
};

export default Sidebar;