export interface ApiError {
  message: string;
  status?: number;
}

export interface WeightEntry {
  _id: string;
  user: string;
  weight: number;
  change: number;
  date: string;
}

export interface UserProfile {
  firstName: string;
  familyName: string;
  dateOfBirth?: string;
  height?: number;
}

