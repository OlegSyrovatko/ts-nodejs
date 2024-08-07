"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeMovie = exports.deleteAvatar = exports.updateAvatar = exports.addMovie = exports.updateSubscription = exports.logout = exports.getCurrent = exports.refresh = exports.login = exports.resendVerifyEmail = exports.verifyEmail = exports.register = void 0;
const register_1 = require("./register");
Object.defineProperty(exports, "register", { enumerable: true, get: function () { return register_1.register; } });
const verifyEmail_1 = require("./verifyEmail");
Object.defineProperty(exports, "verifyEmail", { enumerable: true, get: function () { return verifyEmail_1.verifyEmail; } });
const resendVerifyEmail_1 = require("./resendVerifyEmail");
Object.defineProperty(exports, "resendVerifyEmail", { enumerable: true, get: function () { return resendVerifyEmail_1.resendVerifyEmail; } });
const login_1 = require("./login");
Object.defineProperty(exports, "login", { enumerable: true, get: function () { return login_1.login; } });
const refresh_1 = require("./refresh");
Object.defineProperty(exports, "refresh", { enumerable: true, get: function () { return refresh_1.refresh; } });
const getCurrent_1 = require("./getCurrent");
Object.defineProperty(exports, "getCurrent", { enumerable: true, get: function () { return getCurrent_1.getCurrent; } });
const logout_1 = require("./logout");
Object.defineProperty(exports, "logout", { enumerable: true, get: function () { return logout_1.logout; } });
const updateSubscription_1 = require("./updateSubscription");
Object.defineProperty(exports, "updateSubscription", { enumerable: true, get: function () { return updateSubscription_1.updateSubscription; } });
const updateAvatar_1 = require("./updateAvatar");
Object.defineProperty(exports, "updateAvatar", { enumerable: true, get: function () { return updateAvatar_1.updateAvatar; } });
const deleteAvatar_1 = require("./deleteAvatar");
Object.defineProperty(exports, "deleteAvatar", { enumerable: true, get: function () { return deleteAvatar_1.deleteAvatar; } });
const movies_1 = require("./movies");
Object.defineProperty(exports, "addMovie", { enumerable: true, get: function () { return movies_1.addMovie; } });
Object.defineProperty(exports, "removeMovie", { enumerable: true, get: function () { return movies_1.removeMovie; } });
