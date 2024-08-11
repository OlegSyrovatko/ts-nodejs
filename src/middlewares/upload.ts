import multer from "multer";
import path from "path";
import fs from "fs/promises";

const tempDir = path.join(__dirname, "../temp");

const ensureDirExists = async (dir: string) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory ${dir}:`, err);
  }
};

// Ensure the temp directory exists at startup
ensureDirExists(tempDir);

const multerConfig = multer.diskStorage({
  destination: async (req, file, cb) => {
    await ensureDirExists(tempDir); // Ensure the temp directory exists before saving the file
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

export const upload = multer({
  storage: multerConfig,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB size limit
  },
});
