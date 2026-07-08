import React, { useState } from "react";
import { Video, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { MotionTimeline } from "../remotion/script-formatter";

interface RenderButtonProps {
  timeline: MotionTimeline;
}

export const RenderButton: React.FC<RenderButtonProps> = ({ timeline }) => {
  const [status, setStatus] = useState<"idle" | "rendering" | "done" | "error">("idle");
  const [outputPath, setOutputPath] = useState<string>("");

  const handleRender = async () => {
    setStatus("rendering");
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(timeline),
      });
      if (!res.ok) throw new Error("Render failed");
      const data = await res.json();
      setOutputPath(data.path);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-2">
      <button
        onClick={handleRender}
        disabled={status === "rendering"}
        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:cursor-not-allowed text-white"
      >
        {status === "rendering" ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Rendering...
          </>
        ) : status === "done" ? (
          <>
            <CheckCircle className="w-4 h-4 text-green-400" />
            Rendered
          </>
        ) : (
          <>
            <Video className="w-4 h-4" />
            Render to MP4
          </>
        )}
      </button>
      {status === "done" && outputPath && (
        <p className="text-xs text-green-400 text-center">
          Video saved: {outputPath}
        </p>
      )}
      {status === "error" && (
        <p className="text-xs text-red-400 text-center">
          Render failed. Check server console.
        </p>
      )}
      {status === "idle" && (
        <p className="text-xs text-zinc-500 text-center">
          Renders server-side via Next.js API route
        </p>
      )}
    </div>
  );
};
