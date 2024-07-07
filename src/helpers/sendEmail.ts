import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { EmailData } from "../models/user";

dotenv.config();

const { META_PASSWORD } = process.env;

if (!META_PASSWORD) {
  throw new Error("META_PASSWORD is not defined in environment variables");
}

const nodemailerConfig = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "syrovatkooleg@meta.ua",
    pass: META_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = async (data: EmailData): Promise<void> => {
  const mail = { ...data, from: "syrovatkooleg@meta.ua" };
  try {
    await transport.sendMail(mail);
    console.log("send email success");
  } catch (err: any) {
    console.log(err.message);
  }
};

export default sendEmail;
