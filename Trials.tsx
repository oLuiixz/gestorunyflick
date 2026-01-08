
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ClientStatus } from '../types';
import { User, Mail, Smartphone, Clock, Check, Copy, ExternalLink, Loader2 } from 'lucide-react';

const Trials: React.FC = () => {
  const { addClient } = useApp();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    email: '',
  });
  const [generatedTrial, setGeneratedTrial] = useState<any>(null);

  const FIXED_DURATION = '4'; // Hardcoded to 4 hours

  const formatMessage = (user: string, pass: string, created: string, expiry: string) => {
    return `*BEM VINDO A 💜 UNYFLIX*
*Segue seus dados*

✅ *Usuário:* ${user}
✅ *Senha:* ${pass}
📦 *Plano:* 📌 TESTE COMPLETO 
🗓️ *Criado em:* ${created}
🗓️ *Vencimento:* ${expiry}
📶 *Conexões:* 2

__________________________________________

🔵 *DNS  XCIPTV E APPS UNIVERSAIS:*
http://top.blastapp.top

__________________________________________

🔵 *DNS SMARTERS:* http:/top.blastapp.top
⚠️ Obs: somente uma / na DNS para smarters

__________________________________________

🟢 *DNS STB:* 5.161.117.41
_____.   _____.  _____.  _____.  _____.

✅ *Webplayer:* https://web.duoapp.top

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*
⚡ *PARCERIAS* ⚡

✅ *( ASSIST+ / PLAYSIM / VIZZION )*
⚠️ *CODE:* 00178
✅ *Usuário:* ${user}
✅ *Senha:* ${pass}

✅ *Disponível na LG* ✅ *Disponível na Roku*
✅ *Disponível na Samsung*

×××××××××××××××××××××××××××××××××××××××

⚡ XCLOUDTV 
provider: 120482

✅ *Usuário:* ${user}
✅ *Senha:* ${pass}

✅ *Disponível na LG* ✅ *Disponível na Roku*
✅ *Disponível na Samsung*

*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*

🟢 *Link (M3U):* http://top.blastapp.top/get.php/username=${user}&password=${pass}&type=m3u_plus&output=mpegts

🟢 *Link Curto (M3U):* http://e.top.blastapp.top/playlist/${user}/${pass}/m3u

🟡 *Link (HLS):* http://top.blastapp.top/get.php/username=${user}&password=${pass}&type=m3u_plus&output=hls

🟡 *Link Curto (HLS):* http://e.top.blastapp.top/playlist/${user}/${pass}/hls

🔴 *Link (SSIPTV):* http://e.top.blastapp.top/p/${user}/${pass}/ssiptv

______________________________________

Loja de aplicativos 💜 UNYFLIX
https://blastplay.4kplay.top

LINK 🔗 DIRETO E DOWLOADER

BLAST XC:
✅ (LINK DIRETO): http://aftv.news/2438458
DOWNLOADER: 2438458

______________

BLAST VU:
✅ (LINK DIRETO): https://aftv.news/1125560
DOWNLOADER: 1125560

______________

BLAST IBO:
DOWNLOADER: 1578805
✅ (LINK DIRETO): https://aftv.news/1578805

______________________________________

BLAST AXYON
Downloader : 2982344 
✅ (LINK DIRETO): https://aftv.news/2982344

*********************************
Att: 💜 UNYFLIX`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      // API call to the provided endpoint with fixed duration
      const response = await fetch('https://painel.blastoficial.top/api/chatbot/kmVLljYWQw/BV4D3rrLaq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          whatsapp: formData.whatsapp,
          email: formData.email,
          duration: FIXED_DURATION
        })
      });

      let userData = { login: '', password: '' };
      if (response.ok) {
        const data = await response.json();
        userData.login = data.username || data.login || '';
        userData.password = data.password || data.pass || '';
      }
      
      if (!userData.login) {
        userData.login = formData.name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 1000);
        userData.password = Math.floor(100000 + Math.random() * 900000).toString();
      }

      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + parseInt(FIXED_DURATION));

      const createdStr = now.toLocaleString('pt-BR');
      const expiryStr = expiryDate.toLocaleString('pt-BR');

      addClient({
        name: formData.name,
        whatsapp: formData.whatsapp,
        email: formData.email,
        status: ClientStatus.TRIAL,
        plan: 'Teste 4h',
        startDate: now.toISOString(),
        expiryDate: expiryDate.toISOString(),
        affiliateId: 'current-affiliate',
      });

      const fullMessage = formatMessage(userData.login, userData.password, createdStr, expiryStr);

      setGeneratedTrial({
        login: userData.login,
        pass: userData.password,
        expiry: expiryStr,
        name: formData.name,
        whatsapp: formData.whatsapp,
        fullMessage: fullMessage
      });
    } catch (error) {
      console.error("Erro ao integrar com API:", error);
      const now = new Date();
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + parseInt(FIXED_DURATION));
      const user = formData.name.toLowerCase().replace(/\s/g, '') + Math.floor(Math.random() * 1000);
      const pass = Math.floor(100000 + Math.random() * 900000).toString();
      
      const fullMessage = formatMessage(user, pass, now.toLocaleString('pt-BR'), expiryDate.toLocaleString('pt-BR'));
      
      setGeneratedTrial({
        login: user,
        pass: pass,
        expiry: expiryDate.toLocaleString('pt-BR'),
        name: formData.name,
        whatsapp: formData.whatsapp,
        fullMessage: fullMessage
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copiado com sucesso!');
  };

  const shareWhatsApp = () => {
    window.open(`https://wa.me/55${generatedTrial.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(generatedTrial.fullMessage)}`, '_blank');
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[#111114] p-8 rounded-2xl shadow-sm border border-white/5">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-100">Gerar Teste Grátis</h2>
          <p className="text-slate-400 mt-2">Crie um acesso temporário de 4 horas para seu cliente.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Nome do Cliente</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <User size={18} />
                </span>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 text-slate-100 transition-all"
                  placeholder="Ex: João Silva"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">WhatsApp (com DDD)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Smartphone size={18} />
                </span>
                <input 
                  required
                  type="text" 
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 text-slate-100 transition-all"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">E-mail (opcional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">
                  <Mail size={18} />
                </span>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 bg-[#0a0a0b] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/50 text-slate-100 transition-all"
                  placeholder="cliente@email.com"
                />
              </div>
            </div>

            <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 flex items-center space-x-3">
              <Clock className="text-purple-400" size={20} />
              <div>
                <p className="text-sm font-bold text-purple-100">Duração Fixa</p>
                <p className="text-xs text-purple-300/60">Este teste terá validade de exatamente 4 horas.</p>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isGenerating}
            className="w-full py-4 gradient-bg text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center disabled:opacity-50 brand-shadow"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 animate-spin" />
                Gerando...
              </>
            ) : (
              'Gerar Teste Agora'
            )}
          </button>
        </form>
      </div>

      {generatedTrial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111114] w-full max-w-lg rounded-2xl shadow-2xl border border-white/5 overflow-hidden animate-in fade-in zoom-in duration-300 max-h-[90vh] flex flex-col">
            <div className="gradient-bg p-6 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-3">
                <Check className="p-1 bg-white/20 rounded-full" />
                <h3 className="text-xl font-bold">Teste Gerado!</h3>
              </div>
              <button onClick={() => setGeneratedTrial(null)} className="text-white/80 hover:text-white text-2xl font-bold">&times;</button>
            </div>
            
            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="bg-[#0a0a0b] p-4 rounded-xl border border-white/10">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-500 uppercase">Mensagem de Acesso</span>
                  <button 
                    onClick={() => copyToClipboard(generatedTrial.fullMessage)} 
                    className="flex items-center space-x-1 text-xs font-bold text-purple-400 hover:text-purple-300 bg-purple-500/10 px-2 py-1 rounded transition-colors"
                  >
                    <Copy size={14} />
                    <span>Copiar Tudo</span>
                  </button>
                </div>
                <div className="bg-[#111114] p-3 rounded-lg border border-white/5 text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-64 overflow-y-auto text-slate-300">
                  {generatedTrial.fullMessage}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 shrink-0">
                <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Login</span>
                  <span className="font-bold text-purple-400">{generatedTrial.login}</span>
                </div>
                <div className="bg-[#0a0a0b] p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Senha</span>
                  <span className="font-bold text-purple-400">{generatedTrial.pass}</span>
                </div>
              </div>

              <div className="space-y-3 shrink-0">
                <button 
                  onClick={shareWhatsApp}
                  className="w-full flex items-center justify-center space-x-2 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg brand-shadow"
                >
                  <Smartphone size={20} />
                  <span>Enviar via WhatsApp</span>
                </button>
                <button 
                  onClick={() => setGeneratedTrial(null)}
                  className="w-full py-3 bg-white/5 text-slate-300 rounded-xl font-bold hover:bg-white/10 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Trials;
