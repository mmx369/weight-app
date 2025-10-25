import { Request, Response } from 'express';
import WeightService from '../service/weight-service';
import UserService from '../service/user-service';
import { IGetUserAuthInfoRequest } from '../types/express';
import ApiError from '../exceptions/api-error';

class WeightController {
  async create(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      const { weight } = req.body;

      if (!weight) {
        return res.status(400).json({ message: 'Weight is required' });
      }

      const weightNumber = Number(weight);

      if (isNaN(weightNumber)) {
        return res
          .status(400)
          .json({ message: 'Weight must be a valid number' });
      }

      if (weightNumber < 1 || weightNumber > 200) {
        return res
          .status(400)
          .json({ message: 'Weight must be between 1 and 200 kg' });
      }

      if (!req.user?.email) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.email;
      const weightEntry = await WeightService.create(currentUser, weightNumber);
      res.status(200).json(weightEntry);
    } catch (error: any) {
      console.error('Weight creation error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAll(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.email) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.email;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await WeightService.getAll(currentUser, page, limit);

      const userProfile = req.user;
      const idealWeightInfo = await WeightService.getIdealWeightInfo(
        currentUser,
        userProfile
      );

      const response = {
        ...result,
        idealWeight: idealWeightInfo,
      };

      return res.json(response);
    } catch (error: any) {
      console.error('Get all weights error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getSimpleMovingAvg(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.email) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.email;
      const weights = await WeightService.getSimpleMovingAvg(currentUser);
      return res.json(weights);
    } catch (error: any) {
      console.error('Get simple moving average error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async removeLastEntry(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.email) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.email;
      const response = await WeightService.removeLastEntry(currentUser);
      return res.json(response);
    } catch (error: any) {
      console.error('Remove last entry error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteEntry(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.email) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.email;
      const entryId = req.params.id;

      if (!entryId) {
        return res.status(400).json({ message: 'Entry ID is required' });
      }

      const response = await WeightService.deleteEntry(currentUser, entryId);
      return res.json(response);
    } catch (error: any) {
      console.error('Delete entry error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new WeightController();
