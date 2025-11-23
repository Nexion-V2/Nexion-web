import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import ConvertApi from "convertapi";
import config from "config";

const CONVERT_API_KEY = config.get("convertapi.apiKey") as string;
const convertapi = new ConvertApi(CONVERT_API_KEY);

export async function pdfToDocx(req: Request, res: Response) {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = req.file;
  console.log("File uploaded:", file.originalname, file.size, "bytes");

  try {
    // Convert PDF → DOCX
    const result = await convertapi.convert(
      "docx",
      {
        File: file.path,
        FileName: file.originalname.replace(/\.pdf$/i, ""),
      },
      "pdf"
    );

    // Save converted file locally (optional)
    const outputDir = path.join(process.cwd(), "converted");
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

    const savedFiles = await result.saveFiles(outputDir);
    console.log("Converted file saved:", savedFiles[0]);

    // Send back download URL (or file path)
    res.status(200).json({
      success: true,
      downloadPath: savedFiles[0], // full path of saved DOCX
    });
  } catch (err: any) {
    console.error("ConvertAPI error:", err);
    res.status(500).json({
      status: false,
      error: "PDF to DOCX conversion failed",
      details: err.message,
    });
  } finally {
    // Remove uploaded PDF to save space
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  }
}
