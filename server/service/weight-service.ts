import Weight from '../models/weight'

class WeightService {
  async create(weight: number) {
    const createdWeight = await Weight.create(weight)
    return createdWeight
  }

  async getAll() {
    const weights = await Weight.find()
    return weights
  }
}

export default new WeightService()
