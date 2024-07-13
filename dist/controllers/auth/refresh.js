"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refresh = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../../models/user");
const HttpError_1 = __importDefault(require("../../helpers/HttpError"));
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;
if (!SECRET_KEY || !REFRESH_SECRET_KEY) {
    throw new Error("SECRET_KEY or REFRESH_SECRET_KEY is not defined in environment variables");
}
exports.refresh = (0, ctrlWrapper_1.default)(async (req, res, next) => {
    const { email, tokenRefresh } = req.body;
    if (!email || !tokenRefresh) {
        throw (0, HttpError_1.default)(400, "Error. Provide all required fields");
    }
    const userRefresh = await user_1.Token.findOne({ email });
    if (!userRefresh) {
        throw (0, HttpError_1.default)(401, "User email invalid or unauthorized");
    }
    try {
        const validateTokenResult = jsonwebtoken_1.default.verify(tokenRefresh, REFRESH_SECRET_KEY);
        if (tokenRefresh !== userRefresh.tokenRefresh || !validateTokenResult) {
            await user_1.User.findOneAndUpdate({ email }, { token: "" });
            await user_1.Token.findOneAndDelete({ email });
            throw (0, HttpError_1.default)(403, "Refresh token invalid or unauthorized");
        }
        const user = (await user_1.User.findOne({ email }));
        if (!user) {
            throw (0, HttpError_1.default)(401, "User email invalid or unauthorized");
        }
        const newSession = await user_1.Session.create({
            uid: user._id,
        });
        const payload = {
            id: user._id.toString(),
            sid: newSession._id.toString(),
        };
        const newToken = jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: "11h" });
        const newTokenRefresh = jsonwebtoken_1.default.sign(payload, REFRESH_SECRET_KEY, {
            expiresIn: "23d",
        });
        await user_1.User.findByIdAndUpdate(user._id, { token: newToken });
        await user_1.Token.findOneAndUpdate({ email }, { tokenRefresh: newTokenRefresh });
        res.status(200).json({
            code: 200,
            message: "Refresh success",
            token: newToken,
            tokenRefresh: newTokenRefresh,
        });
    }
    catch (error) {
        next((0, HttpError_1.default)(401, "Invalid token"));
    }
});
