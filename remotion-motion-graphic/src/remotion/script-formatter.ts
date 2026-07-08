export type SceneType = "title" | "content" | "end";

export interface MotionScene {
  id: string;
  type: SceneType;
  text: string;
  durationInFrames: number;
  animation: "fade" | "slideUp" | "scale" | "slideLeft" | "none";
  color: string;
  fontSize: number;
}

export interface MotionTimeline {
  scenes: MotionScene[];
  backgroundColor: string;
  fps: number;
  width: number;
  height: number;
}

function detectAnimation(prev: SceneType | null, next: SceneType | null): MotionScene["animation"] {
  if (prev === null) return "scale";
  if (next === "end") return "fade";
  return "slideUp";
}

function detectType(index: number, total: number): SceneType {
  if (index === 0) return "title";
  if (index === total - 1) return "end";
  return "content";
}

const COLORS = [
  "#FFFFFF", "#F0F4FF", "#FFF7ED", "#F0FFF4", "#FFF5F5",
  "#F5F3FF", "#FFFAF0", "#F0FFFF",
];

function pickColor(index: number): string {
  return COLORS[index % COLORS.length];
}

export function formatScript(raw: string): MotionTimeline {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const scenes: MotionScene[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const words = line.split(/\s+/).length;
    const duration = Math.max(60, Math.min(words * 3 + 30, 300));

    scenes.push({
      id: `scene-${i}`,
      type: detectType(i, lines.length),
      text: line,
      durationInFrames: duration,
      animation: detectAnimation(
        i > 0 ? scenes[i - 1]?.type ?? null : null,
        i < lines.length - 1 ? ("content" as SceneType) : null,
      ),
      color: pickColor(i),
      fontSize: i === 0 ? 72 : i === lines.length - 1 ? 48 : 56,
    });
  }

  return {
    scenes,
    backgroundColor: "#0a0a0a",
    fps: 30,
    width: 1920,
    height: 1080,
  };
}

export function timelineToScript(timeline: MotionTimeline): string {
  return timeline.scenes
    .map((s, i) => `[${i + 1}] (${s.type}) ${s.animation} | ${s.durationInFrames}f | ${s.text}`)
    .join("\n");
}
