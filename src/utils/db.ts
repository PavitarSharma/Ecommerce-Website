import monggose from "mongoose";
import { DATABASE_URL, logger } from "../config";

export const connectDB = async () => {
 
  try {
    await monggose.connect(DATABASE_URL as string);
    logger.info("Connected to MongoDB");
  } catch (error: any) {
    logger.error(`Error connecting to Mongo: ${error.message}`);
  }
};
