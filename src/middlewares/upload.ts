import multer, { StorageEngine } from "multer";
import path from "path";

const tempDir = path.join(__dirname, "../", "temp");

const multerConfig: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: multerConfig,
});
