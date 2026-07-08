import React, { useState, useRef, useEffect } from "react";
import { Film, RefreshCw, CheckCircle, AlertCircle, Loader2, Video } from "lucide-react";

import { Player } from "@remotion/player";
import { MotionGraphic } from "../remotion/MotionGraphic";

declare global {
  interface Window {
    showDirectoryPicker: (options?: { mode?: "read" | "readwrite" }) => Promise<any>;
  }
}

const FPS = 30;
const DURATION = 300;
const WIDTH = 1920;
const HEIGHT = 1080;

export default function AppContent() {
  const [bgCode, setBgCode] = useState("");
  const [bgStatus, setBgStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [bgError, setBgError] = useState("");
  const [renderState, setRenderState] = useState<"idle" | "rendering" | "saving" | "done" | "error">("idle");
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderOutput, setRenderOutput] = useState("");
  const [renderFilePath, setRenderFilePath] = useState("");
  const [saveMsg, setSaveMsg] = useState("");
  const [folderPath, setFolderPath] = useState(() => {
    if (typeof window !== "undefined") return localStorage.getItem("outputDir") || "";
    return "";
  });
  const [folderName, setFolderName] = useState("");
  const folderHandle = useRef<any>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const copyAndCleanup = async (srcPath: string): Promise<boolean> => {
    const handle = folderHandle.current;
    if (!handle) return false;
    try {
      const res = await fetch(`/api/download?path=${encodeURIComponent(srcPath)}`);
      if (!res.ok) return false;
      const blob = await res.blob();
      const fh = await handle.getFileHandle(`bg-${Date.now()}.mp4`, { create: true });
      const w = await fh.createWritable();
      await w.write(blob);
      await w.close();
      // Hapus file temp
      try {
        await fetch("/api/render", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filePath: srcPath }),
        });
      } catch {}
      return true;
    } catch {
      return false;
    }
  };

  const pollStatus = () => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/render", { method: "GET" });
        const data = await res.json();
        setRenderProgress(data.progress);
        setRenderOutput(data.output);
        if (data.state === "done") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          const fp = data.filePath || "";
          setRenderFilePath(fp);
          if (folderHandle.current && fp) {
            setRenderState("saving");
            setSaveMsg("Menyimpan ke folder tujuan...");
            const ok = await copyAndCleanup(fp);
            setSaveMsg(
              ok
                ? `Tersimpan di folder "${folderName}"`
                : `File sementara di ${fp}`
            );
          } else if (folderPath.trim()) {
            setSaveMsg(`Tersimpan di ${fp}`);
          } else {
            setSaveMsg(`Render selesai! File di ${fp}`);
          }
          setRenderState("done");
        } else if (data.state === "error") {
          if (pollRef.current) clearInterval(pollRef.current);
          pollRef.current = null;
          setRenderState("error");
        }
      } catch {
        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = null;
        setRenderState("error");
      }
    }, 1000);
  };

  const startRender = async () => {
    if (renderState === "rendering") return;

    const useFolderHandle = !!folderHandle.current;
    const outDir = useFolderHandle ? undefined : (folderPath.trim() || undefined);

    setRenderState("rendering");
    setRenderProgress(0);
    setRenderOutput("");
    setRenderFilePath("");
    setSaveMsg("");
    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fps: FPS, outputDir: outDir }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRenderState("error");
        return;
      }
      pollStatus();
    } catch {
      setRenderState("error");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Film className="w-5 h-5 text-brand-400" />
            <h1 className="text-lg font-bold text-white">MotionGraphic Studio</h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span>{WIDTH}x{HEIGHT}</span>
            <span>{FPS} fps</span>
            <span>{(DURATION / FPS).toFixed(1)}s</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden border border-zinc-800">
              <Player
                component={MotionGraphic}
                durationInFrames={DURATION}
                fps={FPS}
                compositionWidth={WIDTH}
                compositionHeight={HEIGHT}
                style={{ width: "100%", height: "100%" }}
                controls
                loop
              />
            </div>

            {renderState === "rendering" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-brand-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Rendering... {renderProgress}%
                </div>
                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-brand-500 transition-all duration-500 rounded-full"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
              </div>
            )}

            {renderState === "saving" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-brand-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {saveMsg}
                </div>
              </div>
            )}

            {renderState === "done" && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 text-sm text-emerald-400">
                  <CheckCircle className="w-4 h-4" />
                  {saveMsg}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-2 space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">
                  Background Code
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      setBgStatus("idle");
                      setBgError("");
                      try {
                        const res = await fetch("/api/reset-background", { method: "POST" });
                        const data = await res.json();
                        if (data.success) {
                          setBgStatus("success");
                          setTimeout(() => setBgStatus("idle"), 2000);
                        } else {
                          setBgStatus("error");
                          setBgError(data.error || "Reset failed");
                        }
                      } catch {
                        setBgStatus("error");
                        setBgError("Network error");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Reset
                  </button>
                  <button
                    onClick={async () => {
                      if (!bgCode.trim()) return;
                      setBgStatus("saving");
                      setBgError("");
                      try {
                        const res = await fetch("/api/save-background", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ code: bgCode }),
                        });
                        const data = await res.json();
                        if (data.success) {
                          setBgStatus("success");
                          setTimeout(() => setBgStatus("idle"), 2000);
                        } else {
                          setBgStatus("error");
                          setBgError(data.error || "Save failed");
                        }
                      } catch {
                        setBgStatus("error");
                        setBgError("Network error");
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors"
                  >
                    {bgStatus === "saving" ? (
                      <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>
                    ) : (
                      "Apply"
                    )}
                  </button>
                </div>
              </div>
              <textarea
                value={bgCode}
                onChange={(e) => setBgCode(e.target.value)}
                placeholder={"// Paste your React component here\n// Must export default a React.FC\n\nimport React from 'react';\nimport { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';\n\nconst MyBg: React.FC = () => {\n  const frame = useCurrentFrame();\n  const { width, height } = useVideoConfig();\n  return (\n    <AbsoluteFill style={{\n      background: '#1a1a2e',\n      display: 'flex',\n      alignItems: 'center',\n      justifyContent: 'center',\n    }}>\n      <div style={{ color: 'white', fontSize: 48 }}>\n        Frame {frame}\n      </div>\n    </AbsoluteFill>\n  );\n};\n\nexport default MyBg;"}
                rows={20}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono resize-none"
                spellCheck={false}
              />
              {bgStatus === "success" && (
                <div className="flex items-center gap-2 text-xs text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Applied!
                </div>
              )}
              {bgStatus === "error" && (
                <div className="flex items-center gap-2 text-xs text-red-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {bgError || "Save failed."}
                </div>
              )}
              <p className="text-xs text-zinc-500">
                Paste React code, klik Apply. Preview update otomatis.
              </p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-zinc-500 mb-1 block">
                  Folder Tujuan
                </label>
                <div className="flex gap-2">
                  <input
                    value={folderPath}
                    onChange={(e) => {
                      setFolderPath(e.target.value);
                      localStorage.setItem("outputDir", e.target.value);
                    }}
                    placeholder="D:\Videos"
                    className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                  <button
                    onClick={async () => {
                      try {
                        const handle = await window.showDirectoryPicker({ mode: "readwrite" });
                        folderHandle.current = handle;
                        setFolderName(handle.name);
                      } catch {}
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-700 hover:bg-zinc-600 text-zinc-300 transition-colors"
                    title="Browse folder"
                  >
                    <FolderOpenIcon />
                  </button>
                </div>
                {folderName && (
                  <p className="text-xs text-zinc-500 mt-1">
                    Selected: {folderName}
                  </p>
                )}
              </div>
              <button
                onClick={startRender}
                disabled={renderState === "rendering" || renderState === "saving"}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all bg-brand-600 hover:bg-brand-500 disabled:bg-brand-800 disabled:cursor-not-allowed text-white"
              >
                {renderState === "rendering" || renderState === "saving" ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Rendering...</>
                ) : (
                  <><Video className="w-4 h-4" /> Render to MP4</>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function FolderOpenIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
    </svg>
  );
}
