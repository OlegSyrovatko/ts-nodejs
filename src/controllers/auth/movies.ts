import { Request, Response, NextFunction } from "express";
import { User, IUser } from "../../models/user";
import HttpError from "../../helpers/HttpError";
import ctrlWrapper from "../../helpers/ctrlWrapper";

export const addMovie = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { movieId } = req.body;
    const { _id } = req.user as IUser & { _id: string };

    try {
      const data = await User.findByIdAndUpdate(
        _id,
        { $addToSet: { movieIds: movieId } }, // Додаємо фільм до масиву
        { new: true }
      );

      if (!data) {
        throw HttpError(404, "User not found");
      }

      res.status(200).json(data);
    } catch (error: any) {
      next(HttpError(500, `Failed to add movie: ${error.message}`));
    }
  }
);

export const removeMovie = ctrlWrapper(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { movieId } = req.body;
    const { _id } = req.user as IUser & { _id: string };

    try {
      const data = await User.findByIdAndUpdate(
        _id,
        { $pull: { movieIds: movieId } }, // Видаляємо фільм з масиву
        { new: true }
      );

      if (!data) {
        throw HttpError(404, "User not found");
      }

      res.status(200).json(data);
    } catch (error: any) {
      next(HttpError(500, `Failed to remove movie: ${error.message}`));
    }
  }
);
