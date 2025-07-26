import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import ocrRoutes from "./Routes/ocrRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api", ocrRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at ${PORT}`);
});
