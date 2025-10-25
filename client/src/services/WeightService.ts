import { json } from 'react-router-dom';
import $api from '../http';

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

  static async createNewEntry(newObject: TCreateChallenge) {
    const response = await $api.post(baseUrl, newObject);
    return response;
  }

  static async modifyProfileData(data: any) {
    const response = await $api.post('/edit-profile', data);
    console.log(response);
  }

  static async removeLastEntry() {
    await $api.delete(baseUrl);
    return WeightService.getData();
  }

  static async deleteEntry(entryId: string) {
    const response = await $api.delete(`${baseUrl}/${entryId}`);
    return response;
  }
}
