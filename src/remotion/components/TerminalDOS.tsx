import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ScriptSegment } from "@/lib/types";

interface Props {
  segment: ScriptSegment;
}

export const TerminalDOS: React.FC<Props> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Full text to type out
  const fullText = segment.voiceover;
  const charsPerFrame = Math.max(1, Math.floor(fullText.length / Math.max(1, durationInFrames - 20)));
  const visibleChars = Math.min(fullText.length, Math.floor(frame * charsPerFrame));
  const displayedText = fullText.slice(0, visibleChars);

  // Blinking cursor: blinks every 12 frames
  const showCursor = Math.floor(frame / 6) % 2 === 0;

  // Red Warning Box trigger: appears in the middle or last third of the sequence
  const showWarning = frame > Math.floor(durationInFrames * 0.35);

  // Shake offset calculation for the red box
  const shakeX = showWarning ? Math.sin(frame * 0.8) * 8 : 0;
  const shakeY = showWarning ? Math.cos(frame * 0.8) * 4 : 0;

  // Scanline flicker
  const scanlineOpacity = 0.15 + (Math.sin(frame * 0.3) * 0.05);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#050806",
        color: "#00ff66",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        padding: "60px 48px",
        boxSizing: "border-box",
        fontFamily: "'Courier New', Courier, monospace",
      }}
    >
      {/* CRT Scanline effect overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03))",
          backgroundSize: "100% 4px, 6px 100%",
          pointerEvents: "none",
          opacity: scanlineOpacity,
          zIndex: 30,
        }}
      />

      {/* CRT Vignette Curve */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)",
          pointerEvents: "none",
          zIndex: 25,
        }}
      />

      {/* Terminal Title Bar */}
      <div
        style={{
          borderBottom: "2px solid #00ff66",
          paddingBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: "18px",
          letterSpacing: "0.15em",
          zIndex: 10,
        }}
      >
        <span style={{ fontWeight: "bold" }}>MS-DOS 6.22 [ROOT ACCESS]</span>
        <span style={{ color: "#22c55e", fontSize: "16px" }}>MEM: 640K OK</span>
      </div>

      {/* System Boot Logs */}
      <div
        style={{
          marginTop: "24px",
          fontSize: "17px",
          lineHeight: 1.6,
          opacity: 0.7,
          zIndex: 10,
        }}
      >
        <div>{`> C:\\SYSTEM\\ARCHIVES\\SEC_FILE_${segment.id}.DAT`}</div>
        <div>{`> DECRYPTING CIPHER: RSA-4096 (BYPASS=TRUE)`}</div>
        <div>{`> CHECKSUM MATCHED: 0x9F4C2A8E`}</div>
      </div>

      {/* Main Headline or Alert prompt */}
      {segment.headline && (
        <div
          style={{
            marginTop: "32px",
            backgroundColor: "rgba(0, 255, 102, 0.12)",
            borderLeft: "6px solid #00ff66",
            padding: "16px 20px",
            fontSize: "28px",
            fontWeight: "bold",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            zIndex: 10,
          }}
        >
          {`>>> ${segment.headline}`}
        </div>
      )}

      {/* Voiceover Typed Output */}
      <div
        style={{
          marginTop: "40px",
          flex: 1,
          fontSize: "34px",
          lineHeight: 1.5,
          fontWeight: "bold",
          color: "#e6ffe6",
          textShadow: "0 0 12px rgba(0, 255, 102, 0.6)",
          zIndex: 10,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        <span>{displayedText}</span>
        {showCursor && (
          <span
            style={{
              backgroundColor: "#00ff66",
              color: "#000",
              marginLeft: "4px",
              padding: "0 2px",
              boxShadow: "0 0 10px #00ff66",
            }}
          >
            █
          </span>
        )}
      </div>

      {/* Red ACCESS DENIED Shake Box */}
      {showWarning && (
        <div
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            transform: `translate(-50%, -50%) translate(${shakeX}px, ${shakeY}px)`,
            backgroundColor: "rgba(185, 28, 28, 0.95)",
            border: "4px solid #ef4444",
            padding: "24px 36px",
            color: "#ffffff",
            textAlign: "center",
            boxShadow: "0 0 40px rgba(239, 68, 68, 0.8)",
            zIndex: 40,
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              fontSize: "42px",
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontFamily: "'Impact', sans-serif",
            }}
          >
            ACCESS DENIED
          </div>
          <div
            style={{
              marginTop: "8px",
              fontSize: "18px",
              letterSpacing: "0.15em",
              color: "#fecaca",
            }}
          >
            SECURITY BREACH DETECTED // NODE COMPROMISED
          </div>
        </div>
      )}

      {/* Bottom Status Bar */}
      <div
        style={{
          borderTop: "1px solid rgba(0, 255, 102, 0.3)",
          paddingTop: "16px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "16px",
          color: "rgba(0, 255, 102, 0.7)",
          zIndex: 10,
        }}
      >
        <span>STATUS: STREAMING_VOICEOVER</span>
        <span>FRAME: {frame}/{durationInFrames}</span>
      </div>
    </div>
  );
};

