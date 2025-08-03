export interface AadhaarData {
  aadhaarNumber?: string;
  name?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  pincode?: string;
  fatherName?: string;
}

export interface OCRResult {
  frontSide: AadhaarData;
  backSide: AadhaarData;
  combined: AadhaarData;
}

export interface ProcessedText {
  text: string;
}

export interface VisionAPIResponse {
  textAnnotations: Array<{
    description: string;
    confidence?: number;
    boundingPoly?: {
      vertices: Array<{ x: number; y: number }>;
    };
  }>;
  fullTextAnnotation?: {
    text: string;
  };
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
}

export interface MulterFiles {
  frontImage?: UploadedFile[];
  backImage?: UploadedFile[];
}
