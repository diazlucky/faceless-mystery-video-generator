import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { ScriptSegment } from "@/lib/types";

interface Props {
  segment: ScriptSegment;
}

export const KineticText: React.FC<Props> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Words breakdown
  const textToDisplay = segment.headline || segment.voiceover;
  const words = textToDisplay.split(/\s+/).filter(Boolean);

  // Calculate timing per word
  const framesPerWord = Math.max(4, Math.floor(durationInFrames / Math.max(words.length, 1)));
  const currentWordIndex = Math.min(
    words.length - 1,
    Math.floor(frame / framesPerWord)
  );

  // Background subtle pulse / zoom
  const bgScale = interpolate(frame, [0, durationInFrames], [1, 1.08], {
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#050508",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 48px",
        boxSizing: "border-box",
      }}
    >
      {/* Background vignette & ambient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.15) 0%, rgba(5, 5, 8, 0.95) 75%)",
          transform: `scale(${bgScale})`,
        }}
      />

      {/* Decorative mystery watermark / frame */}
      <div
        style={{
          position: "absolute",
          top: 80,
          left: 48,
          right: 48,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "2px solid rgba(255, 255, 255, 0.1)",
          paddingBottom: 16,
          zIndex: 10,
        }}
      >
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 22,
            letterSpacing: "0.25em",
            color: "rgba(239, 68, 68, 0.9)",
            textTransform: "uppercase",
            fontWeight: "bold",
          }}
        >
          ● CLASSIFIED FILE
        </span>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 20,
            letterSpacing: "0.15em",
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          SEGMENT {segment.id < 10 ? `0${segment.id}` : segment.id}
        </span>
      </div>

      {/* Word-by-word kinetic text presentation */}
      <div
        style={{
          zIndex: 20,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          gap: "16px 20px",
          maxWidth: "920px",
          textAlign: "center",
        }}
      >
        {words.map((word, idx) => {
          const isVisible = idx <= currentWordIndex;
          const isCurrent = idx === currentWordIndex;

          const wordSpring = spring({
            frame: frame - idx * framesPerWord,
            fps,
            config: {
              damping: 12,
              mass: 0.3,
              stiffness: 220,
            },
          });

          const scale = isCurrent ? 1.18 : 1;
          const isHighlight =
            segment.highlightWords?.some((h) =>
              word.toLowerCase().includes(h.toLowerCase())
            ) || isCurrent;

          if (!isVisible) {
            return (
              <span
                key={idx}
                style={{
                  opacity: 0.08,
                  fontSize: 54,
                  fontWeight: 900,
                  fontFamily: "'Impact', 'Arial Black', sans-serif",
                  color: "#ffffff",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                }}
              >
                {word}
              </span>
            );
          }

          return (
            <span
              key={idx}
              style={{
                display: "inline-block",
                transform: `scale(${wordSpring * scale})`,
                fontSize: 54,
                fontWeight: 900,
                fontFamily: "'Impact', 'Arial Black', sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                color: isHighlight ? "#facc15" : "#ffffff",
                textShadow: isHighlight
                  ? "0 0 24px rgba(250, 204, 21, 0.8), 0 0 8px rgba(0,0,0,0.8)"
                  : "0 4px 12px rgba(0, 0, 0, 0.8)",
                transition: "color 0.1s ease",
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {/* Subtext Voiceover Subtitle Bar at Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: 120,
          left: 48,
          right: 48,
          zIndex: 10,
          background: "rgba(0, 0, 0, 0.6)",
          padding: "20px 24px",
          borderRadius: 12,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(8px)",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 26,
            lineHeight: 1.4,
            color: "#e2e8f0",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontWeight: 500,
          }}
        >
          {segment.voiceover}
        </p>
      </div>
    </div>
  );
};

