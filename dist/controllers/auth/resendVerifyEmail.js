"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendVerifyEmail = void 0;
const user_1 = require("../../models/user");
const HttpError_1 = __importDefault(require("../../helpers/HttpError"));
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
const sendEmail_1 = __importDefault(require("../../helpers/sendEmail"));
const { BASE_URL } = process.env;
if (!BASE_URL) {
    throw new Error("BASE_URL is not defined in environment variables");
}
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.resendVerifyEmail = (0, ctrlWrapper_1.default)(async (req, res, next) => {
    const { email } = req.body;
    const user = await user_1.User.findOne({ email });
    if (!user) {
        throw (0, HttpError_1.default)(404, "Email not found");
    }
    if (user.verify) {
        throw (0, HttpError_1.default)(400, "Verification has already been passed");
    }
    const { BASE_URL } = process.env;
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${user.verificationToken}">Click to verify email</a>`,
    };
    await (0, sendEmail_1.default)(verifyEmail);
    res.status(200).json({
        message: "Verification email sent",
    });
});
