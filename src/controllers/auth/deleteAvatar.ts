import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";
import { User } from "../../models/user";
import ctrlWrapper from "../../helpers/ctrlWrapper";

const avatarsDir = path.join(__dirname, "../../public", "avatars");

export const deleteAvatar = ctrlWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.user!;

    // Fetch the user data to get the avatarURL
    const user = await User.findById(_id);

    if (!user || !user.avatarURL) {
      res.status(404).json({ message: "Avatar not found" });
      return;
    }

    const avatarPath = path.join(avatarsDir, path.basename(user.avatarURL));

    // Remove the avatar file from the server
    await fs.unlink(avatarPath);

    // Update the user's avatarURL to an empty string or a default avatar URL
    await User.findByIdAndUpdate(_id, { avatarURL: "" });

    res.status(200).json({ message: "Avatar deleted successfully" });
  }
);
