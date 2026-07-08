import React from "react";
import { Composition } from "remotion";
import { MotionGraphic } from "./MotionGraphic";

const FPS = 30;
const DURATION = 300;
const WIDTH = 1920;
const HEIGHT = 1080;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="MotionGraphic"
      component={MotionGraphic}
      durationInFrames={DURATION}
      fps={FPS}
      width={WIDTH}
      height={HEIGHT}
    />
  );
};
