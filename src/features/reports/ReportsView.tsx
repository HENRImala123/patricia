import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Lock,
  Bell,
  Clock,
  CheckCircle2,
  CreditCard,
  LayoutGrid,
  UtensilsCrossed,
  BarChart2,
  Sparkles,
  Download,
} from 'lucide-react';
import type { Call, Table, Product, RestaurantSettings } from '../../types/index.ts';
import { formatElapsedTime } from '../../utils/calculations.ts';

interface ReportsViewProps {
  settings: RestaurantSettings;
  calls: Call[];
  tables: Table[];
  products: Product[];
  onNavigateToBilling: () => void;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  settings,
  calls,
  tables,
  products,
  onNavigateToBilling,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'TODAY' | '7D' | '30D' | '12M' | 'FULL'>('TODAY');
  const [showBusinessModal, setShowBusinessModal] = useState(false);

  // Filter calls by period
  const now = new Date().getTime();
  const filteredCalls = calls.filter((c) => {
    const callTime = new Date(c.createdAt).getTime();
    if (selectedPeriod === 'TODAY') {
      const today = new Date();
      const callDate = new Date(c.createdAt);
      return (
        callDate.getDate() === today.getDate() &&
        callDate.getMonth() === today.getMonth() &&
        callDate.getFullYear() === today.getFullYear()
      );
    }
    if (selectedPeriod === '7D') {
      return now - callTime <= 7 * 24 * 60 * 60 * 1000;
    }
    if (selectedPeriod === '30D') {
      return now - callTime <= 30 * 24 * 60 * 60 * 1000;
    }
    if (selectedPeriod === '12M') {
      return now - callTime <= 365 * 24 * 60 * 60 * 1000;
    }
    return true; // FULL
  });

  const pendingCount = filteredCalls.filter((c) => c.status === 'PENDING').length;
  const completedCount = filteredCalls.filter((c) => c.status === 'COMPLETED').length;
  const billCount = filteredCalls.filter((c) => c.type === 'BILL_REQUEST').length;
  const callWaiterCount = filteredCalls.filter((c) => c.type === 'CALL').length;

  const answeredCalls = filteredCalls.filter((c) => c.startedAt && c.createdAt);
  const avgResponseSeconds =
    answeredCalls.length > 0
      ? Math.round(
          answeredCalls.reduce(
            (acc, c) => acc + (new Date(c.startedAt!).getTime() - new Date(c.createdAt).getTime()) / 1000,
            0
          ) / answeredCalls.length
        )
      : 0;

  const activeTablesCount = tables.filter((t) => t.isActive).length;
  const availableProducts = products.filter((p) => p.isAvailable).length;

  // Group movement by table
  const tableMovement: Record<string, number> = {};
  filteredCalls.forEach((c) => {
    tableMovement[c.tableName] = (tableMovement[c.tableName] || 0) + 1;
  });

  const handleExportClick = () => {
    if (settings.plan !== 'BUSINESS') {
      setShowBusinessModal(true);
    } else {
      // Export real CSV
      let csv = 'ID,Mesa,Setor,Tipo,Status,Criado Em,Atendido Em\n';
      filteredCalls.forEach((c) => {
        csv += `${c.id},"${c.tableName}","${c.sector}","${c.typeLabel}","${c.status}","${c.createdAt}","${c.startedAt || ''}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', `relatorio_desempenho_${settings.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header matching Section 31 */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#111318]">
            Relatórios & Desempenho
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Acompanhe o tempo de resposta da equipe e volume de chamados por mesa.
          </p>
        </div>

        {/* Header Right Actions: Export Button & Period Selector */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Export button with Business plan lock badge */}
          <button
            onClick={handleExportClick}
            className="px-3.5 py-2 rounded-xl bg-white border border-[#E5E7EB] text-gray-700 hover:bg-gray-50 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-gray-400" />
            <span>Exportar Planilha</span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-purple-100 text-purple-800">
              BUSINESS
            </span>
          </button>

          {/* Period Filter Segment */}
          <div className="flex items-center p-1 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs text-xs font-bold">
            <button
              onClick={() => setSelectedPeriod('TODAY')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedPeriod === 'TODAY'
                  ? 'bg-[#EF003F] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#111318]'
              }`}
            >
              Hoje
            </button>
            <button
              onClick={() => setSelectedPeriod('7D')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedPeriod === '7D'
                  ? 'bg-[#EF003F] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#111318]'
              }`}
            >
              7 dias
            </button>
            <button
              onClick={() => setSelectedPeriod('30D')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedPeriod === '30D'
                  ? 'bg-[#EF003F] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#111318]'
              }`}
            >
              30 dias
            </button>
            <button
              onClick={() => setSelectedPeriod('12M')}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                selectedPeriod === '12M'
                  ? 'bg-[#EF003F] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#111318]'
              }`}
            >
              12 meses
            </button>
            <button
              onClick={() => {
                setShowBusinessModal(true);
              }}
              className="px-3 py-1.5 rounded-xl text-[#64748B] hover:text-[#111318] transition-all flex items-center gap-1 cursor-pointer"
            >
              <span>Completo</span>
              <Lock className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* The 6 Audited Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {/* 1. Aguardando Atendimento */}
        <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Bell className="w-4 h-4" />
          </div>
          <span className="text-2xl font-black text-[#111318] block leading-none">
            {pendingCount}
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
            {completedCount}
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
            {billCount}
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
            {availableProducts}
          </span>
          <span className="text-xs font-semibold text-emerald-700 mt-1 block">
            Todos disponíveis
          </span>
        </div>
      </div>

      {/* Two Big Side-by-Side Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Chamados por Tipo de Ação */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 md:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#EF003F] flex items-center justify-center border border-rose-100">
              <BarChart2 className="w-4 h-4" />
            </div>
            <h3 className="font-extrabold text-sm md:text-base text-[#111318]">
              Chamados por Tipo de Ação
            </h3>
          </div>

          <div className="space-y-6">
            {/* Chamar Garçom */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-[#111318]">
                  <Bell className="w-3.5 h-3.5 text-[#EF003F]" />
                  Chamar Garçom
                </span>
                <span className="text-base font-black text-[#111318]">
                  {callWaiterCount}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#EF003F] transition-all duration-500"
                  style={{
                    width: `${filteredCalls.length > 0 ? (callWaiterCount / filteredCalls.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>

            {/* Pedir a Conta */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                <span className="flex items-center gap-2 text-[#111318]">
                  <CreditCard className="w-3.5 h-3.5 text-purple-600" />
                  Pedir a Conta
                </span>
                <span className="text-base font-black text-[#111318]">
                  {billCount}
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all duration-500"
                  style={{
                    width: `${filteredCalls.length > 0 ? (billCount / filteredCalls.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Movimento por Mesa */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] p-5 md:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
                <LayoutGrid className="w-4 h-4" />
              </div>
              <h3 className="font-extrabold text-sm md:text-base text-[#111318]">
                Movimento por Mesa
              </h3>
            </div>

            {filteredCalls.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs font-medium text-slate-400">
                  Nenhum chamado registrado no período.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {Object.entries(tableMovement).map(([tName, count]) => (
                  <div key={tName} className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#111318]">{tName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-[#EF003F]">{count} chamados</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-100 text-[11px] text-[#64748B] flex items-center justify-between">
            <span>Filtro ativo: {selectedPeriod === 'TODAY' ? 'Hoje' : selectedPeriod}</span>
            <span>Métricas em tempo real</span>
          </div>
        </div>
      </div>

      {/* MODAL PLANO BUSINESS EXCLUSIVO */}
      {showBusinessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-purple-200 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mx-auto mb-3 border border-purple-200">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#111318] mb-1">
              Recurso Plano Business
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              A exportação completa de planilhas Excel/CSV e histórico ilimitado de 12 meses são exclusivos do Plano Business.
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowBusinessModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Voltar
              </button>
              <button
                onClick={() => {
                  setShowBusinessModal(false);
                  onNavigateToBilling();
                }}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold cursor-pointer"
              >
                Ver Planos & Assinatura
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
