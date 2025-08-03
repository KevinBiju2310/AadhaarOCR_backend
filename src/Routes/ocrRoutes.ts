import express from "express";
import { uploadAadhaarImages } from "../Middleware/Upload";
import handleOcrProcess from "../Controllers/ocrController";

const router = express.Router();

router.post("/process-aadhaar", uploadAadhaarImages, handleOcrProcess);

export default router;
