import { Request, Response } from "express";
import fs from "fs";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Jimp from "jimp";
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
  // Use default configuration. AWS SDK v3 will handle timeouts internally.
});

const bucketName = "ts-node-js";

export const updateAvatarAWS = ctrlWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { _id } = req.user!;
    const { path: tempUpload, originalname } = req.file!;
    const fileName = `${_id}_${originalname}`;

    try {
      const image = await Jimp.read(tempUpload);
      await image.resize(256, 256).write(tempUpload);

      const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: fs.createReadStream(tempUpload),
      };

      const command = new PutObjectCommand(uploadParams);
      const data = await s3.send(command);

      const avatarURL = `https://${bucketName}.s3.${AWS_REGION}.amazonaws.com/${fileName}`;
      await User.findByIdAndUpdate(_id, { avatarURL });

      await fs.promises.unlink(tempUpload);

      res.status(200).json({ avatarURL });
    } catch (error) {
      console.error("Error updating avatar:", error);
      res.status(500).json({ error: "Failed to update avatar" });
    }
  }
);
