import React, { useState, useEffect } from 'react';
import {
  Bell,
  Clock,
  CheckCircle2,
  CreditCard,
  LayoutGrid,
  UtensilsCrossed,
  Tv,
  ArrowRight,
  Play,
  XCircle,
  HelpCircle,
  UserCheck,
  Send,
} from 'lucide-react';
import type { Call, Table, Product, RestaurantSettings } from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';
import { formatElapsedTime } from '../../utils/calculations.ts';

interface CallsViewProps {
  settings: RestaurantSettings;
  tables: Table[];
  products: Product[];
  onNavigateToTables: () => void;
  onOpenTvMode: () => void;
}

export const CallsView: React.FC<CallsViewProps> = ({
  settings,
  tables,
  products,
  onNavigateToTables,
  onOpenTvMode,
}) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL');
  const [now, setNow] = useState(Date.now());
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [simTableNum, setSimTableNum] = useState(tables[0]?.number.toString() || '1');
  const [simCallType, setSimCallType] = useState<'CALL' | 'BILL_REQUEST'>('CALL');
  const [simPaymentMethod, setSimPaymentMethod] = useState<'PIX' | 'CARD' | 'CASH'>('PIX');

  const loadCalls = () => {
    setCalls(storageService.getCalls());
  };

  useEffect(() => {
    loadCalls();
    const unsub = storageService.subscribe(loadCalls);
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => {
      unsub();
      clearInterval(interval);
    };
  }, []);

  // KPIs
  const pendingCalls = calls.filter((c) => c.status === 'PENDING');
  const inProgressCalls = calls.filter((c) => c.status === 'IN_PROGRESS');
  const completedCalls = calls.filter((c) => c.status === 'COMPLETED');
  const billCalls = calls.filter((c) => c.type === 'BILL_REQUEST');

  // Average response time for answered calls
  const answeredWithDuration = calls
    .filter((c) => c.startedAt && c.createdAt)
    .map((c) => (new Date(c.startedAt!).getTime() - new Date(c.createdAt).getTime()) / 1000);
  const avgResponseSeconds =
    answeredWithDuration.length > 0
      ? Math.round(answeredWithDuration.reduce((a, b) => a + b, 0) / answeredWithDuration.length)
      : 0;

  const activeTablesCount = tables.filter((t) => t.isActive).length;
  const availableProductsCount = products.filter((p) => p.isAvailable).length;

  const filteredCalls = calls.filter((c) => {
    if (selectedFilter === 'ALL') return true;
    return c.status === selectedFilter;
  });

  const handleTakeCall = (callId: string) => {
    storageService.updateCallStatus(callId, 'IN_PROGRESS', 'Garçom Responsável');
    soundService.playSuccessChime();
  };

  const handleCompleteCall = (callId: string) => {
    storageService.updateCallStatus(callId, 'COMPLETED');
    soundService.playSuccessChime();
  };

  const handleCancelCall = (callId: string) => {
    if (window.confirm('Tem certeza que deseja cancelar este chamado?')) {
      storageService.updateCallStatus(callId, 'CANCELLED');
    }
  };

  const handleCreateSimulatedCall = () => {
    const table = tables.find((t) => t.number.toString() === simTableNum) || tables[0];
    const typeLabel = simCallType === 'BILL_REQUEST' ? 'Pedido de Conta' : 'Chamar Garçom Especial';
    storageService.createCall(
      table.number.toString(),
      table.name,
      table.sector,
      simCallType,
      typeLabel,
      simCallType === 'BILL_REQUEST' ? simPaymentMethod : undefined
    );
    soundService.playNewCallChime();
    setShowSimulateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Operational Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl md:text-2xl font-black text-[#111318]">
              {settings.name}
            </h2>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Ao vivo
            </span>
          </div>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Acompanhe e atenda chamados das mesas em tempo real com áudio no salão.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSimulateModal(true)}
            className="px-3 py-2 rounded-xl border border-dashed border-[#EF003F] text-[#EF003F] hover:bg-rose-50 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Simular Chamado</span>
          </button>

          <button
            onClick={onOpenTvMode}
            className="px-4 py-2 rounded-xl bg-[#111318] hover:bg-[#252A35] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Tv className="w-4 h-4 text-emerald-400" />
            <span>Abrir Modo TV</span>
          </button>
        </div>
      </div>

      {/* Welcome & Activation Gradient Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#880026] via-[#B50032] to-[#111827] text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-white/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-400 text-emerald-950">
              10 DIAS GRÁTIS ATIVOS
            </span>
            <span className="text-xs text-white/80 font-medium">Acesso completo liberado</span>
          </div>
          <h3 className="text-lg md:text-xl font-extrabold mb-1">
            Tudo pronto para operar em {settings.name}
          </h3>
          <p className="text-xs md:text-sm text-white/85 mb-4 leading-relaxed">
            Mesas cadastradas, cardápio digital publicado e QR Codes gerados com segurança. Distribua os cartões nas mesas para receber chamados e pedidos da equipe em tempo real no salão.
          </p>
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => alert('Tutorial: 1. Posicione os QR Codes nas mesas. 2. Os clientes apontam a câmera para abrir o cardápio ou chamar garçom. 3. O painel toca um sinal sonoro e atualiza os cartões imediatamente.')}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Ver Tutorial do Sistema</span>
            </button>
            <button
              onClick={onNavigateToTables}
              className="px-3.5 py-2 rounded-xl bg-white text-[#111318] hover:bg-gray-100 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#EF003F]" />
              <span>Ver Mesas & QR Codes</span>
            </button>
            <button
              onClick={onOpenTvMode}
              className="px-3.5 py-2 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Tv className="w-3.5 h-3.5 text-emerald-400" />
              <span>Modo TV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Audited KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* 1. Aguardando Atendimento */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-[#111318] block leading-none">
            {pendingCalls.length}
          </span>
          <span className="text-xs font-semibold text-[#64748B] mt-1 block">
            Aguardando Atendimento
          </span>
        </div>

        {/* 2. Tempo Médio de Resposta */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-[#111318] block leading-none">
            {formatElapsedTime(avgResponseSeconds)}
          </span>
          <span className="text-xs font-semibold text-[#64748B] mt-1 block">
            Tempo Médio de Resposta
          </span>
        </div>

        {/* 3. Atendimentos Concluídos */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-[#111318] block leading-none">
            {completedCalls.length}
          </span>
          <span className="text-xs font-semibold text-[#64748B] mt-1 block">
            Atendimentos Concluídos
          </span>
        </div>

        {/* 4. Pedidos de Conta */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-2">
            <CreditCard className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-[#111318] block leading-none">
            {billCalls.length}
          </span>
          <span className="text-xs font-semibold text-[#64748B] mt-1 block">
            Pedidos de Conta
          </span>
        </div>

        {/* 5. Mesas Ativas */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-2">
            <LayoutGrid className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-[#111318] block leading-none">
            {activeTablesCount}/{tables.length}
          </span>
          <span className="text-xs font-semibold text-[#64748B] mt-1 block">
            Mesas Ativas
          </span>
        </div>

        {/* 6. Produtos no Cardápio */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#EF003F] flex items-center justify-center mb-2">
            <UtensilsCrossed className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-[#111318] block leading-none">
            {availableProductsCount}
          </span>
          <span className="text-xs font-semibold text-[#64748B] mt-1 block">
            Produtos no Cardápio
          </span>
        </div>
      </div>

      {/* Calls Panel */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-xs overflow-hidden">
        {/* Filter Navigation */}
        <div className="p-4 md:px-6 border-b border-[#E5E7EB] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#F7F8FA] rounded-2xl border border-gray-200 text-xs font-bold">
            <button
              onClick={() => setSelectedFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedFilter === 'ALL'
                  ? 'bg-white text-[#111318] shadow-2xs'
                  : 'text-[#64748B] hover:text-[#111318]'
              }`}
            >
              Todos ({calls.length})
            </button>
            <button
              onClick={() => setSelectedFilter('PENDING')}
              className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedFilter === 'PENDING'
                  ? 'bg-[#EF003F] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#111318]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              Aguardando ({pendingCalls.length})
            </button>
            <button
              onClick={() => setSelectedFilter('IN_PROGRESS')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedFilter === 'IN_PROGRESS'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#111318]'
              }`}
            >
              Em Atendimento ({inProgressCalls.length})
            </button>
            <button
              onClick={() => setSelectedFilter('COMPLETED')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedFilter === 'COMPLETED'
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#111318]'
              }`}
            >
              Concluídos ({completedCalls.length})
            </button>
          </div>

          <span className="text-xs text-[#64748B]">
            Atualizado a cada 1 segundo com som sincronizado
          </span>
        </div>

        {/* Calls Content */}
        <div className="p-4 md:p-6">
          {filteredCalls.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#111318]">
                Nenhum chamado pendente no momento
              </h4>
              <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1">
                Todas as mesas atendidas! Quando um cliente acionar um botão ou escanear o QR Code, a solicitação aparecerá aqui com alerta sonoro.
              </p>
              <button
                onClick={() => setShowSimulateModal(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-[#111318] text-xs font-bold transition-colors cursor-pointer"
              >
                Criar chamado de teste
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCalls.map((call) => {
                const elapsedSec = Math.floor(
                  (now - new Date(call.createdAt).getTime()) / 1000
                );
                const isUrgent = call.status === 'PENDING' && elapsedSec > 90;

                return (
                  <div
                    key={call.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      call.status === 'PENDING'
                        ? isUrgent
                          ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-200'
                          : 'bg-white border-amber-200 shadow-sm'
                        : call.status === 'IN_PROGRESS'
                        ? 'bg-blue-50/40 border-blue-200 shadow-xs'
                        : 'bg-gray-50 border-gray-200 opacity-70'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-base text-[#111318]">
                            {call.tableName}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-[#64748B]">
                            {call.sector}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#64748B]">
                          ID: #{call.id.slice(-4)}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-bold bg-white border border-gray-200 shadow-2xs">
                        <Clock className={`w-3.5 h-3.5 ${isUrgent ? 'text-[#EF003F] animate-spin' : 'text-gray-500'}`} />
                        <span className={isUrgent ? 'text-[#EF003F] font-black' : 'text-gray-700'}>
                          {formatElapsedTime(elapsedSec)}
                        </span>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            call.type === 'BILL_REQUEST'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-rose-100 text-[#EF003F]'
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
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                            {call.billPaymentMethod}
                          </span>
                        )}
                      </div>

                      {call.assignedStaffName && (
                        <p className="text-xs text-blue-700 mt-2 flex items-center gap-1 font-medium">
                          <UserCheck className="w-3.5 h-3.5" />
                          Atendente: {call.assignedStaffName}
                        </p>
                      )}
                    </div>

                    {/* Action buttons */}
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                      {call.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleTakeCall(call.id)}
                            className="flex-1 py-1.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Play className="w-3 h-3" />
                            <span>Atender</span>
                          </button>
                          <button
                            onClick={() => handleCancelCall(call.id)}
                            className="p-1.5 rounded-xl border border-gray-200 text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Cancelar chamado"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}

                      {call.status === 'IN_PROGRESS' && (
                        <button
                          onClick={() => handleCompleteCall(call.id)}
                          className="w-full py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Concluir Atendimento</span>
                        </button>
                      )}

                      {call.status === 'COMPLETED' && (
                        <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Atendimento Concluído
                        </span>
                      )}

                      {call.status === 'CANCELLED' && (
                        <span className="text-xs font-bold text-gray-400">
                          Cancelado
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Modal Simular Chamado */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-[#111318] mb-1">
              Simular Chamado do Cliente
            </h3>
            <p className="text-xs text-[#64748B] mb-4">
              Dispare um chamado instantâneo como se um cliente estivesse na mesa tocando no celular.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Mesa
                </label>
                <select
                  value={simTableNum}
                  onChange={(e) => setSimTableNum(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F] focus:border-transparent"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.number}>
                      {t.name} ({t.sector})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Tipo de Solicitação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSimCallType('CALL')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      simCallType === 'CALL'
                        ? 'border-[#EF003F] bg-rose-50 text-[#EF003F]'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    Chamar Garçom
                  </button>
                  <button
                    type="button"
                    onClick={() => setSimCallType('BILL_REQUEST')}
                    className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      simCallType === 'BILL_REQUEST'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    Pedir a Conta
                  </button>
                </div>
              </div>

              {simCallType === 'BILL_REQUEST' && (
                <div>
                  <label className="text-xs font-bold text-[#111318] block mb-1">
                    Forma de Pagamento
                  </label>
                  <select
                    value={simPaymentMethod}
                    onChange={(e) => setSimPaymentMethod(e.target.value as 'PIX' | 'CARD' | 'CASH')}
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-purple-600"
                  >
                    <option value="PIX">Pix (QR Code na maquininha)</option>
                    <option value="CARD">Cartão de Crédito / Débito</option>
                    <option value="CASH">Dinheiro</option>
                  </select>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowSimulateModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateSimulatedCall}
                className="px-4 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                Disparar Chamado
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
