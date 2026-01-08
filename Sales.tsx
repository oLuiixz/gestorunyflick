
import React from 'react';
import { useApp } from '../context/AppContext';
import { SaleStatus } from '../types';
import { ShoppingBag, TrendingUp, CreditCard, Calendar, BarChart2 } from 'lucide-react';

const Sales: React.FC = () => {
  const { sales } = useApp();

  const totalRevenue = sales.reduce((acc, curr) => acc + curr.value, 0);
  const totalCommission = sales.reduce((acc, curr) => acc + curr.commission, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="gradient-bg p-8 rounded-3xl shadow-xl text-white relative overflow-hidden brand-shadow">
          <div className="relative z-10 text-left">
            <h3 className="text-white/80 text-lg font-medium">Vendas Totais</h3>
            <p className="text-4xl font-bold mt-2">R$ {totalRevenue.toFixed(2)}</p>
            <div className="mt-6 flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm font-medium border border-white/10">
                {sales.length} transações
              </div>
              <div className="flex items-center text-purple-200 text-sm font-bold">
                <TrendingUp size={16} className="mr-1" />
                Crescimento real
              </div>
            </div>
          </div>
          <ShoppingBag className="absolute bottom-[-20px] right-[-20px] w-48 h-48 text-white/5 rotate-12" />
        </div>

        <div className="bg-[#111114] p-8 rounded-3xl border border-white/5 shadow-sm flex flex-col justify-center">
          <div className="text-left flex items-center justify-between">
            <div>
              <h3 className="text-slate-500 text-lg font-medium">Comissão Disponível</h3>
              <p className="text-4xl font-bold mt-2 text-slate-100">R$ {totalCommission.toFixed(2)}</p>
              <div className="mt-4 flex items-center space-x-2 text-green-400 text-sm font-bold">
                <BarChart2 size={16} />
                <span>Atualizado automaticamente</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111114] rounded-2xl border border-white/5 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100">Histórico de Transações</h3>
          <button className="text-sm text-purple-400 font-bold flex items-center hover:text-purple-300 transition-colors">
            <Calendar size={16} className="mr-1" />
            Ordenar por data
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0a0a0b] border-b border-white/5">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plano</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Valor Bruto</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Comissão (Afiliado)</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {sales.map((sale) => (
                <tr key={sale.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-200">{sale.clientName}</td>
                  <td className="px-6 py-4 text-sm text-slate-400">{sale.plan}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-100">R$ {sale.value.toFixed(2)}</td>
                  <td className="px-6 py-4 text-sm font-bold text-green-400">R$ {sale.commission.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2 text-sm text-slate-400">
                      <span>{new Date(sale.date).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      sale.status === SaleStatus.PAID ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500 bg-[#111114]">
                    Nenhuma venda processada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
