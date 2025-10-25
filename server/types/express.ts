import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    familyName?: string;
    dateOfBirth?: Date;
    height?: number;
  };
}

export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    familyName?: string;
    dateOfBirth?: Date;
    height?: number;
  };
}
