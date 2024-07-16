"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAvatar = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const user_1 = require("../../models/user");
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
const avatarsDir = path_1.default.join(__dirname, "../../../public", "avatars");
exports.deleteAvatar = (0, ctrlWrapper_1.default)(async (req, res) => {
    const { _id } = req.user;
    // Fetch the user data to get the avatarURL
    const user = await user_1.User.findById(_id);
    if (!user || !user.avatarURL) {
        res.status(404).json({ message: "Avatar not found" });
        return;
    }
    const avatarPath = path_1.default.join(avatarsDir, path_1.default.basename(user.avatarURL));
    // Remove the avatar file from the server
    await promises_1.default.unlink(avatarPath);
    // Update the user's avatarURL to an empty string or a default avatar URL
    await user_1.User.findByIdAndUpdate(_id, { avatarURL: "" });
    res.status(200).json({ message: "Avatar deleted successfully" });
});
