import crypto from "crypto";
import { hashService } from ".";
import { Otp, OtpDoc } from "../models";

class OtpService {
  async generateOtp() {
    const otp = crypto.randomInt(100000, 999999);
    return otp;
  }

  async saveOtp(email: string, otp: number, otpExpiration: Date) {
    return await Otp.create({ email, otp, otpExpiration });
  }

  async isOtpInvalid(email: string, otp: number): Promise<boolean> {
    const otpDoc = await Otp.findOne({ email });

    if (otpDoc) {
      if (otp === otpDoc.otp) {
        return true;
      }
    }

    return false;
  }

  async isOtpExpired(email: string, otp: number): Promise<boolean> {
    const otpDoc = await Otp.findOne({ email });
    if (otpDoc && otpDoc.otpExpiration > new Date()) {
      return false; // OTP has not expired
    }

    return true;
  }
  async otpHasVerified(email: string) {
    return Otp.findOneAndUpdate(
      { email },
      { otp:  undefined, otpExpiration: undefined },
      { upsert: true, new: true }
    );
    
  }

  async findOtpByEmail(email: string): Promise<OtpDoc | null> {
    return await Otp.findOne({ email });
  }

  async updateOtp(
    email: string,
    otp: number,
    otpExpiration: Date
  ): Promise<OtpDoc | null> {
    return Otp.findOneAndUpdate(
      { email },
      { otp, otpExpiration },
      { upsert: true, new: true }
    );
  }
}

export const otpService = new OtpService();
