"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, Compass, AlertCircle, Cpu } from "lucide-react";

interface Props {
  onScriptGenerated: (script: any) => void;
  isLoading: boolean;
  setIsLoading: (val: boolean) => void;
}

const PRESET_TOPICS = [
  "The Unsolved Enigma of Cicada 3301",
  "The Dyatlov Pass Incident: What Really Happened?",
  "The Hidden Underground Vaults of Area 51",
  "The Lost Colony of Roanoke: The Croatoan Mystery",
  "Project MK-Ultra: The Declassified Experiments",
];

const AVAILABLE_MODELS = [
  { id: "kr/claude-sonnet-4.5", label: "Claude Sonnet 4.5 (Paling Sinematik & Suspense)" },
  { id: "kr/deepseek-3.2", label: "DeepSeek 3.2 (Super Cepat & Kreatif)" },
  { id: "kr/minimax-m2.5", label: "MiniMax M2.5 (Narasi Misteri Alami)" },
  { id: "diaz-combo", label: "diaz-combo (Custom 9Router Combo)" },
  { id: "kr/auto", label: "kr/auto (Auto Routing)" },
];

export const ScriptInput: React.FC<Props> = ({
  onScriptGenerated,
  isLoading,
  setIsLoading,
}) => {
  const [topic, setTopic] = useState("");
  const [selectedModel, setSelectedModel] = useState("kr/claude-sonnet-4.5");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleGenerate = async (selectedTopic?: string) => {
    const query = selectedTopic || topic;
    if (!query.trim()) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: query,
          model: selectedModel,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal menghasilkan naskah video");
      }

      onScriptGenerated(data.script);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Terjadi kesalahan saat memanggil LLM");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Compass className="w-5 h-5 text-red-500" />
          <h2 className="text-base font-semibold text-white">
            Step 1: Masukkan Topik Misteri / Konspirasi
          </h2>
        </div>

        {/* Model selector dropdown */}
        <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
          <Cpu className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={isLoading}
            className="bg-transparent text-slate-300 focus:outline-none cursor-pointer text-xs"
          >
            {AVAILABLE_MODELS.map((m) => (
              <option key={m.id} value={m.id} className="bg-slate-900 text-slate-100">
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        AI akan merancang naskah 60-90 detik bergaya <em>Casual US English</em> dengan 8-12 segmen visual otomatis.
      </p>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Contoh: The Secret Under Vatican Archives atau The Dyatlov Pass..."
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) {
              handleGenerate();
            }
          }}
          className="flex-1 px-4 py-2.5 rounded-lg bg-slate-950/80 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono"
        />

        <button
          onClick={() => handleGenerate()}
          disabled={isLoading || !topic.trim()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-medium text-sm transition-all shadow-md shadow-red-950/40 cursor-pointer disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Script...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate Script</span>
            </>
          )}
        </button>
      </div>

      {/* Preset Topics */}
      <div className="mt-4">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2">
          Ide Topik Cepat:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {PRESET_TOPICS.map((preset) => (
            <button
              key={preset}
              onClick={() => {
                setTopic(preset);
                handleGenerate(preset);
              }}
              disabled={isLoading}
              className="text-xs px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors text-left"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block mb-0.5">Peringatan:</span>
            <span>{errorMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};
