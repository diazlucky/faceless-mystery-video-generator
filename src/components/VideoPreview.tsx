"use client";

import React, { useRef } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { VideoComposition } from "@/remotion/VideoComposition";
import { ScriptSegment } from "@/lib/types";
import { Smartphone, PlayCircle, Film, Sparkles } from "lucide-react";

interface Props {
  segments: ScriptSegment[];
  audioUrl?: string;
}

export const VideoPreview: React.FC<Props> = ({ segments, audioUrl }) => {
  const playerRef = useRef<PlayerRef>(null);

  const fps = 30;
  const totalDurationSeconds = segments.reduce(
    (sum, s) => sum + (Number(s.durationInSeconds) || 4),
    0
  );
  const durationInFrames = Math.max(30, Math.round(totalDurationSeconds * fps));

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm flex flex-col items-center">
      <div className="w-full flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Film className="w-5 h-5 text-red-500" />
          <h2 className="text-base font-semibold text-white">
            Step 4: Remotion Video Player (9:16 Preview)
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>Real-time HTML/SVG Render</span>
        </div>
      </div>

      {/* Vertical Smartphone-like preview container */}
      <div className="relative w-full max-w-[340px] rounded-[28px] p-2 bg-gradient-to-b from-slate-800 to-slate-950 border-2 border-slate-700/80 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {/* Notch / Speaker bar */}
        <div className="w-24 h-4 bg-slate-950 rounded-full mx-auto mb-2 flex items-center justify-center">
          <div className="w-8 h-1 bg-slate-800 rounded-full" />
        </div>

        {/* Video Canvas Container (9:16 Aspect Ratio) */}
        <div className="rounded-[20px] overflow-hidden bg-black aspect-[9/16] relative shadow-inner">
          <Player
            ref={playerRef}
            component={VideoComposition}
            inputProps={{
              segments,
              audioUrl,
            }}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionWidth={1080}
            compositionHeight={1920}
            style={{
              width: "100%",
              height: "100%",
            }}
            controls
            autoPlay={false}
            loop
            acknowledgeRemotionLicense
          />
        </div>

        {/* Bottom indicator */}
        <div className="w-28 h-1 bg-slate-700 rounded-full mx-auto mt-2.5" />
      </div>

      {/* Meta Specifications */}
      <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap justify-around text-center text-xs font-mono text-slate-400 gap-2">
        <div>
          <span className="text-slate-500 block text-[10px]">RESOLUSI</span>
          <span className="text-slate-200 font-bold">1080 × 1920</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">ASPEK RASIO</span>
          <span className="text-slate-200 font-bold">9:16 Vertical</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">FRAME RATE</span>
          <span className="text-slate-200 font-bold">30 FPS</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px]">TOTAL FRAMES</span>
          <span className="text-emerald-400 font-bold">{durationInFrames} frames</span>
        </div>
      </div>
    </div>
  );
};

