import type { NextApiRequest, NextApiResponse } from "next";
import { exec, ChildProcess } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

let currentProc: ChildProcess | null = null;
let renderState: "idle" | "rendering" | "done" | "error" = "idle";
let renderProgress = 0;
let renderOutput = "";
let renderOutPath: string | null = null;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json({
      state: renderState,
      progress: renderProgress,
      output: renderOutput.slice(-500),
      filePath: renderOutPath,
      fileExists: renderOutPath ? fs.existsSync(renderOutPath) : false,
    });
  }

  if (req.method === "DELETE") {
    const { filePath } = req.body;
    if (filePath) {
      try { fs.unlinkSync(filePath); } catch {}
    }
    return res.status(200).json({ success: true });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (currentProc) {
    try { currentProc.kill(); } catch {}
    currentProc = null;
  }

  const { outputDir } = req.body;
  const saveDir = outputDir
    ? path.resolve(outputDir)
    : path.join(os.tmpdir(), "remotion-renders");

  fs.mkdirSync(saveDir, { recursive: true });
  const outPath = path.join(saveDir, `bg-${Date.now()}.mp4`);

  // Same approach as VANTA: relative paths, no extra flags
  const cmd = `npx remotion render src/remotion/index.ts MotionGraphic "${outPath}"`;

  renderState = "rendering";
  renderProgress = 0;
  renderOutput = "";
  renderOutPath = null;

  const proc = exec(cmd, {
    cwd: process.cwd(),
    timeout: 600000,
    maxBuffer: 1024 * 1024 * 100,
    env: {
      ...process.env,
      REMOTION_CHROME_PATH: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
  });
  currentProc = proc;

  const onData = (d: string) => {
    renderOutput += d;
    const m = String(d).match(/(\d+)%/);
    if (m) {
      const p = parseInt(m[1], 10);
      if (p > renderProgress) renderProgress = p;
    }
  };
  proc.stdout?.on("data", onData);
  proc.stderr?.on("data", onData);

  proc.on("close", (exitCode) => {
    renderState = exitCode === 0 ? "done" : "error";
    currentProc = null;
    if (exitCode === 0) renderOutPath = outPath;
  });

  res.status(200).json({ success: true, message: "Render started" });
}
