import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateDiscount,
  formatBRL,
  formatElapsedTime,
  generateRandomPin,
  validatePin,
  calculateHaversineDistance,
  isWithinGeofence,
  isRestaurantOpen,
} from './calculations.ts';
import type { DaySchedule } from '../types/index.ts';

test('calculateDiscount calculates percentage and savings correctly', () => {
  // Normal 36, Promotional 29 -> Savings 7, Discount 19%
  const result = calculateDiscount(36, 29);
  assert.notEqual(result, null);
  assert.equal(result?.percentage, 19);
  assert.equal(result?.savings, 7);

  // Normal 100, Promotional 50 -> 50%
  const resultHalf = calculateDiscount(100, 50);
  assert.equal(resultHalf?.percentage, 50);
  assert.equal(resultHalf?.savings, 50);

  // Invalid promotional price (greater than or equal to normal)
  assert.equal(calculateDiscount(30, 30), null);
  assert.equal(calculateDiscount(30, 40), null);
  assert.equal(calculateDiscount(30, 0), null);
  assert.equal(calculateDiscount(30, undefined), null);
});

test('formatBRL formats Brazilian currency string properly', () => {
  const formatted = formatBRL(29);
  assert.ok(formatted.includes('29,00'));
  assert.ok(formatted.includes('R$'));
});

test('formatElapsedTime converts seconds to readable human duration', () => {
  assert.equal(formatElapsedTime(0), '0s');
  assert.equal(formatElapsedTime(45), '45s');
  assert.equal(formatElapsedTime(125), '2m 5s');
  assert.equal(formatElapsedTime(3600), '1h 0m');
});

test('generateRandomPin produces 4 numeric digits preserving leading zeros', () => {
  for (let i = 0; i < 10; i++) {
    const pin = generateRandomPin();
    assert.equal(pin.length, 4);
    assert.ok(validatePin(pin));
  }
});

test('validatePin strictly requires 4 digits', () => {
  assert.equal(validatePin('1234'), true);
  assert.equal(validatePin('0001'), true);
  assert.equal(validatePin('9999'), true);
  assert.equal(validatePin('123'), false);
  assert.equal(validatePin('12345'), false);
  assert.equal(validatePin('abcd'), false);
  assert.equal(validatePin('12a4'), false);
});

test('calculateHaversineDistance calculates meters accurately', () => {
  // Point A and Point B in São Paulo (~500m apart)
  const lat1 = -23.55052;
  const lon1 = -46.633308;
  const lat2 = -23.55452;
  const lon2 = -46.633308;
  const dist = calculateHaversineDistance(lat1, lon1, lat2, lon2);
  assert.ok(dist > 400 && dist < 500);

  // Exact same point
  assert.equal(calculateHaversineDistance(lat1, lon1, lat1, lon1), 0);
});

test('isWithinGeofence identifies inside vs outside radius', () => {
  const centerLat = -23.55052;
  const centerLon = -46.633308;
  // Inside 250m
  assert.equal(isWithinGeofence(centerLat, centerLon, centerLat, centerLon, 250), true);
  // Outside 50m
  const farLat = -23.56052;
  assert.equal(isWithinGeofence(farLat, centerLon, centerLat, centerLon, 50), false);
});

test('isRestaurantOpen checks operating schedules', () => {
  const schedules: DaySchedule[] = [
    { dayName: 'Segunda-feira', dayIndex: 1, isClosed: false, openTime: '11:00', closeTime: '23:00' },
    { dayName: 'Terça-feira', dayIndex: 2, isClosed: true, openTime: '11:00', closeTime: '23:00' },
  ];

  // Monday at 14:00 (inside)
  const mondayOpen = new Date('2026-10-19T14:00:00'); // Oct 19 2026 is Monday
  assert.equal(isRestaurantOpen(schedules, mondayOpen).isOpen, true);

  // Monday at 08:00 (before open)
  const mondayEarly = new Date('2026-10-19T08:00:00');
  assert.equal(isRestaurantOpen(schedules, mondayEarly).isOpen, false);

  // Tuesday (closed day)
  const tuesday = new Date('2026-10-20T14:00:00');
  assert.equal(isRestaurantOpen(schedules, tuesday).isOpen, false);
});
