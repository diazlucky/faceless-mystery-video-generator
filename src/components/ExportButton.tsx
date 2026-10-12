"use client";

import React, { useState } from "react";
import { ScriptSegment } from "@/lib/types";
import { Download, Loader2, Video, CheckCircle2, AlertCircle } from "lucide-react";

interface Props {
  segments: ScriptSegment[];
  audioUrl?: string;
}

export const ExportButton: React.FC<Props> = ({ segments, audioUrl }) => {
  const [isRendering, setIsRendering] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [renderedFilename, setRenderedFilename] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);

  const handleRender = async () => {
    setIsRendering(true);
    setRenderError(null);
    setDownloadUrl(null);

    try {
      const res = await fetch("/api/render", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          segments,
          audioUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Gagal merender video MP4");
      }

      setDownloadUrl(data.downloadUrl);
      setRenderedFilename(data.filename);
    } catch (err: any) {
      console.error(err);
      setRenderError(err.message || "Gagal melakukan render video");
    } finally {
      setIsRendering(false);
    }
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-3">
        <Video className="w-5 h-5 text-red-500" />
        <h2 className="text-base font-semibold text-white">
          Step 5: Export Video Final (.MP4)
        </h2>
      </div>

      <p className="text-xs text-slate-400 mb-4">
        Remotion akan mem-bundle visual React/CSS/SVG dan merendernya frame-demi-frame menggunakan Chromium lokal di Mac M1.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={handleRender}
          disabled={isRendering || segments.length === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-semibold text-sm transition-all shadow-lg shadow-red-950/50 cursor-pointer disabled:cursor-not-allowed"
        >
          {isRendering ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Rendering MP4 (Chromium H.264)...</span>
            </>
          ) : (
            <>
              <Video className="w-5 h-5" />
              <span>Render MP4 Sekarang</span>
            </>
          )}
        </button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={renderedFilename || "mystery-video.mp4"}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/50 cursor-pointer animate-bounce"
          >
            <Download className="w-5 h-5" />
            <span>Unduh File MP4</span>
          </a>
        )}
      </div>

      {/* Rendering status info */}
      {isRendering && (
        <div className="mt-4 p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0" />
          <span>
            Sedang memproses compositing dan audio sync... Ini memakan waktu ~15-45 detik tergantung durasi.
          </span>
        </div>
      )}

      {/* Success notification */}
      {downloadUrl && !isRendering && (
        <div className="mt-4 p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Render selesai! File MP4 tersimpan di{" "}
              <code className="text-white bg-slate-900 px-1 py-0.5 rounded font-mono">
                {downloadUrl}
              </code>
            </span>
          </div>
        </div>
      )}

      {/* Error notification */}
      {renderError && (
        <div className="mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block mb-0.5">Gagal Render MP4:</span>
            <span>{renderError}</span>
          </div>
        </div>
      )}
    </div>
  );
};

