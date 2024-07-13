"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrent = void 0;
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
exports.getCurrent = (0, ctrlWrapper_1.default)(async (req, res, next) => {
    const { email, subscription } = req.user;
    res.json({ email, subscription });
});
