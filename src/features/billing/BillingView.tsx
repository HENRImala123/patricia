import React, { useState } from 'react';
import {
  CreditCard,
  Check,
  Zap,
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { RestaurantSettings } from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';

interface BillingViewProps {
  settings: RestaurantSettings;
}

export const BillingView: React.FC<BillingViewProps> = ({ settings }) => {
  const [selectedPlanForUpgrade, setSelectedPlanForUpgrade] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CARD'>('PIX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const plans = [
    {
      id: 'STARTER',
      name: 'Starter',
      price: 'R$ 79',
      period: '/mês',
      description: 'Ideal para bares e restaurantes de pequeno porte iniciando a operação digital.',
      features: [
        'Até 10 mesas ativas com QR Code',
        'Cardápio digital mobile responsivo',
        'Chamados de garçom em tempo real',
        '1 membro de equipe cadastrado',
        'Suporte por e-mail',
      ],
      isPopular: false,
    },
    {
      id: 'PRO',
      name: 'Pro',
      price: 'R$ 149',
      period: '/mês',
      description: 'O plano mais escolhido. Operação completa com painel de TV e Stories verticais.',
      features: [
        'Mesas e QR Codes ilimitados',
        'Studio de Mídias (Stories e Reels verticais)',
        'Painel Monitor de Salão & Modo TV',
        'Botões personalizados e pedido de conta',
        'Validação de presença por Wi-Fi e GPS',
        'Até 5 colaboradores com PIN',
        'Suporte WhatsApp',
      ],
      isPopular: true,
    },
    {
      id: 'BUSINESS',
      name: 'Business',
      price: 'R$ 249',
      period: '/mês',
      description: 'Para operações gastronômicas de alto volume que exigem métricas e exportação.',
      features: [
        'Tudo do Plano Pro incluído',
        'Exportação ilimitada de relatórios em Excel/CSV',
        'Histórico completo de auditoria e métricas',
        'Colaboradores e atendentes ilimitados',
        'Giro 360° e apresentação de pratos com IA',
        'Gerente de contas dedicado',
      ],
      isPopular: false,
    },
  ];

  const handleConfirmUpgrade = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      storageService.updateSettings({
        plan: selectedPlanForUpgrade as 'PRO' | 'BUSINESS',
        trialDaysLeft: 30,
      });
      setUpgradeSuccess(true);
      soundService.playSuccessChime();
      try {
        confetti({ particleCount: 60, spread: 70 });
      } catch {
        // catch
      }
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-[#111318]">
          Planos & Assinatura
        </h2>
        <p className="text-xs md:text-sm text-[#64748B] mt-1">
          Gerencie sua assinatura, consulte recursos disponíveis e escolha o melhor plano para seu restaurante.
        </p>
      </div>

      {/* Current Subscription Card */}
      <div className="p-5 rounded-3xl bg-white border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#C90036] to-[#EF003F] text-white flex items-center justify-center font-black shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#64748B]">Plano Atual:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-[#EF003F]">
                {settings.plan === 'GRATUITO' ? 'Teste Gratuito (10 Dias)' : settings.plan}
              </span>
            </div>
            <h3 className="text-base font-extrabold text-[#111318] mt-0.5">
              {settings.plan === 'GRATUITO'
                ? `Você possui ${settings.trialDaysLeft} dias restantes no período de avaliação`
                : `Assinatura Plano ${settings.plan} ativa`}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            Acesso Irrestrito
          </span>
        </div>
      </div>

      {/* Plan Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((p) => {
          const isCurrent =
            (p.id === 'STARTER' && settings.plan === 'GRATUITO') ||
            settings.plan === p.id;

          return (
            <div
              key={p.id}
              className={`rounded-3xl p-6 transition-all flex flex-col justify-between relative ${
                p.isPopular
                  ? 'bg-white border-2 border-[#EF003F] shadow-xl shadow-rose-500/10'
                  : 'bg-white border border-[#E5E7EB] shadow-xs hover:border-gray-300'
              }`}
            >
              {p.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#EF003F] text-white shadow-xs">
                  Mais Recomendado
                </span>
              )}

              <div>
                <h4 className="text-lg font-black text-[#111318]">{p.name}</h4>
                <p className="text-xs text-[#64748B] mt-1 mb-4 leading-relaxed">
                  {p.description}
                </p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-black text-[#111318]">{p.price}</span>
                  <span className="text-xs text-[#64748B]">{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-gray-100">
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-gray-100">
                <button
                  onClick={() => setSelectedPlanForUpgrade(p.id)}
                  disabled={isCurrent && settings.plan !== 'GRATUITO'}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    p.isPopular
                      ? 'bg-[#EF003F] hover:bg-[#C90036] text-white shadow-md shadow-[#EF003F]/20'
                      : 'bg-[#111318] hover:bg-gray-800 text-white'
                  }`}
                >
                  {isCurrent && settings.plan !== 'GRATUITO'
                    ? 'Plano Atual'
                    : `Assinar ${p.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL CHECKOUT BRASIL (PIX & CARTÃO) */}
      {selectedPlanForUpgrade && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-lg font-black text-[#111318]">
                  Ativar Plano {selectedPlanForUpgrade}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Pagamento seguro com ativação instantânea no restaurante.
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedPlanForUpgrade(null);
                  setUpgradeSuccess(false);
                }}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {upgradeSuccess ? (
              <div className="py-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-black text-[#111318]">
                  Plano Ativado com Sucesso!
                </h4>
                <p className="text-xs text-[#64748B] mt-1 mb-4">
                  Seu restaurante agora conta com todos os recursos do Plano {selectedPlanForUpgrade} desbloqueados.
                </p>
                <button
                  onClick={() => {
                    setSelectedPlanForUpgrade(null);
                    setUpgradeSuccess(false);
                  }}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Payment Method Selector */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('PIX')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethod === 'PIX'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <QrCode className="w-4 h-4 text-emerald-600" />
                    Pix (Instantâneo)
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-[#EF003F] bg-rose-50 text-[#EF003F]'
                        : 'border-gray-200 text-gray-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-[#EF003F]" />
                    Cartão de Crédito
                  </button>
                </div>

                {paymentMethod === 'PIX' ? (
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-center space-y-2">
                    <div className="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-gray-200 flex items-center justify-center">
                      <QrCode className="w-24 h-24 text-gray-900" />
                    </div>
                    <p className="text-xs font-bold text-[#111318]">
                      Escaneie o QR Code Pix com o aplicativo do seu banco
                    </p>
                    <span className="text-[10px] font-mono text-gray-500 block break-all">
                      00020126580014br.gov.bcb.pix0136saborearte@pix.com.br...
                    </span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Número do Cartão"
                      defaultValue="4532 •••• •••• 9821"
                      className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Validade (MM/AA)"
                        defaultValue="12/28"
                        className="p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        defaultValue="842"
                        className="p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setSelectedPlanForUpgrade(null)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleConfirmUpgrade}
                    disabled={isProcessing}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    {isProcessing ? 'Confirmando...' : 'Confirmar Pagamento'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
