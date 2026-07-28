export interface BarangayData {
  id: string;
  name: string;
  total: number;
  rate: number;
  lat: number;
  lng: number;
}

export interface BarangayComputed extends BarangayData {
  cases: number;
  riskLabel: 'VERY HIGH' | 'HIGH' | 'MODERATE' | 'LOW';
  riskScore: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}

export interface HealthDataContext {
  totalHistoricalCases: number;
  overallPositivityRate: number;
  projectionYears: number;
  projectionMonths: number;
  projectedTotalCases: number;
  projectedPositiveCases: number;
  projectedNegativeCases: number;
  topRiskBarangay: BarangayComputed;
  secondRiskBarangay?: BarangayComputed;
  barangays: BarangayComputed[];
}
