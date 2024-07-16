"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAvatar = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const jimp_1 = __importDefault(require("jimp"));
const user_1 = require("../../models/user");
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
const avatarsDir = path_1.default.join(__dirname, "../../../public/avatars");
const ensureDirExists = async (dir) => {
    try {
        await promises_1.default.mkdir(dir, { recursive: true });
    }
    catch (err) {
        console.error(`Error creating directory ${dir}:`, err);
    }
};
// Ensure the avatars directory exists at startup
ensureDirExists(avatarsDir);
exports.updateAvatar = (0, ctrlWrapper_1.default)(async (req, res) => {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const fileName = `${_id}_${originalname}`;
    const resultUpload = path_1.default.join(avatarsDir, fileName);
    await ensureDirExists(avatarsDir); // Ensure the avatars directory exists before moving the file
    await promises_1.default.rename(tempUpload, resultUpload);
    const image = await jimp_1.default.read(resultUpload);
    const width = 200;
    image.resize(width, jimp_1.default.AUTO).write(resultUpload);
    const avatarURL = `avatars/${fileName}`;
    await user_1.User.findByIdAndUpdate(_id, { avatarURL });
    res.status(200).json({ avatarURL });
});
