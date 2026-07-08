import React from "react";
import { AbsoluteFill } from "remotion";
import MotionBackground from "./MotionBackground";

const MotionGraphic: React.FC = () => {
  return (
    <AbsoluteFill>
      <MotionBackground />
    </AbsoluteFill>
  );
};

export { MotionGraphic };
