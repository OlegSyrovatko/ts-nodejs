"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../../models/user");
const HttpError_1 = __importDefault(require("../../helpers/HttpError"));
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;
if (!SECRET_KEY || !REFRESH_SECRET_KEY) {
    throw new Error("SECRET_KEY or REFRESH_SECRET_KEY is not defined in environment variables");
}
exports.login = (0, ctrlWrapper_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const user = (await user_1.User.findOne({ email })); // Explicitly cast user to include _id
    if (!user) {
        throw (0, HttpError_1.default)(401, "Email or password is wrong");
    }
    if (!user.verify) {
        throw (0, HttpError_1.default)(401, "Email is not verified");
    }
    const passwordCompare = await bcryptjs_1.default.compare(password, user.password);
    if (!passwordCompare) {
        throw (0, HttpError_1.default)(401, "Email or password is wrong");
    }
    const userInTokensCollection = await user_1.Token.findOne({ email });
    if (userInTokensCollection) {
        await user_1.Token.findOneAndDelete({ email });
    }
    const newSession = await user_1.Session.create({
        uid: user._id,
    });
    const payload = {
        id: user._id.toString(),
        sid: newSession._id.toString(),
    };
    const token = jsonwebtoken_1.default.sign(payload, SECRET_KEY, { expiresIn: "23h" });
    const tokenRefresh = jsonwebtoken_1.default.sign(payload, REFRESH_SECRET_KEY, {
        expiresIn: "23d",
    });
    await user_1.User.findByIdAndUpdate(user._id, { token });
    await user_1.Token.create({
        email: user.email,
        tokenRefresh,
    });
    res.json({
        code: 200,
        message: "User login success",
        token,
        tokenRefresh,
        user: {
            name: user.name,
            subscription: "starter",
            avatarURL: user.avatarURL,
            movieIds: user.movieIds,
        },
    });
});
