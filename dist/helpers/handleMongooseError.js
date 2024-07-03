"use strict";
// export const handleMongooseError = (error, data, next) => {
//   const { name, code } = error;
//   const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
//   error.status = status;
//   console.log(error);
//   next();
// };
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleMongooseError = void 0;
const handleMongooseError = (error, doc, next) => {
    const { name, code } = error;
    const status = name === "MongoServerError" && code === 11000 ? 409 : 400;
    error.status = status;
    console.log(error);
    next(error);
};
exports.handleMongooseError = handleMongooseError;
