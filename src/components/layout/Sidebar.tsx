import React from 'react';
import {
  Bell,
  LayoutGrid,
  BookOpen,
  Wifi,
  Sparkles,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  Flame,
} from 'lucide-react';

export type NavTab =
  | 'calls'
  | 'tables'
  | 'menu'
  | 'wifi'
  | 'buttons'
  | 'team'
  | 'reports'
  | 'billing'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  pendingCallsCount: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  pendingCallsCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems: Array<{
    id: NavTab;
    label: string;
    icon: React.ReactNode;
    badge?: (isActive: boolean) => React.ReactNode;
  }> = [
    {
      id: 'calls',
      label: 'Chamados em Tempo Real',
      icon: <Bell className="w-5 h-5 shrink-0" />,
      badge: (isActive: boolean) => (
        <span
          className={`flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded shrink-0 ${
            isActive
              ? 'bg-white/25 text-white animate-pulse'
              : 'bg-rose-50 text-[#EF003F] border border-rose-200'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
          AO VIVO
          {pendingCallsCount > 0 && (
            <span
              className={`ml-1 px-1 rounded-full text-[9px] font-bold ${
                isActive ? 'bg-white text-[#EF003F]' : 'bg-[#EF003F] text-white'
              }`}
            >
              {pendingCallsCount}
            </span>
          )}
        </span>
      ),
    },
    {
      id: 'tables',
      label: 'Mesas & QR Codes',
      icon: <LayoutGrid className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'menu',
      label: 'Cardápio Digital',
      icon: <BookOpen className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'wifi',
      label: 'Redes Autorizadas (Wi-Fi)',
      icon: <Wifi className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'buttons',
      label: 'Botões Personalizados',
      icon: <Sparkles className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'team',
      label: 'Equipe & Permissões',
      icon: <Users className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'reports',
      label: 'Relatórios & Métricas',
      icon: <BarChart3 className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'billing',
      label: 'Planos & Assinatura',
      icon: <CreditCard className="w-5 h-5 shrink-0" />,
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings className="w-5 h-5 shrink-0" />,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-68 bg-white border-r border-[#E5E7EB] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="h-16 px-5 border-b border-[#E5E7EB] flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#C90036] to-[#EF003F] flex items-center justify-center text-white shadow-sm shadow-[#EF003F]/30">
              <Flame className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-tight text-[#111318] block leading-none">
                CARDÁPIO DIGITAL
              </span>
              <span className="text-[10px] font-semibold text-[#64748B] tracking-wider uppercase">
                Painel do Restaurante
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-[#EF003F] text-white shadow-md shadow-[#EF003F]/25 font-bold'
                      : 'text-[#252A35] hover:bg-[#F7F8FA] hover:text-[#111318]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 pr-1">
                    <span className={isActive ? 'text-white' : 'text-[#64748B]'}>{item.icon}</span>
                    <span className="leading-tight text-[11px] font-bold">{item.label}</span>
                  </div>
                  {item.badge && item.badge(isActive)}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Operational Footer Tag */}
        <div className="p-3 border-t border-[#E5E7EB] bg-[#F7F8FA]/60">
          <div className="p-2.5 rounded-xl bg-white border border-[#E5E7EB] shadow-2xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p className="text-[11px] font-bold text-[#111318] leading-none">Salão Conectado</p>
                <p className="text-[9px] text-[#64748B]">Sincronização Ativa</p>
              </div>
            </div>
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded">
              v3.2
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};
