"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMovie = exports.addMovie = void 0;
const user_1 = require("../../models/user");
const HttpError_1 = __importDefault(require("../../helpers/HttpError"));
const ctrlWrapper_1 = __importDefault(require("../../helpers/ctrlWrapper"));
const addMovie = async (req, res, next) => {
    const { movieId } = req.body;
    const { _id } = req.user;
    try {
        const data = await user_1.User.findByIdAndUpdate(_id, { $addToSet: { movieIds: movieId } }, // Додаємо фільм до масиву
        { new: true });
        if (!data) {
            throw (0, HttpError_1.default)(404, "User not found");
        }
        res.status(200).json(data);
    }
    catch (error) {
        next((0, HttpError_1.default)(500, `Failed to add movie: ${error.message}`));
    }
};
exports.addMovie = addMovie;
const removeMovie = async (req, res, next) => {
    const { movieId } = req.body;
    const { _id } = req.user;
    try {
        const data = await user_1.User.findByIdAndUpdate(_id, { $pull: { movieIds: movieId } }, // Видаляємо фільм з масиву
        { new: true });
        if (!data) {
            throw (0, HttpError_1.default)(404, "User not found");
        }
        res.status(200).json(data);
    }
    catch (error) {
        next((0, HttpError_1.default)(500, `Failed to remove movie: ${error.message}`));
    }
};
exports.removeMovie = removeMovie;
exports.default = {
    addMovie: (0, ctrlWrapper_1.default)(exports.addMovie),
    removeMovie: (0, ctrlWrapper_1.default)(exports.removeMovie),
};
