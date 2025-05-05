import { emailTransporter } from "../config/nodemailer";
import fs from "node:fs";
import path from "node:path";

export const verifyEmailTemplateString = (data: { name: string }, redirectLink: string) => {
  const template = fs.readFileSync(
    path.resolve("src/templates/emails/verify-email-template/index.html"),
    "utf-8"
  );
  return template.replace("{{name}}", data.name).replace("{{redirect_link}}", redirectLink);
};

export const sendMail = async (email: string, subject: string, html: string) => {
  await emailTransporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject,
    html,
  });
};
