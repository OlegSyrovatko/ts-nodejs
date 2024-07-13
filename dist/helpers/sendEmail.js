"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
const transport = nodemailer_1.default.createTransport(nodemailerConfig);
const sendEmail = async (data) => {
    const mail = { ...data, from: "syrovatkooleg@meta.ua" };
    try {
        await transport.sendMail(mail);
        console.log("send email success");
    }
    catch (err) {
        console.log(err.message);
    }
};
exports.default = sendEmail;
