import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { ScriptSegment } from "@/lib/types";

interface Props {
  segment: ScriptSegment;
}

export const RadarGrid: React.FC<Props> = ({ segment }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  // Radar sweep rotation angle
  const rotationAngle = (frame * 3.5) % 360;

  // Coordinate jitter / random numbers based on frame
  const coordLat = (37.2431 + ((frame * 7) % 100) * 0.0001).toFixed(4);
  const coordLon = (-115.793 + ((frame * 11) % 100) * 0.0001).toFixed(4);
  const signalLock = Math.min(100, Math.floor(75 + ((frame * 3) % 26)));

  // HUD pulse
  const hudPulse = 0.8 + 0.2 * Math.sin(frame * 0.15);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#030712",
        color: "#38bdf8",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "60px 48px",
        boxSizing: "border-box",
        fontFamily: "'Courier New', monospace",
      }}
    >
      {/* Background Cyber Grid */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.2,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern id="radar-grid-pattern" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#0284c7" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#radar-grid-pattern)" />
      </svg>

      {/* Top Telemetry Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid rgba(56, 189, 248, 0.4)",
          paddingBottom: "16px",
          zIndex: 10,
        }}
      >
        <div>
          <div style={{ fontSize: "20px", fontWeight: "bold", letterSpacing: "0.2em", color: "#38bdf8" }}>
            [ SATELLITE RADAR // DEEP SURVEILLANCE ]
          </div>
          <div style={{ fontSize: "15px", color: "rgba(56, 189, 248, 0.7)", marginTop: "4px" }}>
            TARGET ACQUISITION: ACTIVE
          </div>
        </div>

        <div style={{ textAlign: "right", fontSize: "16px", color: "#facc15" }}>
          <div>SIG LOCK: {signalLock}%</div>
          <div style={{ color: "#38bdf8", fontSize: "14px" }}>GRID SECTOR: 7-G</div>
        </div>
      </div>

      {/* Center Radar Scanner Viewport */}
      <div
        style={{
          position: "relative",
          width: "560px",
          height: "560px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        {/* Concentric Circles & Crosshairs */}
        <svg width="560" height="560" style={{ position: "absolute", inset: 0 }}>
          <circle cx="280" cy="280" r="260" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="8 6" opacity="0.6" />
          <circle cx="280" cy="280" r="190" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.5" />
          <circle cx="280" cy="280" r="110" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.4" />
          <circle cx="280" cy="280" r="30" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
          <circle cx="280" cy="280" r="4" fill="#38bdf8" />

          {/* Crosshairs */}
          <line x1="280" y1="10" x2="280" y2="550" stroke="#0284c7" strokeWidth="1" opacity="0.4" />
          <line x1="10" y1="280" x2="550" y2="280" stroke="#0284c7" strokeWidth="1" opacity="0.4" />

          {/* Compass labels */}
          <text x="280" y="32" fill="#38bdf8" fontSize="14" textAnchor="middle" fontWeight="bold">N 000°</text>
          <text x="535" y="285" fill="#38bdf8" fontSize="14" textAnchor="middle" fontWeight="bold">E 090°</text>
          <text x="280" y="542" fill="#38bdf8" fontSize="14" textAnchor="middle" fontWeight="bold">S 180°</text>
          <text x="28" y="285" fill="#38bdf8" fontSize="14" textAnchor="middle" fontWeight="bold">W 270°</text>
        </svg>

        {/* Radar Sweep Rotating Beam */}
        <div
          style={{
            position: "absolute",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            transform: `rotate(${rotationAngle}deg)`,
            pointerEvents: "none",
            background:
              "conic-gradient(from 0deg, rgba(56, 189, 248, 0.45) 0deg, rgba(56, 189, 248, 0) 65deg, transparent 65deg)",
          }}
        />

        {/* Pulsing Radar Target Blips */}
        <div
          style={{
            position: "absolute",
            top: "140px",
            left: "340px",
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            backgroundColor: "#ef4444",
            boxShadow: "0 0 16px #ef4444",
            opacity: hudPulse,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "380px",
            left: "170px",
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "#facc15",
            boxShadow: "0 0 12px #facc15",
            opacity: 0.8,
          }}
        />
      </div>

      {/* Real-time Telemetry Coordinates */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          backgroundColor: "rgba(15, 23, 42, 0.8)",
          padding: "16px 20px",
          border: "1px solid rgba(56, 189, 248, 0.3)",
          borderRadius: "8px",
          zIndex: 10,
        }}
      >
        <div style={{ fontSize: "16px", color: "rgba(224, 242, 254, 0.9)" }}>
          <div>LAT: <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{coordLat}° N</span></div>
          <div>LON: <span style={{ color: "#38bdf8", fontWeight: "bold" }}>{coordLon}° W</span></div>
        </div>
        <div style={{ fontSize: "16px", color: "rgba(224, 242, 254, 0.9)", textAlign: "right" }}>
          <div>TRACK: <span style={{ color: "#38bdf8", fontWeight: "bold" }}>ANOMALY_#09</span></div>
          <div>RANGE: <span style={{ color: "#38bdf8", fontWeight: "bold" }}>12.4 NM</span></div>
        </div>
      </div>

      {/* Mystery Voiceover Subtitle Container */}
      <div
        style={{
          backgroundColor: "rgba(3, 7, 18, 0.9)",
          border: "2px solid #0284c7",
          padding: "24px 28px",
          borderRadius: "10px",
          zIndex: 10,
          boxShadow: "0 0 24px rgba(2, 132, 199, 0.3)",
        }}
      >
        {segment.headline && (
          <div
            style={{
              fontSize: "22px",
              fontWeight: 900,
              color: "#38bdf8",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            /// {segment.headline}
          </div>
        )}
        <p
          style={{
            margin: 0,
            fontSize: "28px",
            lineHeight: 1.45,
            color: "#f0f9ff",
            fontWeight: 600,
          }}
        >
          {segment.voiceover}
        </p>
      </div>
    </div>
  );
};

