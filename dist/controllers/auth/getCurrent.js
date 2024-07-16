"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrent = void 0;
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
const user_1 = require("../../models/user");
const HttpError_1 = __importDefault(require("../../helpers/HttpError"));
const user_2 = require("../../models/user");
exports.getCurrent = (0, ctrlWrapper_1.default)(async (req, res, next) => {
    const userId = req.user._id;
    if (!userId) {
        throw (0, HttpError_1.default)(401, "Unauthorized");
    }
    const user = await user_1.User.findById(userId);
    if (!user) {
        throw (0, HttpError_1.default)(404, "User not found");
    }
    const tokenDoc = await user_2.Token.findOne({ email: user.email });
    if (!tokenDoc) {
        throw (0, HttpError_1.default)(401, "Refresh token not found");
    }
    res.json({
        email: user.email,
        subscription: user.subscription,
        name: user.name,
        avatarURL: user.avatarURL,
        movieIds: user.movieIds,
        tokenRefresh: tokenDoc.tokenRefresh,
    });
});
