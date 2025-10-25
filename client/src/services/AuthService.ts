import { AxiosResponse } from 'axios';
import $api from '../http';
import { IAuthResponse } from '../shared/interfaces/IAuthResponse';

export default class AuthService {
  static async login(
    email: string,
    password: string,
    recaptchaToken?: string
  ): Promise<AxiosResponse<IAuthResponse>> {
    return $api.post<IAuthResponse>('/login', {
      email,
      password,
      recaptchaToken,
    });
  }

  static async registration(
    email: string,
    password: string,
    additionalData?: any,
    recaptchaToken?: string
  ): Promise<AxiosResponse<IAuthResponse>> {
    const registrationData = {
      email,
      password,
      ...additionalData,
      recaptchaToken,
    };
    return $api.post<IAuthResponse>('/registration', registrationData);
  }

  static async logout(): Promise<void> {
    return $api.post('/logout');
  }
}
