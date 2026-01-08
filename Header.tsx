
import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, X, AlertCircle, Calendar, ChevronRight, BellOff, BellRing } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClientStatus } from '../types';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { clients } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const userJson = localStorage.getItem('uny_user');
  const user = userJson ? JSON.parse(userJson) : { name: 'Usuário', profilePhoto: null };

  const notifications = clients.filter(c => 
    c.status === ClientStatus.BILLING || c.status === ClientStatus.EXPIRED
  ).sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime());

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      alert('Este navegador não suporta notificações de desktop');
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
    
    if (permission === 'granted') {
      new Notification('UnyFlick', {
        body: 'Notificações ativadas com sucesso!',
        icon: 'https://i.postimg.cc/52Nh7zgV/logo.png'
      });
    }
  };

  const getDaysRemaining = (expiryDate: string) => {
    const diff = new Date(expiryDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <header className="h-20 bg-[#0a0a0b]/80 backdrop-blur-md border-b border-white/5 px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onMenuClick}
          className="md:hidden p-2 text-slate-400 hover:bg-white/5 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="relative hidden sm:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
            <Search size={18} />
          </span>
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="pl-10 pr-4 py-2 bg-[#111114] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 transition-all w-64 md:w-80 text-slate-100"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Botão de Status das Notificações do Sistema */}
        <button 
          onClick={requestPermission}
          title={notificationPermission === 'granted' ? 'Notificações Ativas' : 'Ativar Notificações no Celular'}
          className={`p-2 rounded-xl transition-all ${
            notificationPermission === 'granted' ? 'text-green-500 hover:bg-green-500/5' : 'text-amber-500 hover:bg-amber-500/5 animate-pulse'
          }`}
        >
          {notificationPermission === 'granted' ? <BellRing size={20} /> : <BellOff size={20} />}
        </button>

        <div className="relative" ref={notificationRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl relative transition-all ${showNotifications ? 'bg-purple-500/10 text-purple-400' : 'text-slate-400 hover:bg-white/5'}`}
          >
            <Bell size={22} />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#0a0a0b] animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#111114] border border-white/10 rounded-[1.5rem] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
              <div className="p-4 border-b border-white/5 bg-[#0a0a0b]/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-100 flex items-center">
                  <Bell size={16} className="mr-2 text-purple-400" />
                  Alertas de Vencimento
                </h3>
                <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-slate-500 font-bold uppercase tracking-wider">
                  {notifications.length} Pendentes
                </span>
              </div>
              
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length > 0 ? (
                  <div className="divide-y divide-white/5 text-left">
                    {notifications.map((client) => {
                      const days = getDaysRemaining(client.expiryDate);
                      const isExpired = days < 0;
                      
                      return (
                        <div key={client.id} className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer group">
                          <div className="flex items-start space-x-3">
                            <div className={`mt-1 p-2 rounded-lg ${isExpired ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                              {isExpired ? <AlertCircle size={16} /> : <Calendar size={16} />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-slate-200 truncate group-hover:text-white">
                                {client.name}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                Plano: {client.plan}
                              </p>
                              <div className="flex items-center mt-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isExpired ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                  {isExpired ? 'VENCIDO' : `VENCE EM ${days} ${days === 1 ? 'DIA' : 'DIAS'}`}
                                </span>
                              </div>
                            </div>
                            <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 transition-colors self-center" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-10 text-center">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                      <Bell size={24} />
                    </div>
                    <p className="text-sm text-slate-500">Nenhuma notificação crítica no momento.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="h-8 w-[1px] bg-white/5 mx-2"></div>
        <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/5 p-1 pr-3 rounded-xl transition-all">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} className="w-10 h-10 rounded-xl object-cover border border-white/5" alt="Avatar" />
          ) : (
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm border border-white/5">
              {user.name?.charAt(0) || 'U'}
            </div>
          )}
          <div className="hidden lg:block text-left">
            <p className="text-sm font-bold text-slate-100">{user.name}</p>
            <p className="text-xs text-green-400 font-medium">Online</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
