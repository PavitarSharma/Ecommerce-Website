import { Schema, model, Document } from "mongoose"

export interface OtpDoc extends Document {
    otp: number;
    email: string;
    otpExpiration: Date,
}

const otpSchema = new Schema<OtpDoc>({
    otp: Number,
    email: String,
    otpExpiration: Date,
})

export const Otp = model<OtpDoc>("Otp", otpSchema)