import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import ocrRoutes from "./Routes/ocrRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const allowedOrigin = process.env.CLIENT_ORIGIN;

app.use(
  cors({
    origin: allowedOrigin,
  })
);
app.use(express.json());
app.use("/uploads", express.static(uploadsDir));

app.use("/api", ocrRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
