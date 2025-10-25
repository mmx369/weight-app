import { NextFunction, Response } from 'express';
import ApiError from '../exceptions/api-error';
import tokenService from '../service/token-service';
import { AuthenticatedRequest } from '../types/express';

export default function (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (req.method === 'OPTIONS') {
    next();
  }

  try {
    const accessToken = req.headers.authorization?.split(' ')[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if (!userData || typeof userData === 'string') {
      return next(ApiError.UnauthorizedError());
    }
    req.user = userData as { id: string; email: string };
    next();
  } catch (error) {
    return next(ApiError.UnauthorizedError());
  }
}
