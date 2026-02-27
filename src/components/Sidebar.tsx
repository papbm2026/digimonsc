
import React from 'react';
import { NavLink } from 'react-router-dom';
import { User } from '../types';
import { MENU_ITEMS, COLORS } from '../constants';
import { LogOut, MonitorDot } from 'lucide-react';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ user, onLogout }) => {
  const filteredMenu = MENU_ITEMS.filter(item => item.roles.includes(user.role) || user.role === 'Admin');

  return (
    <aside className="w-full md:w-64 bg-emerald-900 text-white flex flex-col no-print">
      <div className="p-6 flex items-center space-x-3 border-b border-emerald-800">
        <div className="bg-emerald-100 p-2 rounded-lg text-emerald-900 shadow-inner">
          <MonitorDot size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight">DIGIMONS</h1>
          <p className="text-[10px] text-emerald-300 uppercase font-medium">Monitoring Sarpras</p>
        </div>
      </div>

      <nav className="flex-1 py-4 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {filteredMenu.map((item) => (
            <li key={item.id}>
              <NavLink
                to={item.id === 'dashboard' ? '/' : `/${item.id}`}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-900/50' 
                      : 'text-emerald-100 hover:bg-emerald-800/50 hover:translate-x-1'
                  }`
                }
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 mt-auto">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-xl bg-emerald-800/50 hover:bg-red-900/40 text-emerald-100 hover:text-white transition-all border border-emerald-700 hover:border-red-800"
        >
          <LogOut size={18} />
          <span className="text-sm font-medium">Keluar Pegawai</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
