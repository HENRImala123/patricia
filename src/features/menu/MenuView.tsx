import React, { useState } from 'react';
import {
  FileSpreadsheet,
  FolderPlus,
  Plus,
  X,
  Smartphone,
  Video,
  Image as ImageIcon,
  Check,
  Star,
  Tag,
  Clock,
  Sparkles,
  Layers,
  Trash2,
  Edit2,
  RotateCw,
  Play,
  Volume2,
  VolumeX,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type {
  Product,
  Category,
  ProductVariation,
  RestaurantSettings,
} from '../../types/index.ts';
import { storageService } from '../../services/storage.ts';
import { soundService } from '../../services/sound.ts';
import { calculateDiscount, formatBRL } from '../../utils/calculations.ts';

interface MenuViewProps {
  settings: RestaurantSettings;
  categories: Category[];
  products: Product[];
}

export const MenuView: React.FC<MenuViewProps> = ({
  settings,
  categories,
  products,
}) => {
  const [activeTab, setActiveTab] = useState<'PRODUCTS' | 'CATEGORIES'>('PRODUCTS');
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Modal Left Subtab
  const [formSubTab, setFormSubTab] = useState<'MAIN' | 'VARIATIONS' | 'PROMO'>('MAIN');

  // Product Form State
  const [prodName, setProdName] = useState('');
  const [prodCatId, setProdCatId] = useState(categories[0]?.id || '');
  const [prodNormalPrice, setProdNormalPrice] = useState('36.00');
  const [prodPromoPrice, setProdPromoPrice] = useState('29.00');
  const [prodDesc, setProdDesc] = useState('');
  const [prodTags, setProdTags] = useState<string[]>(['⭐ Mais Pedido', '👨‍🍳 Artesanal']);
  const [customTagInput, setCustomTagInput] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);

  // Variations Form State
  const [hasVariations, setHasVariations] = useState(false);
  const [variationsList, setVariationsList] = useState<ProductVariation[]>([
    { id: '1', name: 'Simples (180g)', price: 29.0, available: true },
    { id: '2', name: 'Duplo (360g)', price: 39.0, available: true },
  ]);
  const [newVarName, setNewVarName] = useState('');
  const [newVarPrice, setNewVarPrice] = useState('');

  // Promo Form State
  const [hasScheduledPromo, setHasScheduledPromo] = useState(false);
  const [promoDays, setPromoDays] = useState<number[]>([1, 2, 3, 4]); // Mon-Thu
  const [promoStart, setPromoStart] = useState('17:00');
  const [promoEnd, setPromoEnd] = useState('20:00');

  // Media Studio State (9:16)
  const [mediaTab, setMediaTab] = useState<'PHOTO' | 'VIDEO'>('PHOTO');
  const [photoUrl, setPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80'
  );
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlayingVideo, setIsPlayingVideo] = useState(true);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  // 360 Spin Mode state
  const [spinMode, setSpinMode] = useState<'A_VIDEO' | 'B_ORBITAL_SPIN' | 'C_AI_3D'>('B_ORBITAL_SPIN');
  const [orbitalFrameIndex, setOrbitalFrameIndex] = useState(0);
  const orbitalFrames = [
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
    'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80',
  ];

  // Category Modal State
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Import Spreadsheet Wizard State
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3>(1);
  const [importedRows, setImportedRows] = useState<Array<{ name: string; category: string; price: number }>>([]);

  const defaultTagOptions = [
    '⭐ Mais Pedido',
    '🌱 Vegetariano',
    '🥦 Sem Glúten',
    '🌶️ Picante',
    '👨‍🍳 Artesanal',
    '🆕 Novidade',
    '🥩 Especial da Casa',
  ];

  // Calculate promotional discount in real time
  const normalNum = parseFloat(prodNormalPrice.replace(',', '.')) || 0;
  const promoNum = parseFloat(prodPromoPrice.replace(',', '.')) || 0;
  const discountData = calculateDiscount(normalNum, promoNum > 0 ? promoNum : undefined);

  const handleToggleTag = (tag: string) => {
    if (prodTags.includes(tag)) {
      setProdTags(prodTags.filter((t) => t !== tag));
    } else {
      setProdTags([...prodTags, tag]);
    }
  };

  const handleAddCustomTag = () => {
    if (customTagInput.trim() && !prodTags.includes(customTagInput.trim())) {
      setProdTags([...prodTags, customTagInput.trim()]);
      setCustomTagInput('');
    }
  };

  const handleAddVariation = () => {
    if (!newVarName.trim()) return;
    const price = parseFloat(newVarPrice) || normalNum;
    setVariationsList([
      ...variationsList,
      { id: Date.now().toString(), name: newVarName.trim(), price, available: true },
    ]);
    setNewVarName('');
    setNewVarPrice('');
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdCatId(categories[0]?.id || '');
    setProdNormalPrice('36.00');
    setProdPromoPrice('29.00');
    setProdDesc('');
    setProdTags(['⭐ Mais Pedido']);
    setProdFeatured(false);
    setHasVariations(false);
    setHasScheduledPromo(false);
    setFormSubTab('MAIN');
    setMediaTab('PHOTO');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdCatId(prod.categoryId);
    setProdNormalPrice(prod.normalPrice.toFixed(2));
    setProdPromoPrice(prod.promotionalPrice ? prod.promotionalPrice.toFixed(2) : '');
    setProdDesc(prod.description);
    setProdTags(prod.tags || []);
    setProdFeatured(prod.isFeatured);
    setHasVariations(prod.hasVariations);
    setVariationsList(prod.variations || []);
    setHasScheduledPromo(prod.scheduledPromo?.enabled || false);
    setPromoDays(prod.scheduledPromo?.daysOfWeek || [1, 2, 3, 4]);
    setPromoStart(prod.scheduledPromo?.startTime || '17:00');
    setPromoEnd(prod.scheduledPromo?.endTime || '20:00');
    setPhotoUrl(prod.imageUrl || '');
    setVideoUrl(prod.videoUrl || '');
    setMediaTab(prod.mediaType);
    setFormSubTab('MAIN');
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName.trim()) {
      alert('O nome do produto é obrigatório.');
      return;
    }
    const selectedCategory = categories.find((c) => c.id === prodCatId) || categories[0];

    const productPayload: Omit<Product, 'id' | 'createdAt'> = {
      restaurantId: 'rest-1',
      categoryId: selectedCategory.id,
      categoryName: selectedCategory.name,
      name: prodName.trim(),
      description: prodDesc.trim(),
      normalPrice: normalNum,
      promotionalPrice: promoNum > 0 ? promoNum : undefined,
      imageUrl: photoUrl,
      videoUrl: videoUrl,
      mediaType: mediaTab,
      tags: prodTags,
      isFeatured: prodFeatured,
      isAvailable: true,
      hasVariations,
      variations: hasVariations ? variationsList : [],
      scheduledPromo: {
        enabled: hasScheduledPromo,
        daysOfWeek: promoDays,
        startTime: promoStart,
        endTime: promoEnd,
      },
      spin360: {
        enabled: true,
        mode: spinMode,
        orbitalImages: orbitalFrames,
        isAiGenerated: spinMode === 'C_AI_3D',
      },
    };

    if (editingProduct) {
      storageService.updateProduct(editingProduct.id, productPayload);
    } else {
      storageService.addProduct(productPayload);
      try {
        confetti({ particleCount: 40, spread: 50 });
      } catch {
        // catch confetti
      }
    }

    soundService.playSuccessChime();
    setShowProductModal(false);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    storageService.addCategory({
      restaurantId: 'rest-1',
      name: catName.trim(),
      description: catDesc.trim(),
    });
    setCatName('');
    setCatDesc('');
    setShowCategoryModal(false);
    soundService.playSuccessChime();
  };

  const handleDownloadTemplate = () => {
    const csvContent =
      'Nome do Produto,Categoria,Preco Normal,Preco Promocional,Descricao,Tags\n' +
      'Picanha na Chapa 500g,Petiscos & Porções,89.90,79.90,Acompanha farofa crocante e vinagrete da casa,Especial da Casa\n' +
      'Costelinha Barbecue,Petiscos & Porções,58.00,,Costelinha suína macia banhada em molho barbecue artesanal,Mais Pedido\n' +
      'Caipirinha de Limão Siciliano,Bebidas & Chopp,26.00,22.00,Cachaça artesanal envelhecida e limão siciliano,Artesanal\n';
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'modelo_cardapio_produtos.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSimulateSpreadsheetUpload = () => {
    setImportedRows([
      { name: 'Picanha na Chapa 500g', category: 'Petiscos & Porções', price: 79.9 },
      { name: 'Costelinha Barbecue', category: 'Petiscos & Porções', price: 58.0 },
      { name: 'Caipirinha de Limão Siciliano', category: 'Bebidas & Chopp', price: 22.0 },
      { name: 'Pudim de Leite Condensado', category: 'Sobremesas', price: 16.0 },
    ]);
    setWizardStep(2);
  };

  const handleFinishImport = () => {
    importedRows.forEach((row) => {
      let cat = categories.find((c) => c.name.toLowerCase() === row.category.toLowerCase());
      if (!cat) cat = categories[0];
      storageService.addProduct({
        restaurantId: 'rest-1',
        categoryId: cat.id,
        categoryName: cat.name,
        name: row.name,
        description: 'Item importado via integração em lote de planilha.',
        normalPrice: row.price,
        mediaType: 'PHOTO',
        imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
        tags: ['🆕 Novidade'],
        isFeatured: false,
        isAvailable: true,
        hasVariations: false,
        variations: [],
        scheduledPromo: { enabled: false, daysOfWeek: [], startTime: '', endTime: '' },
      });
    });
    soundService.playSuccessChime();
    setShowImportModal(false);
    setWizardStep(1);
    alert(`${importedRows.length} produtos importados com sucesso!`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#111318]">
            Cardápio Digital
          </h2>
          <p className="text-xs md:text-sm text-[#64748B] mt-1">
            Cadastre categorias, organize pratos e bebidas e controle itens disponíveis hoje.
          </p>
        </div>

        {/* Header Actions in Exact Audited Order */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              setWizardStep(1);
              setShowImportModal(true);
            }}
            className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Importar Planilha</span>
          </button>

          <button
            onClick={() => setShowCategoryModal(true)}
            className="px-3.5 py-2 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-800 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4 text-blue-600" />
            <span>Nova Categoria</span>
          </button>

          <button
            onClick={handleOpenNewProduct}
            className="px-4 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-all shadow-md shadow-[#EF003F]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Novo Produto</span>
          </button>
        </div>
      </div>

      {/* Main Subtabs: Produtos (N) and Categorias (N) */}
      <div className="flex items-center gap-6 border-b border-[#E5E7EB]">
        <button
          onClick={() => setActiveTab('PRODUCTS')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'PRODUCTS'
              ? 'border-[#EF003F] text-[#EF003F]'
              : 'border-transparent text-[#64748B] hover:text-[#111318]'
          }`}
        >
          <span>Produtos ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('CATEGORIES')}
          className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'CATEGORIES'
              ? 'border-[#EF003F] text-[#EF003F]'
              : 'border-transparent text-[#64748B] hover:text-[#111318]'
          }`}
        >
          <span>Categorias ({categories.length})</span>
        </button>
      </div>

      {/* PRODUCTS TAB */}
      {activeTab === 'PRODUCTS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((prod) => {
            const hasDiscount =
              prod.promotionalPrice && prod.promotionalPrice < prod.normalPrice;

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-[#E5E7EB] p-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-gray-100 mb-3">
                    <img
                      src={prod.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'}
                      alt={prod.name}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#111318]/80 text-white backdrop-blur-xs">
                        {prod.categoryName}
                      </span>
                      {prod.isFeatured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5" />
                          Destaque
                        </span>
                      )}
                    </div>

                    {prod.mediaType === 'VIDEO' && (
                      <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-600 text-white flex items-center gap-1 shadow-sm">
                        <Video className="w-3 h-3" />
                        Reels
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mb-2">
                    <h4 className="font-extrabold text-base text-[#111318] line-clamp-1">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-[#64748B] line-clamp-2">
                      {prod.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {prod.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-rose-50 text-[#EF003F] border border-rose-100"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5E7EB] flex items-center justify-between">
                  <div>
                    {hasDiscount ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-emerald-600">
                          {formatBRL(prod.promotionalPrice!)}
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {formatBRL(prod.normalPrice)}
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-black text-[#111318]">
                        {formatBRL(prod.normalPrice)}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditProduct(prod)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-[#111318] hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Editar prato"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Excluir ${prod.name}?`)) {
                          storageService.deleteProduct(prod.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Excluir prato"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'CATEGORIES' && (
        <div className="bg-white rounded-3xl border border-[#E5E7EB] overflow-hidden shadow-xs">
          <div className="divide-y divide-[#E5E7EB]">
            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              return (
                <div
                  key={cat.id}
                  className="p-4 md:px-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-rose-50 text-[#EF003F] flex items-center justify-center font-black">
                      {cat.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-[#111318]">
                        {cat.name}
                      </h4>
                      <p className="text-xs text-[#64748B]">
                        {cat.description || 'Sem descrição cadastrada'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-[#111318]">
                      {count} {count === 1 ? 'produto' : 'produtos'}
                    </span>
                    <button
                      onClick={() => {
                        if (count > 0) {
                          alert('Mova ou exclua os produtos desta categoria antes de removê-la.');
                          return;
                        }
                        if (window.confirm(`Excluir categoria "${cat.name}"?`)) {
                          storageService.deleteCategory(cat.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL CADASTRAR / EDITAR NOVO PRATO (2-COLUMNS WITH 9:16 MEDIA STUDIO) */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-5xl w-full shadow-2xl border border-gray-100 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-4 md:px-6 border-b border-[#E5E7EB] flex items-start justify-between">
              <div>
                <h3 className="text-lg md:text-xl font-black text-[#111318]">
                  {editingProduct ? 'Editar Prato' : 'Cadastrar Novo Prato'}
                </h3>
                <p className="text-xs text-[#64748B]">
                  Cadastre pratos, porções, bebidas e personalize fotos e vídeos verticais para o cardápio digital.
                </p>
              </div>
              <button
                onClick={() => setShowProductModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Two-Column Body with internal scrolling */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Forms (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {/* 3 Horizontal Subtabs */}
                <div className="flex items-center gap-2 p-1 bg-[#F7F8FA] rounded-2xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setFormSubTab('MAIN')}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formSubTab === 'MAIN'
                        ? 'bg-[#EF003F] text-white shadow-2xs'
                        : 'text-[#64748B] hover:text-[#111318]'
                    }`}
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>DADOS PRINCIPAIS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSubTab('VARIATIONS')}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formSubTab === 'VARIATIONS'
                        ? 'bg-[#EF003F] text-white shadow-2xs'
                        : 'text-[#64748B] hover:text-[#111318]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>VARIAÇÕES</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormSubTab('PROMO')}
                    className={`flex-1 py-2 px-2.5 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      formSubTab === 'PROMO'
                        ? 'bg-[#EF003F] text-white shadow-2xs'
                        : 'text-[#64748B] hover:text-[#111318]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>PROMOÇÃO</span>
                  </button>
                </div>

                {/* TAB 1: DADOS PRINCIPAIS */}
                {formSubTab === 'MAIN' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-[#111318] block mb-1">
                        Nome do Produto
                      </label>
                      <input
                        type="text"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        placeholder="Ex: Hambúrguer da Casa, Picanha na Chapa, Chopp 500ml"
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-[#111318] block mb-1">
                        Categoria no Cardápio
                      </label>
                      <select
                        value={prodCatId}
                        onChange={(e) => setProdCatId(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Normal and Promotional side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#111318] block mb-1">
                          Preço Normal (R$)
                        </label>
                        <input
                          type="text"
                          value={prodNormalPrice}
                          onChange={(e) => setProdNormalPrice(e.target.value)}
                          placeholder="36.00"
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#111318] block mb-1">
                          Preço Promocional (Opcional)
                        </label>
                        <input
                          type="text"
                          value={prodPromoPrice}
                          onChange={(e) => setProdPromoPrice(e.target.value)}
                          placeholder="29.00"
                          className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-emerald-600"
                        />
                      </div>
                    </div>

                    {/* Discount feedback message */}
                    {discountData && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
                        <span>🎉 Promoção ativa: {discountData.percentage}% de desconto</span>
                        <span>Economia de {formatBRL(discountData.savings)} para o cliente</span>
                      </div>
                    )}

                    {/* Description with live character counter */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold text-[#111318]">
                          Descrição Detalhada do Prato
                        </label>
                        <span className="text-[10px] text-[#64748B]">
                          {prodDesc.length} caracteres
                        </span>
                      </div>
                      <textarea
                        rows={3}
                        value={prodDesc}
                        onChange={(e) => setProdDesc(e.target.value)}
                        placeholder="Descreva os ingredientes, acompanhamentos e modo de preparo..."
                        className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                      />
                    </div>

                    {/* Food tags & badges */}
                    <div>
                      <label className="text-xs font-bold text-[#111318] block mb-1.5">
                        Tags e Selos Alimentares
                      </label>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {defaultTagOptions.map((tag) => {
                          const isSelected = prodTags.includes(tag);
                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => handleToggleTag(tag)}
                              className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1 ${
                                isSelected
                                  ? 'border-[#EF003F] bg-rose-50 text-[#EF003F]'
                                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-[#EF003F]" />}
                              {tag}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom tag addition */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCustomTag();
                            }
                          }}
                          placeholder="Outra tag personalizada (pressione Enter)"
                          className="flex-1 p-2 rounded-xl border border-gray-300 text-xs"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomTag}
                          className="px-3 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold cursor-pointer"
                        >
                          Adicionar
                        </button>
                      </div>
                    </div>

                    {/* Featured Checkbox */}
                    <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="featured-check"
                        checked={prodFeatured}
                        onChange={(e) => setProdFeatured(e.target.checked)}
                        className="mt-0.5 rounded text-[#EF003F] focus:ring-[#EF003F] cursor-pointer"
                      />
                      <label htmlFor="featured-check" className="cursor-pointer">
                        <span className="text-xs font-bold text-[#111318] block">
                          Produto em Destaque no Cardápio
                        </span>
                        <span className="text-[11px] text-[#64748B] block mt-0.5">
                          Fixado no carrossel de topo do cardápio para gerar mais visibilidade e pedidos.
                        </span>
                      </label>
                    </div>

                    {/* Shortcuts to Variations and Promo */}
                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setFormSubTab('VARIATIONS')}
                        className="p-3 rounded-xl border border-gray-200 text-left hover:border-gray-300 transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-bold text-[#111318] flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#EF003F]" />
                          Variações do Produto
                        </span>
                        <span className="text-[10px] text-[#64748B] block mt-0.5">
                          Configurar por peso, tamanho ou tipo
                        </span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormSubTab('PROMO')}
                        className="p-3 rounded-xl border border-gray-200 text-left hover:border-gray-300 transition-colors cursor-pointer"
                      >
                        <span className="text-xs font-bold text-[#111318] flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          Promoção Programada
                        </span>
                        <span className="text-[10px] text-[#64748B] block mt-0.5">
                          Configurar Happy Hour e dias específicos
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: VARIAÇÕES DO PRODUTO */}
                {formSubTab === 'VARIATIONS' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#111318]">
                          Este produto possui variações? (ex: tamanho, peso)
                        </h4>
                        <p className="text-[11px] text-[#64748B] mt-0.5">
                          Ative para cadastrar opções individuais com nomes e preços próprios.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasVariations(!hasVariations)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          hasVariations ? 'bg-[#EF003F]' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            hasVariations ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {hasVariations && (
                      <div className="space-y-3 pt-2">
                        <div className="space-y-2">
                          {variationsList.map((v, i) => (
                            <div
                              key={v.id || i}
                              className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between"
                            >
                              <div>
                                <span className="text-xs font-bold text-[#111318]">{v.name}</span>
                                <span className="text-xs font-black text-emerald-600 ml-2">
                                  {formatBRL(v.price)}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  setVariationsList(variationsList.filter((_, idx) => idx !== i))
                                }
                                className="text-gray-400 hover:text-rose-600 p-1 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Nome (ex: Grande 500g)"
                            value={newVarName}
                            onChange={(e) => setNewVarName(e.target.value)}
                            className="flex-1 p-2 rounded-lg border border-gray-300 text-xs"
                          />
                          <input
                            type="number"
                            placeholder="Preço (R$)"
                            value={newVarPrice}
                            onChange={(e) => setNewVarPrice(e.target.value)}
                            className="w-24 p-2 rounded-lg border border-gray-300 text-xs"
                          />
                          <button
                            type="button"
                            onClick={handleAddVariation}
                            className="px-3 py-2 rounded-lg bg-[#111318] text-white text-xs font-bold cursor-pointer"
                          >
                            + Adicionar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: PROMOÇÃO PROGRAMADA */}
                {formSubTab === 'PROMO' && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#111318]">
                          Ativar Promoção Programada (Happy Hour)?
                        </h4>
                        <p className="text-[11px] text-[#64748B] mt-0.5">
                          O preço especial entrará e sairá do ar automaticamente nos dias e horários selecionados.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setHasScheduledPromo(!hasScheduledPromo)}
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                          hasScheduledPromo ? 'bg-amber-600' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                            hasScheduledPromo ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    {hasScheduledPromo && (
                      <div className="space-y-4 pt-2">
                        <div>
                          <label className="text-xs font-bold text-[#111318] block mb-1.5">
                            Dias de Vigência da Promoção
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              { day: 0, label: 'Dom' },
                              { day: 1, label: 'Seg' },
                              { day: 2, label: 'Ter' },
                              { day: 3, label: 'Qua' },
                              { day: 4, label: 'Qui' },
                              { day: 5, label: 'Sex' },
                              { day: 6, label: 'Sáb' },
                            ].map((d) => {
                              const isChecked = promoDays.includes(d.day);
                              return (
                                <button
                                  key={d.day}
                                  type="button"
                                  onClick={() => {
                                    if (isChecked) {
                                      setPromoDays(promoDays.filter((x) => x !== d.day));
                                    } else {
                                      setPromoDays([...promoDays, d.day]);
                                    }
                                  }}
                                  className={`w-10 h-9 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                                    isChecked
                                      ? 'border-amber-600 bg-amber-600 text-white'
                                      : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                  }`}
                                >
                                  {d.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-bold text-[#111318] block mb-1">
                              Horário de Início
                            </label>
                            <input
                              type="time"
                              value={promoStart}
                              onChange={(e) => setPromoStart(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-[#111318] block mb-1">
                              Horário de Término
                            </label>
                            <input
                              type="time"
                              value={promoEnd}
                              onChange={(e) => setPromoEnd(e.target.value)}
                              className="w-full p-2.5 rounded-xl border border-gray-300 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: STUDIO DE MÍDIAS (9:16) (5 cols) */}
              <div className="lg:col-span-5 bg-gray-50 rounded-3xl p-4 border border-gray-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black text-[#111318] tracking-tight">
                      STUDIO DE MÍDIAS (9:16)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-rose-100 text-[#EF003F]">
                      Stories & Reels
                    </span>
                  </div>

                  {/* Segmented Control Foto Vertical vs Vídeo Reels */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-2xl border border-gray-200 mb-4">
                    <button
                      type="button"
                      onClick={() => setMediaTab('PHOTO')}
                      className={`py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        mediaTab === 'PHOTO'
                          ? 'bg-[#EF003F] text-white shadow-2xs'
                          : 'text-[#64748B] hover:text-[#111318]'
                      }`}
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Foto Vertical</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMediaTab('VIDEO')}
                      className={`py-1.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                        mediaTab === 'VIDEO'
                          ? 'bg-[#EF003F] text-white shadow-2xs'
                          : 'text-[#64748B] hover:text-[#111318]'
                      }`}
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Vídeo Reels</span>
                    </button>
                  </div>

                  {/* Smartphone 9:16 Frame Live Preview */}
                  <div className="w-56 mx-auto aspect-9/16 rounded-3xl bg-[#111318] border-4 border-[#252A35] shadow-xl overflow-hidden relative flex flex-col justify-between p-3 text-white">
                    {/* Media background layer */}
                    {mediaTab === 'PHOTO' ? (
                      <div className="absolute inset-0 z-0">
                        {spinMode === 'B_ORBITAL_SPIN' ? (
                          <img
                            src={orbitalFrames[orbitalFrameIndex]}
                            alt="Preview 360"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <img
                            src={photoUrl || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80'}
                            alt="Preview Foto"
                            className="w-full h-full object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40" />
                      </div>
                    ) : (
                      <div className="absolute inset-0 z-0 bg-[#0B0F19] flex items-center justify-center">
                        {videoUrl ? (
                          <div className="w-full h-full flex items-center justify-center relative">
                            <video
                              src={videoUrl}
                              autoPlay={isPlayingVideo}
                              muted={isVideoMuted}
                              loop
                              playsInline
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30" />
                          </div>
                        ) : (
                          <div className="text-center p-4">
                            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-[#EF003F] flex items-center justify-center mx-auto mb-2">
                              <Video className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-bold text-white">Nenhum vídeo carregado</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              Grave até 10 segundos na vertical para encantar seus clientes.
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Top overlay inside phone frame */}
                    <div className="relative z-10 flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs">
                        9:16 STORIES
                      </span>
                      {mediaTab === 'VIDEO' && videoUrl && (
                        <button
                          type="button"
                          onClick={() => setIsVideoMuted(!isVideoMuted)}
                          className="p-1 rounded-full bg-black/50 text-white backdrop-blur-xs cursor-pointer"
                        >
                          {isVideoMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                        </button>
                      )}
                    </div>

                    {/* 360 Spin Mode controls overlay */}
                    {mediaTab === 'PHOTO' && (
                      <div className="relative z-10 my-auto text-center">
                        {spinMode === 'B_ORBITAL_SPIN' && (
                          <div className="bg-black/50 backdrop-blur-xs p-1.5 rounded-xl inline-flex flex-col items-center">
                            <span className="text-[9px] font-bold text-white flex items-center gap-1">
                              <RotateCw className="w-3 h-3 text-[#EF003F] animate-spin" />
                              Giro 360° Ativo
                            </span>
                            <div className="flex gap-1 mt-1">
                              {orbitalFrames.map((_, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setOrbitalFrameIndex(idx)}
                                  className={`w-2 h-2 rounded-full cursor-pointer ${
                                    orbitalFrameIndex === idx ? 'bg-[#EF003F]' : 'bg-white/40'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom overlay inside phone frame */}
                    <div className="relative z-10 space-y-1">
                      <span className="text-[10px] font-bold text-white/80 block">
                        {categories.find((c) => c.id === prodCatId)?.name || 'Categoria'}
                      </span>
                      <h4 className="text-sm font-black text-white leading-tight line-clamp-1">
                        {prodName || 'Nome do Prato'}
                      </h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-emerald-400">
                          {formatBRL(promoNum > 0 ? promoNum : normalNum)}
                        </span>
                        {promoNum > 0 && promoNum < normalNum && (
                          <span className="text-[10px] text-gray-300 line-through">
                            {formatBRL(normalNum)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media Upload / Link Controls */}
                <div className="mt-4 space-y-2">
                  {mediaTab === 'PHOTO' ? (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <label className="flex-1 py-2 px-3 rounded-xl bg-white border border-gray-300 text-center text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[#EF003F]" />
                          <span>Carregar Foto Vertical (JPG, PNG)</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => setPhotoUrl(reader.result as string);
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500">ou link:</span>
                        <input
                          type="url"
                          value={photoUrl}
                          onChange={(e) => setPhotoUrl(e.target.value)}
                          placeholder="https://..."
                          className="flex-1 p-1.5 rounded-lg border border-gray-300 text-[11px] bg-white"
                        />
                        {photoUrl && (
                          <button
                            type="button"
                            onClick={() => setPhotoUrl('')}
                            className="p-1.5 text-gray-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* 360 Spin Mode Selector (Section 24) */}
                      <div className="mt-3 p-2.5 rounded-xl bg-white border border-gray-200">
                        <span className="text-[11px] font-bold text-[#111318] block mb-1">
                          Apresentação 360° & IA do Prato:
                        </span>
                        <div className="grid grid-cols-3 gap-1">
                          <button
                            type="button"
                            onClick={() => setSpinMode('A_VIDEO')}
                            className={`p-1 text-[10px] font-bold rounded-lg border cursor-pointer ${
                              spinMode === 'A_VIDEO'
                                ? 'border-[#EF003F] bg-rose-50 text-[#EF003F]'
                                : 'border-gray-200 text-gray-600'
                            }`}
                          >
                            Modo A: Foto
                          </button>
                          <button
                            type="button"
                            onClick={() => setSpinMode('B_ORBITAL_SPIN')}
                            className={`p-1 text-[10px] font-bold rounded-lg border cursor-pointer ${
                              spinMode === 'B_ORBITAL_SPIN'
                                ? 'border-[#EF003F] bg-rose-50 text-[#EF003F]'
                                : 'border-gray-200 text-gray-600'
                            }`}
                          >
                            Modo B: Giro 360°
                          </button>
                          <button
                            type="button"
                            onClick={() => setSpinMode('C_AI_3D')}
                            className={`p-1 text-[10px] font-bold rounded-lg border cursor-pointer ${
                              spinMode === 'C_AI_3D'
                                ? 'border-[#EF003F] bg-rose-50 text-[#EF003F]'
                                : 'border-gray-200 text-gray-600'
                            }`}
                          >
                            Modo C: 3D com IA
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="w-full py-2 px-3 rounded-xl bg-white border border-gray-300 text-center text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex items-center justify-center gap-1.5 mb-2">
                        <Upload className="w-3.5 h-3.5 text-rose-600" />
                        <span>Carregar Vídeo Vertical (MP4/MOV até 15s)</span>
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/quicktime"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const url = URL.createObjectURL(file);
                              setVideoUrl(url);
                            }
                          }}
                        />
                      </label>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-500">ou link:</span>
                        <input
                          type="url"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="YouTube Shorts ou link .mp4"
                          className="flex-1 p-1.5 rounded-lg border border-gray-300 text-[11px] bg-white"
                        />
                        {videoUrl && (
                          <button
                            type="button"
                            onClick={() => setVideoUrl('')}
                            className="p-1.5 text-gray-400 hover:text-rose-600 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Modal Footer with Green Dot Audited Text */}
            <div className="p-4 md:px-6 border-t border-[#E5E7EB] bg-[#F7F8FA] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-[#64748B]">
                  Cardápio atualizado em tempo real para os clientes nas mesas
                </span>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-100 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="px-5 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors shadow-sm cursor-pointer"
                >
                  {editingProduct ? 'Salvar Alterações' : 'Cadastrar Produto'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL NOVA CATEGORIA */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-black text-[#111318]">Nova Categoria</h3>
                <p className="text-xs text-[#64748B]">
                  Agrupe seus pratos e bebidas em seções claras.
                </p>
              </div>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 mt-3">
              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Nome da Categoria
                </label>
                <input
                  type="text"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Ex: Hambúrgueres, Bebidas, Sobremesas"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#111318] block mb-1">
                  Descrição (Opcional)
                </label>
                <input
                  type="text"
                  value={catDesc}
                  onChange={(e) => setCatDesc(e.target.value)}
                  placeholder="Ex: Aperitivos e porções artesanais"
                  className="w-full p-2.5 rounded-xl border border-gray-300 text-xs font-medium focus:ring-2 focus:ring-[#EF003F]"
                />
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
                >
                  Salvar Categoria
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IMPORTAR PRODUTOS DE PLANILHA (3-STEP WIZARD) */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in duration-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-[#111318]">
                  Importar Produtos de Planilha
                </h3>
                <p className="text-xs text-[#64748B]">
                  Carregue pratos e bebidas em lote de outros sistemas de forma rápida e inteligente.
                </p>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Wizard Horizontal 3 Steps Indicator */}
            <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#F7F8FA] rounded-2xl mb-6 border border-gray-200 text-center">
              <div
                className={`py-1.5 rounded-xl text-xs font-bold ${
                  wizardStep === 1
                    ? 'bg-[#EF003F] text-white shadow-2xs'
                    : 'text-[#64748B]'
                }`}
              >
                1 Arquivo
              </div>
              <div
                className={`py-1.5 rounded-xl text-xs font-bold ${
                  wizardStep === 2
                    ? 'bg-[#EF003F] text-white shadow-2xs'
                    : 'text-[#64748B]'
                }`}
              >
                2 Mapeamento
              </div>
              <div
                className={`py-1.5 rounded-xl text-xs font-bold ${
                  wizardStep === 3
                    ? 'bg-[#EF003F] text-white shadow-2xs'
                    : 'text-[#64748B]'
                }`}
              >
                3 Prévia & Confirmar
              </div>
            </div>

            {/* Step 1: File Upload */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div
                  onClick={handleSimulateSpreadsheetUpload}
                  className="border-2 border-dashed border-sky-300 rounded-3xl p-8 text-center bg-sky-50/40 hover:bg-sky-50/80 transition-colors cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform">
                    <FileSpreadsheet className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-[#111318]">
                    Arraste sua planilha aqui
                  </h4>
                  <p className="text-xs text-[#64748B] max-w-sm mx-auto mt-1 mb-4">
                    Compatível com planilhas exportadas de PDV, iFood, Saipos, Totvs ou planilha pessoal (.xlsx, .xls ou .csv).
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateSpreadsheetUpload();
                    }}
                    className="px-4 py-2 rounded-xl bg-[#EF003F] hover:bg-[#C90036] text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Escolher Arquivo do Computador
                  </button>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <p className="text-xs text-[#64748B]">
                    Não tem uma planilha pronta? Baixe nosso modelo de exemplo para começar.
                  </p>
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="px-3 py-1.5 rounded-xl border border-gray-300 text-gray-800 hover:bg-gray-200 text-xs font-bold transition-colors shrink-0 cursor-pointer"
                  >
                    Baixar Modelo (.xlsx)
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Column Mapping */}
            {wizardStep === 2 && (
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 text-blue-900 rounded-2xl text-xs font-medium border border-blue-100">
                  Colunas identificadas com sucesso! Verifique o de-para dos campos:
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="font-bold">Coluna "Nome do Produto"</span>
                    <span className="text-emerald-700 font-semibold">→ Nome do Prato (OK)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="font-bold">Coluna "Categoria"</span>
                    <span className="text-emerald-700 font-semibold">→ Categoria (OK)</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50">
                    <span className="font-bold">Coluna "Preço Normal"</span>
                    <span className="text-emerald-700 font-semibold">→ Preço em BRL (OK)</span>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setWizardStep(1)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={() => setWizardStep(3)}
                    className="px-4 py-2 rounded-xl bg-[#EF003F] text-white text-xs font-bold"
                  >
                    Avançar para Prévia
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Preview & Confirm */}
            {wizardStep === 3 && (
              <div className="space-y-4">
                <div className="p-3 bg-emerald-50 text-emerald-900 rounded-2xl text-xs font-medium border border-emerald-100">
                  {importedRows.length} itens prontos para serem incluídos no cardápio:
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-gray-100 border rounded-2xl p-2 text-xs">
                  {importedRows.map((r, i) => (
                    <div key={i} className="py-2 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-[#111318]">{r.name}</span>
                        <span className="text-gray-500 ml-2">({r.category})</span>
                      </div>
                      <span className="font-bold text-emerald-600">{formatBRL(r.price)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    onClick={() => setWizardStep(2)}
                    className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleFinishImport}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                  >
                    Confirmar e Publicar Cardápio
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
