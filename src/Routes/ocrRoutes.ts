import express from "express";
import multer from "multer";
import handleOcrProcess from "../Controllers/ocrController";

const router = express.Router();
const upload = multer();

router.post(
  "/process-aadhaar",
  upload.fields([
    { name: "front", maxCount: 1 },
    { name: "back", maxCount: 1 },
  ]),
  handleOcrProcess
);

export default router;
