import jwt from 'jsonwebtoken';
import TokenModel from '../models/Token';

interface TokenPayload {
  id: string;
  email: string;
  isActivated: boolean;
}

class TokenService {
  generateTokens(payload: TokenPayload) {
    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET as string,
      {
        expiresIn: '15m',
      }
    );
    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET as string,
      {
        expiresIn: '30d',
      }
    );
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveToken(userId: string, refreshToken: string) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await TokenModel.create({ user: userId, refreshToken });
    return token;
  }

  async removeToken(refreshToken: string) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });
    return tokenData;
  }

  validateAccessToken(token: string): TokenPayload | null {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET as string
      ) as TokenPayload;
      return userData;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string): TokenPayload | null {
    try {
      const userData = jwt.verify(
        token,
        process.env.JWT_REFRESH_SECRET as string
      ) as TokenPayload;
      return userData;
    } catch (error) {
      return null;
    }
  }

  async findToken(refreshToken: string) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

export default new TokenService();
