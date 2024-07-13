import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import Jimp from "jimp";
import { User } from "../../models/user";
import ctrlWrapper from "../../helpers/ctrlWrapper";

const avatarsDir = path.join(__dirname, "../../public", "avatars");

export const updateAvatar = ctrlWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const { path: tempUpload, originalname } = req.file!;
    const fileName = `${_id}_${originalname}`;

    const resultUpload = path.join(avatarsDir, fileName);

    await fs.rename(tempUpload, resultUpload);

    const image = await Jimp.read(resultUpload);

    // Resize the images so that the width is a minimum of 200 pixels, and height is adjusted proportionally
    const width = 200;
    image.resize(width, Jimp.AUTO).write(resultUpload);

    const avatarURL = path.join("../../public", "avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.status(200).json({ avatarURL });
  }
);
