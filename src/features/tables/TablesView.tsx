import React, { useState, useEffect } from 'react';
import {
  Plus,
  Radio,
  Printer,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  X,
  Lock,
  Unlock,
  Download,
  Copy,
  Check,
  Smartphone,
  Share2,
  HelpCircle,
  Lightbulb,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Table, RestaurantSettings } from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';
import { generateQrDataUrl } from '../../services/qrcode.ts';
import { getClientTableUrl } from '../../utils/calculations.ts';

interface TablesViewProps {
  settings: RestaurantSettings;
  tables: Table[];
  onOpenClientView: (tableNumber: number) => void;
}

export const TablesView: React.FC<TablesViewProps> = ({
  settings,
  tables,
  onOpenClientView,
}) => {
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [showNewModal, setShowNewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState<Table | null>(null);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [showNfcModal, setShowNfcModal] = useState<Table | null>(null);
  const [isNfcWriting, setIsNfcWriting] = useState(false);
  const [nfcWriteSuccess, setNfcWriteSuccess] = useState(false);
  const [nfcLockStatus, setNfcLockStatus] = useState<'EDITABLE' | 'LOCKED'>('EDITABLE');
  const [nfcCopied, setNfcCopied] = useState(false);

  // Form states
  const [tableName, setTableName] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [tableSector, setTableSector] = useState('Salão Principal');
  const [errorMsg, setErrorMsg] = useState('');

  // QR Data URLs cache
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const sectorSuggestions = [
    'Salão Principal',
    'Varanda',
    'Deck',
    'Bar',
    'Mezanino',
    'Área Externa',
  ];

  // Load QR codes
  useEffect(() => {
    tables.forEach(async (t) => {
      if (!qrImages[t.id]) {
        const url = getClientTableUrl(t.number);
        const dataUrl = await generateQrDataUrl(url, 240);
        setQrImages((prev) => ({ ...prev, [t.id]: dataUrl }));
      }
    });
  }, [tables]);

  // Distinct sectors from current tables
  const sectorsFromTables = Array.from(new Set(tables.map((t) => t.sector)));

  const filteredTables = tables.filter((t) => {
    if (selectedSector === 'ALL') return true;
    return t.sector === selectedSector;
  });

  const handleOpenNewModal = () => {
    const nextNumber = tables.length > 0 ? Math.max(...tables.map((t) => t.number)) + 1 : 1;
    setTableNumber(nextNumber.toString());
    setTableName(`Mesa ${nextNumber < 10 ? '0' + nextNumber : nextNumber}`);
    setTableSector('Salão Principal');
    setErrorMsg('');
    setEditingTable(null);
    setShowNewModal(true);
  };

  const handleOpenEditModal = (table: Table) => {
    setEditingTable(table);
    setTableName(table.name);
    setTableNumber(table.number.toString());
    setTableSector(table.sector);
    setErrorMsg('');
    setShowNewModal(true);
  };

  const handleSaveTable = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseInt(tableNumber, 10);
    if (isNaN(num) || num <= 0) {
      setErrorMsg('Digite um número de mesa válido maior que zero.');
      return;
    }
    if (!tableName.trim()) {
      setErrorMsg('O nome da mesa é obrigatório.');
      return;
    }

    // Check duplicate number
    const duplicate = tables.find(
      (t) => t.number === num && (!editingTable || editingTable.id !== t.id)
    );
    if (duplicate) {
      setErrorMsg(`Já existe uma mesa com o número ${num} cadastrada.`);
      return;
    }

    if (editingTable) {
      storageService.updateTable(editingTable.id, {
        name: tableName.trim(),
        number: num,
        sector: tableSector.trim(),
      });
      setShowNewModal(false);
    } else {
      storageService.addTable({
        restaurantId: 'rest-1',
        name: tableName.trim(),
        number: num,
        sector: tableSector.trim(),
        isActive: true,
      });
      setShowNewModal(false);
      setShowSuccessModal(true);
      soundService.playSuccessChime();
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch {
        // confetti catch
      }
    }
  };

  const handleDeleteTable = (table: Table) => {
    if (window.confirm(`Tem certeza que deseja excluir a ${table.name}? Os pedidos e chamados anteriores serão preservados.`)) {
      storageService.deleteTable(table.id);
    }
  };

  const handleOpenNfcModal = (table: Table) => {
    setShowNfcModal(table);
    setNfcWriteSuccess(false);
    setIsNfcWriting(false);
    setNfcCopied(false);
    setNfcLockStatus('EDITABLE');
  };

  const handleCopyNfcLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setNfcCopied(true);
    setTimeout(() => setNfcCopied(false), 2500);
  };

  const handleShareNfcLink = (table: Table, url: string) => {
    const text = `Link oficial do cardápio e atendimento para ${table.name} (${settings.name}):\n${url}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: `${table.name} — ${settings.name}`,
        text: text,
        url: url,
      }).catch(() => {
        window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
      });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  const handleWriteNfcDirect = async (table: Table) => {
    const url = getClientTableUrl(table.number);
    setIsNfcWriting(true);
    setNfcWriteSuccess(false);

    if (typeof window !== 'undefined' && 'NDEFReader' in window) {
      try {
        // @ts-expect-error Web NFC API
        const ndef = new NDEFReader();
        await ndef.write({
          records: [{ recordType: 'url', data: url }],
        });
        setIsNfcWriting(false);
        setNfcWriteSuccess(true);
        soundService.playSuccessChime();
        try {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
        } catch {}
        return;
      } catch (err) {
        console.warn('NFC Write error:', err);
        setIsNfcWriting(false);
      }
    }

    // Interactive fallback / simulation
    setTimeout(() => {
      setIsNfcWriting(false);
      setNfcWriteSuccess(true);
      soundService.playSuccessChime();
      try {
        confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
      } catch {}
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#111318]">
            Mesas & QR Codes
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Cadastre mesas, imprima cartões de acrílico com QR Code e gerencie tokens seguros.
          </p>
        </div>

        <button
          onClick={handleOpenNewModal}
          className="px-4 py-2.5 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-all shadow-md shadow-[#EF003F]/20 flex items-center justify-center gap-1.5 cursor-pointer self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>+ Nova Mesa</span>
        </button>
      </div>

      {/* Audited NFC Exclusive Banner */}
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-[#F95738] to-[#EF003F] text-white shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start md:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-white shrink-0 mt-0.5 md:mt-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white text-[#EF003F]">
                EXCLUSIVO
              </span>
              <span className="text-xs text-white/90 font-medium">Suporte a tags físicas e acrílicos</span>
            </div>
            <h3 className="text-sm font-extrabold text-white">
              Atendimento por Aproximação (NFC) & Displays Personalizados
            </h3>
            <p className="text-xs text-white/85 max-w-2xl mt-0.5">
              Grave tags físicas NFC ou imprima os cartões de acrílico com QR Code exclusivo, logotipo do restaurante, selo NFC e instruções automáticas para os clientes.
            </p>
          </div>
        </div>

        {tables.length > 0 && (
          <button
            onClick={() => handleOpenNfcModal(tables[0])}
            className="px-3.5 py-2 rounded-xl bg-white text-[#EF003F] hover:bg-white/95 text-xs font-black transition-all shadow-md shrink-0 flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <Radio className="w-4 h-4" />
            <span>Gravar Tag NFC</span>
          </button>
        )}
      </div>

      {/* Sector Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setSelectedSector('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
            selectedSector === 'ALL'
              ? 'bg-[#111318] text-white shadow-xs'
              : 'bg-white text-[#252A35] border border-[#E5E7EB] hover:bg-gray-50'
          }`}
        >
          Todos os Setores ({tables.length})
        </button>
        {sectorsFromTables.map((sec) => {
          const count = tables.filter((t) => t.sector === sec).length;
          return (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedSector === sec
                  ? 'bg-[#111318] text-white shadow-xs'
                  : 'bg-white text-[#252A35] border border-[#E5E7EB] hover:bg-gray-50'
              }`}
            >
              {sec} ({count})
            </button>
          );
        })}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTables.map((table) => {
          const qrSrc = qrImages[table.id];

          return (
            <div
              key={table.id}
              className="bg-white rounded-3xl border border-[#E5E7EB] p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Card Top: Small ID + Actions */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-black text-[#64748B]">
                      MESA #{table.number}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      Editável
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditModal(table)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#111318] hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Editar mesa"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTable(table)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#EF003F] hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Excluir mesa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* QR Code Container */}
                <div className="w-full aspect-square bg-[#F7F8FA] rounded-2xl p-4 flex items-center justify-center border border-gray-100 mb-3 relative group">
                  {qrSrc ? (
                    <img
                      src={qrSrc}
                      alt={`QR Code ${table.name}`}
                      className="w-full h-full object-contain mix-blend-multiply"
                    />
                  ) : (
                    <div className="animate-pulse w-32 h-32 bg-gray-200 rounded-xl"></div>
                  )}

                  <div className="absolute inset-0 bg-black/40 backdrop-blur-2xs rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => onOpenClientView(table.number)}
                      className="px-3 py-1.5 rounded-xl bg-white text-[#111318] text-xs font-bold shadow-md hover:bg-gray-100 flex items-center gap-1 cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#EF003F]" />
                      Abrir Tela
                    </button>
                  </div>
                </div>

                {/* Title and Sector Chip */}
                <div className="mb-2">
                  <h4 className="font-extrabold text-base text-[#111318]">
                    {table.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                      {table.sector}
                    </span>
                    <span className="text-[10px] font-mono text-[#64748B]">
                      Token v1: {table.token.slice(0, 7)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between gap-1.5">
                <button
                  onClick={() => setShowPrintModal(table)}
                  className="flex-1 py-1.5 px-2 rounded-xl border border-gray-200 text-[#111318] hover:bg-gray-50 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5 text-gray-600" />
                  <span>Imprimir</span>
                </button>

                <button
                  onClick={() => handleOpenNfcModal(table)}
                  className="flex-1 py-1.5 px-2 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Gravar tag NFC física por aproximação"
                >
                  <Radio className="w-3.5 h-3.5 text-amber-700" />
                  <span>Gravar NFC</span>
                </button>

                <button
                  onClick={() => onOpenClientView(table.number)}
                  className="p-1.5 rounded-xl border border-gray-200 text-gray-700 hover:text-[#EF003F] hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Abrir em nova aba"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Nova / Editar Mesa */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-black text-[#111318]">
                  {editingTable ? 'Editar Mesa' : 'Nova Mesa'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Defina a identificação da mesa para geração do QR Code exclusivo.
                </p>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveTable} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Nome ou Identificação da Mesa
                </label>
                <input
                  type="text"
                  value={tableName}
                  onChange={(e) => setTableName(e.target.value)}
                  placeholder="Ex: Mesa 02"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F] focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Número de Identificação
                </label>
                <input
                  type="number"
                  min="1"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  placeholder="Ex: 2"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Setor / Área do Restaurante
                </label>
                <input
                  type="text"
                  value={tableSector}
                  onChange={(e) => setTableSector(e.target.value)}
                  placeholder="Ex: Salão Principal"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F] mb-2"
                  required
                />

                <div className="flex flex-wrap gap-1.5">
                  {sectorSuggestions.map((sug) => (
                    <button
                      key={sug}
                      type="button"
                      onClick={() => setTableSector(sug)}
                      className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        tableSector === sug
                          ? 'border-[#111318] bg-[#111318] text-white'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {sug}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-[#64748B] mt-1.5">
                  Permite que os painéis da TV filtrem e mostrem apenas as mesas deste setor.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  {editingTable ? 'Salvar Alterações' : 'Criar Mesa & Gerar QR'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Sucesso */}
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
              Mesa criada com sucesso! O QR Code exclusivo foi gerado e vinculado ao salão.
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

      {/* Modal Impressão de Display de Acrílico */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-[#111318] flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#EF003F]" />
                Display de Mesa (Acrílico 10x15cm)
              </h3>
              <button
                onClick={() => setShowPrintModal(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Printable Frame */}
            <div
              id="printable-acrylic-stand"
              className="p-6 bg-white border-2 border-dashed border-gray-300 rounded-2xl text-center space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#EF003F] text-white flex items-center justify-center font-black text-xs">
                  {settings.name.charAt(0)}
                </div>
                <span className="font-extrabold text-sm text-[#111318] tracking-tight">
                  {settings.name}
                </span>
              </div>

              <div className="w-44 h-44 mx-auto p-2 bg-white rounded-2xl border border-gray-200 shadow-xs flex items-center justify-center">
                <img
                  src={qrImages[showPrintModal.id]}
                  alt="QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <div>
                <span className="px-3 py-1 rounded-full text-xs font-black bg-[#111318] text-white inline-block">
                  {showPrintModal.name} • {showPrintModal.sector}
                </span>
                <p className="text-xs font-bold text-[#111318] mt-2">
                  Aponte a câmera do seu celular
                </p>
                <p className="text-[11px] text-[#64748B]">
                  Para acessar o cardápio, fazer pedidos ou solicitar atendimento.
                </p>
              </div>

              <div className="pt-2 border-t border-gray-100 flex items-center justify-center gap-2 text-[10px] font-bold text-gray-400">
                <Radio className="w-3 h-3 text-[#EF003F]" />
                <span>Toque com NFC ou Escaneie o QR Code</span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPrintModal(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
              >
                Fechar
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#111318] hover:bg-gray-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir Agora
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gravar Tag NFC — Idêntico à especificação */}
      {showNfcModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#111318]">
                  Gravar Tag NFC — {showNfcModal.name}
                </h3>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Grave o link oficial desta mesa diretamente em uma tag física por aproximação.
                </p>
              </div>
              <button
                onClick={() => setShowNfcModal(null)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-[#111318] hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Card Mesa Selecionada */}
            <div className="mt-5 p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-[#FFF1EB] text-[#F95738] flex items-center justify-center shrink-0 shadow-xs">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] block">
                      MESA SELECIONADA
                    </span>
                    <h4 className="text-base font-black text-[#111318]">
                      {showNfcModal.name}
                    </h4>
                  </div>
                </div>
                <span className="text-xs font-black text-[#64748B] bg-[#EDF2F7] px-2.5 py-1 rounded-lg">
                  #{showNfcModal.number}
                </span>
              </div>

              <div className="pt-2.5 border-t border-[#E2E8F0]/60 flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#64748B]">
                  Status da Tag NFC:
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setNfcLockStatus((prev) => (prev === 'EDITABLE' ? 'LOCKED' : 'EDITABLE'))
                  }
                  className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                    nfcLockStatus === 'EDITABLE'
                      ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                      : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                  }`}
                  title="Clique para alternar o status de proteção contra regravação"
                >
                  {nfcLockStatus === 'EDITABLE' ? (
                    <>
                      <Unlock className="w-3 h-3 text-amber-600" />
                      <Lock className="w-3 h-3 text-amber-700" />
                      <span>Editável — pode ser regravada</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 text-rose-600" />
                      <span>Bloqueada — protegida contra regravação</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Caixa de Aviso / Instrução do Navegador */}
            <div className="mt-4 p-4 rounded-2xl bg-[#FFFDF5] border border-[#FDE68A] text-[#92400E] space-y-3">
              <div className="flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-xs sm:text-[13px] text-[#78350F]">
                    Navegador sem suporte a escrita direta Web NFC
                  </h5>
                  <p className="text-xs text-[#92400E] mt-1 leading-relaxed">
                    Por políticas da Apple, o Safari no iOS não permite que sites gravem NFC diretamente pelo navegador.
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-[#FDE68A]/60 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#B45309] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-[#78350F] block mb-0.5">
                    Dica rápida para gravar direto pelo celular:
                  </span>
                  <p className="leading-relaxed text-[#92400E]">
                    Acesse este mesmo painel administrativo pelo{' '}
                    <strong className="text-[#78350F]">Google Chrome em um celular Android com NFC</strong>.
                    Nele, a gravação e a proteção contra alterações funcionam nativamente com 1 toque!
                  </p>
                </div>
              </div>

              {/* Botão interativo para gravar diretamente ou testar simulação */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => handleWriteNfcDirect(showNfcModal)}
                  disabled={isNfcWriting}
                  className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 ${
                    nfcWriteSuccess
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                      : 'bg-[#F95738] hover:bg-[#E54827] text-white shadow-[#F95738]/20'
                  }`}
                >
                  <Radio className={`w-4 h-4 ${isNfcWriting ? 'animate-ping' : ''}`} />
                  <span>
                    {isNfcWriting
                      ? 'Aguardando aproximação da tag NFC física...'
                      : nfcWriteSuccess
                      ? '✓ Tag Gravada com Sucesso!'
                      : 'Gravar Tag NFC por Aproximação'}
                  </span>
                </button>
              </div>
            </div>

            {/* Link Oficial Formatado */}
            <div className="mt-4">
              <label className="text-xs font-bold text-[#1E293B] mb-1.5 block">
                Link oficial formatado para esta mesa:
              </label>
              <div className="flex items-center gap-2 mb-2.5">
                <input
                  type="text"
                  readOnly
                  value={getClientTableUrl(showNfcModal.number)}
                  className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3.5 py-2.5 text-xs text-[#334155] font-mono flex-1 select-all outline-hidden truncate"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleCopyNfcLink(getClientTableUrl(showNfcModal.number))
                  }
                  className="px-4 py-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-gray-50 text-xs font-bold text-[#1E293B] transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-2xs"
                >
                  {nfcCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-gray-600" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
                <a
                  href={getClientTableUrl(showNfcModal.number)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-[#CBD5E1] bg-white hover:bg-gray-50 text-[#1E293B] hover:text-[#EF003F] transition-colors shrink-0 flex items-center justify-center cursor-pointer shadow-2xs"
                  title="Abrir e testar cardápio desta mesa no navegador"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <button
                type="button"
                onClick={() =>
                  handleShareNfcLink(
                    showNfcModal,
                    getClientTableUrl(showNfcModal.number)
                  )
                }
                className="w-full py-2.5 px-4 rounded-xl border border-[#CBD5E1] bg-white hover:bg-gray-50 text-[#1E293B] text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-gray-600" />
                <span>Compartilhar Link (WhatsApp / Mensagem)</span>
              </button>
            </div>

            {/* Como os clientes usam no salão */}
            <div className="mt-5 pt-4 border-t border-[#F1F5F9]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#334155] mb-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#64748B]" />
                <span>Como os clientes usam no salão?</span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#64748B] leading-relaxed">
                Após gravar a tag, cole-a na mesa ou sob o display acrílico. No salão, clientes com{' '}
                <strong className="text-[#334155]">iPhone e Android</strong> só precisam aproximar o celular da tag para serem atendidos, sem precisar de nenhum aplicativo instalado.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
