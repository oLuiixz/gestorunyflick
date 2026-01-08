
import React from 'react';
import { 
  LayoutDashboard, 
  UserPlus, 
  Users, 
  ShoppingCart, 
  BellRing, 
  Link as LinkIcon, 
  UserCircle 
} from 'lucide-react';

export const MENU_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'trials', label: 'Gerar Teste Grátis', icon: <UserPlus size={20} /> },
  { id: 'clients', label: 'Clientes', icon: <Users size={20} /> },
  { id: 'sales', label: 'Vendas', icon: <ShoppingCart size={20} /> },
  { id: 'billing', label: 'Cobranças', icon: <BellRing size={20} /> },
  { id: 'links', label: 'Links de Divulgação', icon: <LinkIcon size={20} /> },
  { id: 'profile', label: 'Perfil', icon: <UserCircle size={20} /> },
];

export const PLANS = [
  { id: 'mensal_no_adult', name: 'Mensal sem adultos', price: 24.99, commissionRate: 0.4 },
  { id: 'mensal_adult', name: 'Mensal com adultos', price: 29.99, commissionRate: 0.4 },
  { id: 'trimestral_no_adult', name: 'Trimestral sem adultos', price: 64.99, commissionRate: 0.4 },
  { id: 'trimestral_adult', name: 'Trimestral com adultos', price: 69.99, commissionRate: 0.4 },
  { id: 'semestral_no_adult', name: 'Semestral sem adultos', price: 119.99, commissionRate: 0.4 },
  { id: 'semestral_adult', name: 'Semestral com adultos', price: 129.99, commissionRate: 0.4 },
  { id: 'anual_no_adult', name: 'Anual sem adultos', price: 224.99, commissionRate: 0.4 },
  { id: 'anual_adult', name: 'Anual com adultos', price: 235.99, commissionRate: 0.4 },
];