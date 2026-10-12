import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ScriptSegment, SceneMood, GraphicElement } from "@/lib/types";

interface Props {
  segment: ScriptSegment;
}

// Modern Mood Color Palettes
interface MoodTheme {
  primary: string;
  glow: string;
  badgeBg: string;
  badgeBorder: string;
  bgGradient: string;
  orb1: string;
  orb2: string;
}

const MOOD_THEMES: Record<SceneMood, MoodTheme> = {
  crimson_danger: {
    primary: "#ef4444",
    glow: "rgba(239, 68, 68, 0.4)",
    badgeBg: "rgba(127, 29, 29, 0.35)",
    badgeBorder: "rgba(239, 68, 68, 0.4)",
    bgGradient: "radial-gradient(circle at 50% 40%, #1a080a 0%, #060203 100%)",
    orb1: "rgba(220, 38, 38, 0.25)",
    orb2: "rgba(153, 27, 27, 0.15)",
  },
  cyan_cyber: {
    primary: "#38bdf8",
    glow: "rgba(56, 189, 248, 0.4)",
    badgeBg: "rgba(12, 74, 110, 0.35)",
    badgeBorder: "rgba(56, 189, 248, 0.4)",
    bgGradient: "radial-gradient(circle at 50% 40%, #031726 0%, #020617 100%)",
    orb1: "rgba(56, 189, 248, 0.22)",
    orb2: "rgba(2, 132, 199, 0.15)",
  },
  emerald_matrix: {
    primary: "#10b981",
    glow: "rgba(16, 185, 129, 0.4)",
    badgeBg: "rgba(6, 78, 59, 0.35)",
    badgeBorder: "rgba(16, 185, 129, 0.4)",
    bgGradient: "radial-gradient(circle at 50% 40%, #041a12 0%, #020a06 100%)",
    orb1: "rgba(16, 185, 129, 0.22)",
    orb2: "rgba(5, 150, 105, 0.15)",
  },
  amber_archive: {
    primary: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.4)",
    badgeBg: "rgba(120, 53, 15, 0.35)",
    badgeBorder: "rgba(245, 158, 11, 0.4)",
    bgGradient: "radial-gradient(circle at 50% 40%, #1c1306 0%, #0a0703 100%)",
    orb1: "rgba(245, 158, 11, 0.22)",
    orb2: "rgba(217, 119, 6, 0.15)",
  },
  violet_cosmic: {
    primary: "#a855f7",
    glow: "rgba(168, 85, 247, 0.4)",
    badgeBg: "rgba(88, 28, 135, 0.35)",
    badgeBorder: "rgba(168, 85, 247, 0.4)",
    bgGradient: "radial-gradient(circle at 50% 40%, #150926 0%, #06020a 100%)",
    orb1: "rgba(168, 85, 247, 0.25)",
    orb2: "rgba(126, 34, 206, 0.15)",
  },
  monochrome_noir: {
    primary: "#f1f5f9",
    glow: "rgba(241, 245, 249, 0.3)",
    badgeBg: "rgba(30, 41, 59, 0.5)",
    badgeBorder: "rgba(148, 163, 184, 0.3)",
    bgGradient: "radial-gradient(circle at 50% 40%, #11141c 0%, #040508 100%)",
    orb1: "rgba(148, 163, 184, 0.18)",
    orb2: "rgba(71, 85, 105, 0.12)",
  },
};

export const DynamicScene: React.FC<Props> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Resolve mood and theme
  const mood = segment.mood || "crimson_danger";
  const theme = MOOD_THEMES[mood] || MOOD_THEMES.crimson_danger;
  const graphicType = segment.graphicType || "kinetic_minimal";

  // Slow ambient camera drift / zoom (Ken Burns)
  const cameraZoom = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  // Floating ambient lighting movement
  const orb1X = Math.sin(frame * 0.04) * 30;
  const orb1Y = Math.cos(frame * 0.04) * 25;
  const orb2X = -Math.sin(frame * 0.03) * 35;
  const orb2Y = -Math.cos(frame * 0.03) * 20;

  // Spring animation for main focus title
  const focusTitleSpring = spring({
    frame,
    fps,
    config: { damping: 14, mass: 0.5, stiffness: 180 },
  });

  // Voiceover phrase chunking: 2 to 4 words per chunk to prevent clutter!
  const words = (segment.voiceover || "").split(/\s+/).filter(Boolean);
  const wordsPerChunk = 3;
  const chunks: string[][] = [];
  for (let i = 0; i < words.length; i += wordsPerChunk) {
    chunks.push(words.slice(i, i + wordsPerChunk));
  }

  // Determine current active subtitle chunk
  const totalChunks = Math.max(1, chunks.length);
  const framesPerChunk = Math.max(8, Math.floor(durationInFrames / totalChunks));
  const currentChunkIdx = Math.min(
    totalChunks - 1,
    Math.floor(frame / framesPerChunk)
  );
  const currentChunk = chunks[currentChunkIdx] || [];

  // Chunk progress for subtle active word highlight within chunk
  const chunkFrame = frame - currentChunkIdx * framesPerChunk;
  const activeWordInChunk = Math.min(
    currentChunk.length - 1,
    Math.floor((chunkFrame / framesPerChunk) * currentChunk.length)
  );

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        backgroundColor: "#030407",
        background: theme.bgGradient,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px 56px",
        boxSizing: "border-box",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Dynamic Ambient Floating Glow Orbs */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          width: "550px",
          height: "550px",
          borderRadius: "50%",
          backgroundColor: theme.orb1,
          filter: "blur(110px)",
          pointerEvents: "none",
          transform: `translate(-50%, -50%) translate(${orb1X}px, ${orb1Y}px)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          right: "20%",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          backgroundColor: theme.orb2,
          filter: "blur(120px)",
          pointerEvents: "none",
          transform: `translate(${orb2X}px, ${orb2Y}px)`,
        }}
      />

      {/* Subtle modern cinematic grid lines (very low opacity) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.08,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern id="modern-subtle-grid" width="80" height="80" patternUnits="userSpaceOnUse">
            <path d="M 80 0 L 0 0 0 80" fill="none" stroke="#ffffff" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#modern-subtle-grid)" />
      </svg>

      {/* Corner HUD framing brackets (Sleek Modern Documentary Vibe) */}
      <div style={{ position: "absolute", top: 40, left: 40, width: 24, height: 24, borderTop: `2px solid ${theme.primary}`, borderLeft: `2px solid ${theme.primary}`, opacity: 0.6 }} />
      <div style={{ position: "absolute", top: 40, right: 40, width: 24, height: 24, borderTop: `2px solid ${theme.primary}`, borderRight: `2px solid ${theme.primary}`, opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: 40, left: 40, width: 24, height: 24, borderBottom: `2px solid ${theme.primary}`, borderLeft: `2px solid ${theme.primary}`, opacity: 0.6 }} />
      <div style={{ position: "absolute", bottom: 40, right: 40, width: 24, height: 24, borderBottom: `2px solid ${theme.primary}`, borderRight: `2px solid ${theme.primary}`, opacity: 0.6 }} />

      {/* Top Header / Clean Context Badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 10,
        }}
      >
        {/* Context Tag Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "20px",
            backgroundColor: theme.badgeBg,
            border: `1px solid ${theme.badgeBorder}`,
            backdropFilter: "blur(12px)",
          }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              backgroundColor: theme.primary,
              boxShadow: `0 0 10px ${theme.primary}`,
            }}
          />
          <span
            style={{
              fontSize: "14px",
              fontWeight: 700,
              fontFamily: "monospace",
              letterSpacing: "0.15em",
              color: "#f8fafc",
              textTransform: "uppercase",
            }}
          >
            {segment.tag || "DEEP ARCHIVE"}
          </span>
        </div>

        {/* Minimal Timeline / Sequence Indicator */}
        <div
          style={{
            fontSize: "14px",
            fontFamily: "monospace",
            color: "rgba(255, 255, 255, 0.4)",
            letterSpacing: "0.2em",
          }}
        >
          {segment.id < 10 ? `0${segment.id}` : segment.id} // SEC
        </div>
      </div>

      {/* Center Dynamic Graphic Component */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          transform: `scale(${cameraZoom})`,
          zIndex: 10,
          margin: "30px 0",
        }}
      >
        {/* Render Contextual Clean Graphic Artifact */}
        {renderGraphicElement(graphicType, theme, frame, durationInFrames, segment)}

        {/* Focus Word (1 to 3 words only - High Impact & Modern) */}
        <div
          style={{
            marginTop: "36px",
            textAlign: "center",
            maxWidth: "920px",
            transform: `scale(${focusTitleSpring})`,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "62px",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textTransform: "uppercase",
              color: "#ffffff",
              textShadow: `0 0 35px ${theme.glow}, 0 4px 16px rgba(0,0,0,0.8)`,
              fontFamily: "'Impact', 'Arial Black', -apple-system, sans-serif",
            }}
          >
            {segment.focusWord || segment.headline || "CRITICAL EVENT"}
          </h2>
        </div>
      </div>

      {/* Bottom Paced Subtitles: Only 2-3 words at a time! Clean, Uncluttered & Rhythmic */}
      <div
        style={{
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "120px",
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.65)",
            backdropFilter: "blur(16px)",
            padding: "16px 28px",
            borderRadius: "16px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            maxWidth: "880px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.7)",
          }}
        >
          {currentChunk.map((w, wIdx) => {
            const isHighlight = wIdx === activeWordInChunk;
            return (
              <span
                key={`${currentChunkIdx}-${wIdx}`}
                style={{
                  fontSize: "36px",
                  fontWeight: isHighlight ? 900 : 700,
                  letterSpacing: "-0.01em",
                  color: isHighlight ? theme.primary : "#e2e8f0",
                  textShadow: isHighlight
                    ? `0 0 20px ${theme.primary}, 0 2px 8px rgba(0,0,0,0.8)`
                    : "none",
                  transition: "all 0.1s ease",
                  transform: isHighlight ? "scale(1.06)" : "scale(1)",
                  display: "inline-block",
                }}
              >
                {w}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Helper function to render modern uncluttered graphic artifacts
function renderGraphicElement(
  graphicType: GraphicElement,
  theme: MoodTheme,
  frame: number,
  durationInFrames: number,
  segment: ScriptSegment
) {
  switch (graphicType) {
    case "radar_scanner": {
      const sweepAngle = (frame * 4) % 360;
      return (
        <div
          style={{
            position: "relative",
            width: "320px",
            height: "320px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg width="320" height="320" style={{ position: "absolute", inset: 0 }}>
            <circle cx="160" cy="160" r="150" fill="none" stroke={theme.primary} strokeWidth="1.5" opacity="0.4" strokeDasharray="6 6" />
            <circle cx="160" cy="160" r="100" fill="none" stroke={theme.primary} strokeWidth="1" opacity="0.3" />
            <circle cx="160" cy="160" r="50" fill="none" stroke={theme.primary} strokeWidth="1" opacity="0.3" />
            <line x1="160" y1="10" x2="160" y2="310" stroke={theme.primary} strokeWidth="1" opacity="0.25" />
            <line x1="10" y1="160" x2="310" y2="160" stroke={theme.primary} strokeWidth="1" opacity="0.25" />
          </svg>
          <div
            style={{
              position: "absolute",
              width: "280px",
              height: "280px",
              borderRadius: "50%",
              transform: `rotate(${sweepAngle}deg)`,
              background: `conic-gradient(from 0deg, ${theme.primary}55 0deg, transparent 60deg)`,
            }}
          />
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: theme.primary,
              boxShadow: `0 0 16px ${theme.primary}`,
            }}
          />
        </div>
      );
    }

    case "redacted_strip": {
      const redactionOpen = interpolate(frame, [10, 45], [100, 15], {
        extrapolateRight: "clamp",
        extrapolateLeft: "clamp",
      });
      return (
        <div
          style={{
            width: "420px",
            padding: "24px 30px",
            borderRadius: "16px",
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            border: `1px solid ${theme.badgeBorder}`,
            backdropFilter: "blur(16px)",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            boxShadow: `0 10px 40px rgba(0,0,0,0.5)`,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", fontFamily: "monospace", color: theme.primary }}>
            <span>TOP SECRET // LEVEL 5</span>
            <span>RESTRICTED</span>
          </div>
          <div style={{ height: "18px", borderRadius: "4px", backgroundColor: "#0f172a", position: "relative", overflow: "hidden" }}>
            <div style={{ width: `${redactionOpen}%`, height: "100%", backgroundColor: theme.primary, opacity: 0.85 }} />
          </div>
          <div style={{ height: "18px", borderRadius: "4px", backgroundColor: "#0f172a", position: "relative", overflow: "hidden" }}>
            <div style={{ width: "70%", height: "100%", backgroundColor: "#334155" }} />
          </div>
        </div>
      );
    }

    case "audio_waveform": {
      const bars = [30, 65, 90, 45, 80, 100, 50, 75, 40, 85, 60, 95, 35];
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            height: "140px",
            padding: "20px 36px",
            borderRadius: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            border: `1px solid ${theme.badgeBorder}`,
            backdropFilter: "blur(14px)",
          }}
        >
          {bars.map((h, i) => {
            const dynamicHeight = Math.max(
              15,
              h * (0.6 + 0.4 * Math.sin(frame * 0.2 + i * 0.8))
            );
            return (
              <div
                key={i}
                style={{
                  width: "12px",
                  height: `${dynamicHeight}px`,
                  borderRadius: "6px",
                  backgroundColor: theme.primary,
                  boxShadow: `0 0 12px ${theme.glow}`,
                  transition: "height 0.05s ease",
                }}
              />
            );
          })}
        </div>
      );
    }

    case "telemetry_coords": {
      const lat = (37.243 + ((frame * 3) % 50) * 0.001).toFixed(4);
      const lon = (-115.81 + ((frame * 5) % 50) * 0.001).toFixed(4);
      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {/* Crosshair Target */}
          <div
            style={{
              width: "140px",
              height: "140px",
              borderRadius: "50%",
              border: `2px dashed ${theme.primary}`,
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 25px ${theme.glow}`,
            }}
          >
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: theme.primary }} />
            <div style={{ position: "absolute", width: "100%", height: "1px", backgroundColor: theme.primary, opacity: 0.5 }} />
            <div style={{ position: "absolute", height: "100%", width: "1px", backgroundColor: theme.primary, opacity: 0.5 }} />
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: "16px",
              letterSpacing: "0.15em",
              color: "#e2e8f0",
              backgroundColor: "rgba(0,0,0,0.6)",
              padding: "8px 18px",
              borderRadius: "8px",
              border: `1px solid ${theme.badgeBorder}`,
            }}
          >
            LOCK: {lat}° N, {lon}° W
          </div>
        </div>
      );
    }

    case "timeline_marker": {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            backgroundColor: "rgba(0,0,0,0.6)",
            padding: "16px 28px",
            borderRadius: "16px",
            border: `1px solid ${theme.badgeBorder}`,
          }}
        >
          <span style={{ fontSize: "28px", fontWeight: 900, fontFamily: "monospace", color: theme.primary }}>
            1974
          </span>
          <div style={{ width: "40px", height: "2px", backgroundColor: theme.primary }} />
          <span style={{ fontSize: "16px", fontWeight: 700, fontFamily: "monospace", color: "#f8fafc", letterSpacing: "0.1em" }}>
            INCIDENT ARCHIVED
          </span>
        </div>
      );
    }

    case "evidence_tag":
    default: {
      return (
        <div
          style={{
            width: "280px",
            padding: "20px 24px",
            borderRadius: "16px",
            backgroundColor: "rgba(15, 23, 42, 0.65)",
            border: `1px solid ${theme.badgeBorder}`,
            backdropFilter: "blur(14px)",
            textAlign: "center",
            boxShadow: `0 0 30px ${theme.glow}`,
          }}
        >
          <div style={{ fontSize: "11px", fontFamily: "monospace", letterSpacing: "0.2em", color: theme.primary, textTransform: "uppercase" }}>
            EVIDENCE REPOSITORY
          </div>
          <div style={{ marginTop: "8px", fontSize: "24px", fontWeight: 900, fontFamily: "monospace", color: "#ffffff" }}>
            ITEM #094-B
          </div>
        </div>
      );
    }
  }
}

