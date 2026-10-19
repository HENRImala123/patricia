import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Smartphone,
  ArrowRight,
  BookOpen,
  Bell,
  CreditCard,
  Link as LinkIcon,
  ShieldAlert,
  Edit2,
  Trash2,
  ExternalLink,
  CheckCircle2,
  X,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { CustomButton, ButtonActionType } from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';

interface ButtonsViewProps {
  customButtons: CustomButton[];
  onNavigateToSettingsMessage: () => void;
}

export const ButtonsView: React.FC<ButtonsViewProps> = ({
  customButtons,
  onNavigateToSettingsMessage,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [editingButton, setEditingButton] = useState<CustomButton | null>(null);

  // Form
  const [btnLabel, setBtnLabel] = useState('');
  const [btnActionType, setBtnActionType] = useState<ButtonActionType>('EXTERNAL_LINK');
  const [btnUrl, setBtnUrl] = useState('https://instagram.com/');
  const [btnRequiresWifi, setBtnRequiresWifi] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenNewModal = () => {
    setEditingButton(null);
    setBtnLabel('');
    setBtnActionType('EXTERNAL_LINK');
    setBtnUrl('https://instagram.com/');
    setBtnRequiresWifi(false);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleOpenEditModal = (btn: CustomButton) => {
    setEditingButton(btn);
    setBtnLabel(btn.label);
    setBtnActionType(btn.actionType);
    setBtnUrl(btn.url || '');
    setBtnRequiresWifi(btn.requiresWifi);
    setErrorMsg('');
    setShowModal(true);
  };

  const handleSaveButton = (e: React.FormEvent) => {
    e.preventDefault();
    if (!btnLabel.trim()) {
      setErrorMsg('O rótulo do botão é obrigatório.');
      return;
    }
    if (btnActionType === 'EXTERNAL_LINK' && (!btnUrl.trim() || !btnUrl.startsWith('http'))) {
      setErrorMsg('Digite uma URL válida iniciando com https:// ou http://');
      return;
    }

    let defaultIcon = 'link';
    if (btnActionType === 'MENU') defaultIcon = 'book';
    if (btnActionType === 'CALL') defaultIcon = 'bell';
    if (btnActionType === 'BILL_REQUEST') defaultIcon = 'credit-card';

    if (editingButton) {
      storageService.updateButton(editingButton.id, {
        label: btnLabel.trim(),
        actionType: btnActionType,
        url: btnActionType === 'EXTERNAL_LINK' ? btnUrl.trim() : undefined,
        requiresWifi: btnRequiresWifi,
        icon: defaultIcon,
      });
      setShowModal(false);
    } else {
      storageService.addButton({
        restaurantId: 'rest-1',
        label: btnLabel.trim(),
        actionType: btnActionType,
        url: btnActionType === 'EXTERNAL_LINK' ? btnUrl.trim() : undefined,
        requiresWifi: btnRequiresWifi,
        icon: defaultIcon,
        isActive: true,
      });
      setShowModal(false);
      setShowSuccessModal(true);
      soundService.playSuccessChime();
      try {
        confetti({ particleCount: 40, spread: 50 });
      } catch {
        // confetti catch
      }
    }
  };

  const handleDeleteButton = (btn: CustomButton) => {
    if (window.confirm(`Tem certeza que deseja excluir o botão "${btn.label}"?`)) {
      storageService.deleteButton(btn.id);
    }
  };

  const getActionBadge = (type: ButtonActionType) => {
    switch (type) {
      case 'MENU':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-emerald-100 text-emerald-800">
            MENU
          </span>
        );
      case 'CALL':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-rose-100 text-[#EF003F]">
            CALL
          </span>
        );
      case 'BILL_REQUEST':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-purple-100 text-purple-800">
            BILL_REQUEST
          </span>
        );
      case 'EXTERNAL_LINK':
        return (
          <span className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider bg-blue-100 text-blue-800">
            EXTERNAL_LINK
          </span>
        );
    }
  };

  const getActionIcon = (type: ButtonActionType) => {
    switch (type) {
      case 'MENU':
        return (
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
            <BookOpen className="w-5 h-5" />
          </div>
        );
      case 'CALL':
        return (
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#EF003F] flex items-center justify-center shrink-0 border border-rose-100">
            <Bell className="w-5 h-5" />
          </div>
        );
      case 'BILL_REQUEST':
        return (
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
            <CreditCard className="w-5 h-5" />
          </div>
        );
      case 'EXTERNAL_LINK':
        return (
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <LinkIcon className="w-5 h-5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#111318]">
            Botões Personalizados
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Configure as ações exibidas para o cliente na mesa (redes sociais, links, chamados extras).
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-4 py-2.5 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-all shadow-md shadow-[#EF003F]/20 flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Novo Botão</span>
        </button>
      </div>

      {/* Audited Banner: Frase de Boas-Vindas da Mesa */}
      <div className="p-4 md:p-5 rounded-2xl bg-rose-50/70 border border-rose-200 text-[#111318] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#EF003F] flex items-center justify-center shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-[#111318]">
              Frase de Boas-Vindas da Mesa
            </h4>
            <p className="text-xs text-[#64748B] mt-0.5">
              Deseja editar o texto "Como podemos ajudar?" exibido acima dos botões na tela do cliente?
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToSettingsMessage}
          className="px-3.5 py-2 rounded-xl border border-[#EF003F] text-[#EF003F] hover:bg-rose-100/60 text-xs font-bold transition-colors flex items-center gap-1 shrink-0 cursor-pointer"
        >
          <span>Personalizar Frase da Mesa</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Button Rows List */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-xs divide-y divide-[#E5E7EB]">
        {customButtons.map((btn) => (
          <div
            key={btn.id}
            className="p-4 md:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors"
          >
            <div className="flex items-start sm:items-center gap-3">
              {getActionIcon(btn.actionType)}

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h4 className="font-extrabold text-sm text-[#111318]">
                    {btn.label}
                  </h4>
                  {getActionBadge(btn.actionType)}
                  {btn.requiresWifi && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-amber-600" />
                      Exige Wi-Fi
                    </span>
                  )}
                </div>

                {btn.url && (
                  <a
                    href={btn.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-1 font-medium"
                  >
                    <span>{btn.url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 self-end sm:self-auto">
              <button
                onClick={() => handleOpenEditModal(btn)}
                className="p-2 rounded-xl text-gray-500 hover:text-[#111318] hover:bg-gray-100 transition-colors cursor-pointer"
                title="Editar botão"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteButton(btn)}
                className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Excluir botão"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL NOVO / EDITAR BOTÃO */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-black text-[#111318]">
                  {editingButton ? 'Editar Botão' : 'Novo Botão'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Personalize o texto, tipo de ação e ícone do botão.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveButton} className="space-y-4 mt-3">
              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Rótulo do Botão
                </label>
                <input
                  type="text"
                  value={btnLabel}
                  onChange={(e) => setBtnLabel(e.target.value)}
                  placeholder="Ex: Siga no Instagram, WhatsApp, Wi-Fi"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Tipo de Ação
                </label>
                <select
                  value={btnActionType}
                  onChange={(e) => setBtnActionType(e.target.value as ButtonActionType)}
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                >
                  <option value="EXTERNAL_LINK">Link Externo (Instagram, Site, WhatsApp)</option>
                  <option value="CALL">Chamado de Garçom Especial</option>
                  <option value="BILL_REQUEST">Pedido de Conta</option>
                  <option value="MENU">Abrir Cardápio</option>
                </select>
              </div>

              {btnActionType === 'EXTERNAL_LINK' && (
                <div>
                  <label className="text-xs font-bold text-[#111318] block mb-1">
                    URL do Link
                  </label>
                  <input
                    type="url"
                    value={btnUrl}
                    onChange={(e) => setBtnUrl(e.target.value)}
                    placeholder="https://instagram.com/"
                    className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                    required
                  />
                </div>
              )}

              {/* Checkbox Wi-Fi */}
              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                <input
                  type="checkbox"
                  id="requires-wifi-check"
                  checked={btnRequiresWifi}
                  onChange={(e) => setBtnRequiresWifi(e.target.checked)}
                  className="mt-0.5 rounded text-[#EF003F] focus:ring-[#EF003F] cursor-pointer"
                />
                <label htmlFor="requires-wifi-check" className="cursor-pointer text-xs">
                  <span className="font-bold text-[#111318] block">
                    Exigir validação de presença no Wi-Fi para acionar este botão
                  </span>
                  <span className="text-[11px] text-[#64748B] block mt-0.5">
                    Impede que clientes fora do salão disparem chamados ou ações restritas.
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Salvar Botão
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL SUCESSO AO CADASTRAR BOTÃO */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 border border-emerald-100">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#111318] mb-1">
              Tudo certo!
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Novo botão criado com sucesso! Ele já está disponível na tela dos clientes nas mesas.
            </p>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => setShowSuccessModal(false)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
              >
                Perfeito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
