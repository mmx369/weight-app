import { Request, Response } from 'express'
import WeightService from '../service/weight-service'

class WeightController {
  async create(req: Request, res: Response) {
    //TODO: add validation logic
    try {
      const weightEntry = await WeightService.create(req.body)
      res.status(200).json(weightEntry)
    } catch (error) {
      //@ts-ignore
      res.status(500).json(error.message)
    }
  }

  async getAll(req: Request, res: Response) {
    try {
      const weights = await WeightService.getAll()
      return res.json(weights)
    } catch (error) {
      //@ts-ignore
      res.status(500).json(error.message)
    }
  }
}

export default new WeightController()
