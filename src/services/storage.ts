import type {
  Call,
  Table,
  Category,
  Product,
  WifiNetwork,
  CustomButton,
  TeamMember,
  RestaurantSettings,
  Order,
} from '../types/index.ts';

const BROADCAST_CHANNEL_NAME = 'cardapio_digital_sync_channel';

// Initial default settings
const DEFAULT_SETTINGS: RestaurantSettings = {
  id: 'set-1',
  restaurantId: 'rest-1',
  name: 'Restaurante Sabor & Arte',
  primaryColor: '#EF003F',
  legalName: 'Sabor & Arte Gastronomia Ltda',
  taxId: '23.456.789/0001-10',
  contactEmail: 'contato@saborearte.com.br',
  contactPhone: '(11) 98765-4321',
  coverImageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  logoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
  welcomeTitle: 'Como podemos ajudar?',
  welcomeSubtitle: 'Toque em um dos botões abaixo para solicitar atendimento, pedir a conta ou ver nosso cardápio completo.',
  callReturnIntervalSeconds: 10,
  presenceMode: 'WIFI_OR_GPS',
  clientWifiSsid: 'Restaurante_Clientes_5G',
  clientWifiPassword: '',
  clientSessionDurationMinutes: 120,
  geofenceAddress: 'Av. Paulista, 1578 - Bela Vista, São Paulo - SP',
  geofenceLatitude: -23.561494,
  geofenceLongitude: -46.655881,
  geofenceRadiusMeters: 250,
  showUnavailableBadge: true,
  requireTvPin: false,
  tvPin: '1234',
  showTvActionButtons: true,
  tvPassiveMode: false,
  tvMoveToInProgressSeconds: 60,
  tvFinishAndReleaseSeconds: 180,
  emailConfirmed: false,
  trialDaysLeft: 7,
  plan: 'GRATUITO',
  schedules: [
    { dayName: 'Segunda-feira', dayIndex: 1, isClosed: false, openTime: '11:00', closeTime: '23:00' },
    { dayName: 'Terça-feira', dayIndex: 2, isClosed: false, openTime: '11:00', closeTime: '23:00' },
    { dayName: 'Quarta-feira', dayIndex: 3, isClosed: false, openTime: '11:00', closeTime: '23:00' },
    { dayName: 'Quinta-feira', dayIndex: 4, isClosed: false, openTime: '11:00', closeTime: '23:30' },
    { dayName: 'Sexta-feira', dayIndex: 5, isClosed: false, openTime: '11:00', closeTime: '00:00' },
    { dayName: 'Sábado', dayIndex: 6, isClosed: false, openTime: '11:30', closeTime: '00:30' },
    { dayName: 'Domingo', dayIndex: 0, isClosed: false, openTime: '11:30', closeTime: '22:00' },
  ],
};

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    restaurantId: 'rest-1',
    name: 'Hambúrgueres Artesanais',
    description: 'Blends especiais grelhados no fogo com pão brioche',
    sortOrder: 1,
    isActive: true,
    itemCount: 2,
  },
  {
    id: 'cat-2',
    restaurantId: 'rest-1',
    name: 'Petiscos & Porções',
    description: 'Perfeitos para compartilhar no salão ou no deck',
    sortOrder: 2,
    isActive: true,
    itemCount: 2,
  },
  {
    id: 'cat-3',
    restaurantId: 'rest-1',
    name: 'Bebidas & Chopp',
    description: 'Chopp artesanal trincando, drinks e refrigerantes',
    sortOrder: 3,
    isActive: true,
    itemCount: 2,
  },
  {
    id: 'cat-4',
    restaurantId: 'rest-1',
    name: 'Sobremesas',
    description: 'Finalizações doces irresistíveis',
    sortOrder: 4,
    isActive: true,
    itemCount: 1,
  },
];

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    restaurantId: 'rest-1',
    categoryId: 'cat-1',
    categoryName: 'Hambúrgueres Artesanais',
    name: 'Burger Grand Angus Cheddar',
    description: 'Hambúrguer angus 180g, cheddar inglês derretido, cebola caramelizada, bacon crocante no pão brioche artesanal tostado na manteiga.',
    normalPrice: 36.0,
    promotionalPrice: 29.0,
    imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    mediaType: 'PHOTO',
    tags: ['⭐ Mais Pedido', '👨‍🍳 Artesanal'],
    isFeatured: true,
    isAvailable: true,
    hasVariations: true,
    variations: [
      { id: 'var-1', name: 'Simples (180g)', price: 29.0, available: true },
      { id: 'var-2', name: 'Duplo (360g)', price: 39.0, available: true },
    ],
    scheduledPromo: {
      enabled: true,
      daysOfWeek: [1, 2, 3, 4],
      startTime: '17:00',
      endTime: '20:00',
    },
    spin360: {
      enabled: true,
      mode: 'B_ORBITAL_SPIN',
      orbitalImages: [
        'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=600&q=80',
      ],
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    restaurantId: 'rest-1',
    categoryId: 'cat-2',
    categoryName: 'Petiscos & Porções',
    name: 'Dadinhos de Tapioca com Geleia de Pimenta',
    description: 'Cubos dourados e crocantes de queijo coalho com tapioca granulada, acompanhados de redução caseira de pimenta dedo-de-moça.',
    normalPrice: 32.0,
    promotionalPrice: 28.0,
    imageUrl: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80',
    mediaType: 'PHOTO',
    tags: ['🌱 Vegetariano', '⭐ Mais Pedido'],
    isFeatured: true,
    isAvailable: true,
    hasVariations: false,
    variations: [],
    scheduledPromo: { enabled: false, daysOfWeek: [], startTime: '', endTime: '' },
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    restaurantId: 'rest-1',
    categoryId: 'cat-3',
    categoryName: 'Bebidas & Chopp',
    name: 'Chopp IPA Artesanal 500ml',
    description: 'Chopp lupulado fresco, notas cítricas e amargor equilibrado na caldereta trincando.',
    normalPrice: 18.0,
    imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=800&q=80',
    mediaType: 'PHOTO',
    tags: ['👨‍🍳 Artesanal'],
    isFeatured: false,
    isAvailable: true,
    hasVariations: true,
    variations: [
      { id: 'var-3', name: '300ml', price: 12.0, available: true },
      { id: 'var-4', name: '500ml', price: 18.0, available: true },
    ],
    scheduledPromo: { enabled: false, daysOfWeek: [], startTime: '', endTime: '' },
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_TABLES: Table[] = [
  {
    id: 'tab-1',
    restaurantId: 'rest-1',
    name: 'Mesa 01',
    number: 1,
    sector: 'Salão Principal',
    token: 'tk_98a7fbc2',
    qrUrl: window.location.origin + '/?view=client&mesa=1',
    isEditable: true,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tab-2',
    restaurantId: 'rest-1',
    name: 'Mesa 02',
    number: 2,
    sector: 'Deck',
    token: 'tk_41e8c9d0',
    qrUrl: window.location.origin + '/?view=client&mesa=2',
    isEditable: true,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_BUTTONS: CustomButton[] = [
  {
    id: 'btn-1',
    restaurantId: 'rest-1',
    label: 'Ver cardápio',
    actionType: 'MENU',
    requiresWifi: false,
    icon: 'book',
    sortOrder: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'btn-2',
    restaurantId: 'rest-1',
    label: 'Chamar Garçom Especial',
    actionType: 'CALL',
    requiresWifi: true,
    icon: 'bell',
    sortOrder: 2,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'btn-3',
    restaurantId: 'rest-1',
    label: 'Pedido de Conta',
    actionType: 'BILL_REQUEST',
    requiresWifi: true,
    icon: 'credit-card',
    sortOrder: 3,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'btn-4',
    restaurantId: 'rest-1',
    label: 'Siga no Instagram',
    actionType: 'EXTERNAL_LINK',
    url: 'https://instagram.com/',
    requiresWifi: false,
    icon: 'link',
    sortOrder: 4,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: 'team-1',
    restaurantId: 'rest-1',
    name: 'Carlos Oliveira (Proprietário)',
    email: 'carlos@saborearte.com.br',
    role: 'OWNER',
    pin: '1234',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-2',
    restaurantId: 'rest-1',
    name: 'Mariana Lima',
    email: 'mariana.gerente@saborearte.com.br',
    role: 'MANAGER',
    pin: '5678',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'team-3',
    restaurantId: 'rest-1',
    name: 'Lucas Santos',
    email: 'lucas.atendimento@saborearte.com.br',
    role: 'STAFF',
    pin: '4321',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_WIFI: WifiNetwork[] = [
  {
    id: 'wifi-1',
    restaurantId: 'rest-1',
    name: 'Wi-Fi Principal Restaurante',
    ssid: 'Restaurante_Clientes_5G',
    publicIpRange: '189.40.120.0/24',
    isActive: true,
    notes: 'Roteador MikroTik Salão e Deck',
    createdAt: new Date().toISOString(),
  },
];

class StorageService {
  private channel: BroadcastChannel | null = null;
  private listeners: Array<() => void> = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this.channel.onmessage = () => {
        this.notifyListeners();
      };
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', () => {
        this.notifyListeners();
      });
    }
  }

  public subscribe(callback: () => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }

  private broadcastChange() {
    this.notifyListeners();
    if (this.channel) {
      try {
        this.channel.postMessage({ type: 'SYNC_UPDATE', timestamp: Date.now() });
      } catch {
        // channel error catch
      }
    }
  }

  private getItem<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const stored = localStorage.getItem(key);
      if (!stored) {
        localStorage.setItem(key, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return JSON.parse(stored);
    } catch {
      return defaultValue;
    }
  }

  private setItem<T>(key: string, value: T) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      this.broadcastChange();
    } catch {
      // localStorage quota or private mode catch
    }
  }

  // Settings
  public getSettings(): RestaurantSettings {
    return this.getItem<RestaurantSettings>('cd_settings', DEFAULT_SETTINGS);
  }

  public updateSettings(updates: Partial<RestaurantSettings>): RestaurantSettings {
    const current = this.getSettings();
    const updated = { ...current, ...updates };
    this.setItem('cd_settings', updated);
    return updated;
  }

  // Tables
  public getTables(): Table[] {
    return this.getItem<Table[]>('cd_tables', DEFAULT_TABLES);
  }

  public addTable(tableData: Omit<Table, 'id' | 'createdAt' | 'token' | 'qrUrl' | 'isEditable'>): Table {
    const tables = this.getTables();
    const randomHex = Math.random().toString(16).substring(2, 10);
    const newTable: Table = {
      ...tableData,
      id: `tab-${Date.now()}`,
      token: `tk_${randomHex}`,
      qrUrl: `${window.location.origin}/?view=client&mesa=${tableData.number}`,
      isEditable: true,
      createdAt: new Date().toISOString(),
    };
    tables.push(newTable);
    this.setItem('cd_tables', tables);
    return newTable;
  }

  public updateTable(id: string, updates: Partial<Table>): Table | null {
    const tables = this.getTables();
    const index = tables.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tables[index] = { ...tables[index], ...updates };
    this.setItem('cd_tables', tables);
    return tables[index];
  }

  public deleteTable(id: string): boolean {
    const tables = this.getTables();
    const filtered = tables.filter((t) => t.id !== id);
    if (filtered.length === tables.length) return false;
    this.setItem('cd_tables', filtered);
    return true;
  }

  // Categories
  public getCategories(): Category[] {
    return this.getItem<Category[]>('cd_categories', DEFAULT_CATEGORIES);
  }

  public addCategory(catData: Omit<Category, 'id' | 'sortOrder' | 'isActive'>): Category {
    const categories = this.getCategories();
    const newCat: Category = {
      ...catData,
      id: `cat-${Date.now()}`,
      sortOrder: categories.length + 1,
      isActive: true,
      itemCount: 0,
    };
    categories.push(newCat);
    this.setItem('cd_categories', categories);
    return newCat;
  }

  public deleteCategory(id: string): boolean {
    const categories = this.getCategories();
    const filtered = categories.filter((c) => c.id !== id);
    this.setItem('cd_categories', filtered);
    return true;
  }

  // Products
  public getProducts(): Product[] {
    return this.getItem<Product[]>('cd_products', DEFAULT_PRODUCTS);
  }

  public addProduct(productData: Omit<Product, 'id' | 'createdAt'>): Product {
    const products = this.getProducts();
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    this.setItem('cd_products', products);

    // Update category itemCount
    const categories = this.getCategories();
    const cat = categories.find((c) => c.id === newProduct.categoryId);
    if (cat) {
      cat.itemCount = (cat.itemCount || 0) + 1;
      this.setItem('cd_categories', categories);
    }

    return newProduct;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const products = this.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...updates };
    this.setItem('cd_products', products);
    return products[index];
  }

  public deleteProduct(id: string): boolean {
    const products = this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    this.setItem('cd_products', filtered);
    return true;
  }

  // Calls
  public getCalls(): Call[] {
    return this.getItem<Call[]>('cd_calls', []);
  }

  public createCall(
    tableNumber: string,
    tableName: string,
    sector: string,
    type: 'CALL' | 'BILL_REQUEST' | 'WATER' | 'HELP',
    typeLabel: string,
    billPaymentMethod?: 'PIX' | 'CARD' | 'CASH'
  ): Call {
    const calls = this.getCalls();
    const newCall: Call = {
      id: `call-${Date.now()}`,
      restaurantId: 'rest-1',
      tableId: `tab-${tableNumber}`,
      tableNumber,
      tableName,
      sector,
      type,
      typeLabel,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      billPaymentMethod,
    };
    // Prepend to top
    calls.unshift(newCall);
    this.setItem('cd_calls', calls);
    return newCall;
  }

  public updateCallStatus(
    callId: string,
    status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED',
    staffName?: string
  ): Call | null {
    const calls = this.getCalls();
    const index = calls.findIndex((c) => c.id === callId);
    if (index === -1) return null;

    const call = calls[index];
    call.status = status;
    if (status === 'IN_PROGRESS') {
      call.startedAt = new Date().toISOString();
      if (staffName) call.assignedStaffName = staffName;
    } else if (status === 'COMPLETED' || status === 'CANCELLED') {
      call.completedAt = new Date().toISOString();
    }

    this.setItem('cd_calls', calls);
    return call;
  }

  // Custom Buttons
  public getButtons(): CustomButton[] {
    return this.getItem<CustomButton[]>('cd_buttons', DEFAULT_BUTTONS);
  }

  public addButton(buttonData: Omit<CustomButton, 'id' | 'createdAt' | 'sortOrder'>): CustomButton {
    const buttons = this.getButtons();
    const newBtn: CustomButton = {
      ...buttonData,
      id: `btn-${Date.now()}`,
      sortOrder: buttons.length + 1,
      createdAt: new Date().toISOString(),
    };
    buttons.push(newBtn);
    this.setItem('cd_buttons', buttons);
    return newBtn;
  }

  public updateButton(id: string, updates: Partial<CustomButton>): CustomButton | null {
    const buttons = this.getButtons();
    const idx = buttons.findIndex((b) => b.id === id);
    if (idx === -1) return null;
    buttons[idx] = { ...buttons[idx], ...updates };
    this.setItem('cd_buttons', buttons);
    return buttons[idx];
  }

  public deleteButton(id: string): boolean {
    const buttons = this.getButtons();
    const filtered = buttons.filter((b) => b.id !== id);
    this.setItem('cd_buttons', filtered);
    return true;
  }

  // Team
  public getTeam(): TeamMember[] {
    return this.getItem<TeamMember[]>('cd_team', DEFAULT_TEAM);
  }

  public addTeamMember(memberData: Omit<TeamMember, 'id' | 'createdAt'>): TeamMember {
    const team = this.getTeam();
    const newMember: TeamMember = {
      ...memberData,
      id: `team-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    team.push(newMember);
    this.setItem('cd_team', team);
    return newMember;
  }

  public updateTeamMember(id: string, updates: Partial<TeamMember>): TeamMember | null {
    const team = this.getTeam();
    const index = team.findIndex((t) => t.id === id);
    if (index === -1) return null;
    team[index] = { ...team[index], ...updates };
    this.setItem('cd_team', team);
    return team[index];
  }

  public deleteTeamMember(id: string): boolean {
    const team = this.getTeam();
    const filtered = team.filter((t) => t.id !== id);
    this.setItem('cd_team', filtered);
    return true;
  }

  // Wi-Fi
  public getWifiNetworks(): WifiNetwork[] {
    return this.getItem<WifiNetwork[]>('cd_wifi', DEFAULT_WIFI);
  }

  public addWifiNetwork(netData: Omit<WifiNetwork, 'id' | 'createdAt'>): WifiNetwork {
    const nets = this.getWifiNetworks();
    const newNet: WifiNetwork = {
      ...netData,
      id: `wifi-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    nets.push(newNet);
    this.setItem('cd_wifi', nets);
    return newNet;
  }

  public deleteWifiNetwork(id: string): boolean {
    const nets = this.getWifiNetworks();
    const filtered = nets.filter((n) => n.id !== id);
    this.setItem('cd_wifi', filtered);
    return true;
  }

  // Orders
  public getOrders(): Order[] {
    return this.getItem<Order[]>('cd_orders', []);
  }

  public createOrder(tableNumber: string, tableName: string, items: Order['items'], subtotal: number): Order {
    const orders = this.getOrders();
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      restaurantId: 'rest-1',
      tableNumber,
      tableName,
      items,
      subtotal,
      createdAt: new Date().toISOString(),
      status: 'PREPARING',
    };
    orders.unshift(newOrder);
    this.setItem('cd_orders', orders);
    return newOrder;
  }
}

export const storageService = new StorageService();
