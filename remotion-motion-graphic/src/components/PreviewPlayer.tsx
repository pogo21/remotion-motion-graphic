import React, { useRef } from "react";
import { Player } from "@remotion/player";
import { MotionGraphic } from "../remotion/MotionGraphic";
import type { MotionTimeline } from "../remotion/script-formatter";

interface PreviewPlayerProps {
  timeline: MotionTimeline;
}

export const PreviewPlayer: React.FC<PreviewPlayerProps> = ({ timeline }) => {
  const totalDuration = timeline.scenes.reduce(
    (a, s) => a + s.durationInFrames,
    0
  );

  if (totalDuration === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-zinc-900 rounded-lg border border-zinc-800">
        <p className="text-zinc-500 text-sm">No scenes to preview</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800">
      <Player
        component={MotionGraphic as unknown as React.FC<Record<string, unknown>>}
        inputProps={timeline as unknown as Record<string, unknown>}
        durationInFrames={totalDuration}
        fps={timeline.fps}
        compositionWidth={timeline.width}
        compositionHeight={timeline.height}
        style={{ width: "100%", height: "100%" }}
        controls
        loop
      />
    </div>
  );
};
