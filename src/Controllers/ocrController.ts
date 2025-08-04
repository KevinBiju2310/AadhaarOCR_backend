import { Request, Response } from "express";
import visionService from "../Services/ocrService";
import { MulterFiles, OCRResult } from "../Types/interfaces";

const handleOcrProcess = async (req: Request, res: Response) => {
  let frontImagePath: string | undefined;
  let backImagePath: string | undefined;
  try {
    const files = req.files as MulterFiles;
    if (!files || (!files.frontImage && !files.backImage)) {
      return res.status(400).json({
        error: "No images provided",
        message:
          "Please upload at least one image (front or back of Aadhaar card)",
      });
    }
    const result: OCRResult = {
      frontSide: {},
      backSide: {},
      combined: {},
    };
    if (files.frontImage && files.frontImage[0]) {
      frontImagePath = files.frontImage[0].path;
      // console.log("Processing front image:", frontImagePath);

      const frontText = await visionService.extractTextFromImage(
        frontImagePath
      );
      console.log(frontText, "frontText");
      result.frontSide = visionService.parseAadhaarFront(frontText);

      console.log("Front side extracted:", result.frontSide);
    }
    if (files.backImage && files.backImage[0]) {
      backImagePath = files.backImage[0].path;
      // console.log("Processing back image:", backImagePath);

      const backText = await visionService.extractTextFromImage(backImagePath);
      console.log(backText, "backText");
      result.backSide = visionService.parseAadhaarBack(backText);

      console.log("Back side extracted:", result.backSide);
    }
    result.combined = visionService.combineAadhaarData(
      result.frontSide,
      result.backSide
    );
    console.log("Combined result:", result.combined);
    res.json({
      success: true,
      data: result,
      message: "Aadhaar card processed successfully",
    });
  } catch (error) {
    console.error("Error processing Aadhaar images:", error);
    if (error instanceof Error) {
      if (error.message.includes("Invalid Aadhaar card")) {
        return res.status(400).json({
          error: "Invalid document",
          message: error.message,
          details:
            "The uploaded images do not appear to be valid Aadhaar cards",
        });
      }
    }
    res.status(500).json({
      error: "Processing failed",
      message: "An error occurred while processing the Aadhaar card images",
      details:
        "Please try again with clear, high-quality images of both sides of the Aadhaar card",
    });
  }
};

export default handleOcrProcess;
