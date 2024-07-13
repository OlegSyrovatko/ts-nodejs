"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubscription = void 0;
const user_1 = require("../../models/user");
const HttpError_1 = __importDefault(require("../../helpers/HttpError"));
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
exports.updateSubscription = (0, ctrlWrapper_1.default)(async (req, res, next) => {
    const { subscription = "starter" } = req.body;
    const { _id } = req.user;
    try {
        const data = await user_1.User.findByIdAndUpdate(_id, { subscription }, { new: true });
        if (!data) {
            throw (0, HttpError_1.default)(404, "Not found");
        }
        res.status(200).json(data);
    }
    catch (error) {
        next((0, HttpError_1.default)(500, `Failed to update subscription: ${error.message}`));
    }
});
