import { exec } from "child_process";
import path from "path";

const [entryPointRel, outputPathRel] = process.argv.slice(2);
const cwd = process.cwd();
const resolvedEntry = path.resolve(cwd, entryPointRel);
const resolvedOutput = path.resolve(cwd, outputPathRel);

const cmd = `npx remotion render "${resolvedEntry}" MotionGraphic "${resolvedOutput}"`;

const env = {
  ...process.env,
  REMOTION_CHROME_PATH: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
};

const sendResult = (success, data) => {
  if (process.send) {
    process.send({ success, data });
  } else {
    process.stdout.write(JSON.stringify({ success, data }));
  }
};

const child = exec(cmd, { cwd, env, timeout: 600000, maxBuffer: 1024 * 1024 * 100 });

child.stdout?.on("data", (data) => {
  process.stderr.write(data.toString());
});
child.stderr?.on("data", (data) => {
  process.stderr.write(data.toString());
});

child.on("exit", (code) => {
  if (code === 0) {
    sendResult(true, resolvedOutput);
  } else {
    sendResult(false, `Exit code ${code}`);
  }
});

child.on("error", (err) => {
  sendResult(false, err.message);
});
