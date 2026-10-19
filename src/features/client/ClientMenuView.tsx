import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Bell,
  CreditCard,
  BookOpen,
  ExternalLink,
  ShoppingBag,
  RotateCw,
  Play,
  Volume2,
  VolumeX,
  X,
  Plus,
  Minus,
  Check,
  Star,
  Search,
  Sparkles,
  ArrowLeft,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type {
  Product,
  Category,
  CustomButton,
  Table,
  RestaurantSettings,
  CartItem,
  ProductVariation,
} from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';
import { formatBRL, isRestaurantOpen } from '../../utils/calculations.ts';

interface ClientMenuViewProps {
  tableNumber: number;
  settings: RestaurantSettings;
  tables: Table[];
  categories: Category[];
  products: Product[];
  customButtons: CustomButton[];
  onBackToAdmin: () => void;
}

export const ClientMenuView: React.FC<ClientMenuViewProps> = ({
  tableNumber,
  settings,
  tables,
  categories,
  products,
  customButtons,
  onBackToAdmin,
}) => {
  const currentTable = tables.find((t) => t.number === tableNumber) || tables[0];

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCartModal, setShowCartModal] = useState(false);
  const [showOrderSuccessModal, setShowOrderSuccessModal] = useState(false);

  // Call status feedback
  const [callCooldown, setCallCooldown] = useState(0);
  const [callFeedbackMsg, setCallFeedbackMsg] = useState<string | null>(null);

  // Bill modal
  const [showBillModal, setShowBillModal] = useState(false);
  const [billMethod, setBillMethod] = useState<'PIX' | 'CARD' | 'CASH'>('PIX');

  // Stories / Reels / 360 Fullscreen Viewer
  const [activeReelProduct, setActiveReelProduct] = useState<Product | null>(null);
  const [isReelPlaying, setIsReelPlaying] = useState(true);
  const [isReelMuted, setIsReelMuted] = useState(true);
  const [reelOrbitalIndex, setReelOrbitalIndex] = useState(0);

  // Detail Modal for Product
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [detailSelectedVar, setDetailSelectedVar] = useState<ProductVariation | undefined>(undefined);
  const [detailNotes, setDetailNotes] = useState('');

  // Cooldown timer
  useEffect(() => {
    if (callCooldown > 0) {
      const timer = setTimeout(() => setCallCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [callCooldown]);

  const openStatus = isRestaurantOpen(settings.schedules);

  const filteredProducts = products.filter((p) => {
    if (!settings.showUnavailableBadge && !p.isAvailable) return false;
    if (selectedCategory !== 'ALL' && p.categoryId !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    }
    return true;
  });

  const featuredProducts = products.filter((p) => p.isFeatured && p.isAvailable);

  const cartTotalCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => {
    const itemPrice = item.variation?.price || item.product.promotionalPrice || item.product.normalPrice;
    return acc + itemPrice * item.quantity;
  }, 0);

  const handleTriggerButton = (btn: CustomButton) => {
    // Check Wi-Fi requirements
    if (btn.requiresWifi && settings.presenceMode === 'STRICT') {
      // In strict mode explain verification
    }

    if (btn.actionType === 'MENU') {
      const el = document.getElementById('client-menu-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (btn.actionType === 'CALL') {
      if (callCooldown > 0) {
        alert(`Aguarde ${callCooldown}s para solicitar um novo atendimento.`);
        return;
      }
      storageService.createCall(
        currentTable.number.toString(),
        currentTable.name,
        currentTable.sector,
        'CALL',
        btn.label
      );
      soundService.playNewCallChime();
      setCallCooldown(settings.callReturnIntervalSeconds || 15);
      setCallFeedbackMsg('Garçom chamado com sucesso! Um atendente virá à sua mesa.');
      setTimeout(() => setCallFeedbackMsg(null), 6000);
    } else if (btn.actionType === 'BILL_REQUEST') {
      setShowBillModal(true);
    } else if (btn.actionType === 'EXTERNAL_LINK') {
      if (btn.url) {
        window.open(btn.url, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleConfirmBillRequest = () => {
    storageService.createCall(
      currentTable.number.toString(),
      currentTable.name,
      currentTable.sector,
      'BILL_REQUEST',
      'Pedido de Conta',
      billMethod
    );
    soundService.playNewCallChime();
    setShowBillModal(false);
    setCallFeedbackMsg(`Conta solicitada com forma de pagamento: ${billMethod}!`);
    setTimeout(() => setCallFeedbackMsg(null), 6000);
  };

  const handleAddToCart = (product: Product, variation?: ProductVariation, notes?: string) => {
    const existingIndex = cart.findIndex(
      (item) => item.product.id === product.id && item.variation?.id === variation?.id
    );
    if (existingIndex > -1) {
      const updated = [...cart];
      updated[existingIndex].quantity += 1;
      setCart(updated);
    } else {
      setCart([...cart, { product, variation, quantity: 1, notes }]);
    }
    soundService.playSuccessChime();
    setSelectedProductForDetail(null);
  };

  const handleUpdateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1);
    }
    setCart(updated);
  };

  const handleFinishOrder = () => {
    if (cart.length === 0) return;
    storageService.createOrder(
      currentTable.number.toString(),
      currentTable.name,
      cart,
      cartSubtotal
    );
    soundService.playNewCallChime();
    setCart([]);
    setShowCartModal(false);
    setShowOrderSuccessModal(true);
    try {
      confetti({ particleCount: 50, spread: 60 });
    } catch {
      // catch
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] pb-24 text-[#111318] max-w-md mx-auto shadow-2xl relative font-sans">
      {/* Top Preview Bar for return to Admin Panel */}
      <div className="bg-[#111318] text-white px-4 py-2 flex items-center justify-between text-xs sticky top-0 z-40 border-b border-gray-800">
        <button
          onClick={onBackToAdmin}
          className="flex items-center gap-1 font-bold text-gray-300 hover:text-white cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Painel Admin</span>
        </button>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
          QR Code Ativo
        </span>
      </div>

      {/* Header Banner & Cover */}
      <div className="relative h-48 bg-[#111318] overflow-hidden">
        {settings.coverImageUrl ? (
          <img
            src={settings.coverImageUrl}
            alt="Capa"
            className="w-full h-full object-cover opacity-85"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#C90036] to-[#EF003F]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-black/40 to-black/20" />

        {/* Floating Table Badge */}
        <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-black bg-white/90 text-[#111318] backdrop-blur-xs shadow-md">
            {currentTable.name} • {currentTable.sector}
          </span>

          <span
            className={`px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-xs shadow-sm ${
              openStatus.isOpen
                ? 'bg-emerald-500/90 text-white'
                : 'bg-rose-500/90 text-white'
            }`}
          >
            {openStatus.message}
          </span>
        </div>

        {/* Restaurant Profile on Cover */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white border-2 border-white shadow-lg overflow-hidden flex items-center justify-center shrink-0">
            {settings.logoUrl ? (
              <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
            ) : (
              <span className="font-black text-xl text-[#EF003F]">{settings.name.charAt(0)}</span>
            )}
          </div>

          <div>
            <h1 className="text-lg font-black text-white leading-tight drop-shadow-sm">
              {settings.name}
            </h1>
            <p className="text-xs text-white/80 font-medium">
              Atendimento digital na mesa
            </p>
          </div>
        </div>
      </div>

      {/* Welcome Title & Subtitle Card */}
      <div className="p-4 bg-white border-b border-[#E5E7EB]">
        <h2 className="text-base font-black text-[#111318] mb-1">
          {settings.welcomeTitle}
        </h2>
        <p className="text-xs text-[#64748B] leading-relaxed">
          {settings.welcomeSubtitle}
        </p>

        {callFeedbackMsg && (
          <div className="mt-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{callFeedbackMsg}</span>
          </div>
        )}
      </div>

      {/* Custom Operational Action Buttons (Botões Personalizados) */}
      <div className="p-4 space-y-2.5">
        <span className="text-[11px] font-black uppercase tracking-wider text-[#64748B] block">
          Ações Rápidas
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {customButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => handleTriggerButton(btn)}
              style={btn.actionType === 'CALL' ? { backgroundColor: settings.primaryColor } : {}}
              className={`p-3.5 rounded-2xl text-left transition-transform active:scale-95 cursor-pointer flex flex-col justify-between min-h-[90px] shadow-xs ${
                btn.actionType === 'CALL'
                  ? 'text-white shadow-md'
                  : 'bg-white border border-[#E5E7EB] text-[#111318] hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                {btn.actionType === 'CALL' ? (
                  <Bell className="w-5 h-5 text-white" />
                ) : btn.actionType === 'BILL_REQUEST' ? (
                  <CreditCard className="w-5 h-5 text-purple-600" />
                ) : btn.actionType === 'MENU' ? (
                  <BookOpen className="w-5 h-5 text-emerald-600" />
                ) : (
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                )}

                {btn.requiresWifi && (
                  <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    Wi-Fi
                  </span>
                )}
              </div>

              <div>
                <span className="text-xs font-black block leading-tight">
                  {btn.label}
                </span>
                {btn.actionType === 'CALL' && callCooldown > 0 && (
                  <span className="text-[10px] text-white/80 block mt-0.5">
                    Aguarde {callCooldown}s
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured / Reels Highlights Carrousel */}
      {featuredProducts.length > 0 && (
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-[#111318] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#EF003F]" />
              Destaques & Stories
            </span>
            <span className="text-[10px] text-[#64748B]">Toque para ver em 9:16</span>
          </div>

          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
            {featuredProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => setActiveReelProduct(p)}
                className="w-28 shrink-0 aspect-9/16 rounded-2xl overflow-hidden relative cursor-pointer shadow-sm group border-2 border-rose-500/30"
              >
                <img
                  src={p.imageUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80'}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 p-2 flex flex-col justify-between">
                  <span className="self-end px-1.5 py-0.5 rounded text-[8px] font-black bg-[#EF003F] text-white uppercase">
                    360°
                  </span>
                  <div>
                    <h5 className="text-[11px] font-black text-white leading-tight line-clamp-2">
                      {p.name}
                    </h5>
                    <span className="text-[10px] font-bold text-emerald-400">
                      {formatBRL(p.promotionalPrice || p.normalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DIGITAL MENU SECTION */}
      <div id="client-menu-section" className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#111318]">
            Nosso Cardápio
          </h3>
          <span className="text-xs text-[#64748B]">
            {filteredProducts.length} itens disponíveis
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar pratos, porções, bebidas..."
            className="w-full pl-9 pr-3 py-2.5 rounded-2xl bg-white border border-[#E5E7EB] text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
          />
        </div>

        {/* Category Horizontal Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#111318] text-white'
                : 'bg-white text-gray-700 border border-[#E5E7EB]'
            }`}
          >
            Todos
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-[#111318] text-white'
                  : 'bg-white text-gray-700 border border-[#E5E7EB]'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Products List */}
        <div className="space-y-3">
          {filteredProducts.map((p) => {
            const hasPromo = p.promotionalPrice && p.promotionalPrice < p.normalPrice;

            return (
              <div
                key={p.id}
                onClick={() => {
                  setSelectedProductForDetail(p);
                  setDetailSelectedVar(p.variations?.[0]);
                  setDetailNotes('');
                }}
                className="p-3 bg-white rounded-2xl border border-[#E5E7EB] shadow-xs flex gap-3 cursor-pointer hover:border-gray-300 transition-all active:scale-[0.99]"
              >
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                  <img
                    src={p.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80'}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                  {p.spin360?.enabled && (
                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-black bg-black/60 text-white backdrop-blur-xs flex items-center gap-0.5">
                      <RotateCw className="w-2 h-2 text-[#EF003F]" />
                      360°
                    </span>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <h4 className="text-xs font-black text-[#111318] line-clamp-1">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5 leading-tight">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xs font-black text-emerald-600">
                        {formatBRL(p.promotionalPrice || p.normalPrice)}
                      </span>
                      {hasPromo && (
                        <span className="text-[10px] text-gray-400 line-through">
                          {formatBRL(p.normalPrice)}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(p);
                      }}
                      className="p-1.5 rounded-xl bg-rose-50 text-[#EF003F] hover:bg-[#EF003F] hover:text-white transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Cart Button */}
      {cartTotalCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
          <button
            onClick={() => setShowCartModal(true)}
            className="w-full p-4 rounded-2xl bg-[#EF003F] text-white shadow-xl shadow-[#EF003F]/30 flex items-center justify-between font-bold text-xs cursor-pointer active:scale-95 transition-transform"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Ver Pedido ({cartTotalCount} {cartTotalCount === 1 ? 'item' : 'itens'})</span>
            </div>
            <span className="text-sm font-black">{formatBRL(cartSubtotal)}</span>
          </button>
        </div>
      )}

      {/* MODAL DETALHES DO PRODUTO */}
      {selectedProductForDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-base font-black text-[#111318]">
                {selectedProductForDetail.name}
              </h3>
              <button
                onClick={() => setSelectedProductForDetail(null)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full aspect-16/10 rounded-2xl overflow-hidden bg-gray-100 mb-3">
              <img
                src={selectedProductForDetail.imageUrl}
                alt={selectedProductForDetail.name}
                className="w-full h-full object-cover"
              />
            </div>

            <p className="text-xs text-[#64748B] mb-4">
              {selectedProductForDetail.description}
            </p>

            {/* Variations */}
            {selectedProductForDetail.hasVariations && selectedProductForDetail.variations?.length > 0 && (
              <div className="mb-4">
                <label className="text-xs font-bold text-[#111318] block mb-1.5">
                  Escolha o Tamanho / Opção:
                </label>
                <div className="space-y-2">
                  {selectedProductForDetail.variations.map((v) => (
                    <label
                      key={v.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs font-bold cursor-pointer transition-colors ${
                        detailSelectedVar?.id === v.id
                          ? 'border-[#EF003F] bg-rose-50/50 text-[#EF003F]'
                          : 'border-gray-200 text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="variation"
                          checked={detailSelectedVar?.id === v.id}
                          onChange={() => setDetailSelectedVar(v)}
                          className="text-[#EF003F]"
                        />
                        <span>{v.name}</span>
                      </div>
                      <span className="font-black">{formatBRL(v.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Observações */}
            <div className="mb-4">
              <label className="text-xs font-bold text-[#111318] block mb-1">
                Observações para a cozinha (opcional)
              </label>
              <input
                type="text"
                value={detailNotes}
                onChange={(e) => setDetailNotes(e.target.value)}
                placeholder="Ex: sem cebola, ponto da carne bem passado..."
                className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
              />
            </div>

            <button
              onClick={() =>
                handleAddToCart(
                  selectedProductForDetail,
                  detailSelectedVar,
                  detailNotes
                )
              }
              className="w-full py-3 rounded-2xl bg-[#EF003F] text-white text-xs font-black shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Adicionar ao Pedido • {formatBRL(detailSelectedVar?.price || selectedProductForDetail.promotionalPrice || selectedProductForDetail.normalPrice)}</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL STORIES & REELS VERTICAL VIEWER WITH 360° SPIN INTERACTION */}
      {activeReelProduct && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4 max-w-md mx-auto">
          {/* Top Reels Bar */}
          <div className="flex items-center justify-between z-10 text-white">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#EF003F]">
                Stories & Reels
              </span>
              <span className="text-xs font-bold text-white/90">
                {activeReelProduct.name}
              </span>
            </div>

            <button
              onClick={() => setActiveReelProduct(null)}
              className="p-1 text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center: Video or 360 Spin orbital image */}
          <div className="relative flex-1 my-4 flex items-center justify-center overflow-hidden rounded-3xl bg-neutral-900 select-none">
            {activeReelProduct.mediaType === 'VIDEO' && activeReelProduct.videoUrl ? (
              <video
                src={activeReelProduct.videoUrl}
                autoPlay
                loop
                muted={isReelMuted}
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full relative cursor-grab active:cursor-grabbing"
                onMouseMove={(e) => {
                  if (e.buttons === 1) {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const frame = Math.floor((x / rect.width) * 4) % 4;
                    setReelOrbitalIndex(Math.abs(frame));
                  }
                }}
                onTouchMove={(e) => {
                  const touch = e.touches[0];
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = touch.clientX - rect.left;
                  const frame = Math.floor((x / rect.width) * 4) % 4;
                  setReelOrbitalIndex(Math.abs(frame));
                }}
              >
                <img
                  src={
                    activeReelProduct.spin360?.orbitalImages?.[reelOrbitalIndex] ||
                    activeReelProduct.imageUrl
                  }
                  alt="360 View"
                  className="w-full h-full object-cover pointer-events-none"
                />

                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5 pointer-events-none">
                  <RotateCw className="w-3.5 h-3.5 text-[#EF003F] animate-spin" />
                  <span>Arraste para girar em 360°</span>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Dish Card */}
          <div className="p-4 rounded-3xl bg-neutral-900/95 border border-white/10 text-white z-10 backdrop-blur-md">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <h4 className="text-sm font-black leading-tight">
                  {activeReelProduct.name}
                </h4>
                <p className="text-xs text-gray-300 line-clamp-1 mt-0.5">
                  {activeReelProduct.description}
                </p>
              </div>
              <span className="text-sm font-black text-emerald-400">
                {formatBRL(activeReelProduct.promotionalPrice || activeReelProduct.normalPrice)}
              </span>
            </div>

            <button
              onClick={() => {
                handleAddToCart(activeReelProduct);
                setActiveReelProduct(null);
              }}
              className="w-full py-2.5 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
            >
              Adicionar ao Pedido
            </button>
          </div>
        </div>
      )}

      {/* MODAL CARRINHO */}
      {showCartModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl max-w-md w-full p-5 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <h3 className="text-base font-black text-[#111318]">
                Seu Pedido ({currentTable.name})
              </h3>
              <button onClick={() => setShowCartModal(false)} className="p-1">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-3 divide-y divide-gray-100 pr-1">
              {cart.map((item, idx) => {
                const itemPrice =
                  item.variation?.price || item.product.promotionalPrice || item.product.normalPrice;

                return (
                  <div key={idx} className="pt-2 flex items-center justify-between">
                    <div>
                      <h5 className="text-xs font-black text-[#111318]">
                        {item.product.name}
                      </h5>
                      {item.variation && (
                        <span className="text-[10px] text-gray-500 font-bold block">
                          Opção: {item.variation.name}
                        </span>
                      )}
                      {item.notes && (
                        <span className="text-[10px] text-gray-400 italic block">
                          Obs: {item.notes}
                        </span>
                      )}
                      <span className="text-xs font-bold text-emerald-600 block">
                        {formatBRL(itemPrice * item.quantity)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(idx, -1)}
                        className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-700"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-black w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(idx, 1)}
                        className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-700"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
              <div className="flex justify-between items-center text-sm font-black">
                <span>Total</span>
                <span className="text-[#EF003F] text-base">{formatBRL(cartSubtotal)}</span>
              </div>

              <button
                onClick={handleFinishOrder}
                className="w-full py-3 rounded-2xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-black shadow-md cursor-pointer"
              >
                Confirmar e Enviar Pedido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PEDIDO CONFIRMADO */}
      {showOrderSuccessModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-[#111318] mb-1">
              Pedido Enviado!
            </h3>
            <p className="text-xs text-[#64748B] mb-6">
              Seu pedido foi registrado no sistema e já está sendo preparado pela equipe.
            </p>
            <button
              onClick={() => setShowOrderSuccessModal(false)}
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
            >
              Entendido
            </button>
          </div>
        </div>
      )}

      {/* MODAL PEDIR CONTA */}
      {showBillModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-base font-black text-[#111318]">
                Solicitar Fechamento de Conta
              </h3>
              <button onClick={() => setShowBillModal(false)} className="p-1">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <p className="text-xs text-[#64748B] mb-4">
              Como você deseja efetuar o pagamento da {currentTable.name}?
            </p>

            <div className="space-y-2 mb-6">
              {[
                { id: 'PIX' as const, label: 'Pix (Chave ou QR Code na maquininha)' },
                { id: 'CARD' as const, label: 'Cartão de Crédito ou Débito' },
                { id: 'CASH' as const, label: 'Dinheiro' },
              ].map((m) => (
                <label
                  key={m.id}
                  className={`p-3 rounded-2xl border flex items-center gap-3 text-xs font-bold cursor-pointer transition-colors ${
                    billMethod === m.id
                      ? 'border-purple-600 bg-purple-50 text-purple-900'
                      : 'border-gray-200 text-gray-700'
                  }`}
                >
                  <input
                    type="radio"
                    name="billMethod"
                    checked={billMethod === m.id}
                    onChange={() => setBillMethod(m.id)}
                    className="text-purple-600"
                  />
                  <span>{m.label}</span>
                </label>
              ))}
            </div>

            <button
              onClick={handleConfirmBillRequest}
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-md cursor-pointer"
            >
              Confirmar Solicitação de Conta
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
