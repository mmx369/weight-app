import { Request, Response } from 'express';
import WeightService from '../service/weight-service';
import { IGetUserAuthInfoRequest } from '../types/express';
import UserModel from '../models/User';

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

      if (!req.user?.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.id;
      const weightEntry = await WeightService.create(currentUser, weightNumber);
      res.status(200).json(weightEntry);
    } catch (error: any) {
      console.error('Weight creation error:', error);
      if (error?.status && error?.message) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getAll(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await WeightService.getAll(currentUser, page, limit);

      const userProfile = await UserModel.findById(currentUser)
        .select('height gender dateOfBirth')
        .lean();
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
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.id;
      const weights = await WeightService.getSimpleMovingAvg(currentUser);
      return res.json(weights);
    } catch (error: any) {
      console.error('Get simple moving average error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getTrend(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.id;
      const period =
        (req.query.period as '30d' | '90d' | '180d' | '1y' | 'all') || '90d';

      const trend = await WeightService.getTrend(currentUser, period);
      return res.json(trend);
    } catch (error: any) {
      console.error('Get weight trend error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async getMetrics(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.id;
      const userProfile = await UserModel.findById(currentUser)
        .select('height gender dateOfBirth')
        .lean();
      const metrics = await WeightService.getMetrics(currentUser, userProfile);
      return res.json(metrics);
    } catch (error: any) {
      console.error('Get weight metrics error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async removeLastEntry(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.id;
      const response = await WeightService.removeLastEntry(currentUser);
      return res.json(response);
    } catch (error: any) {
      console.error('Remove last entry error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  async deleteEntry(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.id;
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

  async updateEntry(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: 'User not authenticated' });
      }

      const currentUser = req.user.id;
      const entryId = req.params.id;
      const { weight } = req.body;

      if (!entryId) {
        return res.status(400).json({ message: 'Entry ID is required' });
      }

      const parsedWeight = Number(weight);
      if (isNaN(parsedWeight) || parsedWeight < 1 || parsedWeight > 200) {
        return res
          .status(400)
          .json({ message: 'Weight must be between 1 and 200 kg' });
      }

      const updatedEntry = await WeightService.updateEntry(
        currentUser,
        entryId,
        parsedWeight
      );

      return res.json(updatedEntry);
    } catch (error: any) {
      console.error('Update entry error:', error);
      if (error?.status && error?.message) {
        return res.status(error.status).json({ message: error.message });
      }
      res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default new WeightController();
