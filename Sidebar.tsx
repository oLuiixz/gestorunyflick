
import React from 'react';
import { MENU_ITEMS } from '../constants';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const userJson = localStorage.getItem('uny_user');
  const user = userJson ? JSON.parse(userJson) : { name: 'Usuário', role: 'Gestor', profilePhoto: null };
  
  const initials = user.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <aside className="w-64 bg-[#111114] h-screen flex flex-col border-r border-white/5">
      <div className="p-6 flex flex-col items-center border-b border-white/5">
        <img 
          src="https://i.postimg.cc/Kzh0dJ4q/logounyflick.png" 
          alt="UnyFlick Logo" 
          className="w-full max-w-[150px] object-contain mb-2"
        />
        <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-500">Gestor UnyFlick</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {MENU_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              activeTab === item.id
                ? 'sidebar-item-active shadow-sm'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
            }`}
          >
            <span className={activeTab === item.id ? 'text-purple-400' : 'text-slate-500'}>
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <div className="bg-[#1c1c21] rounded-xl p-4 flex items-center space-x-3">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} className="w-8 h-8 rounded-full object-cover shadow-md" alt="User" />
          ) : (
            <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-semibold text-xs shadow-md">
              {initials}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-500 truncate">Gestor Ativo</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;