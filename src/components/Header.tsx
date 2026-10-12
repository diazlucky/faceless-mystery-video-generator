"use client";

import React from "react";
import { Skull, Cpu, Video, Sparkles } from "lucide-react";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Skull className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Faceless Mystery <span className="text-red-500">Video Generator</span>
              </h1>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-700/50">
                PROD v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              Pure HTML Motion • 9:16 Vertical Video • Remotion Local Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>Apple Silicon M1</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-amber-300">
            <Video className="w-3.5 h-3.5" />
            <span>9:16 (1080x1920)</span>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-md bg-red-950/40 border border-red-900/60 text-red-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>9router LLM</span>
          </div>
        </div>
      </div>
    </header>
  );
};

