import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import ApiError from '../exceptions/api-error';
import userService from '../service/user-service';
import { RecaptchaService } from '../service/recaptcha-service';

class UserAuthController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(
          ApiError.BadRequest('Validation error', errors.array() as any)
        );
      }
      const {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        height,
        gender,
        recaptchaToken,
      } = req.body;

      if (recaptchaToken) {
        const isRecaptchaValid = await RecaptchaService.verifyToken(
          recaptchaToken,
          'registration'
        );
        if (!isRecaptchaValid) {
          return next(ApiError.BadRequest('reCAPTCHA verification failed'));
        }
      } else {
        return next(ApiError.BadRequest('reCAPTCHA token is required'));
      }

      const additionalData = {
        firstName: firstName || '',
        familyName: lastName || '',
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        height: height ? parseFloat(height) : null,
        gender: gender || null,
      };

      const userData = await userService.registration(
        email,
        password,
        additionalData
      );
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, recaptchaToken } = req.body;

      if (recaptchaToken) {
        const isRecaptchaValid = await RecaptchaService.verifyToken(
          recaptchaToken,
          'login'
        );
        if (!isRecaptchaValid) {
          return next(ApiError.BadRequest('reCAPTCHA verification failed'));
        }
      } else {
        return next(ApiError.BadRequest('reCAPTCHA token is required'));
      }

      const userData = await userService.login(email, password);

      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const token = await userService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      next(error);
    }
  }
  async activate(req: Request, res: Response, next: NextFunction) {
    try {
      const activationLink = req.params.link;
      await userService.activate(activationLink);
      return res.redirect(process.env.CLIENT_URL as string);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // Исправлено: было 100, стало 1000
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      res.json(userData);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserAuthController();
