import type { DaySchedule } from '../types/index.ts';

/**
 * Calculates promotion discount and savings.
 * Returns null if no promotional price or if promotional price is >= normal price.
 */
export function calculateDiscount(
  normalPrice: number,
  promotionalPrice?: number
): { percentage: number; savings: number } | null {
  if (
    promotionalPrice === undefined ||
    promotionalPrice === null ||
    promotionalPrice <= 0 ||
    promotionalPrice >= normalPrice
  ) {
    return null;
  }
  const savings = Math.max(0, normalPrice - promotionalPrice);
  const percentage = Math.round((savings / normalPrice) * 100);
  return { percentage, savings };
}

/**
 * Formats a numeric value to Brazilian Real currency string.
 */
export function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * Formats elapsed seconds into readable display ("0s", "45s", "2m 15s", "1h 10m").
 */
export function formatElapsedTime(seconds: number): string {
  if (seconds < 0) return '0s';
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  if (minutes < 60) {
    return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Generates a 4-digit numeric string for hall PIN, preserving leading zeros.
 */
export function generateRandomPin(): string {
  // Use crypto for unguessable random numbers
  const array = new Uint16Array(1);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
    const num = array[0] % 10000;
    return num.toString().padStart(4, '0');
  }
  const fallback = Math.floor(Math.random() * 10000);
  return fallback.toString().padStart(4, '0');
}

/**
 * Validates that a PIN is composed of strictly 4 digits.
 */
export function validatePin(pin: string): boolean {
  return /^\d{4}$/.test(pin.trim());
}

/**
 * Generates a secure random password with alphanumeric and special characters.
 */
export function generateStrongPassword(length = 12): string {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%&*';
  let result = '';
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const values = new Uint8Array(length);
    crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += chars[values[i] % chars.length];
    }
    return result;
  }
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Calculates geodesic distance between two latitude/longitude points in meters (Haversine formula).
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Checks if user is within the geofence radius.
 */
export function isWithinGeofence(
  userLat: number,
  userLon: number,
  targetLat: number,
  targetLon: number,
  radiusMeters: number
): boolean {
  const distance = calculateHaversineDistance(userLat, userLon, targetLat, targetLon);
  return distance <= radiusMeters;
}

/**
 * Checks if the establishment is currently open according to the 7-day schedule.
 */
export function isRestaurantOpen(
  schedules: DaySchedule[],
  currentDate = new Date()
): { isOpen: boolean; message: string } {
  if (!schedules || schedules.length === 0) {
    return { isOpen: true, message: 'Aberto agora' };
  }

  const currentDayIndex = currentDate.getDay(); // 0 is Sunday
  const todaySchedule = schedules.find((s) => s.dayIndex === currentDayIndex);

  if (!todaySchedule || todaySchedule.isClosed) {
    return { isOpen: false, message: 'Fechado hoje' };
  }

  const [openHour, openMin] = todaySchedule.openTime.split(':').map(Number);
  const [closeHour, closeMin] = todaySchedule.closeTime.split(':').map(Number);

  const currentMinutes = currentDate.getHours() * 60 + currentDate.getMinutes();
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;

  // Handle midnight cross e.g. 18:00 to 02:00
  if (closeMinutes < openMinutes) {
    if (currentMinutes >= openMinutes || currentMinutes <= closeMinutes) {
      return { isOpen: true, message: `Aberto até ${todaySchedule.closeTime}` };
    }
  } else {
    if (currentMinutes >= openMinutes && currentMinutes <= closeMinutes) {
      return { isOpen: true, message: `Aberto até ${todaySchedule.closeTime}` };
    }
  }

  return { isOpen: false, message: `Fechado agora (Abre às ${todaySchedule.openTime})` };
}
