import axios from 'axios';

interface RecaptchaResponse {
  success: boolean;
  score?: number;
  action?: string;
  'error-codes'?: string[];
}

export class RecaptchaService {
  private static readonly RECAPTCHA_VERIFY_URL =
    'https://www.google.com/recaptcha/api/siteverify';
  private static readonly MIN_SCORE_THRESHOLD = 0.5; // Минимальный порог для reCAPTCHA v3

  static async verifyToken(
    token: string,
    expectedAction: string = 'submit'
  ): Promise<boolean> {
    try {
      const secretKey = process.env.RECAPTCHA_SECRET_KEY;

      console.log('=== reCAPTCHA Debug Info ===');
      console.log(
        'Token received:',
        token ? `${token.substring(0, 20)}...` : 'null'
      );
      console.log('Expected action:', expectedAction);
      console.log('Secret key exists:', !!secretKey);
      console.log(
        'Secret key preview:',
        secretKey ? `${secretKey.substring(0, 10)}...` : 'undefined'
      );

      if (!secretKey) {
        console.error('RECAPTCHA_SECRET_KEY is not set');
        return false;
      }

      const response = await axios.post<RecaptchaResponse>(
        this.RECAPTCHA_VERIFY_URL,
        null,
        {
          params: {
            secret: secretKey,
            response: token,
          },
        }
      );

      const {
        success,
        score,
        action,
        'error-codes': errorCodes,
      } = response.data;

      console.log('=== Google reCAPTCHA Response ===');
      console.log('Success:', success);
      console.log('Score:', score);
      console.log('Action:', action);
      console.log('Error codes:', errorCodes);
      console.log('Full response:', JSON.stringify(response.data, null, 2));

      if (!success) {
        console.error('reCAPTCHA verification failed:', errorCodes);
        return false;
      }

      // Для reCAPTCHA v3 проверяем score и action
      if (score !== undefined) {
        if (score < this.MIN_SCORE_THRESHOLD) {
          console.error(
            `reCAPTCHA score too low: ${score} (minimum: ${this.MIN_SCORE_THRESHOLD})`
          );
          return false;
        }

        if (action !== expectedAction) {
          console.error(
            `reCAPTCHA action mismatch: expected ${expectedAction}, got ${action}`
          );
          return false;
        }
      }

      console.log(
        `reCAPTCHA verification successful. Score: ${score}, Action: ${action}`
      );
      return true;
    } catch (error) {
      console.error('Error verifying reCAPTCHA token:', error);
      return false;
    }
  }
}
