import { NextFunction, Response } from 'express';
import profileService from '../service/profile-service';
import { IGetUserAuthInfoRequest } from '../types/express';

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
      if (!req.user || !req.user.email) {
        throw new Error('User not found!');
      }
      const currentUser = req.user.email;
      const { firstName, familyName, dateOfBirth, height } = req.body;

      const newUserData: IProfileData = {
        firstName,
        familyName,
        dateOfBirth,
        height,
      };
      const updatedProfile = await profileService.editProfileData(
        currentUser,
        newUserData
      );
      return res.status(200).json({
        message: 'Profile updated successfully',
        user: updatedProfile,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserProfileController();
