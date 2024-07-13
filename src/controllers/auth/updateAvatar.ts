import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { User } from "../../models/user";
import ctrlWrapper from "../../helpers/ctrlWrapper";

const avatarsDir = path.join(__dirname, "../../../public/avatars");

const ensureDirExists = async (dir: string) => {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    console.error(`Error creating directory ${dir}:`, err);
  }
};

// Ensure the avatars directory exists at startup
ensureDirExists(avatarsDir);

export const updateAvatar = ctrlWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const { path: tempUpload, originalname } = req.file!;
    const fileName = `${_id}_${originalname}`;

    const resultUpload = path.join(avatarsDir, fileName);

    await ensureDirExists(avatarsDir); // Ensure the avatars directory exists before moving the file
    await fs.rename(tempUpload, resultUpload);

    const image = await Jimp.read(resultUpload);
    const width = 200;
    image.resize(width, Jimp.AUTO).write(resultUpload);

    const avatarURL = `avatars/${fileName}`;
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  }
);
