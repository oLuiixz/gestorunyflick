
import React, { useState } from 'react';
import { Mail, Lock, User, Smartphone, ArrowRight, ChevronLeft, AlertCircle } from 'lucide-react';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  const getUsers = () => {
    const users = localStorage.getItem('uny_users_db');
    return users ? JSON.parse(users) : [];
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      const users = getUsers();

      if (mode === 'register') {
        if (users.find((u: any) => u.email === email)) {
          setError('Este e-mail já está cadastrado.');
          setLoading(false);
          return;
        }

        const newUser = { 
          name, 
          email, 
          password, 
          whatsapp,
          profilePhoto: null
        };
        users.push(newUser);
        localStorage.setItem('uny_users_db', JSON.stringify(users));
        localStorage.setItem('uny_user', JSON.stringify(newUser));
        localStorage.setItem('uny_auth', 'true');
        onLogin();
      } else {
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('uny_user', JSON.stringify(user));
          localStorage.setItem('uny_auth', 'true');
          onLogin();
        } else {
          setError('E-mail ou senha incorretos.');
        }
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md bg-[#111114] rounded-[2.5rem] shadow-2xl border border-white/5 overflow-hidden p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
        <div className="text-center mb-10">
          <img 
            src="https://i.postimg.cc/52Nh7zgV/logo.png" 
            alt="UnyFlick Logo" 
            className="w-48 mx-auto mb-8 object-contain"
          />
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestor UnyFlick</h1>
          <p className="text-slate-400 mt-2 font-medium">
            {mode === 'login' ? 'Entre para gerenciar sua plataforma' : 'Crie sua conta de gestor'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center space-x-3 text-red-400 text-sm animate-in shake duration-300">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'register' && (
            <>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><User size={20} /></span>
                <input 
                  required 
                  type="text" 
                  placeholder="Nome Completo" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0b] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 text-slate-100 transition-all placeholder:text-slate-600" 
                />
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Smartphone size={20} /></span>
                <input 
                  required 
                  type="text" 
                  placeholder="WhatsApp (DDD)" 
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-[#0a0a0b] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 text-slate-100 transition-all placeholder:text-slate-600" 
                />
              </div>
            </>
          )}

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Mail size={20} /></span>
            <input 
              required 
              type="email" 
              placeholder="E-mail" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#0a0a0b] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 text-slate-100 transition-all placeholder:text-slate-600" 
            />
          </div>

          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500"><Lock size={20} /></span>
            <input 
              required 
              type="password" 
              placeholder="Senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#0a0a0b] border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 text-slate-100 transition-all placeholder:text-slate-600" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-4 gradient-bg text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 flex items-center justify-center space-x-2 brand-shadow disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span className="text-lg">{mode === 'login' ? 'Entrar no Gestor' : 'Criar Conta Agora'}</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <div className="mt-10 text-center">
          {mode === 'login' ? (
            <button 
              onClick={() => { setMode('register'); setError(''); }}
              className="text-sm font-bold text-slate-400 hover:text-purple-400 transition-colors"
            >
              Ainda não tem conta? <span className="text-purple-500 underline underline-offset-4 decoration-purple-500/30">Cadastre-se grátis</span>
            </button>
          ) : (
            <button 
              onClick={() => { setMode('login'); setError(''); }}
              className="text-sm font-bold text-slate-400 hover:text-slate-100 flex items-center justify-center mx-auto transition-colors"
            >
              <ChevronLeft size={18} className="mr-1" />
              Já sou cadastrado
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
