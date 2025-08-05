"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ocrService_1 = __importDefault(require("../Services/ocrService"));
const handleOcrProcess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let frontImagePath;
    let backImagePath;
    try {
        const files = req.files;
        if (!files || (!files.frontImage && !files.backImage)) {
            return res.status(400).json({
                error: "No images provided",
                message: "Please upload at least one image (front or back of Aadhaar card)",
            });
        }
        const result = {
            frontSide: {},
            backSide: {},
            combined: {},
        };
        if (files.frontImage && files.frontImage[0]) {
            frontImagePath = files.frontImage[0].path;
            // console.log("Processing front image:", frontImagePath);
            const frontText = yield ocrService_1.default.extractTextFromImage(frontImagePath);
            console.log(frontText, "frontText");
            result.frontSide = ocrService_1.default.parseAadhaarFront(frontText);
            console.log("Front side extracted:", result.frontSide);
        }
        if (files.backImage && files.backImage[0]) {
            backImagePath = files.backImage[0].path;
            // console.log("Processing back image:", backImagePath);
            const backText = yield ocrService_1.default.extractTextFromImage(backImagePath);
            console.log(backText, "backText");
            result.backSide = ocrService_1.default.parseAadhaarBack(backText);
            console.log("Back side extracted:", result.backSide);
        }
        result.combined = ocrService_1.default.combineAadhaarData(result.frontSide, result.backSide);
        console.log("Combined result:", result.combined);
        res.json({
            success: true,
            data: result,
            message: "Aadhaar card processed successfully",
        });
    }
    catch (error) {
        console.error("Error processing Aadhaar images:", error);
        if (error instanceof Error) {
            if (error.message.includes("Invalid Aadhaar card")) {
                return res.status(400).json({
                    error: "Invalid document",
                    message: error.message,
                    details: "The uploaded images do not appear to be valid Aadhaar cards",
                });
            }
        }
        res.status(500).json({
            error: "Processing failed",
            message: "An error occurred while processing the Aadhaar card images",
            details: "Please try again with clear, high-quality images of both sides of the Aadhaar card",
        });
    }
});
exports.default = handleOcrProcess;
