import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const src = path.join(process.cwd(), "src", "remotion", "BackgroundDefault.tsx");
    const dest = path.join(process.cwd(), "src", "remotion", "MotionBackground.tsx");

    if (!fs.existsSync(src)) {
      return res.status(404).json({ error: "Default background not found" });
    }

    fs.copyFileSync(src, dest);

    res.status(200).json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Reset background error:", message);
    res.status(500).json({ error: message });
  }
}
