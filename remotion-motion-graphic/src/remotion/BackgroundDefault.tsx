import React, { useMemo } from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const BackgroundDefault: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();

  const progress = (frame % durationInFrames) / durationInFrames;

  const config = useMemo(
    () => ({
      particles: Array.from({ length: 8 }).map((_, i) => ({
        size: 200 + i * 50,
        speed: 0.5 + i * 0.1,
        offset: i * 0.8,
      })),
    }),
    []
  );

  return (
    <AbsoluteFill style={{ backgroundColor: "#050505" }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="bgGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0f0524" stopOpacity={1} />
            <stop offset="25%" stopColor="#3d1c5e" stopOpacity={1} />
            <stop offset="50%" stopColor="#ff4d6d" stopOpacity={1} />
            <stop offset="75%" stopColor="#ff85a1" stopOpacity={1} />
            <stop offset="100%" stopColor="#7b2cbf" stopOpacity={1} />
          </radialGradient>
        </defs>
        {config.particles.map((p, i) => {
          const x =
            width / 2 +
            Math.sin(progress * Math.PI * 2 * p.speed + p.offset) *
              (width * 0.3);
          const y =
            height / 2 +
            Math.cos(progress * Math.PI * 2 * p.speed + p.offset) *
              (height * 0.2);

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={p.size}
              fill="url(#bgGrad)"
              style={{
                mixBlendMode: "screen",
                filter: `blur(${p.size / 2}px)`,
                transform: `scale(${
                  1 + Math.sin(progress * Math.PI * 2 + p.offset) * 0.2
                })`,
                transformOrigin: `${x}px ${y}px`,
              }}
            />
          );
        })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 70% 30%, rgba(123, 44, 191, 0.15), transparent 60%)",
        }}
      />
    </AbsoluteFill>
  );
};

export default BackgroundDefault;
