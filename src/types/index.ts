export type UserRole = 'OWNER' | 'MANAGER' | 'STAFF';

export type CallStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export type CallType = 'CALL' | 'BILL_REQUEST' | 'WATER' | 'HELP';

export interface Call {
  id: string;
  restaurantId: string;
  tableId: string;
  tableNumber: string;
  tableName: string;
  sector: string;
  type: CallType;
  typeLabel: string;
  status: CallStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  assignedStaffId?: string;
  assignedStaffName?: string;
  notes?: string;
  billPaymentMethod?: 'PIX' | 'CARD' | 'CASH';
}

export interface Table {
  id: string;
  restaurantId: string;
  name: string;
  number: number;
  sector: string;
  token: string;
  qrUrl: string;
  isEditable: boolean;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  sortOrder: number;
  isActive: boolean;
  itemCount?: number;
}

export interface ProductVariation {
  id: string;
  name: string;
  price: number;
  available: boolean;
}

export interface ScheduledPromotion {
  enabled: boolean;
  daysOfWeek: number[]; // 0=Sunday, 1=Monday, etc.
  startTime: string; // "17:00"
  endTime: string; // "20:00"
}

export interface Product360Asset {
  enabled: boolean;
  mode: 'A_VIDEO' | 'B_ORBITAL_SPIN' | 'C_AI_3D';
  orbitalImages: string[];
  aiModelName?: string;
  isAiGenerated?: boolean;
}

export interface Product {
  id: string;
  restaurantId: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  normalPrice: number; // in cents or float
  promotionalPrice?: number;
  imageUrl?: string;
  videoUrl?: string;
  mediaType: 'PHOTO' | 'VIDEO';
  tags: string[];
  isFeatured: boolean;
  isAvailable: boolean;
  hasVariations: boolean;
  variations: ProductVariation[];
  scheduledPromo: ScheduledPromotion;
  spin360?: Product360Asset;
  createdAt: string;
}

export interface WifiNetwork {
  id: string;
  restaurantId: string;
  name: string;
  ssid: string;
  publicIpRange: string;
  isActive: boolean;
  notes?: string;
  createdAt: string;
}

export type ButtonActionType = 'EXTERNAL_LINK' | 'CALL' | 'BILL_REQUEST' | 'MENU';

export interface CustomButton {
  id: string;
  restaurantId: string;
  label: string;
  actionType: ButtonActionType;
  url?: string;
  requiresWifi: boolean;
  icon: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  restaurantId: string;
  name: string;
  email: string;
  role: UserRole;
  pin: string; // 4 digits
  passwordHash?: string;
  createdAt: string;
}

export type PresenceMode = 'BASIC' | 'WIFI_ONLY' | 'WIFI_OR_GPS' | 'STRICT';

export interface DaySchedule {
  dayName: string;
  dayIndex: number; // 0=Sun, 1=Mon, etc.
  isClosed: boolean;
  openTime: string; // "11:00"
  closeTime: string; // "23:00"
}

export interface RestaurantSettings {
  id: string;
  restaurantId: string;
  name: string;
  primaryColor: string; // Hex e.g. #EF003F
  legalName: string;
  taxId: string; // CPF or CNPJ
  contactEmail: string;
  contactPhone: string;
  coverImageUrl: string;
  logoUrl: string;
  welcomeTitle: string; // max 60
  welcomeSubtitle: string; // max 180
  callReturnIntervalSeconds: number; // 10, 15, 30, 60
  presenceMode: PresenceMode;
  clientWifiSsid: string;
  clientWifiPassword?: string;
  clientSessionDurationMinutes: number;
  geofenceAddress: string;
  geofenceLatitude: number;
  geofenceLongitude: number;
  geofenceRadiusMeters: number; // 50, 100, 150, 250
  showUnavailableBadge: boolean;
  requireTvPin: boolean;
  tvPin: string; // 4 digits
  showTvActionButtons: boolean;
  tvPassiveMode: boolean;
  tvMoveToInProgressSeconds: number;
  tvFinishAndReleaseSeconds: number;
  schedules: DaySchedule[];
  emailConfirmed: boolean;
  trialDaysLeft: number;
  plan: 'GRATUITO' | 'PRO' | 'BUSINESS';
}

export interface CartItem {
  product: Product;
  variation?: ProductVariation;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  restaurantId: string;
  tableNumber: string;
  tableName: string;
  items: CartItem[];
  subtotal: number;
  createdAt: string;
  status: 'PENDING' | 'PREPARING' | 'DELIVERED';
}
