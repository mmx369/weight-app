import { default as Weight } from '../models/weight'
import { percentageChange } from '../utils/percentageChange'

class WeightService {
  async create(currentUser: string, currentWeight: number) {
    let recentWeight
    let weight = (await Weight.findOne(
      {
        user: currentUser,
      },
      { weight: 1, _id: 0 }
    ).sort({
      date: -1,
    })) as any

    if (!weight) {
      recentWeight = currentWeight
    } else {
      recentWeight = weight.weight
    }

    const newWeightObj = {
      user: currentUser,
      weight: currentWeight,
      change: percentageChange(recentWeight, currentWeight),
      date: new Date(),
    }

    const createdWeight = await Weight.create(newWeightObj)
    return createdWeight
  }

  async getAll(currentUser: string) {
    const weights = await Weight.find({ user: currentUser }).sort({ date: -1 })
    return weights
  }

  async removeLastEntry(currentUser: string) {
    const lastWeightsEntry = await Weight.findOne({ user: currentUser }).sort({
      date: -1,
    })
    await Weight.findByIdAndRemove(lastWeightsEntry?.id)
    const weights = await Weight.find({ user: currentUser }).sort({ date: -1 })
    return weights
  }
}

export default new WeightService()
