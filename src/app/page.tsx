"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { ScriptInput } from "@/components/ScriptInput";
import { ScriptTable } from "@/components/ScriptTable";
import { FullScriptCard } from "@/components/FullScriptCard";
import { AudioUploader } from "@/components/AudioUploader";
import { VideoPreview } from "@/components/VideoPreview";
import { ExportButton } from "@/components/ExportButton";
import { defaultSegments } from "@/remotion/VideoComposition";
import { ScriptSegment, VideoScript } from "@/lib/types";
import { BookOpen, Layers } from "lucide-react";

export default function Home() {
  const [segments, setSegments] = useState<ScriptSegment[]>(defaultSegments);
  const [fullScript, setFullScript] = useState<string>(
    defaultSegments.map((s) => s.voiceover).join(" ")
  );
  const [audioUrl, setAudioUrl] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<"full" | "segments">("full");
  const [scriptMeta, setScriptMeta] = useState<{ title?: string; hook?: string }>({
    title: "Project Blackout: The 50-Year Mystery",
    hook: "What they hid from the public for over 50 years...",
  });

  const handleScriptGenerated = (newScript: VideoScript) => {
    setSegments(newScript.segments);
    const unitedScript =
      newScript.fullScript ||
      newScript.segments.map((s) => s.voiceover).filter(Boolean).join(" ");
    setFullScript(unitedScript);
    setScriptMeta({
      title: newScript.title,
      hook: newScript.hook,
    });
  };

  const handleUpdateFullScript = (updatedText: string) => {
    setFullScript(updatedText);
  };

  const handleSegmentsChange = (updated: ScriptSegment[]) => {
    setSegments(updated);
    // Keep full script in sync with segment voiceovers
    setFullScript(updated.map((s) => s.voiceover).filter(Boolean).join(" "));
  };

  const handleAudioUploaded = (url: string) => {
    setAudioUrl(url);
  };

  const handleAudioRemoved = () => {
    setAudioUrl(undefined);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Intro banner */}
        <div className="mb-8 p-4 rounded-xl bg-gradient-to-r from-red-950/30 via-slate-900/60 to-slate-950 border border-red-900/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold mb-1">
              AUTOMATED MOTION GRAPHIC PIPELINE
            </div>
            <h2 className="text-lg font-bold text-white">
              {scriptMeta.title || "Faceless Mystery Video Studio"}
            </h2>
            {scriptMeta.hook && (
              <p className="text-xs text-slate-400 font-mono italic mt-0.5">
                Hook: "{scriptMeta.hook}"
              </p>
            )}
          </div>

          <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-black/60 border border-slate-800 text-slate-300">
            Target Format: <span className="text-amber-400 font-bold">TikTok / Shorts / Reels</span>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Script Generation, Script Review Tabs, Audio & Export (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: LLM Topic Input */}
            <ScriptInput
              onScriptGenerated={handleScriptGenerated}
              isLoading={isGenerating}
              setIsLoading={setIsGenerating}
            />

            {/* Step 2: Tab Switcher (Naskah Utuh vs Detail Segmen) */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
                <button
                  onClick={() => setActiveTab("full")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTab === "full"
                      ? "bg-amber-950/50 text-amber-300 border border-amber-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>📄 Naskah Utuh (Full Voice Over)</span>
                </button>

                <button
                  onClick={() => setActiveTab("segments")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                    activeTab === "segments"
                      ? "bg-red-950/50 text-red-300 border border-red-700/60 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  <span>🎬 Detail Segmen & Visual ({segments.length})</span>
                </button>
              </div>

              {activeTab === "full" ? (
                <FullScriptCard
                  fullScript={fullScript}
                  onUpdateFullScript={handleUpdateFullScript}
                  title={scriptMeta.title}
                  hook={scriptMeta.hook}
                />
              ) : (
                <ScriptTable
                  segments={segments}
                  onChange={handleSegmentsChange}
                />
              )}
            </div>

            {/* Step 3: Voiceover Audio Upload */}
            <AudioUploader
              audioUrl={audioUrl}
              onAudioUploaded={handleAudioUploaded}
              onAudioRemoved={handleAudioRemoved}
            />

            {/* Step 5: MP4 Export Button */}
            <ExportButton segments={segments} audioUrl={audioUrl} />
          </div>

          {/* Right Column: Remotion Player 9:16 Video Preview (5 cols, sticky) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <VideoPreview segments={segments} audioUrl={audioUrl} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-400 font-mono">
        Faceless Mystery Video Generator • Remotion HTML Engine • Next.js 14 App Router
      </footer>
    </div>
  );
}
