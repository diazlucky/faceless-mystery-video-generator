"use client";

import React, { useRef, useState } from "react";
import { Mic, UploadCloud, Volume2, CheckCircle2, X, Loader2 } from "lucide-react";

interface Props {
  audioUrl?: string;
  onAudioUploaded: (url: string, filename: string) => void;
  onAudioRemoved: () => void;
}

export const AudioUploader: React.FC<Props> = ({
  audioUrl,
  onAudioUploaded,
  onAudioRemoved,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate type
    const validTypes = ["audio/mpeg", "audio/wav", "audio/mp3", "audio/x-wav"];
    if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav)$/i)) {
      alert("Format audio harus berupa .mp3 atau .wav");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("audio", file);

      const res = await fetch("/api/upload-audio", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal mengunggah file audio");
      }

      setCurrentFileName(file.name);
      onAudioUploaded(data.audioUrl, file.name);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Error saat mengunggah audio VO");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Mic className="w-5 h-5 text-red-500" />
        <h2 className="text-base font-semibold text-white">
          Step 3: Unggah Voice Over (Audio VO)
        </h2>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        Unggah rekaman audio narasi (.mp3 atau .wav). Audio ini akan otomatis disinkronkan ke dalam video preview dan render final.
      </p>

      {!audioUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
            dragActive
              ? "border-red-500 bg-red-950/20"
              : "border-slate-700/80 hover:border-slate-600 bg-slate-950/50"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".mp3,.wav,audio/mpeg,audio/wav"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
          />

          <div className="flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <span className="text-sm font-medium text-slate-300">
                  Mengunggah audio voiceover...
                </span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-red-400">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="text-sm text-slate-200 font-medium">
                  Klik untuk memilih file VO atau drag & drop ke sini
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Mendukung file audio .MP3 atau .WAV
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/50 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs font-mono text-emerald-400 flex items-center gap-1.5 font-bold">
                <Volume2 className="w-3.5 h-3.5" />
                AUDIO AKTIF
              </div>
              <div className="text-sm font-medium text-slate-200 truncate max-w-xs">
                {currentFileName || "voiceover-audio.mp3"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <audio
              src={audioUrl}
              controls
              className="h-8 max-w-[240px] rounded"
            />
            <button
              onClick={() => {
                setCurrentFileName(null);
                onAudioRemoved();
              }}
              title="Ganti / Hapus Audio"
              className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 text-slate-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

