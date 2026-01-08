
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Client, Sale, ClientStatus, SaleStatus, AffiliateLink } from '../types';
import { PLANS } from '../constants';

interface AppContextType {
  clients: Client[];
  sales: Sale[];
  links: AffiliateLink[];
  addClient: (client: Omit<Client, 'id' | 'billingHistory'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addSale: (sale: Omit<Sale, 'id'>) => void;
  processAutomatedBilling: () => void;
  convertToSale: (clientId: string, planName: string) => void;
  addLink: (link: Omit<AffiliateLink, 'id' | 'clicks' | 'conversion'>) => void;
  updateLink: (id: string, updates: Partial<AffiliateLink>) => void;
  deleteLink: (id: string) => void;
  importAppData: (data: string) => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('uny_clients');
    return saved ? JSON.parse(saved) : [];
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('uny_sales');
    return saved ? JSON.parse(saved) : [];
  });

  const [links, setLinks] = useState<AffiliateLink[]>(() => {
    const saved = localStorage.getItem('uny_links');
    if (saved) return JSON.parse(saved);
    return [
      { id: '1', name: 'Página de Vendas Principal', url: 'https://unyflick.com/go/aff123', clicks: 1240, conversion: '3.2%' },
      { id: '2', name: 'Checkout Direto (Mensal)', url: 'https://unyflick.com/pay/mensal?ref=aff123', clicks: 450, conversion: '5.1%' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('uny_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('uny_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('uny_links', JSON.stringify(links));
  }, [links]);

  const addSale = (newSale: Omit<Sale, 'id'>) => {
    const sale: Sale = {
      ...newSale,
      id: Math.random().toString(36).substr(2, 9),
    };
    setSales(prev => [sale, ...prev]);
  };

  const addClient = (newClient: Omit<Client, 'id' | 'billingHistory'>) => {
    const clientId = Math.random().toString(36).substr(2, 9);
    const client: Client = {
      ...newClient,
      id: clientId,
      billingHistory: {
        d3Sent: false,
        d1Sent: false,
        d0Sent: false,
      }
    };
    setClients(prev => [client, ...prev]);

    if (newClient.status === ClientStatus.ACTIVE) {
      const planInfo = PLANS.find(p => p.name === newClient.plan);
      if (planInfo) {
        addSale({
          clientId: clientId,
          clientName: newClient.name,
          plan: newClient.plan,
          value: planInfo.price,
          commission: planInfo.price * planInfo.commissionRate,
          paymentMethod: 'Pix',
          date: new Date().toISOString(),
          status: SaleStatus.PAID
        });
      }
    }
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const convertToSale = (clientId: string, planName: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const planInfo = PLANS.find(p => p.name === planName);
    if (!planInfo) return;

    const value = planInfo.price;
    const commission = value * planInfo.commissionRate;

    addSale({
      clientId: client.id,
      clientName: client.name,
      plan: planName,
      value,
      commission,
      paymentMethod: 'Pix',
      date: new Date().toISOString(),
      status: SaleStatus.PAID
    });

    const expiryDate = new Date();
    if (planName.toLowerCase().includes('mensal')) expiryDate.setMonth(expiryDate.getMonth() + 1);
    else if (planName.toLowerCase().includes('trimestral')) expiryDate.setMonth(expiryDate.getMonth() + 3);
    else if (planName.toLowerCase().includes('semestral')) expiryDate.setMonth(expiryDate.getMonth() + 6);
    else if (planName.toLowerCase().includes('anual')) expiryDate.setFullYear(expiryDate.getFullYear() + 1);

    updateClient(clientId, {
      status: ClientStatus.ACTIVE,
      expiryDate: expiryDate.toISOString(),
      plan: planName,
      billingHistory: { d3Sent: false, d1Sent: false, d0Sent: false }
    });
  };

  const processAutomatedBilling = useCallback(() => {
    const now = new Date();
    const updatedClients = clients.map(client => {
      const expiry = new Date(client.expiryDate);
      const diffInDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      let status = client.status;
      if (diffInDays < 0) status = ClientStatus.EXPIRED;
      else if (diffInDays <= 3 && status !== ClientStatus.TRIAL && status !== ClientStatus.EXPIRED) status = ClientStatus.BILLING;

      return { ...client, status };
    });

    setClients(updatedClients);
  }, [clients]);

  const addLink = (linkData: Omit<AffiliateLink, 'id' | 'clicks' | 'conversion'>) => {
    const newLink: AffiliateLink = {
      ...linkData,
      id: Math.random().toString(36).substr(2, 9),
      clicks: 0,
      conversion: '0%'
    };
    setLinks(prev => [newLink, ...prev]);
  };

  const updateLink = (id: string, updates: Partial<AffiliateLink>) => {
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const deleteLink = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este link?')) {
      setLinks(prev => prev.filter(l => l.id !== id));
    }
  };

  const importAppData = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.clients) setClients(parsed.clients);
      if (parsed.sales) setSales(parsed.sales);
      if (parsed.links) setLinks(parsed.links);
      return true;
    } catch (e) {
      console.error("Erro ao importar dados:", e);
      return false;
    }
  };

  return (
    <AppContext.Provider value={{ 
      clients, sales, links, addClient, updateClient, addSale, 
      processAutomatedBilling, convertToSale, addLink, updateLink, deleteLink,
      importAppData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
