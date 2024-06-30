import { IProfileData } from '../controllers/profileController'
import UserModel from '../models/User'

class ProfileService {
  async editProfileData(email: string, profileData: IProfileData) {
    const doc = await UserModel.findOneAndUpdate({ email }, profileData, {
      new: true,
    })
    return doc
  }
}

export default new ProfileService()
