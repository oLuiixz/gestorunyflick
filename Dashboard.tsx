
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart,
  Area
} from 'recharts';
import { 
  Users, 
  CheckCircle, 
  Wallet,
  ArrowUpRight,
  Clock,
  Bell,
  X,
  ShieldCheck,
  MessageCircle,
  Zap,
  ChevronRight
} from 'lucide-react';
import { ClientStatus } from '../types';

const Dashboard: React.FC = () => {
  const { clients, sales } = useApp();
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // 1. Checar Popup do Telegram
    const hasSeenPopup = sessionStorage.getItem('uny_popup_seen');
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setShowPopup(true), 1500);
    }

    // 2. Checar Vencimentos Críticos para Notificação Push Real
    const checkCriticalBilling = () => {
      if (Notification.permission === 'granted') {
        const today = new Date().toDateString();
        const clientsDueToday = clients.filter(c => 
          new Date(c.expiryDate).toDateString() === today && 
          c.status !== ClientStatus.TRIAL
        );

        if (clientsDueToday.length > 0) {
          new Notification('UnyFlick: Cobrança Pendente', {
            body: `Você tem ${clientsDueToday.length} clientes que vencem hoje! Toque para ver.`,
            icon: 'https://i.postimg.cc/52Nh7zgV/logo.png',
            tag: 'billing-alert', // evita múltiplas notificações iguais
          });
        }
      }
    };

    const notifyTimer = setTimeout(checkCriticalBilling, 3000);
    return () => clearTimeout(notifyTimer);
  }, [clients]);

  const closePopup = () => {
    sessionStorage.setItem('uny_popup_seen', 'true');
    setShowPopup(false);
  };

  const totalCommission = sales.reduce((acc, curr) => acc + curr.commission, 0);
  const totalSalesCount = sales.length;
  const activeClients = clients.filter(c => c.status === 'Ativo').length;
  const trials = clients.filter(c => c.status === 'Em teste').length;

  const chartData = [
    { name: 'Seg', vendas: 4, testes: 12 },
    { name: 'Ter', vendas: 7, testes: 15 },
    { name: 'Qua', vendas: 5, testes: 10 },
    { name: 'Qui', vendas: 12, testes: 22 },
    { name: 'Sex', vendas: 15, testes: 30 },
    { name: 'Sab', vendas: 8, testes: 18 },
    { name: 'Dom', vendas: 10, testes: 25 },
  ];

  const StatCard = ({ title, value, icon, color, trend }: any) => (
    <div className="bg-[#111114] p-6 rounded-2xl shadow-sm border border-white/5 hover:border-white/10 transition-all group">
      <div className="flex justify-between items-start">
        <div className={`p-3 rounded-xl ${color} text-white group-hover:scale-110 transition-transform shadow-lg`}>
          {icon}
        </div>
        {trend && (
          <div className="flex items-center text-green-400 text-sm font-bold">
            <ArrowUpRight size={16} className="mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className="mt-4 text-left">
        <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
        <p className="text-2xl font-bold mt-1 text-slate-100">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Support Group Popup com Animação Elegante */}
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 animate-backdrop-fade">
          <div className="absolute inset-0" onClick={closePopup}></div>
          <div className="bg-[#111114] w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative animate-modal-pop z-10">
            <button 
              onClick={closePopup}
              className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-full transition-all z-20"
            >
              <X size={20} />
            </button>
            <div className="p-8 md:p-10 text-center">
              <div className="w-20 h-20 gradient-bg mx-auto rounded-3xl flex items-center justify-center text-white mb-6 shadow-2xl brand-shadow animate-bounce">
                <Bell size={40} />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">🚨 Novo Grupo Oficial</h3>
              <p className="text-slate-400 mt-3 text-sm leading-relaxed">
                Entre agora no grupo exclusivo para afiliados UnyFlick e impulsione seus resultados.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  { icon: <ShieldCheck size={18} className="text-purple-400" />, text: 'Suporte direto com ADM' },
                  { icon: <Zap size={18} className="text-purple-400" />, text: 'Novidades sobre servidores' },
                  { icon: <MessageCircle size={18} className="text-purple-400" />, text: 'Materiais e dicas de vendas' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center space-x-3 bg-white/5 p-3 rounded-2xl border border-white/5 text-left text-sm text-slate-300">
                    {item.icon}
                    <span className="font-medium">{item.text}</span>
                  </div>
                ))}
              </div>
              <div className="mt-10 flex flex-col space-y-3">
                <a 
                  href="https://t.me/unyflick_suporte" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full py-4 gradient-bg text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2 brand-shadow"
                >
                  <span className="text-lg">👉 Entrar no Grupo</span>
                  <ChevronRight size={20} />
                </a>
                <button 
                  onClick={closePopup}
                  className="w-full py-3 text-slate-500 font-bold hover:text-slate-300 transition-colors text-sm"
                >
                  Talvez mais tarde
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-slate-100">Visão Geral</h2>
          <p className="text-slate-400 text-sm">Dados atualizados em tempo real.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-slate-300 bg-[#111114] px-4 py-2 rounded-xl border border-white/5 font-medium">
          <Clock size={16} className="text-purple-400" />
          <span>Atividades Recentes</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Testes Gerados" 
          value={trials} 
          icon={<Clock size={24} />} 
          color="bg-violet-600"
          trend="+12%"
        />
        <StatCard 
          title="Clientes Ativos" 
          value={activeClients} 
          icon={<Users size={24} />} 
          color="bg-indigo-600"
          trend="+5%"
        />
        <StatCard 
          title="Vendas" 
          value={totalSalesCount} 
          icon={<CheckCircle size={24} />} 
          color="bg-emerald-600"
          trend="+18%"
        />
        <StatCard 
          title="Comissões" 
          value={`R$ ${totalCommission.toFixed(2)}`} 
          icon={<Wallet size={24} />} 
          color="bg-purple-700"
          trend="+22%"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111114] p-6 rounded-2xl border border-white/5 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-100 text-left">Fluxo de Conversão</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Area type="monotone" dataKey="testes" stroke="#a78bfa" fillOpacity={1} fill="url(#colorTest)" strokeWidth={3} />
                <Area type="monotone" dataKey="vendas" stroke="#10b981" fillOpacity={1} fill="transparent" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111114] p-6 rounded-2xl border border-white/5 shadow-sm">
          <h3 className="text-lg font-bold mb-6 text-slate-100 text-left">Vendas Diárias</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#1c1c21'}}
                  contentStyle={{ backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="vendas" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
