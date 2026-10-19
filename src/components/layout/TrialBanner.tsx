import React, { useState } from 'react';
import { Mail, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import type { RestaurantSettings } from '../../types/index.ts';

interface TrialBannerProps {
  settings: RestaurantSettings;
  onNavigateToBilling: () => void;
  onNavigateToSettings: () => void;
}

export const TrialBanner: React.FC<TrialBannerProps> = ({
  settings,
  onNavigateToBilling,
  onNavigateToSettings,
}) => {
  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const handleResendEmail = () => {
    setEmailStatus('Link de confirmação reenviado para ' + settings.contactEmail + ' com sucesso!');
    setTimeout(() => setEmailStatus(null), 5000);
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Email confirmation alert banner */}
      {!settings.emailConfirmed && (
        <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-amber-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-100 text-amber-700 shrink-0 mt-0.5">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-amber-200 text-amber-900">
                  CONFIRMAÇÃO DE ACESSO
                </span>
                <span className="text-xs text-amber-800 font-medium">Acesso liberado durante 10 dias de teste</span>
              </div>
              <h4 className="text-sm font-bold text-amber-950">
                Confirme seu e-mail para proteger seu painel
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Enviamos um link de confirmação para <strong className="font-semibold">{settings.contactEmail}</strong>. Verifique sua caixa de entrada e spam para garantir o recebimento de chamados e recuperação de senha.
              </p>
              {emailStatus && (
                <div className="mt-2 text-xs font-semibold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {emailStatus}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <button
              onClick={onNavigateToSettings}
              className="px-3 py-1.5 rounded-xl border border-amber-300 text-amber-900 hover:bg-amber-100 text-xs font-bold transition-colors cursor-pointer"
            >
              Corrigir E-mail
            </button>
            <button
              onClick={handleResendEmail}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
            >
              Reenviar E-mail
            </button>
          </div>
        </div>
      )}

      {/* Trial period progress card */}
      <div className="p-4 rounded-2xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#EF003F] border border-rose-100 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded bg-rose-100 text-[#EF003F]">
                {settings.trialDaysLeft} DIAS RESTANTES
              </span>
              <span className="text-xs text-[#64748B] font-medium">10 dias gratuitos</span>
            </div>
            <h4 className="text-sm font-extrabold text-[#111318] mt-0.5">
              Seu período gratuito termina em {settings.trialDaysLeft} dias
            </h4>
            <p className="text-xs text-[#64748B]">
              Aproveite todos os recursos liberados (chamados, QR Codes e cardápio sem limites)
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="flex-1 md:w-48">
            <div className="flex justify-between text-[11px] font-bold text-[#64748B] mb-1">
              <span>Dia 4 de 10</span>
              <span className="text-[#EF003F]">7 dias para o fim</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-[#EF003F]"
                style={{ width: '40%' }}
              ></div>
            </div>
          </div>

          <button
            onClick={onNavigateToBilling}
            className="px-4 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span>Escolher plano</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
