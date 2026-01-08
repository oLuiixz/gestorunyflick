
import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ClientStatus } from '../types';
import { PLANS } from '../constants';
import { 
  Search, 
  Smartphone, 
  ShoppingCart, 
  Edit, 
  Plus, 
  X, 
  User, 
  Mail, 
  Calendar,
  Package,
  CheckCircle2
} from 'lucide-react';

const Clients: React.FC = () => {
  const { clients, convertToSale, addClient } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
    plan: PLANS[0].name,
    status: ClientStatus.ACTIVE,
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
  });

  // Calculate Expiry Date automatically when plan or start date changes
  useEffect(() => {
    const start = new Date(formData.startDate);
    const planName = formData.plan.toLowerCase();
    const newExpiry = new Date(start);

    if (planName.includes('mensal')) {
      newExpiry.setMonth(newExpiry.getMonth() + 1);
    } else if (planName.includes('trimestral')) {
      newExpiry.setMonth(newExpiry.getMonth() + 3);
    } else if (planName.includes('semestral')) {
      newExpiry.setMonth(newExpiry.getMonth() + 6);
    } else if (planName.includes('anual')) {
      newExpiry.setFullYear(newExpiry.getFullYear() + 1);
    }

    setFormData(prev => ({
      ...prev,
      expiryDate: newExpiry.toISOString().split('T')[0]
    }));
  }, [formData.plan, formData.startDate]);

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.whatsapp.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }: { status: string }) => {
    const styles: Record<string, string> = {
      [ClientStatus.TRIAL]: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      [ClientStatus.ACTIVE]: 'bg-green-500/10 text-green-400 border-green-500/20',
      [ClientStatus.BILLING]: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      [ClientStatus.EXPIRED]: 'bg-red-500/10 text-red-400 border-red-500/20',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
        {status}
      </span>
    );
  };

  const handleConvert = (clientId: string) => {
    const selectedPlan = window.prompt(
      'Para qual plano deseja converter? Digite o nome exato:\n' + 
      PLANS.map(p => `- ${p.name}`).join('\n'), 
      PLANS[0].name
    );
    
    if (selectedPlan && PLANS.some(p => p.name === selectedPlan)) {
      convertToSale(clientId, selectedPlan);
    } else if (selectedPlan) {
      alert('Plano inválido selecionado.');
    }
  };

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    addClient({
      name: formData.name,
      whatsapp: formData.whatsapp,
      email: formData.email,
      status: formData.status,
      plan: formData.plan,
      startDate: new Date(formData.startDate).toISOString(),
      expiryDate: new Date(formData.expiryDate).toISOString(),
      affiliateId: 'current-affiliate'
    });
    setIsModalOpen(false);
    setFormData({
      name: '',
      whatsapp: '',
      email: '',
      plan: PLANS[0].name,
      status: ClientStatus.ACTIVE,
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Gerenciar Clientes</h2>
          <p className="text-slate-400 text-sm">Controle sua base de assinantes UnyFlick.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-5 py-2.5 gradient-bg text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={18} />
            <span>Adicionar Cliente</span>
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-[#111114] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-100 w-full md:w-48"
            />
          </div>

          <select 
            className="px-4 py-2.5 bg-[#111114] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-300 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="All">Todos Status</option>
            <option value={ClientStatus.TRIAL}>Em Teste</option>
            <option value={ClientStatus.ACTIVE}>Ativo</option>
            <option value={ClientStatus.BILLING}>Em Cobrança</option>
            <option value={ClientStatus.EXPIRED}>Vencido</option>
          </select>
        </div>
      </div>

      <div className="bg-[#111114] rounded-2xl border border-white/5 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a0b] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nome</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">WhatsApp</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center text-white font-bold text-xs">
                        {client.name.charAt(0)}
                      </div>
                      <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">{client.whatsapp}</td>
                  <td className="px-6 py-4"><StatusBadge status={client.status} /></td>
                  <td className="px-6 py-4 text-sm text-slate-400">{client.plan}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{new Date(client.expiryDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {client.status === ClientStatus.TRIAL && (
                        <button 
                          onClick={() => handleConvert(client.id)}
                          className="p-2 text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                          title="Converter em Venda"
                        >
                          <ShoppingCart size={18} />
                        </button>
                      )}
                      <button className="p-2 text-slate-500 hover:bg-white/5 rounded-lg transition-colors"><Smartphone size={18} /></button>
                      <button className="p-2 text-slate-500 hover:bg-white/5 rounded-lg transition-colors"><Edit size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredClients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 bg-[#111114]">
                    Nenhum cliente encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Client Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111114] w-full max-w-2xl rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="gradient-bg p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <User size={20} />
                </div>
                <h3 className="text-xl font-bold">Novo Cliente</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddClient} className="p-8 space-y-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Informações Pessoais</h4>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">Nome Completo</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><User size={16} /></span>
                      <input 
                        required
                        type="text" 
                        placeholder="Ex: Pedro Alvares"
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-100 transition-all"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">WhatsApp</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Smartphone size={16} /></span>
                      <input 
                        required
                        type="text" 
                        placeholder="(00) 00000-0000"
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-100 transition-all"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">E-mail (Opcional)</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Mail size={16} /></span>
                      <input 
                        type="email" 
                        placeholder="cliente@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-100 transition-all"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                {/* Plan Info */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contrato & Datas</h4>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">Plano Adquirido</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Package size={16} /></span>
                      <select 
                        className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-100 transition-all appearance-none"
                        value={formData.plan}
                        onChange={(e) => setFormData({...formData, plan: e.target.value})}
                      >
                        {PLANS.map(p => (
                          <option key={p.id} value={p.name}>
                            {p.name} - R$ {p.price.toFixed(2)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">Data Início</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Calendar size={16} /></span>
                        <input 
                          required
                          type="date" 
                          className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-100 transition-all"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">Vencimento (Auto)</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Calendar size={16} /></span>
                        <input 
                          required
                          readOnly
                          type="date" 
                          className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b]/50 border border-white/10 rounded-xl focus:outline-none text-slate-400 transition-all cursor-not-allowed"
                          value={formData.expiryDate}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">Status</label>
                    <select 
                      className="w-full px-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-100 transition-all"
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as ClientStatus})}
                    >
                      <option value={ClientStatus.ACTIVE}>Ativo (Pago)</option>
                      <option value={ClientStatus.TRIAL}>Em Teste</option>
                      <option value={ClientStatus.BILLING}>Pendente Pagamento</option>
                      <option value={ClientStatus.EXPIRED}>Vencido</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-4 shrink-0">
                <button 
                  type="submit"
                  className="flex-1 py-4 gradient-bg text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2"
                >
                  <CheckCircle2 size={20} />
                  <span>Cadastrar Agora</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-10 py-4 bg-white/5 text-slate-400 font-bold rounded-2xl border border-white/10 hover:bg-white/10 hover:text-slate-200 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
