export interface AadhaarData {
  name?: string;
  aadhaarNumber?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  fatherName?: string;
}

export interface OCRResult {
  front?: AadhaarData;
  back?: AadhaarData;
  success: boolean;
  message: string;
}

export interface UploadedFiles {
  front?: Express.Multer.File[];
  back?: Express.Multer.File[];
}
