
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Link as LinkIcon, 
  Copy, 
  ExternalLink, 
  MousePointer2, 
  PieChart, 
  Edit2, 
  Trash2, 
  Plus, 
  X,
  CheckCircle2,
  Globe
} from 'lucide-react';

const AffiliateLinks: React.FC = () => {
  const { links, addLink, updateLink, deleteLink } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', url: '' });

  const handleOpenModal = (link?: any) => {
    if (link) {
      setEditingId(link.id);
      setFormData({ name: link.name, url: link.url });
    } else {
      setEditingId(null);
      setFormData({ name: '', url: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateLink(editingId, formData);
    } else {
      addLink(formData);
    }
    setIsModalOpen(false);
  };

  const copy = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('Link copiado!');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h2 className="text-2xl font-bold text-slate-100">Links de Divulgação</h2>
          <p className="text-slate-400 text-sm">Gerencie seus pontos de entrada para novos clientes.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center space-x-2 px-5 py-2.5 gradient-bg text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
        >
          <Plus size={18} />
          <span>Novo Link</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {links.map((link) => (
          <div key={link.id} className="bg-[#111114] p-6 rounded-3xl border border-white/5 shadow-sm flex flex-col justify-between hover:border-white/10 transition-all group relative">
            <div className="text-left">
              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-purple-500/10 text-purple-400 rounded-2xl shadow-inner group-hover:scale-110 transition-transform">
                  <LinkIcon size={28} />
                </div>
                <div className="flex space-x-1">
                  <button 
                    onClick={() => handleOpenModal(link)}
                    className="p-2 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-all"
                    title="Editar"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteLink(link.id)}
                    className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all"
                    title="Excluir"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h4 className="font-bold text-slate-100 text-xl tracking-tight">{link.name}</h4>
              <p className="text-slate-500 text-sm mt-2 truncate bg-white/5 px-2 py-1.5 rounded-lg border border-white/5 font-mono">
                {link.url}
              </p>
              
              <div className="flex items-center mt-6 space-x-6">
                <div className="flex items-center space-x-2 text-slate-400 font-medium">
                  <MousePointer2 size={18} className="text-purple-400" />
                  <span className="text-sm">{link.clicks} cliques</span>
                </div>
                <div className="flex items-center space-x-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-lg text-xs font-bold border border-green-500/20">
                  <PieChart size={14} />
                  <span>{link.conversion} Conv.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex space-x-3">
              <button 
                onClick={() => copy(link.url)}
                className="flex-1 flex items-center justify-center space-x-2 py-3.5 bg-slate-100 text-[#0a0a0b] rounded-2xl font-bold hover:bg-white transition-all shadow-lg"
              >
                <Copy size={18} />
                <span>Copiar Link</span>
              </button>
              <button 
                onClick={() => window.open(link.url, '_blank')}
                className="p-3.5 bg-white/5 text-slate-400 rounded-2xl border border-white/10 hover:bg-white/10 hover:text-slate-100 transition-all"
              >
                <ExternalLink size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Link Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111114] w-full max-w-md rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="gradient-bg p-6 text-white flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Plus size={20} />
                </div>
                <h3 className="text-xl font-bold">{editingId ? 'Editar Link' : 'Novo Link de Divulgação'}</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-4 text-left">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">Nome Identificador</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><Globe size={16} /></span>
                    <input 
                      required
                      type="text" 
                      placeholder="Ex: Campanha Instagram Maio"
                      className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-100 transition-all"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-1.5 ml-1">URL de Destino</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500"><LinkIcon size={16} /></span>
                    <input 
                      required
                      type="url" 
                      placeholder="https://sua-url.com"
                      className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-100 transition-all"
                      value={formData.url}
                      onChange={(e) => setFormData({...formData, url: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-3">
                <button 
                  type="submit"
                  className="w-full py-4 gradient-bg text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2 brand-shadow"
                >
                  <CheckCircle2 size={20} />
                  <span>{editingId ? 'Salvar Alterações' : 'Criar Link'}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-full py-3 text-slate-500 font-bold hover:text-slate-300 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-[#1d1d21] to-[#111114] p-10 rounded-[2.5rem] border border-white/5 text-left relative overflow-hidden">
        <div className="max-w-xl relative z-10">
          <div className="w-12 h-12 bg-purple-500/20 flex items-center justify-center rounded-2xl mb-6">
            <span className="text-2xl">💡</span>
          </div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Estratégia de Performance</h3>
          <p className="text-slate-400 mt-4 leading-relaxed text-lg">Links customizados ajudam a entender de onde vem o seu tráfego. Crie um link específico para cada rede social e maximize suas comissões.</p>
        </div>
        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full"></div>
      </div>
    </div>
  );
};

export default AffiliateLinks;
