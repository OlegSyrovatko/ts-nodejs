"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const user_1 = require("../../models/user");
const HttpError_1 = __importDefault(require("../../helpers/HttpError"));
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
exports.logout = (0, ctrlWrapper_1.default)(async (req, res) => {
    const { _id } = req.user;
    const user = await user_1.User.findByIdAndUpdate(_id, { token: "" });
    const currentSession = req.session;
    const sessionDeletionResult = await user_1.Session.deleteOne({
        _id: currentSession === null || currentSession === void 0 ? void 0 : currentSession._id,
    });
    if (!user || !sessionDeletionResult) {
        throw (0, HttpError_1.default)(401, "Not authorized");
    }
    const tokenRefresh = await user_1.Token.findOneAndDelete({
        userEmail: user.email,
    });
    if (!tokenRefresh) {
        throw (0, HttpError_1.default)(401, "User email invalid or unauthorized");
    }
    res.status(204).json({ message: "No Content" });
});
