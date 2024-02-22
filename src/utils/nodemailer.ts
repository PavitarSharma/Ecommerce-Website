import nodemailer, { Transporter } from "nodemailer";
import {
  SMTP_HOST,
  SMTP_MAIL,
  SMTP_PASSWORD,
  SMTP_PORT,
  SMPT_SERVICE,
} from "../config";
import ejs from "ejs";
import path from "path";

interface EmailData {
  email: string;
  subject: string;
  template: string;
  html: string
}

export const sendMail = async (emailData: EmailData) => {
  const { subject, email,  html } = emailData;
  // const year = new Date().getFullYear()
  // const templatePath = path.join(__dirname, "../views", `${template}.ejs`);
  // const html: string = await ejs.renderFile(templatePath, { ...data, year });

  try {
    const transportConfig = {
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: true,
      service: SMPT_SERVICE,
      auth: {
        user: SMTP_MAIL,
        pass: SMTP_PASSWORD,
      },
    };

    const transporter: Transporter =
      nodemailer.createTransport(transportConfig);

    const mailOptions = {
      from: SMTP_MAIL,
      to: email,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error rendering EJS template:", error);
    throw error;
  }
};
