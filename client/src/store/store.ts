import { makeAutoObservable, runInAction } from 'mobx';
import $api from '../http';
import AuthService from '../services/AuthService';
import { IAuthResponse } from '../shared/interfaces/IAuthResponse';
import { IUser } from '../shared/interfaces/IUser';

import 'react-toastify/dist/ReactToastify.css';
import { IWeightData, IIdealWeight } from '../shared/interfaces/IWeightData';

export default class Store {
  user = {} as IUser;
  weightData = [] as IWeightData[];
  weightPagination = {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
    hasNext: false,
    hasPrev: false,
  };
  idealWeight: IIdealWeight | null = null;
  isAuth = false;
  isLoading = false;
  justLoggedIn = false;
  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool: boolean) {
    this.isAuth = bool;
  }

  setUser(user: IUser) {
    this.user = user;
  }

  setWeightData(
    weightData: IWeightData[],
    pagination?: any,
    idealWeight?: IIdealWeight | null
  ) {
    runInAction(() => {
      this.weightData = [...weightData];
      if (pagination) {
        this.weightPagination = { ...pagination };
      }
      if (idealWeight !== undefined) {
        this.idealWeight = idealWeight;
      }
    });
  }

  setLoading(bool: boolean) {
    this.isLoading = bool;
  }

  getWeightList() {
    return this.weightData;
  }

  async login(email: string, password: string, recaptchaToken?: string) {
    try {
      const response = await AuthService.login(email, password, recaptchaToken);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
      this.justLoggedIn = true;
      // Небольшая задержка для установки refresh токена в cookies
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error: any) {
      throw error.response?.data?.message || error.message || 'Login failed';
    }
  }

  async registration(
    email: string,
    password: string,
    additionalData?: any,
    recaptchaToken?: string
  ) {
    try {
      const response = await AuthService.registration(
        email,
        password,
        additionalData,
        recaptchaToken
      );
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error: any) {
      throw (
        error.response?.data?.message || error.message || 'Registration failed'
      );
    }
  }

  async logout() {
    try {
      await AuthService.logout();
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
      this.justLoggedIn = false;
    } catch (error: any) {
      console.log(error.response?.data?.message || 'Logout failed');
    }
  }

  async checkAuth() {
    this.setLoading(true);
    try {
      const response = await $api.get<IAuthResponse>(`/refresh`);
      localStorage.setItem('token', response.data.accessToken);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (error: any) {
      // Если refresh токен недействителен, очищаем localStorage
      localStorage.removeItem('token');
      this.setAuth(false);
      this.setUser({} as IUser);
    } finally {
      this.setLoading(false);
    }
  }
}
