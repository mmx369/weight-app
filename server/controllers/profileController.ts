import { NextFunction, Response } from 'express';
import profileService from '../service/profile-service';
import { IGetUserAuthInfoRequest } from './weightController';

export interface IProfileData {
  firstName?: string;
  familyName?: string;
  dateOfBirth?: Date;
  height?: number;
}

class UserProfileController {
  async editProfileData(
    req: IGetUserAuthInfoRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      if (!req.user.email) {
        throw new Error('User not found!');
      }
      const currentUser = req.user.email;
      const { firstName, familyName, dateOfBirth, height } = req.body;
      console.log(888, firstName, familyName, dateOfBirth, height);
      const newUserData: IProfileData = {
        firstName,
        familyName,
        dateOfBirth,
        height,
      };
      const userEditEntry = await profileService.editProfileData(
        currentUser,
        newUserData
      );
    } catch (error) {
      next(error);
    }
  }
}

export default new UserProfileController();
