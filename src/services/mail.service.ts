import ejs from "ejs";
import path from "path";
import { sendMail } from "../utils";
import { logger } from "../config";

class MailService {
  async verificationMail(data: any, template: string): Promise<void> {
    const year = new Date().getFullYear();
    const templatePath = path.join(__dirname, "../views", `${template}.ejs`);
    const html: string = await ejs.renderFile(templatePath, { ...data, year });

    try {
      const emailData = {
        email: data.email,
        subject: `Firstlink Exim Account Verification - ${data.otp}`,
        template: "activation-account-mail",
        html,
      };

      await sendMail(emailData);
      logger.info("Verification email sent");
    } catch (error: any) {
      logger.error("Error sending verification email:", error.message); // Propagate the error for handling in the caller
    }
    await sendMail(data);
  }
}

export const mailService = new MailService();
