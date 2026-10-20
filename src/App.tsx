import React, { useState, useEffect } from 'react';
import { Sidebar, type NavTab } from './components/layout/Sidebar.tsx';
import { Header } from './components/layout/Header.tsx';
import { TrialBanner } from './components/layout/TrialBanner.tsx';
import { CallsView } from './features/calls/CallsView.tsx';
import { TablesView } from './features/tables/TablesView.tsx';
import { MenuView } from './features/menu/MenuView.tsx';
import { WifiView } from './features/wifi/WifiView.tsx';
import { ButtonsView } from './features/buttons/ButtonsView.tsx';
import { TeamView } from './features/team/TeamView.tsx';
import { ReportsView } from './features/reports/ReportsView.tsx';
import { BillingView } from './features/billing/BillingView.tsx';
import { SettingsView } from './features/settings/SettingsView.tsx';
import { ClientMenuView } from './features/client/ClientMenuView.tsx';
import { TVModeView } from './features/tv/TVModeView.tsx';
import { storageService } from './services/storage.ts';
import { soundService } from './services/sound.ts';
import type {
  RestaurantSettings,
  Table,
  Category,
  Product,
  Call,
  CustomButton,
  TeamMember,
  WifiNetwork,
} from './types/index.ts';
import { MessageCircle } from 'lucide-react';

export default function App() {
  // Global Data State
  const [settings, setSettings] = useState<RestaurantSettings>(() => storageService.getSettings());
  const [tables, setTables] = useState<Table[]>(() => storageService.getTables());
  const [categories, setCategories] = useState<Category[]>(() => storageService.getCategories());
  const [products, setProducts] = useState<Product[]>(() => storageService.getProducts());
  const [calls, setCalls] = useState<Call[]>(() => storageService.getCalls());
  const [customButtons, setCustomButtons] = useState<CustomButton[]>(() => storageService.getButtons());
  const [team, setTeam] = useState<TeamMember[]>(() => storageService.getTeam());
  const [wifiNetworks, setWifiNetworks] = useState<WifiNetwork[]>(() => storageService.getWifiNetworks());

  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>('calls');
  const [viewMode, setViewMode] = useState<'admin' | 'client' | 'tv'>('admin');
  const [clientTableNum, setClientTableNum] = useState<number>(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Sync with storage and URL parameters on mount
  useEffect(() => {
    const handleUrlParams = () => {
      const params = new URLSearchParams(window.location.search);
      const view = params.get('view');
      const mesaParam = params.get('mesa') || params.get('m') || params.get('table') || params.get('t');

      let tableNum: number | null = null;
      if (mesaParam) {
        const digits = mesaParam.replace(/\D/g, '');
        const parsed = digits ? parseInt(digits, 10) : parseInt(mesaParam, 10);
        if (!isNaN(parsed) && parsed > 0) {
          tableNum = parsed;
        }
      }

      // Check hash route support e.g. #mesa=3, #/mesa/3, #m3
      if (!tableNum && window.location.hash) {
        const hashMatch = window.location.hash.match(/(?:mesa|m|t|table)[=_/]?(\d+)/i);
        if (hashMatch) {
          const parsed = parseInt(hashMatch[1], 10);
          if (!isNaN(parsed) && parsed > 0) {
            tableNum = parsed;
          }
        }
      }

      if (view === 'client' || tableNum !== null) {
        setViewMode('client');
        if (tableNum !== null) {
          setClientTableNum(tableNum);
        }
      } else if (view === 'tv') {
        setViewMode('tv');
      } else {
        setViewMode('admin');
      }
    };

    handleUrlParams();
    window.addEventListener('popstate', handleUrlParams);
    window.addEventListener('hashchange', handleUrlParams);

    // Subscribe to reactive data updates
    const refreshData = () => {
      setSettings(storageService.getSettings());
      setTables(storageService.getTables());
      setCategories(storageService.getCategories());
      setProducts(storageService.getProducts());
      setCalls(storageService.getCalls());
      setCustomButtons(storageService.getButtons());
      setTeam(storageService.getTeam());
      setWifiNetworks(storageService.getWifiNetworks());
    };

    const unsub = storageService.subscribe(refreshData);
    return () => {
      window.removeEventListener('popstate', handleUrlParams);
      window.removeEventListener('hashchange', handleUrlParams);
      unsub();
    };
  }, []);

  const handleToggleSound = () => {
    const next = !isSoundMuted;
    setIsSoundMuted(next);
    soundService.setMuted(next);
  };

  const handleRefresh = () => {
    setSettings(storageService.getSettings());
    setTables(storageService.getTables());
    setCategories(storageService.getCategories());
    setProducts(storageService.getProducts());
    setCalls(storageService.getCalls());
    setCustomButtons(storageService.getButtons());
    setTeam(storageService.getTeam());
    setWifiNetworks(storageService.getWifiNetworks());
  };

  const pendingCallsCount = calls.filter((c) => c.status === 'PENDING').length;
  const currentMember = team[0] || {
    id: '1',
    restaurantId: 'rest-1',
    name: 'Carlos Oliveira',
    email: 'carlos@restaurante.com.br',
    role: 'OWNER',
    pin: '1234',
    createdAt: new Date().toISOString(),
  };

  // CLIENT VIEW MODE (Simulated customer table)
  if (viewMode === 'client') {
    return (
      <ClientMenuView
        tableNumber={clientTableNum}
        settings={settings}
        tables={tables}
        categories={categories}
        products={products}
        customButtons={customButtons}
        onBackToAdmin={() => setViewMode('admin')}
      />
    );
  }

  // TV MONITOR VIEW MODE
  if (viewMode === 'tv') {
    return (
      <TVModeView
        settings={settings}
        tables={tables}
        onExit={() => setViewMode('admin')}
      />
    );
  }

  // ADMIN DASHBOARD VIEW MODE
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex text-[#111318] antialiased">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        pendingCallsCount={pendingCallsCount}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Superior Header */}
        <Header
          settings={settings}
          currentMember={currentMember}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenTvMode={() => setViewMode('tv')}
          onOpenClientMode={() => {
            setClientTableNum(tables[0]?.number || 1);
            setViewMode('client');
          }}
          onRefresh={handleRefresh}
          isSoundMuted={isSoundMuted}
          onToggleSound={handleToggleSound}
        />

        {/* Workspace Body */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          {/* Trial and Email Confirmation Banners */}
          <TrialBanner
            settings={settings}
            onNavigateToBilling={() => setCurrentTab('billing')}
            onNavigateToSettings={() => setCurrentTab('settings')}
          />

          {/* Section Router */}
          {currentTab === 'calls' && (
            <CallsView
              settings={settings}
              tables={tables}
              products={products}
              onNavigateToTables={() => setCurrentTab('tables')}
              onOpenTvMode={() => setViewMode('tv')}
            />
          )}

          {currentTab === 'tables' && (
            <TablesView
              settings={settings}
              tables={tables}
              onOpenClientView={(tableNum) => {
                setClientTableNum(tableNum);
                setViewMode('client');
              }}
            />
          )}

          {currentTab === 'menu' && (
            <MenuView
              settings={settings}
              categories={categories}
              products={products}
            />
          )}

          {currentTab === 'wifi' && (
            <WifiView wifiNetworks={wifiNetworks} />
          )}

          {currentTab === 'buttons' && (
            <ButtonsView
              customButtons={customButtons}
              onNavigateToSettingsMessage={() => setCurrentTab('settings')}
            />
          )}

          {currentTab === 'team' && (
            <TeamView team={team} />
          )}

          {currentTab === 'reports' && (
            <ReportsView
              settings={settings}
              calls={calls}
              tables={tables}
              products={products}
              onNavigateToBilling={() => setCurrentTab('billing')}
            />
          )}

          {currentTab === 'billing' && (
            <BillingView settings={settings} />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              settings={settings}
              onNavigateToWifi={() => setCurrentTab('wifi')}
              onOpenTvMode={() => setViewMode('tv')}
            />
          )}
        </main>
      </div>

      {/* Audited Floating WhatsApp Action Button */}
      <a
        href={`https://wa.me/5511987654321?text=${encodeURIComponent(
          `Olá, suporte Cardápio Digital! Gostaria de tirar uma dúvida sobre o restaurante ${settings.name}.`
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        title="Falar com suporte no WhatsApp"
        className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
