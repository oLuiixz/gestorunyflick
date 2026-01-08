
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Smartphone, Send, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { ClientStatus } from '../types';

const Billing: React.FC = () => {
  const { clients, processAutomatedBilling, updateClient } = useApp();
  const [activeFilter, setActiveFilter] = useState('All');

  const filtered = clients.filter(c => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'DueToday') {
      const today = new Date().toDateString();
      return new Date(c.expiryDate).toDateString() === today;
    }
    if (activeFilter === 'Overdue') return c.status === ClientStatus.EXPIRED;
    return true;
  });

  const handleSendManual = (client: any, type: 'd3' | 'd1' | 'd0') => {
    let msg = "";
    const dateStr = new Date(client.expiryDate).toLocaleDateString();
    
    if (type === 'd3') msg = `Olá ${client.name}! 👋 Seu acesso ao UnyFlick vence em ${dateStr}. Para não ficar sem acesso, já podemos renovar seu plano 😊`;
    else if (type === 'd1') msg = `Oi ${client.name}! ⚠️ Falta 1 dia para o vencimento do seu plano UnyFlick. Posso te ajudar com a renovação agora mesmo!`;
    else msg = `Olá ${client.name}! 🚨 Seu plano UnyFlick vence hoje. Me avise que já envio o link de pagamento.`;

    window.open(`https://wa.me/55${client.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
    
    const newHistory = { ...client.billingHistory };
    if (type === 'd3') newHistory.d3Sent = true;
    if (type === 'd1') newHistory.d1Sent = true;
    if (type === 'd0') newHistory.d0Sent = true;
    newHistory.lastBillingDate = new Date().toISOString();
    
    updateClient(client.id, { billingHistory: newHistory });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-slate-100">Controle de Cobranças</h2>
          <p className="text-slate-400">Monitore vencimentos e automatize mensagens de renovação.</p>
        </div>
        <button 
          onClick={processAutomatedBilling}
          className="flex items-center space-x-2 px-6 py-3 gradient-bg text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all brand-shadow"
        >
          <Bell size={18} />
          <span>Executar Verificação Diária</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {[
          { id: 'All', label: 'Todos' },
          { id: 'DueToday', label: 'Vence Hoje' },
          { id: 'Overdue', label: 'Vencidos' }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap border ${
              activeFilter === filter.id 
              ? 'bg-purple-600 border-purple-500 text-white shadow-lg' 
              : 'bg-[#111114] text-slate-400 border-white/5 hover:border-white/10 hover:text-slate-100'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(client => (
          <div key={client.id} className="bg-[#111114] p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-white/10 transition-all">
            <div className="flex items-center space-x-5 text-left">
              <div className={`p-4 rounded-2xl shadow-inner ${client.status === ClientStatus.EXPIRED ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'}`}>
                {client.status === ClientStatus.EXPIRED ? <AlertCircle size={28} /> : <Calendar size={28} />}
              </div>
              <div>
                <h4 className="font-bold text-lg text-slate-100 group-hover:text-white transition-colors">{client.name}</h4>
                <p className="text-sm text-slate-500">{client.whatsapp} • {client.plan}</p>
                <div className="flex items-center mt-2 space-x-4">
                  <span className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-1 rounded">Expira: {new Date(client.expiryDate).toLocaleDateString()}</span>
                  <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded border ${
                    client.status === ClientStatus.EXPIRED ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}>{client.status}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex space-x-1 mr-4">
                {[
                  { label: 'D-3', active: client.billingHistory.d3Sent, type: 'd3' },
                  { label: 'D-1', active: client.billingHistory.d1Sent, type: 'd1' },
                  { label: 'D-0', active: client.billingHistory.d0Sent, type: 'd0' }
                ].map(step => (
                  <button 
                    key={step.label}
                    onClick={() => handleSendManual(client, step.type as any)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                      step.active 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20 cursor-default' 
                      : 'bg-[#0a0a0b] text-slate-500 border-white/10 hover:border-purple-500/50 hover:text-purple-400'
                    }`}
                  >
                    {step.active && <CheckCircle2 size={12} className="inline mr-1" />}
                    {step.label}
                  </button>
                ))}
              </div>
              <button 
                onClick={() => handleSendManual(client, 'd0')}
                className="flex items-center space-x-2 px-5 py-3 bg-green-600 text-white rounded-2xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg"
              >
                <Send size={18} />
                <span>Cobrança Manual</span>
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-[#111114] p-16 text-center rounded-3xl border border-white/5">
            <p className="text-slate-500 font-medium">Nenhuma cobrança pendente para este filtro.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;
