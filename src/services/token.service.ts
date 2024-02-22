import jwt from "jsonwebtoken";
import { TokenPayload } from "../types";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../config";

class TokenService {
  async generateToken(payload: TokenPayload) {
    const refresh_token = jwt.sign(payload, REFRESH_TOKEN as string, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    const access_token = jwt.sign(payload, ACCESS_TOKEN as string, {
      expiresIn: 60 * 60 * 24 * 7,
    });

    return { access_token, refresh_token };
  }

  async verifyAccessToken(token: string) {
    return jwt.verify(token, ACCESS_TOKEN as string);
  }

  async verifyRefreshToken(token: string) {
    return jwt.verify(token, REFRESH_TOKEN as string);
  }
}

export const tokenService = new TokenService();
