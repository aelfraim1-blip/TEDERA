import { BarangayData, BarangayComputed } from '../types';

export const HISTORICAL_TOTAL = 191;
export const HISTORICAL_POSITIVE = 84;
export const HISTORICAL_NEGATIVE = 107;
export const HISTORICAL_RATE = 44.0;

export const INITIAL_BARANGAYS: BarangayData[] = [
  {
    id: 'mambucal',
    name: 'Barangay Mambucal, Koronadal City',
    total: 18,
    rate: 55.6,
    lat: 6.4973963,
    lng: 124.8471625,
  },
  {
    id: 'paraiso',
    name: 'Barangay Paraiso, Koronadal City',
    total: 165,
    rate: 41.2,
    lat: 6.4961387,
    lng: 124.840347,
  },
  {
    id: 'zone-iv',
    name: 'Barangay Zone IV, Koronadal City',
    total: 8,
    rate: 75.0,
    lat: 6.4999231,
    lng: 124.8351048,
  },
  {
    id: 'gps',
    name: 'Barangay Gen. Paulino Santos (GPS), Koronadal City',
    total: 14,
    rate: 48.2,
    lat: 6.4912000,
    lng: 124.8425000,
  },
  {
    id: 'zone-i',
    name: 'Barangay Zone I, Koronadal City',
    total: 11,
    rate: 36.4,
    lat: 6.5021000,
    lng: 124.8450000,
  },
  {
    id: 'morales',
    name: 'Barangay Morales, Koronadal City',
    total: 9,
    rate: 33.3,
    lat: 6.4880000,
    lng: 124.8510000,
  }
];

export function projectCases(value: number, years: number): number {
  return Math.round(value * Math.pow(1.05, years));
}

export function calculateRisk(
  barangayTotal: number,
  barangayRate: number,
  projectedCases: number,
  maxBarangayTotal: number,
  yearsGlobal: number
): { label: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'LOW'; score: number } {
  const maxProjected = projectCases(maxBarangayTotal, yearsGlobal);
  const burdenScore = (barangayTotal / maxBarangayTotal) * 35;
  const projectionScore = (projectedCases / maxProjected) * 35;
  const positivityScore = (barangayRate / 100) * 20;
  const communityScore = barangayTotal > 50 ? 10 : barangayTotal > 15 ? 7 : 4;
  
  const totalScore = burdenScore + projectionScore + positivityScore + communityScore;
  const roundedScore = Math.round(Math.min(totalScore, 100));

  let label: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  if (roundedScore >= 90) label = 'VERY HIGH';
  else if (roundedScore >= 70) label = 'HIGH';
  else if (roundedScore >= 40) label = 'MODERATE';
  else label = 'LOW';

  return { label, score: roundedScore };
}

export function heatColor(score: number): string {
  const stops = [
    { p: 0, c: [34, 197, 94] },   // green
    { p: 40, c: [250, 204, 21] },  // yellow
    { p: 70, c: [249, 115, 22] },  // orange
    { p: 90, c: [239, 68, 68] },   // red
    { p: 100, c: [153, 27, 27] },  // dark red
  ];

  const s = Math.max(0, Math.min(100, score));
  let a = stops[0];
  let b = stops[stops.length - 1];

  for (let i = 0; i < stops.length - 1; i++) {
    if (s >= stops[i].p && s <= stops[i + 1].p) {
      a = stops[i];
      b = stops[i + 1];
      break;
    }
  }

  const range = b.p - a.p || 1;
  const t = (s - a.p) / range;
  const rgb = a.c.map((v, i) => Math.round(v + (b.c[i] - v) * t));
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function computeAllBarangays(
  barangays: BarangayData[],
  years: number
): BarangayComputed[] {
  const maxTotal = Math.max(...barangays.map((b) => b.total), 1);
  return barangays.map((b) => {
    const cases = projectCases(b.total, years);
    const risk = calculateRisk(b.total, b.rate, cases, maxTotal, years);
    return {
      ...b,
      cases,
      riskLabel: risk.label,
      riskScore: risk.score,
    };
  });
}
