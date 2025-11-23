import { Client } from "@gradio/client";
import fs from "fs";
import type { Request, Response } from "express";
import config from "config";

const SPACE_ID = "not-lain/background-removal";
const API_KEY = config.get("huggingface.apiKey") as any;

export async function removeBackground(req: Request, res: Response) {
  console.log(`Background removal request received for Space: ${SPACE_ID}`);

  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const file = (req as any).file;
  const fileBuffer = fs.readFileSync(file.path);

  try {
    const client = await Client.connect(SPACE_ID, { token: API_KEY });
    console.log("Sending image to Gradio Space...");

    const result = await client.predict("/image", { image: fileBuffer });
    const resultData = result.data as any;

    // unwrap first level array
    const filesArray = Array.isArray(resultData[0])
      ? resultData[0]
      : resultData;

    const imageUrl = {
      original: filesArray[0]?.url || null,
      processed: filesArray[1]?.url || null,
    };

    console.log("Gradio Response Data:", imageUrl);

    // Return the URL directly
    res.status(200).json({ imageUrl: imageUrl });
  } catch (err: any) {
    console.error("Background removal failed:", err.message);
    res.status(500).json({ status: false, error: "Background removal failed" });
  } finally {
    if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
  }
}
