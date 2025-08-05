"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Upload_1 = require("../Middleware/Upload");
const ocrController_1 = __importDefault(require("../Controllers/ocrController"));
const router = express_1.default.Router();
router.post("/process-aadhaar", Upload_1.uploadAadhaarImages, ocrController_1.default);
exports.default = router;
