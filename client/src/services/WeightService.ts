import { json } from 'react-router-dom'
import $api from '../http'

type TCreateChallenge = {
  weight: string
}

const baseUrl = 'http://localhost:5000/api/weight'

export default class WeightService {
  static async getData() {
    const response = await $api.get(baseUrl)
    if (response.statusText !== 'OK') {
      return json({ message: 'Could not fetch data' }, { status: 500 })
    }
    return response.data
  }

  static async createNewEntry(newObject: TCreateChallenge) {
    const response = await $api.post(baseUrl, newObject)
    return response
  }

  static async removeLastEntry() {
    await $api.delete(baseUrl)
    return WeightService.getData()
  }
}
