import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate } from "remotion";

const DURATION = 300;
const TAU = Math.PI * 2;

type Drip = {
  id: string;
  x: number;
  freq: number;
  phase: number;
  color: string;
  headR: number;
  strokeW: number;
  maxTailFrac: number;
};

const palette = ["#DB2777", "#2563EB", "#059669", "#F59E0B", "#DC2626", "#7C3AED"];

const drips: Drip[] = Array.from({ length: 11 }, (_, i) => ({
  id: `drip-${i}`,
  x: 100 + ((i * 167) % 1750),
  freq: 1 + (i % 3),
  phase: (i * 0.09) % 1,
  color: palette[i % palette.length],
  headR: 12 + (i % 4) * 5,
  strokeW: 8 + (i % 4) * 4,
  maxTailFrac: 0.55 + (i % 3) * 0.1,
}));

const MotionBackground: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = frame / DURATION;

  const topY = -20;
  const bottomY = height + 40;
  const fallRange = bottomY - topY;

  return (
    <AbsoluteFill style={{ backgroundColor: "#F7F3EA", overflow: "hidden" }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ position: "absolute", inset: 0 }}
      >
        <defs>
          <radialGradient id="canvasWash" cx="50%" cy="30%" r="90%">
            <stop offset="0%" stopColor="#FCFAF3" stopOpacity="1" />
            <stop offset="100%" stopColor="#EDE6D4" stopOpacity="1" />
          </radialGradient>

          <filter id="dripShadow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="3" />
          </filter>

          <filter id="paperGrain" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" result="n" />
            <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0" />
          </filter>
        </defs>

        <rect x="0" y="0" width={width} height={height} fill="url(#canvasWash)" />

        {drips.map((d) => {
          const progress = (d.freq * t + d.phase) % 1;
          const headY = topY + progress * fallRange;
          const tailProgress = Math.min(progress, d.maxTailFrac);
          const tailTopY = topY;
          const tailBottomY = topY + tailProgress * fallRange;
          const fadeIn = interpolate(progress, [0, 0.04], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const fadeOut = interpolate(progress, [0.9, 1], [1, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          });
          const opacity = fadeIn * fadeOut;
          return (
            <g key={d.id} opacity={opacity} filter="url(#dripShadow)">
              <line
                x1={d.x}
                y1={tailTopY}
                x2={d.x}
                y2={tailBottomY}
                stroke={d.color}
                strokeWidth={d.strokeW}
                strokeLinecap="round"
                opacity="0.88"
              />
              <circle cx={d.x} cy={headY} r={d.headR} fill={d.color} />
              <ellipse
                cx={d.x - d.headR * 0.3}
                cy={headY - d.headR * 0.3}
                rx={d.headR * 0.28}
                ry={d.headR * 0.18}
                fill="#FFFFFF"
                opacity="0.35"
              />
            </g>
          );
        })}

        <rect x="0" y="0" width={width} height={height} filter="url(#paperGrain)" opacity="0.4" />
      </svg>
    </AbsoluteFill>
  );
};

export default MotionBackground;