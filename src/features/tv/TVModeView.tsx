import React, { useState, useEffect } from 'react';
import {
  Tv,
  Bell,
  Clock,
  CheckCircle2,
  Volume2,
  VolumeX,
  CreditCard,
  Lock,
  ArrowLeft,
  Play,
  RotateCcw,
} from 'lucide-react';
import type { Call, Table, RestaurantSettings } from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';
import { formatElapsedTime } from '../../utils/calculations.ts';

interface TVModeViewProps {
  settings: RestaurantSettings;
  tables: Table[];
  onExit: () => void;
}

export const TVModeView: React.FC<TVModeViewProps> = ({
  settings,
  tables,
  onExit,
}) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('pt-BR'));
  const [isMuted, setIsMuted] = useState(false);
  const [now, setNow] = useState(Date.now());

  // PIN gate state
  const [isUnlocked, setIsUnlocked] = useState(!settings.requireTvPin);
  const [pinAttempt, setPinAttempt] = useState('');
  const [pinError, setPinError] = useState(false);

  const loadCalls = () => {
    setCalls(storageService.getCalls());
  };

  useEffect(() => {
    loadCalls();
    const unsub = storageService.subscribe(loadCalls);
    const interval = setInterval(() => {
      setNow(Date.now());
      setCurrentTime(new Date().toLocaleTimeString('pt-BR'));
    }, 1000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  // Passive wall mode auto advancement
  useEffect(() => {
    if (!settings.tvPassiveMode) return;

    const passiveInterval = setInterval(() => {
      const activeCalls = storageService.getCalls();
      const currentStamp = Date.now();

      activeCalls.forEach((call) => {
        const createdMs = new Date(call.createdAt).getTime();
        const elapsed = (currentStamp - createdMs) / 1000;

        if (call.status === 'PENDING' && elapsed >= settings.tvMoveToInProgressSeconds) {
          storageService.updateCallStatus(call.id, 'IN_PROGRESS', 'Atendimento Automático');
        } else if (call.status === 'IN_PROGRESS' && elapsed >= settings.tvFinishAndReleaseSeconds) {
          storageService.updateCallStatus(call.id, 'COMPLETED');
        }
      });
    }, 3000);

    return () => clearInterval(passiveInterval);
  }, [settings.tvPassiveMode, settings.tvMoveToInProgressSeconds, settings.tvFinishAndReleaseSeconds]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinAttempt === settings.tvPin) {
      setIsUnlocked(true);
      setPinError(false);
      soundService.playSuccessChime();
    } else {
      setPinError(true);
      setPinAttempt('');
    }
  };

  const filteredCalls = calls.filter((c) => {
    if (selectedSector === 'ALL') return true;
    return c.sector === selectedSector;
  });

  const pendingCalls = filteredCalls.filter((c) => c.status === 'PENDING');
  const inProgressCalls = filteredCalls.filter((c) => c.status === 'IN_PROGRESS');
  const completedCalls = filteredCalls.filter((c) => c.status === 'COMPLETED').slice(0, 8);

  const sectors = Array.from(new Set(tables.map((t) => t.sector)));

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0B0F19] flex items-center justify-center p-4 text-white">
        <div className="bg-[#151D2F] border border-gray-800 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-[#EF003F] flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-black mb-1">Monitor de Salão Protegido</h2>
          <p className="text-xs text-gray-400 mb-6">
            Digite a Senha Geral da TV (PIN de 4 dígitos) para liberar o painel.
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <input
              type="password"
              maxLength={4}
              value={pinAttempt}
              onChange={(e) => setPinAttempt(e.target.value.replace(/\D/g, ''))}
              placeholder="••••"
              className="w-full p-3 rounded-2xl bg-[#0B0F19] border border-gray-700 text-center font-mono text-2xl tracking-widest text-white font-black"
              autoFocus
            />

            {pinError && (
              <p className="text-xs text-rose-500 font-bold">PIN incorreto. Tente novamente.</p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onExit}
                className="flex-1 py-3 rounded-xl border border-gray-700 text-gray-300 text-xs font-bold"
              >
                Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-3 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-black shadow-lg"
              >
                Desbloquear
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0F19] text-white flex flex-col justify-between overflow-hidden font-sans">
      {/* TV Header Bar */}
      <header className="h-20 px-6 bg-[#111827] border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onExit}
            className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title="Sair do Modo TV"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Tv className="w-5 h-5 text-emerald-400" />
              <h1 className="text-lg md:text-xl font-black tracking-tight">
                MONITOR DE SALÃO • {settings.name.toUpperCase()}
              </h1>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>
            <p className="text-xs text-gray-400">
              Painel operacional de alta visibilidade para TVs e paredes
            </p>
          </div>
        </div>

        {/* Sectors and Clock */}
        <div className="flex items-center gap-4">
          {/* Sector Filter Chips */}
          <div className="hidden md:flex items-center gap-1.5 p-1 bg-[#0B0F19] rounded-2xl border border-gray-800 text-xs font-bold">
            <button
              onClick={() => setSelectedSector('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                selectedSector === 'ALL'
                  ? 'bg-[#EF003F] text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Todos os Setores
            </button>
            {sectors.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSector(s)}
                className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                  selectedSector === s
                    ? 'bg-[#EF003F] text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              const next = !isMuted;
              setIsMuted(next);
              soundService.setMuted(next);
            }}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-2 cursor-pointer ${
              isMuted
                ? 'border-gray-800 text-gray-500'
                : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
            }`}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Large Clock */}
          <div className="px-4 py-2 rounded-2xl bg-[#0B0F19] border border-gray-800 text-xl font-mono font-black text-emerald-400">
            {currentTime}
          </div>
        </div>
      </header>

      {/* 3 Operational TV Columns */}
      <main className="flex-1 p-6 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* COLUMN 1: Aguardando Atendimento (Urgent) */}
        <div className="bg-[#111827] rounded-3xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 bg-rose-950/30 border-b border-rose-900/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping"></div>
              <h2 className="text-sm font-black uppercase tracking-wider text-rose-400">
                Aguardando Atendimento ({pendingCalls.length})
              </h2>
            </div>
            <span className="text-xs font-mono text-gray-400">Prioridade Máxima</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {pendingCalls.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-500/30 mb-2" />
                <p className="text-sm font-bold">Nenhum chamado pendente</p>
                <p className="text-xs text-gray-600">Todas as mesas atendidas</p>
              </div>
            ) : (
              pendingCalls.map((call) => {
                const elapsedSec = Math.floor((now - new Date(call.createdAt).getTime()) / 1000);
                const isOverdue = elapsedSec > 90;

                return (
                  <div
                    key={call.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isOverdue
                        ? 'bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/50'
                        : 'bg-[#1A2234] border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xl font-black text-white block">
                          {call.tableName}
                        </span>
                        <span className="text-xs text-gray-400">{call.sector}</span>
                      </div>

                      <div className="px-2.5 py-1 rounded-xl bg-black/40 border border-gray-700 font-mono text-sm font-black flex items-center gap-1.5 text-amber-400">
                        <Clock className="w-4 h-4" />
                        <span>{formatElapsedTime(elapsedSec)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider flex items-center gap-1.5 ${
                          call.type === 'BILL_REQUEST'
                            ? 'bg-purple-900/60 text-purple-300'
                            : 'bg-rose-600 text-white'
                        }`}
                      >
                        {call.type === 'BILL_REQUEST' ? (
                          <CreditCard className="w-3.5 h-3.5" />
                        ) : (
                          <Bell className="w-3.5 h-3.5" />
                        )}
                        {call.typeLabel}
                      </span>

                      {call.billPaymentMethod && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-800">
                          {call.billPaymentMethod}
                        </span>
                      )}
                    </div>

                    {settings.showTvActionButtons && (
                      <button
                        onClick={() => {
                          storageService.updateCallStatus(call.id, 'IN_PROGRESS', 'Garçom Salão');
                          soundService.playSuccessChime();
                        }}
                        className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <Play className="w-3.5 h-3.5" />
                        <span>Assumir Atendimento</span>
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: Em Atendimento */}
        <div className="bg-[#111827] rounded-3xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 bg-blue-950/30 border-b border-blue-900/40 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-blue-400">
              Em Atendimento ({inProgressCalls.length})
            </h2>
            <span className="text-xs font-mono text-gray-400">Equipe no Salão</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {inProgressCalls.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-6">
                <Clock className="w-12 h-12 text-gray-700 mb-2" />
                <p className="text-sm font-bold">Nenhum garçom em atendimento</p>
              </div>
            ) : (
              inProgressCalls.map((call) => {
                const elapsedSec = Math.floor(
                  (now - new Date(call.startedAt || call.createdAt).getTime()) / 1000
                );

                return (
                  <div
                    key={call.id}
                    className="p-4 rounded-2xl bg-[#1A2234] border border-blue-900/50"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-xl font-black text-white block">
                          {call.tableName}
                        </span>
                        <span className="text-xs text-gray-400">{call.sector}</span>
                      </div>

                      <div className="px-2.5 py-1 rounded-xl bg-blue-950/60 border border-blue-800 font-mono text-sm font-black text-blue-300">
                        {formatElapsedTime(elapsedSec)}
                      </div>
                    </div>

                    <div className="text-xs text-gray-300 mb-3">
                      <span>Atendente: </span>
                      <strong className="text-blue-400">{call.assignedStaffName || 'Garçom'}</strong>
                    </div>

                    {settings.showTvActionButtons && (
                      <button
                        onClick={() => {
                          storageService.updateCallStatus(call.id, 'COMPLETED');
                          soundService.playSuccessChime();
                        }}
                        className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Concluir e Liberar Mesa</span>
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 3: Concluídos Recentemente */}
        <div className="bg-[#111827] rounded-3xl border border-gray-800 flex flex-col overflow-hidden">
          <div className="p-4 bg-emerald-950/30 border-b border-emerald-900/40 flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-wider text-emerald-400">
              Finalizados Recentemente
            </h2>
            <span className="text-xs font-mono text-gray-400">Histórico de Salão</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-2.5">
            {completedCalls.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 p-6">
                <CheckCircle2 className="w-12 h-12 text-gray-700 mb-2" />
                <p className="text-sm font-bold">Nenhum atendimento finalizado ainda</p>
              </div>
            ) : (
              completedCalls.map((call) => (
                <div
                  key={call.id}
                  className="p-3 rounded-2xl bg-[#141B2B] border border-gray-800 flex items-center justify-between opacity-80"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <div>
                      <span className="text-sm font-black text-white">{call.tableName}</span>
                      <span className="text-[10px] text-gray-400 block">{call.typeLabel}</span>
                    </div>
                  </div>

                  <span className="text-[10px] text-emerald-400 font-mono font-bold">
                    Concluído
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* TV Footer Status */}
      <footer className="h-10 px-6 bg-[#0B0F19] border-t border-gray-800 flex items-center justify-between text-[11px] text-gray-400 font-mono">
        <div className="flex items-center gap-3">
          <span>Sincronização em tempo real ativa</span>
          <span>•</span>
          <span>
            {settings.tvPassiveMode
              ? `Modo Passivo: Avança em ${settings.tvMoveToInProgressSeconds}s / Libera em ${settings.tvFinishAndReleaseSeconds}s`
              : 'Modo Interativo com Botões Touchscreen'}
          </span>
        </div>

        <button
          onClick={onExit}
          className="text-gray-400 hover:text-white underline cursor-pointer"
        >
          Pressione aqui ou clique na seta para sair da tela cheia
        </button>
      </footer>
    </div>
  );
};
