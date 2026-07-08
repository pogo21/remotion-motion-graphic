import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs";
import os from "os";

const outDir = path.join(os.tmpdir(), "remotion-renders");
fs.mkdirSync(outDir, { recursive: true });
const outPath = path.join(outDir, `motion-graphic-${Date.now()}.mp4`);

const entryPoint = path.join(process.cwd(), "src/remotion/index.ts");

const serveUrl = await bundle({
  entryPoint,
  webpackOverride: (config) => config,
});

const composition = await selectComposition({
  serveUrl,
  id: "MotionGraphic",
  inputProps: {},
});

await renderMedia({
  composition,
  serveUrl,
  codec: "h264",
  outputLocation: outPath,
  inputProps: {},
});

console.log(JSON.stringify({ path: outPath, filename: path.basename(outPath) }));
