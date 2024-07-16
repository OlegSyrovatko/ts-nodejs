"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const todos_1 = __importDefault(require("./routes/todos"));
const auth_1 = __importDefault(require("./routes/auth"));
const body_parser_1 = require("body-parser");
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const { SESSION_SECRET_WORD, SESSION_KEY, DB_HOST } = process.env;
if (!SESSION_SECRET_WORD || !SESSION_KEY || !DB_HOST) {
    throw new Error("Required environment variables are missing");
}
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use(express_1.default.static(path_1.default.join(__dirname, "../public")));
const allowedOrigins = [
    "http://localhost:3000",
    "https://olegsyrovatko.github.io",
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
}));
app.use((0, express_session_1.default)({
    secret: SESSION_SECRET_WORD,
    name: SESSION_KEY,
    cookie: {
        path: "/",
        httpOnly: true,
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
    },
    saveUninitialized: false,
    resave: false,
    store: connect_mongo_1.default.create({
        mongoUrl: DB_HOST,
        autoRemove: "native",
    }),
}));
app.use("/todos", todos_1.default);
app.use("/auth", auth_1.default);
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
exports.default = app;
