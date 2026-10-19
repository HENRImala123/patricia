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
  Download,
  Copy,
  Check,
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

  const handleNfcWrite = async (table: Table) => {
    const tableUrl = getClientTableUrl(table.number);
    // Web NFC check
    if ('NDEFReader' in window) {
      try {
        // @ts-expect-error Web NFC API
        const ndef = new NDEFReader();
        alert('Aproxime a tag NFC física da traseira do aparelho para gravar o link da mesa...');
        await ndef.write({
          records: [{ recordType: 'url', data: tableUrl }],
        });
        alert(`Sucesso! Tag NFC gravada com o link da ${table.name}!`);
        return;
      } catch (err) {
        console.warn('NFC Write error:', err);
      }
    }

    // Fallback: copy link to clipboard with instructions
    navigator.clipboard.writeText(tableUrl);
    setCopiedLink(table.id);
    setTimeout(() => setCopiedLink(null), 3000);
    alert(`Link da ${table.name} copiado para a área de transferência!\n\n${tableUrl}\n\nVocê pode usar o aplicativo "NFC Tools" no celular para aproximar a tag e colar este link.`);
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
      <div className="p-4 md:p-5 rounded-2xl bg-gradient-to-r from-[#F95738] to-[#EF003F] text-white shadow-sm flex items-start md:items-center justify-between gap-4">
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
                  onClick={() => handleNfcWrite(table)}
                  className="flex-1 py-1.5 px-2 rounded-xl border border-amber-200 bg-amber-50/50 hover:bg-amber-100/70 text-amber-900 text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  title="Gravar tag NFC ou copiar link"
                >
                  {copiedLink === table.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Radio className="w-3.5 h-3.5 text-amber-700" />
                  )}
                  <span>{copiedLink === table.id ? 'Copiado' : 'Gravar NFC'}</span>
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
    </div>
  );
};
