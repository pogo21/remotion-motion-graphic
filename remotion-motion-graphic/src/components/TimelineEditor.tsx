import React from "react";
import type { MotionTimeline, MotionScene } from "../remotion/script-formatter";
import { GripVertical, Trash2, Plus } from "lucide-react";

interface TimelineEditorProps {
  timeline: MotionTimeline;
  onChange: (timeline: MotionTimeline) => void;
}

export const TimelineEditor: React.FC<TimelineEditorProps> = ({ timeline, onChange }) => {
  const updateScene = (index: number, updates: Partial<MotionScene>) => {
    const newScenes = timeline.scenes.map((s, i) =>
      i === index ? { ...s, ...updates } : s
    );
    onChange({ ...timeline, scenes: newScenes });
  };

  const removeScene = (index: number) => {
    const newScenes = timeline.scenes.filter((_, i) => i !== index);
    onChange({ ...timeline, scenes: newScenes });
  };

  const addScene = () => {
    const newScene: MotionScene = {
      id: `scene-${timeline.scenes.length}`,
      type: "content",
      text: "New scene",
      durationInFrames: 90,
      animation: "slideUp",
      color: "#FFFFFF",
      fontSize: 56,
    };
    onChange({ ...timeline, scenes: [...timeline.scenes, newScene] });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-300">Timeline</label>
        <button
          onClick={addScene}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
        >
          <Plus className="w-3 h-3" />
          Add Scene
        </button>
      </div>
      <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
        {timeline.scenes.map((scene, i) => (
          <div
            key={scene.id}
            className="flex items-center gap-2 bg-zinc-800/50 rounded-lg px-3 py-2 group"
          >
            <GripVertical className="w-3.5 h-3.5 text-zinc-600 cursor-move shrink-0" />
            <span className="text-xs text-zinc-500 w-5 shrink-0">{i + 1}</span>
            <input
              value={scene.text}
              onChange={(e) => updateScene(i, { text: e.target.value })}
              className="flex-1 bg-transparent text-sm text-white border-b border-transparent hover:border-zinc-600 focus:border-brand-500 focus:outline-none px-1 truncate"
            />
            <select
              value={scene.animation}
              onChange={(e) =>
                updateScene(i, { animation: e.target.value as MotionScene["animation"] })
              }
              className="text-xs bg-zinc-700 rounded px-1.5 py-1 text-zinc-300 border-0 focus:ring-1 focus:ring-brand-500"
            >
              <option value="fade">Fade</option>
              <option value="slideUp">Slide Up</option>
              <option value="slideLeft">Slide Left</option>
              <option value="scale">Scale</option>
            </select>
            <input
              type="number"
              value={scene.durationInFrames}
              onChange={(e) =>
                updateScene(i, { durationInFrames: Math.max(15, Number(e.target.value)) })
              }
              className="w-16 text-xs bg-zinc-700 rounded px-1.5 py-1 text-zinc-300 border-0 focus:ring-1 focus:ring-brand-500 text-center"
              title="Duration (frames)"
            />
            <button
              onClick={() => removeScene(i)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
