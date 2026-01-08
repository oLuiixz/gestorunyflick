
import React, { useState, useRef } from 'react';
import { User, Mail, Smartphone, Shield, LogOut, Save, Wallet, Camera, Check, Download, Upload, Database } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const { clients, sales, links, importAppData } = useApp();
  const userJson = localStorage.getItem('uny_user');
  const initialUser = userJson ? JSON.parse(userJson) : { 
    name: 'Usuário', 
    email: 'contato@unyflick.com', 
    whatsapp: '(00) 00000-0000',
    profilePhoto: null
  };

  const [user, setUser] = useState(initialUser);
  const [success, setSuccess] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dataInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const updatedUser = { ...user, profilePhoto: base64String };
        setUser(updatedUser);
        localStorage.setItem('uny_user', JSON.stringify(updatedUser));
        
        const usersDb = JSON.parse(localStorage.getItem('uny_users_db') || '[]');
        const updatedDb = usersDb.map((u: any) => u.email === user.email ? updatedUser : u);
        localStorage.setItem('uny_users_db', JSON.stringify(updatedDb));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('uny_user', JSON.stringify(user));
    const usersDb = JSON.parse(localStorage.getItem('uny_users_db') || '[]');
    const updatedDb = usersDb.map((u: any) => u.email === user.email ? user : u);
    localStorage.setItem('uny_users_db', JSON.stringify(updatedDb));
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const exportBackup = () => {
    const backupData = {
      clients,
      sales,
      links,
      user,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_unyflick_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        const success = importAppData(content);
        if (success) {
          setImportStatus('success');
          setTimeout(() => setImportStatus('idle'), 3000);
        } else {
          setImportStatus('error');
          setTimeout(() => setImportStatus('idle'), 3000);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-[#111114] rounded-[2rem] border border-white/5 shadow-2xl overflow-hidden">
        <div className="h-40 gradient-bg opacity-90 relative">
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
        <div className="px-8 pb-10">
          <div className="flex flex-col md:flex-row md:items-end -mt-16 md:space-x-8 text-left">
            <div className="relative group">
              <div className="relative">
                {user.profilePhoto ? (
                  <img src={user.profilePhoto} className="w-36 h-36 rounded-[2.5rem] border-8 border-[#111114] object-cover shadow-2xl" alt="Profile" />
                ) : (
                  <div className="w-36 h-36 rounded-[2.5rem] border-8 border-[#111114] gradient-bg flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                    {user.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 p-2 bg-purple-600 text-white rounded-full border-[6px] border-[#111114] shadow-xl z-20">
                  <Shield size={18} fill="currentColor" />
                </div>
              </div>
              <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-8 border-transparent">
                <Camera size={32} className="text-white" />
              </button>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
            </div>
            <div className="mt-6 md:mb-2 flex-1">
              <h2 className="text-3xl font-bold text-white tracking-tight">{user.name}</h2>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-purple-400 font-bold tracking-wider uppercase text-xs">Gestor UnyFlick VIP</span>
                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                <span className="text-slate-400 text-xs font-medium">Conta Verificada</span>
              </div>
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-white/5 pb-3 text-slate-100 flex items-center">
                <User size={18} className="mr-2 text-purple-400" />
                Informações de Perfil
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">Nome Completo</label>
                  <input type="text" value={user.name} onChange={(e) => setUser({...user, name: e.target.value})} className="w-full px-4 py-4 bg-[#0a0a0b] border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 text-slate-100 transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-400 mb-2 ml-1">WhatsApp de Contato</label>
                  <input type="text" value={user.whatsapp} onChange={(e) => setUser({...user, whatsapp: e.target.value})} className="w-full px-4 py-4 bg-[#0a0a0b] border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 text-slate-100 transition-all" />
                </div>
                <button onClick={handleSave} className="w-full flex items-center justify-center space-x-2 py-4 bg-slate-100 text-[#0a0a0b] font-bold rounded-2xl shadow-xl hover:bg-white transition-all transform hover:-translate-y-1">
                  {success ? <Check size={20} /> : <Save size={20} />}
                  <span>{success ? 'Dados Salvos!' : 'Salvar Perfil'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-bold border-b border-white/5 pb-3 text-slate-100 flex items-center">
                <Database size={18} className="mr-2 text-purple-400" />
                Gestão de Dados (Offline)
              </h3>
              <div className="space-y-4">
                <div className="bg-[#0a0a0b] p-6 rounded-2xl border border-white/10">
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Backup do Painel</p>
                  <p className="text-sm text-slate-400 mt-2 leading-relaxed">Baixe um arquivo com todos os seus clientes e vendas para restaurar em outro celular.</p>
                  
                  <div className="mt-6 flex flex-col space-y-3">
                    <button onClick={exportBackup} className="w-full flex items-center justify-center space-x-2 py-3 bg-purple-500/10 text-purple-400 font-bold rounded-xl border border-purple-500/20 hover:bg-purple-500/20 transition-all">
                      <Download size={18} />
                      <span>Exportar Backup</span>
                    </button>
                    
                    <button onClick={() => dataInputRef.current?.click()} className="w-full flex items-center justify-center space-x-2 py-3 bg-white/5 text-slate-300 font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                      <Upload size={18} />
                      <span>Restaurar Backup</span>
                    </button>
                    <input type="file" ref={dataInputRef} className="hidden" accept=".json" onChange={handleImport} />
                    
                    {importStatus === 'success' && <p className="text-xs text-green-400 font-bold text-center">Dados importados com sucesso!</p>}
                    {importStatus === 'error' && <p className="text-xs text-red-400 font-bold text-center">Erro ao ler arquivo de backup.</p>}
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10">
                  <div className="flex items-center space-x-2 text-blue-400 mb-1">
                    <Shield size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Dica de Segurança</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">Seus dados estão seguros no armazenamento local deste aparelho. Excluir o cache do navegador apagará os dados.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-16 flex flex-col sm:flex-row gap-4">
            <button onClick={onLogout} className="flex-1 flex items-center justify-center space-x-2 px-10 py-4 bg-red-500/10 text-red-400 font-bold rounded-2xl border border-red-500/20 hover:bg-red-500/20 transition-all">
              <LogOut size={20} />
              <span>Sair da Conta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
