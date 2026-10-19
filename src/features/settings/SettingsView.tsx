import React, { useState } from 'react';
import {
  Palette,
  Smartphone,
  Shield,
  MapPin,
  Clock,
  Tv,
  Lock,
  Save,
  RotateCcw,
  Upload,
  Trash2,
  Search,
  Crosshair,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { RestaurantSettings, PresenceMode, DaySchedule } from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';
import { generateStrongPassword } from '../../utils/calculations.ts';

interface SettingsViewProps {
  settings: RestaurantSettings;
  onNavigateToWifi: () => void;
  onOpenTvMode: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onNavigateToWifi,
  onOpenTvMode,
}) => {
  // Form State
  const [name, setName] = useState(settings.name);
  const [primaryColor, setPrimaryColor] = useState(settings.primaryColor);
  const [legalName, setLegalName] = useState(settings.legalName);
  const [taxId, setTaxId] = useState(settings.taxId);
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [coverImageUrl, setCoverImageUrl] = useState(settings.coverImageUrl);
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl);

  // Welcome message state
  const [welcomeTitle, setWelcomeTitle] = useState(settings.welcomeTitle);
  const [welcomeSubtitle, setWelcomeSubtitle] = useState(settings.welcomeSubtitle);

  // Call rules
  const [callReturnInterval, setCallReturnInterval] = useState(settings.callReturnIntervalSeconds);

  // Presence mode
  const [presenceMode, setPresenceMode] = useState<PresenceMode>(settings.presenceMode);
  const [clientWifiSsid, setClientWifiSsid] = useState(settings.clientWifiSsid);
  const [clientWifiPassword, setClientWifiPassword] = useState(settings.clientWifiPassword || '');
  const [sessionDuration, setSessionDuration] = useState(settings.clientSessionDurationMinutes);

  // Geofence
  const [geofenceAddress, setGeofenceAddress] = useState(settings.geofenceAddress);
  const [geofenceLat, setGeofenceLat] = useState(settings.geofenceLatitude);
  const [geofenceLon, setGeofenceLon] = useState(settings.geofenceLongitude);
  const [geofenceRadius, setGeofenceRadius] = useState(settings.geofenceRadiusMeters);

  // Menu rules
  const [showUnavailableBadge, setShowUnavailableBadge] = useState(settings.showUnavailableBadge);

  // TV Monitor settings
  const [requireTvPin, setRequireTvPin] = useState(settings.requireTvPin);
  const [tvPin, setTvPin] = useState(settings.tvPin);
  const [showTvActionButtons, setShowTvActionButtons] = useState(settings.showTvActionButtons);
  const [tvPassiveMode, setTvPassiveMode] = useState(settings.tvPassiveMode);
  const [tvMoveToInProgressSeconds, setTvMoveToInProgressSeconds] = useState(settings.tvMoveToInProgressSeconds);
  const [tvFinishAndReleaseSeconds, setTvFinishAndReleaseSeconds] = useState(settings.tvFinishAndReleaseSeconds);

  // Schedules (7 days)
  const [schedules, setSchedules] = useState<DaySchedule[]>(settings.schedules);

  // Password state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  // Feedback toast
  const [saveToast, setSaveToast] = useState(false);

  // Preset covers
  const coverPresets = [
    { label: 'Restaurante Moderno', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Bistrô & Café', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Bar & Choperia', url: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Hamburgueria Artesanal', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Pizzaria Forno a Lenha', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80' },
  ];

  // Preset logos
  const logoPresets = [
    { label: 'Gastronomia', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80' },
    { label: 'Burger & Grill', url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80' },
    { label: 'Cafeteria', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=200&q=80' },
    { label: 'Pizzaria', url: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?auto=format&fit=crop&w=200&q=80' },
  ];

  const handleRestoreDefaultWelcome = () => {
    setWelcomeTitle('Como podemos ajudar?');
    setWelcomeSubtitle('Toque em um dos botões abaixo para solicitar atendimento, pedir a conta ou ver nosso cardápio completo.');
  };

  const handleSaveAll = () => {
    storageService.updateSettings({
      name,
      primaryColor,
      legalName,
      taxId,
      contactEmail,
      contactPhone,
      coverImageUrl,
      logoUrl,
      welcomeTitle,
      welcomeSubtitle,
      callReturnIntervalSeconds: callReturnInterval,
      presenceMode,
      clientWifiSsid,
      clientWifiPassword,
      clientSessionDurationMinutes: sessionDuration,
      geofenceAddress,
      geofenceLatitude: geofenceLat,
      geofenceLongitude: geofenceLon,
      geofenceRadiusMeters: geofenceRadius,
      showUnavailableBadge,
      requireTvPin,
      tvPin,
      showTvActionButtons,
      tvPassiveMode,
      tvMoveToInProgressSeconds,
      tvFinishAndReleaseSeconds,
      schedules,
    });

    soundService.playSuccessChime();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 4000);
    try {
      confetti({ particleCount: 30, spread: 50 });
    } catch {
      // catch
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPass) {
      setPasswordFeedback('Digite sua senha atual.');
      return;
    }
    if (newPass.length < 6) {
      setPasswordFeedback('A nova senha deve ter no mínimo 6 caracteres.');
      return;
    }
    if (newPass !== confirmPass) {
      setPasswordFeedback('A confirmação da nova senha não confere.');
      return;
    }

    soundService.playSuccessChime();
    setPasswordFeedback('Senha alterada com sucesso!');
    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
  };

  const handleUseCurrentGps = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGeofenceLat(Number(pos.coords.latitude.toFixed(6)));
          setGeofenceLon(Number(pos.coords.longitude.toFixed(6)));
          alert('Localização GPS capturada com sucesso!');
        },
        () => {
          // fallback mock in case permission blocked in iframe
          setGeofenceLat(-23.561494);
          setGeofenceLon(-46.655881);
          alert('Localização aproximada definida (São Paulo).');
        }
      );
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#111318]">
            Configurações do Estabelecimento
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Personalize a identidade da marca, capas, modo de segurança, TV de salão e horários de funcionamento.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="px-5 py-2.5 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-all shadow-md shadow-[#EF003F]/20 flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      {/* Internal Navigation Shortcuts Strip (Audited Section 32.1) */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white rounded-2xl border border-[#E5E7EB] shadow-2xs text-xs font-bold text-[#64748B]">
        <button
          onClick={() => scrollToSection('sec-identity')}
          className="px-3 py-1.5 rounded-xl hover:bg-gray-100 hover:text-[#111318] transition-colors shrink-0 cursor-pointer"
        >
          Identidade & Capa
        </button>
        <button
          onClick={() => scrollToSection('sec-welcome')}
          className="px-3 py-1.5 rounded-xl hover:bg-gray-100 hover:text-[#111318] transition-colors shrink-0 cursor-pointer"
        >
          Mensagem da Mesa
        </button>
        <button
          onClick={() => scrollToSection('sec-presence')}
          className="px-3 py-1.5 rounded-xl hover:bg-gray-100 hover:text-[#111318] transition-colors shrink-0 cursor-pointer"
        >
          Modo de Presença
        </button>
        <button
          onClick={() => scrollToSection('sec-geofence')}
          className="px-3 py-1.5 rounded-xl hover:bg-gray-100 hover:text-[#111318] transition-colors shrink-0 cursor-pointer"
        >
          GPS & Geofence
        </button>
        <button
          onClick={() => scrollToSection('sec-tv')}
          className="px-3 py-1.5 rounded-xl hover:bg-gray-100 hover:text-[#111318] transition-colors shrink-0 cursor-pointer"
        >
          Monitor de TV
        </button>
        <button
          onClick={() => scrollToSection('sec-hours')}
          className="px-3 py-1.5 rounded-xl hover:bg-gray-100 hover:text-[#111318] transition-colors shrink-0 cursor-pointer"
        >
          Horários de Funcionamento
        </button>
        <button
          onClick={() => scrollToSection('sec-security')}
          className="px-3 py-1.5 rounded-xl hover:bg-gray-100 hover:text-[#111318] transition-colors shrink-0 cursor-pointer"
        >
          Segurança & Senha
        </button>
      </div>

      {/* SECTION 1: Identidade Visual, Capa & Logotipo */}
      <div id="sec-identity" className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#EF003F] flex items-center justify-center border border-rose-100">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#111318]">
              Identidade Visual, Capa & Logotipo
            </h3>
            <p className="text-xs text-[#64748B]">
              Personalize o nome comercial, cor de destaque dos botões do cliente e fotos de apresentação.
            </p>
          </div>
        </div>

        {/* First Line: Nome & Cor Primária with Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#111318] block mb-1">
              Nome do Estabelecimento
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111318] block mb-1">
              Cor Primária dos Botões e Destaques
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-10 h-10 rounded-xl border border-gray-300 p-1 cursor-pointer"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-28 p-2 rounded-xl border border-gray-300 text-xs font-mono font-bold"
              />
              <button
                type="button"
                style={{ backgroundColor: primaryColor }}
                className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-xs"
              >
                Preview do Botão
              </button>
            </div>
          </div>
        </div>

        {/* Dados Cadastrais & Faturamento */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-extrabold text-[#111318] uppercase tracking-wider mb-1">
            Dados Cadastrais & Faturamento da Empresa
          </h4>
          <p className="text-[11px] text-[#64748B] mb-3">
            Utilizado para faturamento da assinatura, cobranças e recibos fiscais.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Razão Social / Nome do Responsável
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                CPF ou CNPJ (Obrigatório para Gateway)
              </label>
              <input
                type="text"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                E-mail de Contato & Cobrança
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                WhatsApp / Telefone Principal
              </label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full p-2 rounded-xl border border-gray-300 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Imagem de Fundo do Topo (Capa da Mesa) */}
        <div className="pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-xs font-extrabold text-[#111318]">
                Imagem de Fundo do Topo (Capa da Mesa)
              </h4>
              <p className="text-[11px] text-[#64748B]">
                Banner panorâmico que aparece no topo da tela do cliente após escanear o QR Code.
              </p>
            </div>
            {coverImageUrl && (
              <button
                type="button"
                onClick={() => setCoverImageUrl('')}
                className="text-xs text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Remover Capa
              </button>
            )}
          </div>

          {/* Cover preview box */}
          <div className="w-full h-36 rounded-2xl overflow-hidden bg-gray-100 relative mb-3 border border-gray-200">
            {coverImageUrl ? (
              <img
                src={coverImageUrl}
                alt="Capa do Restaurante"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                Nenhuma capa cadastrada (fundo padrão gradiente será exibido)
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
              <span className="text-white text-base font-extrabold drop-shadow-sm">
                {name}
              </span>
            </div>
          </div>

          {/* Presets and URL input */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[11px] font-bold text-gray-600">Modelos prontos:</span>
              {coverPresets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setCoverImageUrl(preset.url)}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-800 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="url"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Cole o link direto da imagem de capa (ex: https://...)"
                className="flex-1 p-2 rounded-xl border border-gray-300 text-xs"
              />
              <label className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0">
                <Upload className="w-3.5 h-3.5 text-[#EF003F]" />
                <span>Upload da Foto</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => setCoverImageUrl(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Logotipo do Estabelecimento */}
        <div className="pt-4 border-t border-gray-100">
          <h4 className="text-xs font-extrabold text-[#111318] mb-1">
            Logotipo do Estabelecimento (Acima do Título)
          </h4>
          <p className="text-[11px] text-[#64748B] mb-2">
            Ícone ou emblema que aparece no smartphone do cliente ao abrir a mesa.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="font-black text-sm text-[#EF003F]">{name.charAt(0)}</span>
              )}
            </div>

            <div className="flex-1 min-w-[240px] space-y-1.5">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-bold text-gray-500">Presets:</span>
                {logoPresets.map((lp) => (
                  <button
                    key={lp.label}
                    type="button"
                    onClick={() => setLogoUrl(lp.url)}
                    className="px-2 py-0.5 rounded-lg text-[10px] font-bold border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 cursor-pointer"
                  >
                    {lp.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="url"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="Cole o link da logo (ex: https://...)"
                  className="flex-1 p-1.5 rounded-xl border border-gray-300 text-xs"
                />
                <label className="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1">
                  <Upload className="w-3.5 h-3.5 text-gray-600" />
                  <span>Upload Logo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => setLogoUrl(reader.result as string);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Mensagem de Boas-Vindas da Mesa (QR Code) (Audited Section 32.3) */}
      <div id="sec-welcome" className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-6">
        <div className="flex items-start justify-between pb-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-[#111318]">
                  Mensagem de Boas-Vindas da Mesa (QR Code)
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-purple-100 text-purple-800">
                  VISÃO DO CLIENTE
                </span>
              </div>
              <p className="text-xs text-[#64748B]">
                Personalize o título e descrição que aparecem no smartphone quando o cliente escaneia o QR Code.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRestoreDefaultWelcome}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Restaurar Padrão</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Form left (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#111318]">
                  Título Principal de Boas-Vindas
                </label>
                <span className="text-[10px] text-[#64748B]">
                  {welcomeTitle.length}/60
                </span>
              </div>
              <input
                type="text"
                maxLength={60}
                value={welcomeTitle}
                onChange={(e) => setWelcomeTitle(e.target.value)}
                placeholder="Ex: Como podemos ajudar?"
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-[#111318]">
                  Mensagem de Apoio / Subtítulo
                </label>
                <span className="text-[10px] text-[#64748B]">
                  {welcomeSubtitle.length}/180
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={180}
                value={welcomeSubtitle}
                onChange={(e) => setWelcomeSubtitle(e.target.value)}
                placeholder="Toque em um dos botões abaixo para solicitar atendimento, pedir a conta..."
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
              />
            </div>

            <div className="p-3 rounded-2xl bg-rose-50/60 border border-rose-100 text-xs text-rose-900 leading-relaxed">
              💡 Os textos alterados aqui são atualizados <strong>em tempo real</strong> nos smartphones de todos os clientes nas mesas ao abrirem pelo QR Code.
            </div>
          </div>

          {/* Live Mobile Mockup Preview (5 cols) */}
          <div className="lg:col-span-5 bg-gray-50 rounded-3xl p-4 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-black text-[#111318]">
                Prévia na Tela do Cliente
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                EM TEMPO REAL
              </span>
            </div>

            <div className="w-56 mx-auto rounded-3xl bg-white border-4 border-[#111318] shadow-lg overflow-hidden flex flex-col p-4 text-center">
              <div className="w-8 h-8 rounded-xl bg-gray-100 mx-auto mb-2 overflow-hidden flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-black text-xs text-[#EF003F]">{name.charAt(0)}</span>
                )}
              </div>

              <span className="text-[11px] font-extrabold text-[#111318] block">
                {name}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-gray-100 text-gray-700 inline-block mx-auto mt-0.5 mb-3">
                Mesa 01 • Salão Principal
              </span>

              <h4 className="text-xs font-black text-[#111318] leading-tight mb-1">
                {welcomeTitle || 'Título da Mesa'}
              </h4>
              <p className="text-[10px] text-[#64748B] leading-tight mb-4 line-clamp-3">
                {welcomeSubtitle || 'Mensagem de apoio'}
              </p>

              <button
                type="button"
                style={{ backgroundColor: primaryColor }}
                className="w-full py-2 rounded-xl text-white text-[11px] font-bold shadow-xs flex items-center justify-center gap-1"
              >
                Chamar Garçom
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: Regras de Chamados & Retorno Automático da Mesa (Audited Section 32.4) */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#111318]">
              Regras de Chamados & Retorno Automático da Mesa
            </h3>
            <p className="text-xs text-[#64748B]">
              Configure o intervalo de segurança para novo chamado após atendimento e conclusão.
            </p>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#111318] block mb-1">
            Tempo de retorno após atendimento / intervalo para novo chamado (segundos)
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {[
              { val: 10, label: '10s (Padrão)' },
              { val: 15, label: '15s' },
              { val: 30, label: '30s' },
              { val: 60, label: '60s' },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setCallReturnInterval(p.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                  callReturnInterval === p.val
                    ? 'border-[#EF003F] bg-rose-50 text-[#EF003F]'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {p.label}
              </button>
            ))}

            <input
              type="number"
              min="5"
              max="300"
              value={callReturnInterval}
              onChange={(e) => setCallReturnInterval(Number(e.target.value))}
              className="w-20 p-1.5 rounded-xl border border-gray-300 text-xs font-bold text-center"
            />
          </div>
          <p className="text-[11px] text-[#64748B] mt-1.5">
            Ao atender e concluir o chamado, a mesa volta automaticamente ao estado pronto para novos pedidos após o tempo configurado.
          </p>
        </div>
      </div>

      {/* SECTION 4: Modo de Validação de Presença (4 Radio Cards) (Audited Section 32.5) */}
      <div id="sec-presence" className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center border border-blue-100">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#111318]">
              Modo de Validação de Presença
            </h3>
            <p className="text-xs text-[#64748B]">
              Selecione a política de segurança para acionamento de chamados e pedidos nas mesas.
            </p>
          </div>
        </div>

        {/* The 4 Audited Choice Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              id: 'BASIC' as PresenceMode,
              title: 'Básico (Padrão)',
              desc: 'Sem verificação de IP. Acesso por QR Code/link direto sujeito aos demais controles.',
            },
            {
              id: 'WIFI_ONLY' as PresenceMode,
              title: 'Rede Wi-Fi (Alta Segurança)',
              desc: 'Valida presença por correspondência com os IPs públicos ativos cadastrados nas Redes.',
            },
            {
              id: 'WIFI_OR_GPS' as PresenceMode,
              title: 'Wi-Fi OU Geolocalização',
              desc: 'Aceita verificação por rede autorizada OU localização permitida dentro do raio configurado.',
            },
            {
              id: 'STRICT' as PresenceMode,
              title: 'Estrito (Strict)',
              desc: 'Exige validações simultâneas de rede e localização GPS para autorizar a mesa.',
            },
          ].map((mode) => (
            <div
              key={mode.id}
              onClick={() => setPresenceMode(mode.id)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                presenceMode === mode.id
                  ? 'border-[#EF003F] bg-rose-50/40 shadow-xs'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black text-[#111318]">{mode.title}</h4>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      presenceMode === mode.id
                        ? 'border-[#EF003F] bg-[#EF003F]'
                        : 'border-gray-300'
                    }`}
                  >
                    {presenceMode === mode.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{mode.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Wi-Fi Explanation Banner with "Acessar Redes" button */}
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-amber-950">
            <span className="font-extrabold block mb-0.5">
              Como funciona a validação por Wi-Fi na web?
            </span>
            <span>
              O navegador web do cliente não expõe o SSID. A checagem ocorre comparando o IP de conexão do cliente com os IPs públicos autorizados cadastrados.
            </span>
          </div>

          <button
            type="button"
            onClick={onNavigateToWifi}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors shrink-0 cursor-pointer"
          >
            Acessar Redes
          </button>
        </div>

        {/* Wi-Fi Supplementary Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Nome da Rede Wi-Fi exibida ao cliente
            </label>
            <input
              type="text"
              value={clientWifiSsid}
              onChange={(e) => setClientWifiSsid(e.target.value)}
              placeholder="Ex: Restaurante_Clientes_5G"
              className="w-full p-2 rounded-xl border border-gray-300 text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Senha do Wi-Fi (Opcional)
            </label>
            <input
              type="text"
              value={clientWifiPassword}
              onChange={(e) => setClientWifiPassword(e.target.value)}
              placeholder="Ex: bemvindo2026"
              className="w-full p-2 rounded-xl border border-gray-300 text-xs"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Duração da Sessão do Cliente (minutos)
            </label>
            <input
              type="number"
              min="15"
              max="480"
              value={sessionDuration}
              onChange={(e) => setSessionDuration(Number(e.target.value))}
              className="w-full p-2 rounded-xl border border-gray-300 text-xs"
            />
          </div>
        </div>
      </div>

      {/* SECTION 5: Coordenadas de Geolocalização (Fallback Geofence) (Audited Section 32.6) */}
      <div id="sec-geofence" className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#EF003F] flex items-center justify-center border border-rose-100">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#111318]">
              Coordenadas de Geolocalização (Fallback Geofence)
            </h3>
            <p className="text-xs text-[#64748B]">
              Usado se o cliente não conseguir se conectar ao Wi-Fi e o estabelecimento permitir validação por localização.
            </p>
          </div>
        </div>

        {/* Address Search Strip */}
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={geofenceAddress}
              onChange={(e) => setGeofenceAddress(e.target.value)}
              placeholder="Digite o endereço do restaurante (rua, número, bairro ou cidade)..."
              className="w-full pl-9 p-2.5 rounded-xl border border-gray-300 text-xs"
            />
          </div>

          <button
            type="button"
            onClick={() => alert(`Endereço localizado: ${geofenceAddress}`)}
            className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-[#EF003F] border border-rose-200 text-xs font-bold transition-colors cursor-pointer shrink-0"
          >
            Buscar
          </button>
          <button
            type="button"
            onClick={handleUseCurrentGps}
            className="px-4 py-2.5 rounded-xl bg-[#111318] hover:bg-gray-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>Usar meu GPS atual</span>
          </button>
        </div>

        {/* Interactive Map Visualizer with Leaflet/OpenStreetMap styled layout */}
        <div className="w-full h-56 rounded-2xl bg-slate-100 border border-gray-200 relative overflow-hidden flex items-center justify-center">
          {/* Simulated OpenStreetMap Map Background */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]"></div>

          {/* Draggable PIN and Geofence Circle Overlay */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Geofence Circle Representation */}
            <div
              style={{
                width: `${Math.min(260, geofenceRadius * 0.9)}px`,
                height: `${Math.min(260, geofenceRadius * 0.9)}px`,
              }}
              className="rounded-full bg-[#EF003F]/15 border-2 border-[#EF003F] animate-pulse flex items-center justify-center transition-all duration-300"
            >
              <div className="p-2 rounded-full bg-[#EF003F] text-white shadow-lg">
                <MapPin className="w-5 h-5" />
              </div>
            </div>
            <span className="mt-2 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#111318] text-white shadow-xs">
              Raio Permitido: {geofenceRadius}m
            </span>
          </div>

          <div className="absolute top-2 left-2 px-2 py-1 bg-white/90 backdrop-blur-xs rounded-lg text-[10px] font-semibold text-gray-700 border border-gray-200">
            Arraste o PIN ou clique no mapa para posicionar o restaurante
          </div>

          <div className="absolute bottom-1 right-2 text-[9px] text-gray-500 bg-white/80 px-1.5 py-0.5 rounded">
            Leaflet | © OpenStreetMap contributors
          </div>
        </div>

        {/* Coordinates Inputs and Presets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Latitude
            </label>
            <input
              type="number"
              step="any"
              value={geofenceLat}
              onChange={(e) => setGeofenceLat(Number(e.target.value))}
              className="w-full p-2 rounded-xl border border-gray-300 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Longitude
            </label>
            <input
              type="number"
              step="any"
              value={geofenceLon}
              onChange={(e) => setGeofenceLon(Number(e.target.value))}
              className="w-full p-2 rounded-xl border border-gray-300 text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-[11px] font-bold text-gray-700 block mb-1">
              Raio Permitido (Metros)
            </label>
            <div className="flex items-center gap-1.5">
              {[50, 100, 150, 250].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setGeofenceRadius(r)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                    geofenceRadius === r
                      ? 'border-[#EF003F] bg-rose-50 text-[#EF003F]'
                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {r}m
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 6: Regras de Visualização do Cardápio (Audited Section 32.7) */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-3">
        <h3 className="text-base font-extrabold text-[#111318]">
          Regras de Visualização do Cardápio
        </h3>
        <p className="text-xs text-[#64748B]">
          Controle a exibição de itens sem estoque e integração com presença física.
        </p>

        <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
          <input
            type="checkbox"
            id="unavailable-check"
            checked={showUnavailableBadge}
            onChange={(e) => setShowUnavailableBadge(e.target.checked)}
            className="mt-0.5 rounded text-[#EF003F] focus:ring-[#EF003F] cursor-pointer"
          />
          <label htmlFor="unavailable-check" className="cursor-pointer text-xs">
            <span className="font-bold text-[#111318] block">
              Exibir itens esgotados com badge de “Indisponível”
            </span>
            <span className="text-[11px] text-[#64748B] block mt-0.5">
              Se desmarcado, itens indisponíveis não ficam visíveis para clientes no cardápio público.
            </span>
          </label>
        </div>
      </div>

      {/* SECTION 7: Monitor de Salão & TV (VIP) (Audited Section 32.8) */}
      <div id="sec-tv" className="bg-white rounded-3xl border-2 border-rose-200 p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-[#EF003F]">
                NOVO
              </span>
              <h3 className="text-base font-extrabold text-[#111318]">
                Monitor de Salão & TV (VIP)
              </h3>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              Acesso ao monitor, botões touchscreen e comportamento automático dos chamados em TVs e paredes do estabelecimento.
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenTvMode}
            className="text-xs font-bold text-[#EF003F] hover:underline flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Abrir Monitor de TV em nova aba</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {/* Checkbox TV PIN */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="require-tv-pin"
              checked={requireTvPin}
              onChange={(e) => setRequireTvPin(e.target.checked)}
              className="mt-0.5 rounded text-[#EF003F] cursor-pointer"
            />
            <label htmlFor="require-tv-pin" className="cursor-pointer text-xs">
              <span className="font-bold text-[#111318] block">
                Exigir PIN / Login para visualizar o Monitor de Salão (TV)
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Impede que clientes ou pessoas não autorizadas visualizem chamados em telas acessíveis.
              </span>
            </label>
          </div>

          {requireTvPin && (
            <div className="pl-6">
              <label className="text-[11px] font-bold text-gray-700 block mb-1">
                Senha Geral da TV (código PIN do Salão de 4 dígitos)
              </label>
              <input
                type="text"
                maxLength={4}
                value={tvPin}
                onChange={(e) => setTvPin(e.target.value.replace(/\D/g, ''))}
                className="w-28 p-2 rounded-xl border border-gray-300 text-center font-mono font-black text-sm"
              />
            </div>
          )}

          {/* Checkbox show action buttons */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="tv-action-buttons"
              checked={showTvActionButtons}
              onChange={(e) => setShowTvActionButtons(e.target.checked)}
              className="mt-0.5 rounded text-[#EF003F] cursor-pointer"
            />
            <label htmlFor="tv-action-buttons" className="cursor-pointer text-xs">
              <span className="font-bold text-[#111318] block">
                Exibir botões “Atender” e “Concluir” nos cards da TV
              </span>
              <span className="text-[11px] text-[#64748B] block mt-0.5">
                Desative caso a TV seja uma tela suspensa de parede sem toque.
              </span>
            </label>
          </div>

          {/* Checkbox passive mode with timers */}
          <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
            <input
              type="checkbox"
              id="tv-passive-mode"
              checked={tvPassiveMode}
              onChange={(e) => setTvPassiveMode(e.target.checked)}
              className="mt-0.5 rounded text-[#EF003F] cursor-pointer"
            />
            <div className="flex-1">
              <label htmlFor="tv-passive-mode" className="cursor-pointer text-xs">
                <span className="font-bold text-[#111318] block">
                  Avançar e finalizar chamados automaticamente por tempo (Modo Passivo de Parede)
                </span>
                <span className="text-[11px] text-[#64748B] block mt-0.5">
                  Os chamados avançam de estágio sozinhos sem exigir clique.
                </span>
              </label>

              {tvPassiveMode && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 block mb-1">
                      Mover para “Em Atendimento” após (segundos)
                    </label>
                    <input
                      type="number"
                      value={tvMoveToInProgressSeconds}
                      onChange={(e) => setTvMoveToInProgressSeconds(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-700 block mb-1">
                      Finalizar e Liberar da TV após (segundos)
                    </label>
                    <input
                      type="number"
                      value={tvFinishAndReleaseSeconds}
                      onChange={(e) => setTvFinishAndReleaseSeconds(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-gray-300 text-xs"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 8: Horário de Funcionamento por Dia da Semana (Audited Section 32.9) */}
      <div id="sec-hours" className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-[#111318]">
              Horário de Funcionamento por Dia da Semana
            </h3>
            <p className="text-xs text-[#64748B]">
              Defina os dias de abertura e fechamento para indicar o status operacional aos clientes.
            </p>
          </div>
        </div>

        {/* 7 Days List */}
        <div className="space-y-2">
          {schedules.map((sched, idx) => (
            <div
              key={sched.dayName}
              className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-[#111318] w-28">
                  {sched.dayName}
                </span>

                <label className="flex items-center gap-1.5 font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={sched.isClosed}
                    onChange={(e) => {
                      const updated = [...schedules];
                      updated[idx].isClosed = e.target.checked;
                      setSchedules(updated);
                    }}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Fechado</span>
                </label>
              </div>

              {!sched.isClosed && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-500 font-medium">Abre:</span>
                  <input
                    type="time"
                    value={sched.openTime}
                    onChange={(e) => {
                      const updated = [...schedules];
                      updated[idx].openTime = e.target.value;
                      setSchedules(updated);
                    }}
                    className="p-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                  />

                  <span className="text-[11px] text-gray-500 font-medium">Fecha:</span>
                  <input
                    type="time"
                    value={sched.closeTime}
                    onChange={(e) => {
                      const updated = [...schedules];
                      updated[idx].closeTime = e.target.value;
                      setSchedules(updated);
                    }}
                    className="p-1.5 rounded-lg border border-gray-300 text-xs font-bold"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleSaveAll}
            className="w-full py-3 rounded-2xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Todas as Configurações</span>
          </button>
        </div>
      </div>

      {/* SECTION 9: Segurança da Conta & Alteração de Senha (Audited Section 32.10) */}
      <div id="sec-security" className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-xs space-y-4">
        <div className="flex items-start justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-[#EF003F] flex items-center justify-center border border-rose-100">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#111318]">
                Segurança da Conta & Alteração de Senha
              </h3>
              <p className="text-xs text-[#64748B]">
                Altere a senha de acesso ao painel para manter sua conta protegida.
              </p>
            </div>
          </div>

          <span className="text-xs text-[#64748B] font-mono hidden sm:block">
            {contactEmail}
          </span>
        </div>

        {passwordFeedback && (
          <div
            className={`p-3 rounded-xl text-xs font-medium ${
              passwordFeedback.includes('sucesso')
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}
          >
            {passwordFeedback}
          </div>
        )}

        <form onSubmit={handleSavePassword} className="space-y-4 max-w-lg">
          <div>
            <label className="text-xs font-bold text-[#111318] block mb-1">
              Senha Atual
            </label>
            <input
              type="password"
              value={currentPass}
              onChange={(e) => setCurrentPass(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-[#111318]">
                Nova Senha
              </label>
              <button
                type="button"
                onClick={() => {
                  const strong = generateStrongPassword(10);
                  setNewPass(strong);
                  setConfirmPass(strong);
                }}
                className="text-[10px] font-bold text-[#EF003F] flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Sparkles className="w-3 h-3" />
                Gerar Forte
              </button>
            </div>
            <input
              type="text"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
              placeholder="Mínimo 6 caracteres"
              required
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#111318] block mb-1">
              Confirmar Nova Senha
            </label>
            <input
              type="text"
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-mono"
              required
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Salvar Nova Senha
          </button>
        </form>
      </div>

      {/* Floating Save Toast */}
      {saveToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#111318] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-gray-700 animate-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="text-xs font-bold">Configurações salvas com sucesso!</p>
            <p className="text-[10px] text-gray-400">Todos os módulos e o cardápio público foram atualizados.</p>
          </div>
        </div>
      )}
    </div>
  );
};
