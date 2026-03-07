import nodemailer from "nodemailer";

import { env } from "../config/env.js";

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.secure,
      auth: env.smtp.user && env.smtp.pass ? {
        user: env.smtp.user,
        pass: env.smtp.pass,
      } : undefined,
    });
  }

  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const mailer = getTransporter();

  return mailer.sendMail({
    from: env.smtp.from,
    to,
    subject,
    html,
    text,
  });
};
