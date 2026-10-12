import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ScriptSegment } from "@/lib/types";

interface Props {
  segment: ScriptSegment;
}

export const Newspaper: React.FC<Props> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Highlight wipe animation: 0% to 100% width
  const highlightProgress = interpolate(
    frame,
    [10, Math.min(60, durationInFrames - 10)],
    [0, 100],
    { extrapolateRight: "clamp", extrapolateLeft: "clamp" }
  );

  // Subtle slow zoom in (Ken Burns effect)
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.05], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#f4ecd8", // Parchment tone
        color: "#1c1917",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "70px 52px",
        boxSizing: "border-box",
        fontFamily: "'Georgia', 'Times New Roman', serif",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}
    >
      {/* Paper texture overlay (subtle vignette and aging) */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, transparent 60%, rgba(120, 90, 40, 0.25) 100%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Masthead / Newspaper Header */}
      <div
        style={{
          borderBottom: "4px double #1c1917",
          paddingBottom: "16px",
          textAlign: "center",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: "14px",
            fontFamily: "monospace",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            marginBottom: "8px",
            fontWeight: "bold",
            color: "#44403c",
          }}
        >
          <span>VOL. XLVIII NO. 142</span>
          <span>SPECIAL INVESTIGATION</span>
          <span>PRICE 5 CENTS</span>
        </div>

        <h1
          style={{
            margin: 0,
            fontSize: "46px",
            fontWeight: 900,
            letterSpacing: "-0.02em",
            textTransform: "uppercase",
            fontFamily: "'Times New Roman', serif",
            lineHeight: 1.1,
          }}
        >
          THE CHRONICLE DISPATCH
        </h1>

        <div
          style={{
            marginTop: "12px",
            borderTop: "1px solid #292524",
            paddingTop: "6px",
            fontSize: "13px",
            fontStyle: "italic",
            color: "#57534e",
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <span>DEEP INVESTIGATION ARCHIVES</span>
          <span>•</span>
          <span>UNCLASSIFIED RECORDS</span>
        </div>
      </div>

      {/* Main Headline */}
      <div style={{ marginTop: "36px", marginBottom: "24px" }}>
        <h2
          style={{
            fontSize: "44px",
            fontWeight: 900,
            lineHeight: 1.15,
            margin: 0,
            color: "#0c0a09",
            textTransform: "uppercase",
            letterSpacing: "-0.01em",
          }}
        >
          {segment.headline || "EVIDENCE REVEALED IN SHOCKING DISCOVERY"}
        </h2>
      </div>

      {/* Yellow Highlighter Box on the Voiceover Content */}
      <div
        style={{
          margin: "24px 0",
          padding: "24px",
          border: "2px dashed #78716c",
          backgroundColor: "#ede4cb",
          position: "relative",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            fontSize: "14px",
            fontFamily: "monospace",
            fontWeight: "bold",
            color: "#b91c1c",
            marginBottom: "12px",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          [ TRANSCRIPT EXTRACT ]
        </div>

        {/* Text with highlighter effect */}
        <div style={{ position: "relative", display: "inline-block" }}>
          {/* Yellow highlighter background div */}
          <div
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              width: `${highlightProgress}%`,
              backgroundColor: "rgba(254, 240, 138, 0.75)", // Neon yellow marker
              mixBlendMode: "multiply",
              borderRadius: "4px",
              boxShadow: "0 0 10px rgba(250, 204, 21, 0.4)",
              transition: "width 0.05s linear",
            }}
          />
          <p
            style={{
              position: "relative",
              margin: 0,
              fontSize: "30px",
              lineHeight: 1.45,
              fontWeight: 700,
              color: "#1c1917",
              fontStyle: "italic",
            }}
          >
            "{segment.voiceover}"
          </p>
        </div>
      </div>

      {/* 2-Column Newspaper Mock Body */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginTop: "16px",
          fontSize: "16px",
          lineHeight: 1.5,
          color: "#44403c",
          textAlign: "justify",
          borderTop: "1px solid #a8a29e",
          paddingTop: "20px",
        }}
      >
        <div>
          <p style={{ margin: 0 }}>
            Officials have refused to comment on newly unearthed documents dating back decades.
            Independent witnesses claim the records contradict the official narrative completely.
            Key witnesses reported missing logbooks and redacted cables prior to the incident.
          </p>
        </div>
        <div>
          <p style={{ margin: 0 }}>
            Forensic analysis of the remaining archives points toward a systematic coverup.
            Investigators discovered that references to this operation were quietly scrubbed from
            national repositories in the subsequent weeks.
          </p>
        </div>
      </div>

      {/* Red Vintage Stamp */}
      <div
        style={{
          position: "absolute",
          bottom: "100px",
          right: "60px",
          border: "4px solid #b91c1c",
          color: "#b91c1c",
          padding: "10px 24px",
          fontSize: "28px",
          fontWeight: 900,
          letterSpacing: "0.2em",
          transform: "rotate(-12deg)",
          opacity: 0.85,
          fontFamily: "'Courier New', monospace",
          borderRadius: "6px",
          boxShadow: "0 0 8px rgba(185, 28, 28, 0.3)",
        }}
      >
        VERIFIED
      </div>
    </div>
  );
};

