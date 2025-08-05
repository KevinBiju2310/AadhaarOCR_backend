"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const ocrRoutes_1 = __importDefault(require("./Routes/ocrRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const uploadsDir = path_1.default.join(__dirname, "../uploads");
if (!fs_1.default.existsSync(uploadsDir)) {
    fs_1.default.mkdirSync(uploadsDir, { recursive: true });
}
const allowedOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use((0, cors_1.default)({
    origin: allowedOrigin,
}));
app.use(express_1.default.json());
app.use("/uploads", express_1.default.static(uploadsDir));
app.use("/api", ocrRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Server is running at ${PORT}`);
});
