import React, { useState } from "react";
import { Wand2, Sparkles } from "lucide-react";

interface ScriptInputProps {
  value: string;
  onChange: (val: string) => void;
  onFormat: () => void;
}

export const ScriptInput: React.FC<ScriptInputProps> = ({ value, onChange, onFormat }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={onFormat}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-brand-600 hover:bg-brand-500 text-white transition-colors"
        >
          <Wand2 className="w-3.5 h-3.5" />
          Auto Format
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Paste your script here...
One line = one scene

Example:
Welcome to Our Channel
Today we explore motion graphics
Subscribe for more content"
        rows={10}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent font-mono resize-none"
      />
      <p className="text-xs text-zinc-500">
        Each line becomes a scene. Use Auto Format to clean up and set timing.
      </p>
    </div>
  );
};
