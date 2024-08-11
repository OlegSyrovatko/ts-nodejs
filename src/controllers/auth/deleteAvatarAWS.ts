import { Request, Response } from "express";
import fs from "fs";
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { User } from "../../models/user";
import ctrlWrapper from "../../helpers/ctrlWrapper";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION } = process.env;

// Ensure that environment variables are defined
if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
  throw new Error("Missing AWS credentials or region.");
}

const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const bucketName = "ts-node-js";

export const deleteAvatarAWS = ctrlWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const user = await User.findById(_id);

    if (!user || !user.avatarURL) {
      res.status(404).json({ message: "Avatar not found" });
      return;
    }

    // const fileName = path.basename(user.avatarURL);

    try {
      const user = await User.findById(_id);
      const avatarURL = user?.avatarURL;

      if (!avatarURL) {
        res.status(404).json({ message: "Avatar not found" });
        return;
      }

      const fileName = avatarURL.split("/").pop();

      const deleteParams = {
        Bucket: bucketName,
        Key: fileName,
      };

      const command = new DeleteObjectCommand(deleteParams);
      await s3.send(command);

      await User.findByIdAndUpdate(_id, { avatarURL: "" });

      res.status(200).json({ message: "Avatar deleted successfully" });
    } catch (error) {
      console.error("Error deleting avatar:", error);
      res.status(500).json({ error: "Failed to delete avatar" });
    }
  }
);
