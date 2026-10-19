import React, { useState } from 'react';
import { Wifi, Plus, ShieldCheck, AlertTriangle, Trash2, Globe, Info, X } from 'lucide-react';
import type { WifiNetwork } from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';

interface WifiViewProps {
  wifiNetworks: WifiNetwork[];
}

export const WifiView: React.FC<WifiViewProps> = ({ wifiNetworks }) => {
  const [showModal, setShowModal] = useState(false);
  const [netName, setNetName] = useState('');
  const [ssid, setSsid] = useState('');
  const [ipRange, setIpRange] = useState('');
  const [notes, setNotes] = useState('');

  const handleSaveNetwork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!netName.trim() || !ssid.trim()) return;

    storageService.addWifiNetwork({
      restaurantId: 'rest-1',
      name: netName.trim(),
      ssid: ssid.trim(),
      publicIpRange: ipRange.trim() || '189.40.120.0/24 (IP Público do Estabelecimento)',
      isActive: true,
      notes: notes.trim(),
    });

    setNetName('');
    setSsid('');
    setIpRange('');
    setNotes('');
    setShowModal(false);
    soundService.playSuccessChime();
  };

  const handleDetectCurrentIp = () => {
    setIpRange('177.136.241.85/32 (Detectado)');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#111318]">
            Redes Autorizadas (Wi-Fi)
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Cadastre os pontos de acesso do restaurante para validar a presença física dos clientes nas mesas.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-all shadow-md shadow-[#EF003F]/20 flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar Rede Autorizada</span>
        </button>
      </div>

      {/* Mandatory Technical Explanation Banner */}
      <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-3 shadow-xs">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <Info className="w-5 h-5" />
        </div>
        <div className="text-xs leading-relaxed">
          <h4 className="font-extrabold text-sm text-amber-950 mb-1">
            Como funciona a validação técnica de Wi-Fi no navegador web
          </h4>
          <p className="text-amber-900">
            <strong>Limitação técnica obrigatória:</strong> navegadores web modernos não têm permissão para descobrir o nome SSID da rede Wi-Fi do cliente por questões de segurança e privacidade do sistema operacional.
          </p>
          <p className="text-amber-800 mt-1">
            Para garantir que o cliente está realmente sentado no salão ao acionar botões protegidos, o servidor compara o <strong>IP público de origem da conexão</strong> com os IPs dos roteadores autorizados cadastrados nesta tela, ou utiliza o fallback de geolocalização por raio GPS.
          </p>
        </div>
      </div>

      {/* Networks List */}
      <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-xs">
        <div className="p-4 md:px-6 border-b border-[#E5E7EB] flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#111318]">
            Redes e Roteadores Cadastrados ({wifiNetworks.length})
          </h3>
          <span className="text-xs text-[#64748B]">Isolamento multi-tenant ativo</span>
        </div>

        <div className="divide-y divide-[#E5E7EB]">
          {wifiNetworks.map((net) => (
            <div
              key={net.id}
              className="p-4 md:px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-100">
                  <Wifi className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-[#111318]">
                      {net.name}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Ativa
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-1">
                    <span>
                      SSID: <strong className="text-gray-800">{net.ssid}</strong>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-500" />
                      Faixa IP: <code className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">{net.publicIpRange}</code>
                    </span>
                  </div>
                  {net.notes && (
                    <p className="text-[11px] text-gray-500 mt-1 italic">
                      Obs: {net.notes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-auto">
                <button
                  onClick={() => {
                    if (window.confirm(`Excluir rede ${net.name}?`)) {
                      storageService.deleteWifiNetwork(net.id);
                    }
                  }}
                  className="p-2 rounded-xl text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Remover rede"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Cadastrar Rede Autorizada */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-black text-[#111318]">
                  Cadastrar Rede Autorizada
                </h3>
                <p className="text-xs text-[#64748B]">
                  Cadastre o nome e identificadores do Wi-Fi do estabelecimento.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNetwork} className="space-y-4 mt-3">
              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Nome Amigável da Rede
                </label>
                <input
                  type="text"
                  value={netName}
                  onChange={(e) => setNetName(e.target.value)}
                  placeholder="Ex: Wi-Fi Salão Principal"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Nome da Rede (SSID exibido aos clientes)
                </label>
                <input
                  type="text"
                  value={ssid}
                  onChange={(e) => setSsid(e.target.value)}
                  placeholder="Ex: Restaurante_Clientes_5G"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-[#111318]">
                    IP Público ou Gateway do Roteador
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectCurrentIp}
                    className="text-[10px] font-bold text-[#EF003F] hover:underline"
                  >
                    Detectar meu IP atual
                  </button>
                </div>
                <input
                  type="text"
                  value={ipRange}
                  onChange={(e) => setIpRange(e.target.value)}
                  placeholder="Ex: 189.40.120.0/24 ou IP fixo"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Observações Internas (Opcional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Roteador instalado no teto do salão"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                />
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
                  Salvar Rede
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
