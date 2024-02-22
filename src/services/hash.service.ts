import crypto from "crypto";

class HashService {
  hashOtp(data: any) {
    return crypto
      .createHmac("sha256", process.env.ACTIVATION_SECRET as string)
      .update(data)
      .digest("hex");
  }
}

export const hashService = new HashService();
