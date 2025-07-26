import Tesseract from "tesseract.js";
import { AadhaarData } from "../Types/interfaces";
import { parseAadhaarText } from "../Utils/parseAadhaar";
import sharp from "sharp";

const preprocessImage = async (imageBuffer: Buffer): Promise<Buffer> => {
  try {
    return await sharp(imageBuffer)
      .greyscale() // Convert to grayscale
      .normalise() // Normalize the image
      .sharpen() // Sharpen the image
      .threshold(128) // Apply threshold for better text contrast
      .png() // Convert to PNG for better OCR
      .toBuffer();
  } catch (error) {
    console.error("Image preprocessing failed:", error);
    return imageBuffer; // Return original if preprocessing fails
  }
};

export const processFrontSide = async (
  imageBuffer: Buffer
): Promise<AadhaarData> => {
  try {
    const processedImage = await preprocessImage(imageBuffer);
    const result = await Tesseract.recognize(processedImage, "eng");
    return parseAadhaarText(result.data.text);
  } catch (error) {
    console.error("Error processing front image:", error);
    throw new Error("Failed to process front side image.");
  }
};

export const processBackSide = async (
  imageBuffer: Buffer
): Promise<AadhaarData> => {
  try {
    const processedImage = await preprocessImage(imageBuffer);
    const result = await Tesseract.recognize(processedImage, "eng");
    return parseAadhaarText(result.data.text);
  } catch (error) {
    console.error("Error processing back image:", error);
    throw new Error("Failed to process back side image.");
  }
};
