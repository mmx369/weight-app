import Weight, { IWeight } from '../models/weight'
import { percentageChange } from '../utils/percentageChange'

class WeightService {
  async create(newWeight: { weight: number; name: string }) {
    let { weight: recentWeight } = (await Weight.findOne().sort({
      date: -1,
    })) as IWeight
    const newWeightObj = {
      ...newWeight,
      change: percentageChange(recentWeight, newWeight.weight),
      date: new Date(),
    }
    const createdWeight = await Weight.create(newWeightObj)
    return createdWeight
  }

  async getAll() {
    const weights = await Weight.find().sort({ date: -1 })
    return weights
  }
}

export default new WeightService()
