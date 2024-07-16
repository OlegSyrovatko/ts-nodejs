"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const tempDir = path_1.default.join(__dirname, "../temp");
const ensureDirExists = async (dir) => {
    try {
        await promises_1.default.mkdir(dir, { recursive: true });
    }
    catch (err) {
        console.error(`Error creating directory ${dir}:`, err);
    }
};
// Ensure the temp directory exists at startup
ensureDirExists(tempDir);
const multerConfig = multer_1.default.diskStorage({
    destination: async (req, file, cb) => {
        await ensureDirExists(tempDir); // Ensure the temp directory exists before saving the file
        cb(null, tempDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
exports.upload = (0, multer_1.default)({
    storage: multerConfig,
});
