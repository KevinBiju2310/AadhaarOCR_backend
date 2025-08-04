import { ImageAnnotatorClient } from "@google-cloud/vision";
import { AadhaarData, ProcessedText } from "../Types/interfaces";

class VisionService {
  private client: ImageAnnotatorClient;

  constructor() {
    this.client = new ImageAnnotatorClient();
  }

  async extractTextFromImage(imagePath: string): Promise<ProcessedText[]> {
    try {
      // console.log("Imgpth", imagePath);
      const [result] = await this.client.textDetection(imagePath);
      // console.log("Result: ", result);
      const detections = result.textAnnotations || [];
      const firstDetection = detections[0];

      return [
        {
          text: firstDetection.description || "",
        },
      ];
    } catch (error) {
      console.error("Error in text extraction: ", error);
      throw new Error("Failed to extract text from image");
    }
  }

  private validateAadhaarCard(extractedText: ProcessedText[]): {
    isValid: boolean;
    reason?: string;
  } {
    const fullText = extractedText.map((item) => item.text).join(" ");
    const normalizedText = fullText.toLowerCase();
    const englishKeywords = [
      "government of india",
      "unique identification authority of india",
      "aadhaar",
    ];
    const hindiKeywords = [
      "भारत सरकार",
      "भारतीय विशिष्ट पहचान प्राधिकरण",
      "आधार",
    ];
    const hasEnglishKeywords = englishKeywords.some((keyword) =>
      normalizedText.includes(keyword.toLowerCase())
    );
    const hasHindiKeywords = hindiKeywords.some((keyword) =>
      fullText.includes(keyword)
    );
    const aadhaarPattern = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/;
    const hasAadhaarNumber = aadhaarPattern.test(fullText);
    if (!hasAadhaarNumber) {
      return { isValid: false, reason: "No valid Aadhaar number found" };
    }
    if (!hasEnglishKeywords && !hasHindiKeywords) {
      return {
        isValid: false,
        reason:
          "Document does not contain required Government of India or UIDAI identifiers",
      };
    }
    return { isValid: true };
  }

  parseAadhaarFront(extractedText: ProcessedText[]): AadhaarData {
    try {
      const validation = this.validateAadhaarCard(extractedText);
      if (!validation.isValid) {
        throw new Error(`Invalid Aadhaar card: ${validation.reason}`);
      }
      const fullText = extractedText.map((item) => item.text).join(" ");
      const lines = fullText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const data: AadhaarData = {};
      // Aadhar number
      const aadhaarPattern = /(\d{4}[\s-]?\d{4}[\s-]?\d{4})/g;
      const aadhaarMatch = fullText.match(aadhaarPattern);
      if (aadhaarMatch) {
        data.aadhaarNumber = aadhaarMatch[0].replace(/[\s-]/g, "");
      }
      // Name
      const dobIndex = lines.findIndex((line) =>
        /DOB|Date of Birth/i.test(line)
      );
      if (dobIndex > 0) {
        const nameCandidate = lines[dobIndex - 1];
        if (
          !/(Government|भारत सरकार|आधार|सत्यमेव)/i.test(nameCandidate) &&
          nameCandidate.length > 2
        ) {
          data.name = nameCandidate;
        }
      }
      // DOB
      const dobPatterns = [
        /DOB[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
        /Date of Birth[:\s]*(\d{2}\/\d{2}\/\d{4})/i,
        /(\d{2}\/\d{2}\/\d{4})/,
      ];
      for (const pattern of dobPatterns) {
        const dobMatch = fullText.match(pattern);
        if (dobMatch) {
          data.dateOfBirth = dobMatch[1];
          break;
        }
      }
      // Gender
      const genderMatch = fullText.match(/\b(MALE|FEMALE|M|F)\b/i);
      if (genderMatch) {
        const gender = genderMatch[0].toUpperCase();
        data.gender =
          gender === "M"
            ? "Male"
            : gender === "F"
            ? "Female"
            : gender.charAt(0) + gender.slice(1).toLowerCase();
      }
      return data;
    } catch (error) {
      console.error("Error in AadharFront: ", error);
      throw error;
    }
  }

  parseAadhaarBack(extractedText: ProcessedText[]): AadhaarData {
    try {
      const validation = this.validateAadhaarCard(extractedText);
      if (!validation.isValid) {
        throw new Error(`Invalid Aadhaar card: ${validation.reason}`);
      }
      const fullText = extractedText.map((item) => item.text).join(" ");
      const lines = fullText
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const data: AadhaarData = {};
      // Extract Address components
      const addressStartIndex = lines.findIndex((line) =>
        /Address|S\/O|C\/O|W\/O/i.test(line)
      );
      if (addressStartIndex !== -1) {
        const addressLines: string[] = [];
        for (let i = addressStartIndex; i < lines.length; i++) {
          const line = lines[i];
          // Stop if common footer keywords are hit
          if (/help@uidai|www\.uidai|aadhaar/i.test(line)) break;
          // Skip unrelated short or numeric lines
          if (/^\d{4}\s?\d{4}\s?\d{4}$/.test(line)) continue;
          addressLines.push(line);
        }
        data.address = addressLines
          .join(", ")
          .replace(/Address[:]?/i, "")
          .replace(/\s+/g, " ")
          .trim();
      }
      // Pincode
      const pincodeMatch = fullText.match(/\b(\d{6})\b/);
      if (pincodeMatch) {
        data.pincode = pincodeMatch[1];
      }
      // Father Name
      const fatherPattern =
        /(?:Father['\s]*s?\s*Name|S\/O)[:\s]*([A-Za-z\s]+)/i;
      const fatherMatch = fullText.match(fatherPattern);
      if (fatherMatch && fatherMatch[1]) {
        data.fatherName = fatherMatch[1].trim();
      }
      return data;
    } catch (error) {
      console.error("Error in AadharBack: ", error);
      throw error;
    }
  }

  combineAadhaarData(
    frontData: AadhaarData,
    backData: AadhaarData
  ): AadhaarData {
    return {
      ...frontData,
      ...backData,
      address: backData.address || frontData.address,
      pincode: backData.pincode || frontData.pincode,
    };
  }
}

export default new VisionService();
