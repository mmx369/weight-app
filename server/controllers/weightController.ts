import { Request, Response } from 'express';
import WeightService from '../service/weight-service';

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    email: string;
  };
}

class WeightController {
  async create(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.body.weight || +req.body.weight < 1 || +req.body.weight > 200) {
        throw new Error('Invalid input!');
      }
      if (!req.user.email) {
        throw new Error('User not found!');
      }
      const { weight: currentWeight } = req.body;
      const currentUser = req.user.email;
      const weightEntry = await WeightService.create(
        currentUser,
        Number(currentWeight)
      );
      res.status(200).json(weightEntry);
    } catch (error) {
      //@ts-ignore
      res.status(500).json(error.message);
    }
  }

  async getAll(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user.email) {
        throw new Error('User not found!');
      }
      const currentUser = req.user.email;
      const weights = await WeightService.getAll(currentUser);
      return res.json(weights);
    } catch (error) {
      //@ts-ignore
      res.status(500).json(error.message);
    }
  }

  async getSimpleMovingAvg(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user.email) {
        throw new Error('User not found!');
      }
      const currentUser = req.user.email;
      const weights = await WeightService.getSimpleMovingAvg(currentUser);
      return res.json(weights);
    } catch (error) {
      //@ts-ignore
      res.status(500).json(error.message);
    }
  }

  async removeLastEntry(req: IGetUserAuthInfoRequest, res: Response) {
    try {
      if (!req.user.email) {
        throw new Error('User not found!');
      }
      const currentUser = req.user.email;
      const response = await WeightService.removeLastEntry(currentUser);
      return res.json(response);
    } catch (error) {
      //@ts-ignore
      res.status(500).json(error.message);
    }
  }
}

export default new WeightController();
