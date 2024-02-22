import dotenv from "dotenv";
import app from "./server";
import { logger } from "./config";
import { connectDB } from "./utils/db";

dotenv.config();
const PORT = process.env.PORT || (5000 as number);

connectDB()

app.listen(PORT, () => logger.info(`Server listening on ${PORT}`));
