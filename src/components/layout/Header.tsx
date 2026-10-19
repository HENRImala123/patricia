import React from 'react';
import {
  Menu,
  Tv,
  Smartphone,
  Volume2,
  VolumeX,
  RefreshCw,
  UserCheck,
} from 'lucide-react';
import { soundService } from '../../services/sound.ts';
import type { RestaurantSettings, TeamMember } from '../../types/index.ts';

interface HeaderProps {
  settings: RestaurantSettings;
  currentMember: TeamMember;
  onOpenMobileMenu: () => void;
  onOpenTvMode: () => void;
  onOpenClientMode: () => void;
  onRefresh: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  currentMember,
  onOpenMobileMenu,
  onOpenTvMode,
  onOpenClientMode,
  onRefresh,
  isSoundMuted,
  onToggleSound,
}) => {
  return (
    <header className="h-16 px-4 md:px-6 bg-white border-b border-[#E5E7EB] flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 -ml-2 rounded-lg text-[#252A35] hover:bg-[#F7F8FA] md:hidden cursor-pointer"
          aria-label="Abrir menu de navegação"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></div>
          <div>
            <h1 className="text-sm md:text-base font-extrabold text-[#111318] flex items-center gap-2 leading-none">
              {settings.name}
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Ao vivo
              </span>
            </h1>
            <p className="hidden md:block text-[11px] text-[#64748B] mt-0.5">
              Acompanhe chamados, mesas e cardápio em tempo real
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          title={isSoundMuted ? 'Áudio de alertas mudo (clique para ativar)' : 'Áudio de alertas ligado'}
          className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            isSoundMuted
              ? 'border-gray-200 text-gray-400 hover:text-gray-700 bg-gray-50'
              : 'border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
          }`}
        >
          {isSoundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span className="hidden lg:inline">{isSoundMuted ? 'Mudo' : 'Som Ativo'}</span>
        </button>

        {/* Sync Refresh */}
        <button
          onClick={() => {
            soundService.playSuccessChime();
            onRefresh();
          }}
          title="Atualizar dados"
          className="p-2 rounded-xl border border-[#E5E7EB] text-[#252A35] hover:bg-[#F7F8FA] text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Atualizar</span>
        </button>

        {/* Customer View Trigger */}
        <button
          onClick={onOpenClientMode}
          className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Smartphone className="w-4 h-4 text-[#EF003F]" />
          <span className="hidden sm:inline">Abrir Mesa (Cliente)</span>
        </button>

        {/* TV Mode Trigger */}
        <button
          onClick={onOpenTvMode}
          className="px-3 py-1.5 rounded-xl bg-[#111318] text-white hover:bg-[#252A35] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
        >
          <Tv className="w-4 h-4 text-emerald-400" />
          <span>Modo TV</span>
        </button>

        {/* User Profile Pill */}
        <div className="hidden xl:flex items-center gap-2 pl-2 border-l border-[#E5E7EB]">
          <div className="w-8 h-8 rounded-full bg-rose-100 text-[#EF003F] font-black text-xs flex items-center justify-center border border-rose-200">
            {currentMember.name.charAt(0)}
          </div>
          <div className="text-left">
            <span className="text-xs font-bold text-[#111318] block leading-none">
              {currentMember.name.split(' ')[0]}
            </span>
            <span className="text-[10px] font-semibold text-rose-600 flex items-center gap-0.5">
              <UserCheck className="w-3 h-3" />
              {currentMember.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
