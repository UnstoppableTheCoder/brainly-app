import nodemailer from "nodemailer";

const transport = nodemailer.createTransport({
  service: "Gmail",
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default transport;
