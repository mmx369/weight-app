import bcrypt from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import { UserDto } from '../dtos/user-dto'
import ApiError from '../exceptions/api-error'
import UserModel from '../models/User'
import mailService, { API_URL } from './mail-service'
import {
  default as tokenService,
  default as TokenService,
} from './token-service'

class UserService {
  async registration(email: string, password: string) {
    const candidate = await UserModel.findOne({ email })
    if (candidate) {
      throw ApiError.BadRequest(`User ${email} already exist`)
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const activationLink = uuidv4()
    const user = await UserModel.create({
      email,
      password: hashPassword,
      activationLink,
    })
    await mailService.sendActivationMail(
      email,
      `${API_URL}/api/activate/${activationLink}`
    )
    const userDto = new UserDto(user)
    const tokens = TokenService.generateTokens({ ...userDto })
    await TokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto,
    }
  }

  async activate(activationLink: string) {
    const user = await UserModel.findOne({ activationLink })
    if (!user) {
      throw ApiError.BadRequest(`Invalid activation link`)
    }
    user.isActivated = true
    await user.save()
  }

  async login(email: string, password: string) {
    const user = await UserModel.findOne({ email })
    if (!user) {
      throw ApiError.BadRequest(`User not found`)
    }
    const isPassMatch = await bcrypt.compare(password, user.password)
    if (!isPassMatch) {
      throw ApiError.BadRequest(`Passwords don't match`)
    }
    const userDto = new UserDto(user)
    const tokens = tokenService.generateTokens({ ...userDto })

    await tokenService.saveToken(userDto.id, tokens.refreshToken)
    return { ...tokens, user: userDto }
  }

  async logout(refreshToken: string) {
    const token = await tokenService.removeToken(refreshToken)
    return token
  }

  async refresh(refreshToken: string) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = await tokenService.findToken(refreshToken)
    if (!userData || !tokenFromDb) {
      throw ApiError.UnauthorizedError()
    }
    //@ts-ignore
    const user = await UserModel.findById(userData.id)

    const userDto = new UserDto(user)
    const tokens = TokenService.generateTokens({ ...userDto })
    await TokenService.saveToken(userDto.id, tokens.refreshToken)
    return {
      ...tokens,
      user: userDto,
    }
  }
}

export default new UserService()
