import React, { useMemo } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

const MotionLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, width, height } = useVideoConfig();

  const progress = (frame % durationInFrames) / durationInFrames;

  // ==========================================
  // GANTI ISI DI BAWAH INI DOANG PAKAI SCRIPT GEMINI
  // JANGAN SENTUH import / export / function di atas
  //
  // ATURAN:
  // 1. Hapus semua import dari script Gemini (React, remotion, dll)
  // 2. Kalau pake SVG fill="url(#xxx)", tambahin <defs> sendiri
  // 3. Kalau pake Easing / useVideoConfig / dll tapi error, hapus aja
  // 4. Pastiin return-nya <AbsoluteFill> ... </AbsoluteFill>
  // ==========================================

  return (
    <AbsoluteFill style={{ backgroundColor: "#0a0a0c", overflow: "hidden" }}>
      {/* MULAI DI SINI — ganti bebas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          fontSize: 40,
          fontFamily: "system-ui, sans-serif",
          fontWeight: "bold",
        }}
      >
        Ganti ini pake efek Gemini
      </div>
      {/* SAMPAI SINI — jangan ubah di luar ini */}
    </AbsoluteFill>
  );
};

export default MotionLayer;
