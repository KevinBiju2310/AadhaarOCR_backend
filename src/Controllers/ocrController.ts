import { Request, Response } from "express";
import { UploadedFiles, OCRResult } from "../Types/interfaces";
import { processFrontSide, processBackSide } from "../Services/ocrService";

const handleOcrProcess = async (req: Request, res: Response) => {
  try {
    const files = req.files as UploadedFiles;
    console.log(files)
    if (!files || (!files.front && !files.back)) {
      return res.status(400).json({
        success: false,
        message: "Please upload at least one image (front or back)",
      });
    }
    const result: OCRResult = {
      success: true,
      message: "OCR processing completed",
    };
    if (files.front && files.front[0]) {
      console.log("Processing front side...");
      result.front = await processFrontSide(files.front[0].buffer);
    }
    if (files.back && files.back[0]) {
      console.log("Processing back side...");
      result.back = await processBackSide(files.back[0].buffer);
    }
    return res.json(result);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "OCR processing failed.",
    });
  }
};

export default handleOcrProcess;
