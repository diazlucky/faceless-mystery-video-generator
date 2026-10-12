"use client";

import React, { useState } from "react";
import { FileText, Copy, Check, Volume2, Sparkles, BookOpen } from "lucide-react";

interface Props {
  fullScript: string;
  onUpdateFullScript?: (updated: string) => void;
  title?: string;
  hook?: string;
}

export const FullScriptCard: React.FC<Props> = ({
  fullScript,
  onUpdateFullScript,
  title,
  hook,
}) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(fullScript);

  // Sync if prop changes
  React.useEffect(() => {
    setText(fullScript);
  }, [fullScript]);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Average speaking pace for short-form video: ~140-150 words per minute (~2.4 words/second)
  const estimatedSeconds = Math.round(wordCount / 2.4);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateFullScript) {
      onUpdateFullScript(text);
    }
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <div>
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              Naskah Lengkap Voice Over (Full Script)
            </h2>
            <p className="text-[11px] text-slate-400">
              Naskah utuh dalam satu kesatuan narasi — siap dibaca untuk rekaman VO atau disalin ke AI Voice.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
            <span>{wordCount} kata</span>
            <span>•</span>
            <span className="text-emerald-400">~{estimatedSeconds}s audio</span>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-bold">Tersalin!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-300" />
                <span>Salin Naskah</span>
              </>
            )}
          </button>
        </div>
      </div>

      {title && (
        <div className="mt-4 mb-2">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block">
            JUDUL VIDEO
          </span>
          <h3 className="text-sm font-bold text-amber-300 font-sans">{title}</h3>
        </div>
      )}

      {/* Main Full Script Box */}
      <div className="mt-3">
        {isEditing ? (
          <div>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm leading-relaxed font-sans focus:outline-none focus:border-amber-500"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => {
                  setText(fullScript);
                  setIsEditing(false);
                }}
                className="px-3 py-1 rounded text-xs text-slate-400 hover:text-white"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-200 text-sm leading-relaxed font-sans whitespace-pre-wrap select-text">
              {text || "Belum ada naskah. Silakan generate topik terlebih dahulu."}
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[11px] font-mono px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white"
            >
              Edit Teks
            </button>
          </div>
        )}
      </div>

      {hook && (
        <div className="mt-3 p-3 rounded-lg bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 font-mono flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold uppercase text-[10px]">
            HOOK 3 DETIK
          </span>
          <span className="truncate">"{hook}"</span>
        </div>
      )}
    </div>
  );
};

