"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const gravatar_1 = __importDefault(require("gravatar"));
const crypto_1 = __importDefault(require("crypto"));
const user_1 = require("../../models/user");
const HttpError_1 = __importDefault(require("../../helpers/HttpError"));
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
const sendEmail_1 = __importDefault(require("../../helpers/sendEmail"));
const { BASE_URL } = process.env;
if (!BASE_URL) {
    throw new Error("BASE_URL is not defined in environment variables");
}
exports.register = (0, ctrlWrapper_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await user_1.User.findOne({ email });
    if (user) {
        throw (0, HttpError_1.default)(409, "Email in use");
    }
    const hashPassword = await bcryptjs_1.default.hash(password, 10);
    const avatarUrl = gravatar_1.default.url(email);
    const verificationToken = crypto_1.default.randomBytes(16).toString("hex");
    const newUser = await user_1.User.create({
        ...req.body,
        password: hashPassword,
        avatarURL: avatarUrl,
        verificationToken,
    });
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/auth/verify/${verificationToken}">Click to verify email</a>`,
    };
    await (0, sendEmail_1.default)(verifyEmail);
    res.status(201).json({
        email: newUser.email,
        subscription: "starter",
    });
});
