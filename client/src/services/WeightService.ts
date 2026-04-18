import { json } from 'react-router-dom';
import $api from '../http';
import {
  IWeightMetrics,
  IWeightTrendResponse,
  TTrendPeriod,
} from '../shared/interfaces/IWeightData';

type TCreateChallenge = {
  weight: string;
};

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_PROD_API_URL
    : process.env.REACT_APP_DEV_API_URL;

const baseUrl = `${BASE_URL}/weight`;

export default class WeightService {
  static async getData(page = 1, limit = 10) {
    const response = await $api.get(`${baseUrl}?page=${page}&limit=${limit}`);
    if (response.statusText !== 'OK') {
      return json({ message: 'Could not fetch data' }, { status: 500 });
    }
    return response.data;
  }

  static async getSimpleMovingAvgData() {
    const response = await $api.get(`${baseUrl}/simple-average`);
    if (response.statusText !== 'OK') {
      return json({ message: 'Could not fetch data' }, { status: 500 });
    }
    return response.data;
  }

  static async getMetrics(): Promise<IWeightMetrics> {
    const response = await $api.get<IWeightMetrics>(`${baseUrl}/metrics`);
    return response.data;
  }

  static async getTrend(period: TTrendPeriod): Promise<IWeightTrendResponse> {
    const response = await $api.get<IWeightTrendResponse>(
      `${baseUrl}/trend?period=${period}`
    );
    return response.data;
  }

  static async createNewEntry(newObject: TCreateChallenge) {
    const response = await $api.post(baseUrl, newObject);
    return response;
  }

  static async modifyProfileData(data: any) {
    const response = await $api.post('/edit-profile', data);
    return response.data;
  }

  static async removeLastEntry() {
    await $api.delete(baseUrl);
    return WeightService.getData();
  }

  static async deleteEntry(entryId: string) {
    const response = await $api.delete(`${baseUrl}/${entryId}`);
    return response;
  }

  static async updateEntry(entryId: string, weight: string) {
    const response = await $api.put(`${baseUrl}/${entryId}`, { weight });
    return response.data;
  }
}
