import React from "react";
import { Audio, Series, useVideoConfig } from "remotion";
import { ScriptSegment, VideoCompositionProps, SceneMood, GraphicElement } from "@/lib/types";
import { DynamicScene } from "./components/DynamicScene";

export const defaultSegments: ScriptSegment[] = [
  {
    id: 1,
    mood: "crimson_danger",
    graphicType: "evidence_tag",
    tag: "CASE FILE #804",
    focusWord: "SECRET PROJECT",
    voiceover: "For fifty years, this file remained sealed under maximum security.",
    durationInSeconds: 4,
  },
  {
    id: 2,
    mood: "cyan_cyber",
    graphicType: "radar_scanner",
    tag: "SECTOR 7-G",
    focusWord: "ANOMALY DETECTED",
    voiceover: "Military satellites recorded impossible magnetic fluctuations at midnight.",
    durationInSeconds: 5,
  },
  {
    id: 3,
    mood: "amber_archive",
    graphicType: "redacted_strip",
    tag: "DECLASSIFIED 1974",
    focusWord: "RECORDS SCRUBBED",
    voiceover: "Every official report was quietly replaced before morning.",
    durationInSeconds: 4,
  },
  {
    id: 4,
    mood: "emerald_matrix",
    graphicType: "audio_waveform",
    tag: "INTERCEPTED TAPE",
    focusWord: "UNKNOWN SIGNAL",
    voiceover: "The final voice transmission was never supposed to be heard.",
    durationInSeconds: 5,
  },
];

// Helper to normalize legacy segment types to dynamic scenes
export function normalizeSegment(seg: any, idx: number): ScriptSegment {
  let mood: SceneMood = seg.mood || "crimson_danger";
  let graphicType: GraphicElement = seg.graphicType || "evidence_tag";

  // Map legacy visualType if present
  if (seg.visualType) {
    if (seg.visualType === "RadarGrid") {
      mood = "cyan_cyber";
      graphicType = "radar_scanner";
    } else if (seg.visualType === "TerminalDOS") {
      mood = "emerald_matrix";
      graphicType = "audio_waveform";
    } else if (seg.visualType === "Newspaper") {
      mood = "amber_archive";
      graphicType = "redacted_strip";
    } else {
      mood = "crimson_danger";
      graphicType = "evidence_tag";
    }
  }

  // Generate punchy 1-3 focus words if not specified
  let focusWord = seg.focusWord;
  if (!focusWord) {
    const rawHeadline = seg.headline || "";
    const words = rawHeadline.split(/\s+/).filter(Boolean);
    focusWord = words.slice(0, 3).join(" ") || "CLASSIFIED";
  }

  return {
    id: seg.id || idx + 1,
    mood,
    graphicType,
    tag: seg.tag || (seg.headline ? seg.headline.slice(0, 18) : "ARCHIVE FILE"),
    focusWord,
    voiceover: seg.voiceover || "",
    durationInSeconds: Number(seg.durationInSeconds) || 4,
    highlightWords: seg.highlightWords || [],
  };
}

export const VideoComposition: React.FC<VideoCompositionProps> = ({
  segments = defaultSegments,
  audioUrl,
}) => {
  const { fps } = useVideoConfig();

  const normalizedSegments = segments.map((s, i) => normalizeSegment(s, i));

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#030407",
        position: "relative",
        width: "100%",
        height: "100%",
      }}
    >
      {/* Audio Voiceover Track (if uploaded) */}
      {audioUrl && <Audio src={audioUrl} />}

      {/* Sequential Dynamic Scenes */}
      <Series>
        {normalizedSegments.map((segment, index) => {
          const durationFrames = Math.max(
            30,
            Math.round((segment.durationInSeconds || 4) * fps)
          );
          return (
            <Series.Sequence
              key={`${segment.id}-${index}`}
              durationInFrames={durationFrames}
            >
              <DynamicScene segment={segment} />
            </Series.Sequence>
          );
        })}
      </Series>
    </div>
  );
};
