export interface IWeightData {
  weight: number;
  user: string;
  _id: string;
  change: number | null;
  date: string;
}

export interface IIdealWeight {
  min: number;
  max: number;
  range: string;
}

export interface IWeightResponse {
  data: IWeightData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  idealWeight?: IIdealWeight | null;
}

export interface IWeightMetrics {
  totalEntries: number;
  startWeight: number | null;
  latestWeight: number | null;
  minWeight: number | null;
  maxWeight: number | null;
  averageWeight: number | null;
  medianWeight: number | null;
  totalChangeKg: number | null;
  totalChangePercent: number | null;
  averageWeeklyChangeKg: number | null;
  biggestDropKg: number | null;
  biggestGainKg: number | null;
  trackingDays: number;
  firstEntryDate: string | null;
  lastEntryDate: string | null;
  currentBmi: number | null;
  idealWeight: IIdealWeight | null;
  idealStatus: 'below' | 'within' | 'above' | null;
  distanceToIdealKg: number | null;
}

export type TTrendPeriod = '30d' | '90d' | '180d' | '1y' | 'all';

export interface IWeightTrendPoint {
  date: string;
  weight: number;
  sma7: number;
}

export interface IWeightTrendResponse {
  period: TTrendPeriod;
  points: IWeightTrendPoint[];
}
