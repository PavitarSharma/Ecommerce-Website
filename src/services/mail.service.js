import ejs from "ejs";
import path from "path";
import { logger } from "../config/logger.js";
import { sendMail } from "../utils/nodemailer.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class MailService {
  async verificationMail(data, template) {
    const year = new Date().getFullYear();
    const templatePath = path.join(__dirname, "../views", `${template}.ejs`);
    const html = await ejs.renderFile(templatePath, { ...data, year });

    try {
      const emailData = {
        email: data.email,
        subject: `Firstlink Exim Account Verification - ${data.otp}`,
        template: "activation-account-mail",
        html,
      };

      await sendMail(emailData);
      logger.info("Verification email sent");
    } catch (error) {
      logger.error("Error sending verification email:", error.message);
      throw error; // Propagate the error for handling in the caller
    }
  }
}

export const mailService = new MailService();
