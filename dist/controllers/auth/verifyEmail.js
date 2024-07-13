"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmail = void 0;
const user_1 = require("../../models/user");
const HttpError_1 = __importDefault(require("../../helpers/HttpError"));
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
const { BASE_URL } = process.env;
if (!BASE_URL) {
    throw new Error("BASE_URL is not defined in environment variables");
}
exports.verifyEmail = (0, ctrlWrapper_1.default)(async (req, res, next) => {
    const { verificationToken } = req.params;
    const user = await user_1.User.findOne({ verificationToken });
    if (!user) {
        throw (0, HttpError_1.default)(404, "User not found");
    }
    await user_1.User.findByIdAndUpdate(user._id, {
        verify: true,
        verificationToken: "",
    });
    res.status(200).json({ message: "Verification successful" });
});
