import { IProfileData } from '../controllers/profileController'
import UserModel from '../models/User'
import ApiError from '../exceptions/api-error'

class ProfileService {
  async editProfileData(email: string, profileData: IProfileData) {
    const doc = await UserModel.findOneAndUpdate({ email }, profileData, {
      new: true,
    })
    if (!doc) {
      throw ApiError.BadRequest('User not found')
    }
    return doc
  }
}

export default new ProfileService()
