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
