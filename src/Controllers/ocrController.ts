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
      console.log(frontText,"frontText");
      result.frontSide = visionService.parseAadhaarFront(frontText);

      // const frontConfidence =
      //   frontText.length > 0
          // ? frontText.reduce((sum, item) => sum + item.confidence, 0) 
      //       frontText.length
      //     : 0;
      // totalConfidence += frontConfidence;
      // processedSides++;

      console.log("Front side extracted:", result.frontSide);
    }
    if (files.backImage && files.backImage[0]) {
      backImagePath = files.backImage[0].path;
      // console.log("Processing back image:", backImagePath);

      const backText = await visionService.extractTextFromImage(backImagePath);
      console.log(backText,"backText");
      result.backSide = visionService.parseAadhaarBack(backText);

      // const backConfidence =
      //   backText.length > 0
      //     ? backText.reduce((sum, item) => sum + item.confidence, 0) /
      //       backText.length
      //     : 0;
      // totalConfidence += backConfidence;
      // processedSides++;

      console.log("Back side extracted:", result.backSide);
    }
    result.combined = visionService.combineAadhaarData(
      result.frontSide,
      result.backSide
    );
    // result.confidence =
    //   processedSides > 0 ? (totalConfidence / processedSides) * 100 : 0;
    // result.processingTime = Date.now() - startTime;
    console.log("Combined result:", result.combined);
    res.json({
      success: true,
      data: result,
      message: "Aadhaar card processed successfully",
    });
  } catch (error) {
    console.error("Error processing Aadhaar images:", error);
  }
};

export default handleOcrProcess;
