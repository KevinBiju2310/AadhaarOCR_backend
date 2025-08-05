"use strict";
// import { AadhaarData } from "../Types/interfaces";
// export const parseAadhaarText = (text: string): AadhaarData => {
//   const cleanedText = text.replace(/\n+/g, "\n").trim();
//   console.log("[OCR RAW TEXT]\n" + cleanedText);
//   // Improved name extraction - more flexible patterns
//   const namePatterns = [
//     /(?:Name[:\s]*|^)([A-Z][A-Za-z\s]{2,}?)(?=\s*(?:S\/O|C\/O|D\/O|\d{4}\s\d{4}\s\d{4}|Male|Female|DOB|Date))/i,
//     /^([A-Z][A-Za-z\s]{3,})$/m, // Name on its own line
//     /(?<=Name[:\s])([A-Z\s]{3,})/i
//   ];
//   let name;
//   for (const pattern of namePatterns) {
//     const match = cleanedText.match(pattern);
//     if (match && match[1]) {
//       name = match[1].trim();
//       break;
//     }
//   }
//   // Improved DOB extraction with multiple formats
//   const dobPatterns = [
//     /\b(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})\b/,
//     /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{4})\b/,
//     /(?:DOB|Date of Birth)[:\s]*(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})/i,
//     /(?:Born|Birth)[:\s]*(\d{2}[\/\-\.]\d{2}[\/\-\.]\d{4})/i,
//     /Year of Birth[:\s]*(\d{4})/i
//   ];
//   let dob;
//   for (const pattern of dobPatterns) {
//     const match = cleanedText.match(pattern);
//     if (match && match[1]) {
//       dob = match[1];
//       break;
//     }
//   }
//   // Improved gender extraction
//   const genderPatterns = [
//     /\b(Male|Female|Transgender|M|F|T)\b/i,
//     /(?:Gender|Sex)[:\s]*(Male|Female|Transgender|M|F|T)/i
//   ];
//   let gender;
//   for (const pattern of genderPatterns) {
//     const match = cleanedText.match(pattern);
//     if (match && match[1]) {
//       gender = match[1].toLowerCase() === 'm' ? 'Male' : 
//                match[1].toLowerCase() === 'f' ? 'Female' :
//                match[1].toLowerCase() === 't' ? 'Transgender' : match[1];
//       break;
//     }
//   }
//   // Improved Aadhaar number extraction
//   const aadhaarPatterns = [
//     /\b(\d{4}\s\d{4}\s\d{4})\b/,
//     /\b(\d{12})\b/,
//     /(\d{4}[\s\-]\d{4}[\s\-]\d{4})/
//   ];
//   let aadhaarNumber;
//   for (const pattern of aadhaarPatterns) {
//     const match = cleanedText.match(pattern);
//     if (match && match[1]) {
//       aadhaarNumber = match[1].replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3');
//       break;
//     }
//   }
//   // Improved address extraction
//   const addressPatterns = [
//     /(?:Address|Add)[:\s\n]*(.*?)(?=\n(?:[A-Z]{2,}|$))/i,
//     /(?:Address|Add)[:\s]*(.*?)(?=(?:PIN|Pincode|Pin Code|\d{6})|$)/i,
//     /S\/O.*?\n(.*?)(?=\n|$)/i // Address often comes after father's name
//   ];
//   let address;
//   for (const pattern of addressPatterns) {
//     const match = cleanedText.match(pattern);
//     if (match && match[1]) {
//       address = match[1]
//         .replace(/\n+/g, ", ")
//         .replace(/\s+/g, " ")
//         .replace(/,\s*,/g, ",")
//         .trim();
//       if (address.length > 10) { // Only consider if substantial
//         break;
//       }
//     }
//   }
//   // Improved father's name extraction
//   const fatherNamePatterns = [
//     /(?:S\/O|Son of|C\/O|Care of|D\/O|Daughter of)[:\s]*([A-Z][A-Za-z\s]{2,}?)(?=\n|Address|Add|$)/i,
//     /Father[:\s]*([A-Z][A-Za-z\s]{3,})/i,
//     /Guardian[:\s]*([A-Z][A-Za-z\s]{3,})/i
//   ];
//   let fatherName;
//   for (const pattern of fatherNamePatterns) {
//     const match = cleanedText.match(pattern);
//     if (match && match[1]) {
//       fatherName = match[1].trim();
//       break;
//     }
//   }
//   const parsed: AadhaarData = {
//     name: name || undefined,
//     dateOfBirth: dob || undefined,
//     gender: gender || undefined,
//     aadhaarNumber: aadhaarNumber || undefined,
//     address: address || undefined,
//     fatherName: fatherName || undefined,
//   };
//   console.log("[PARSED DATA]", parsed);
//   return parsed;
// };
