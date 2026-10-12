"use client";

import React from "react";
import { ScriptSegment, SceneMood, GraphicElement } from "@/lib/types";
import {
  Clock,
  Layers,
  Trash2,
  Plus,
  Palette,
  Eye,
  Type,
} from "lucide-react";

interface Props {
  segments: ScriptSegment[];
  onChange: (updatedSegments: ScriptSegment[]) => void;
}

const MOOD_OPTIONS: { id: SceneMood; label: string; badgeColor: string }[] = [
  { id: "crimson_danger", label: "🔴 Crimson Danger", badgeColor: "border-red-500/40 text-red-400 bg-red-950/40" },
  { id: "cyan_cyber", label: "🔵 Cyan Cyber", badgeColor: "border-cyan-500/40 text-cyan-400 bg-cyan-950/40" },
  { id: "emerald_matrix", label: "🟢 Emerald Matrix", badgeColor: "border-emerald-500/40 text-emerald-400 bg-emerald-950/40" },
  { id: "amber_archive", label: "🟡 Amber Archive", badgeColor: "border-amber-500/40 text-amber-400 bg-amber-950/40" },
  { id: "violet_cosmic", label: "🟣 Violet Cosmic", badgeColor: "border-purple-500/40 text-purple-400 bg-purple-950/40" },
  { id: "monochrome_noir", label: "⚪ Noir Silver", badgeColor: "border-slate-400/40 text-slate-300 bg-slate-900/40" },
];

const GRAPHIC_OPTIONS: { id: GraphicElement; label: string }[] = [
  { id: "evidence_tag", label: "🏷️ Evidence Tag" },
  { id: "radar_scanner", label: "📡 Radar Scanner" },
  { id: "redacted_strip", label: "📄 Redacted File" },
  { id: "audio_waveform", label: "🔊 Audio Waveform" },
  { id: "telemetry_coords", label: "🎯 Telemetry Lock" },
  { id: "timeline_marker", label: "⏱️ Timeline Marker" },
  { id: "biometric_scanner", label: "👁️ Biometric Scan" },
  { id: "kinetic_minimal", label: "⚡ Kinetic Focal" },
];

export const ScriptTable: React.FC<Props> = ({ segments, onChange }) => {
  const totalDuration = segments.reduce(
    (sum, s) => sum + (Number(s.durationInSeconds) || 0),
    0
  );

  const handleUpdateSegment = (
    index: number,
    field: keyof ScriptSegment,
    value: any
  ) => {
    const next = [...segments];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  };

  const handleDeleteSegment = (index: number) => {
    if (segments.length <= 1) return;
    const next = segments
      .filter((_, idx) => idx !== index)
      .map((seg, idx) => ({ ...seg, id: idx + 1 }));
    onChange(next);
  };

  const handleAddSegment = () => {
    const newSegment: ScriptSegment = {
      id: segments.length + 1,
      mood: "crimson_danger",
      graphicType: "evidence_tag",
      tag: "NEW CLUE",
      focusWord: "UNSOLVED TRUTH",
      voiceover: "Investigators uncovered a detail no one could explain.",
      durationInSeconds: 5,
    };
    onChange([...segments, newSegment]);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-red-500" />
          <div>
            <h2 className="text-base font-semibold text-white">
              Step 2: Review Naskah & Visual Dinamis
            </h2>
            <p className="text-[11px] text-slate-400">
              Desain modern & clean — teks fokus 1-3 kata dan subtitle berirama tanpa kerusuhan visual.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="px-3 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            Segmen: <span className="text-red-400 font-bold">{segments.length}</span>
          </div>
          <div className="flex items-center gap-1 px-3 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Durasi:{" "}
            <span
              className={`font-bold ml-1 ${
                totalDuration >= 60 && totalDuration <= 90
                  ? "text-emerald-400"
                  : "text-amber-400"
              }`}
            >
              {totalDuration}s
            </span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase tracking-wider">
              <th className="py-2.5 px-3 w-10 text-center">#</th>
              <th className="py-2.5 px-3 w-36">Mood Warna</th>
              <th className="py-2.5 px-3 w-36">Elemen Visual</th>
              <th className="py-2.5 px-3 w-36">Fokus Teks (1-3 Kata)</th>
              <th className="py-2.5 px-3">Voiceover (Naskah)</th>
              <th className="py-2.5 px-3 w-20 text-center">Durasi</th>
              <th className="py-2.5 px-2 w-10 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {segments.map((seg, idx) => {
              const currentMood = MOOD_OPTIONS.find((m) => m.id === seg.mood) || MOOD_OPTIONS[0];

              return (
                <tr
                  key={`${seg.id}-${idx}`}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  {/* Segment Index */}
                  <td className="py-3 px-3 text-center font-mono font-bold text-slate-400">
                    {idx + 1}
                  </td>

                  {/* Mood Selector */}
                  <td className="py-3 px-3">
                    <select
                      value={seg.mood || "crimson_danger"}
                      onChange={(e) =>
                        handleUpdateSegment(
                          idx,
                          "mood",
                          e.target.value as SceneMood
                        )
                      }
                      className={`w-full text-xs font-mono py-1.5 px-2 rounded-md border ${currentMood.badgeColor} focus:outline-none cursor-pointer`}
                    >
                      {MOOD_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id} className="bg-slate-900 text-slate-100">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Graphic Element Selector */}
                  <td className="py-3 px-3">
                    <select
                      value={seg.graphicType || "evidence_tag"}
                      onChange={(e) =>
                        handleUpdateSegment(
                          idx,
                          "graphicType",
                          e.target.value as GraphicElement
                        )
                      }
                      className="w-full text-xs font-mono py-1.5 px-2 rounded-md bg-slate-950 border border-slate-700/80 text-slate-200 focus:outline-none cursor-pointer"
                    >
                      {GRAPHIC_OPTIONS.map((g) => (
                        <option key={g.id} value={g.id} className="bg-slate-900 text-slate-100">
                          {g.label}
                        </option>
                      ))}
                    </select>
                  </td>

                  {/* Focus Word (1-3 words) */}
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      value={seg.focusWord || ""}
                      onChange={(e) =>
                        handleUpdateSegment(idx, "focusWord", e.target.value.toUpperCase())
                      }
                      placeholder="1-3 KATA..."
                      className="w-full px-2 py-1.5 rounded bg-slate-950/80 border border-slate-700/60 text-white font-bold text-xs font-mono uppercase focus:outline-none focus:border-red-500"
                    />
                  </td>

                  {/* Voiceover narration */}
                  <td className="py-3 px-3">
                    <textarea
                      rows={2}
                      value={seg.voiceover}
                      onChange={(e) =>
                        handleUpdateSegment(idx, "voiceover", e.target.value)
                      }
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950/80 border border-slate-700/60 text-slate-200 text-xs focus:outline-none focus:border-red-500 resize-none font-sans leading-relaxed"
                    />
                  </td>

                  {/* Duration (seconds) */}
                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={seg.durationInSeconds}
                        onChange={(e) =>
                          handleUpdateSegment(
                            idx,
                            "durationInSeconds",
                            Math.max(1, parseInt(e.target.value) || 1)
                          )
                        }
                        className="w-12 px-1 py-1 text-center rounded bg-slate-950/80 border border-slate-700/60 text-slate-200 text-xs font-mono focus:outline-none focus:border-red-500"
                      />
                      <span className="text-slate-400 font-mono text-[11px]">s</span>
                    </div>
                  </td>

                  {/* Delete button */}
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => handleDeleteSegment(idx)}
                      disabled={segments.length <= 1}
                      title="Hapus Segmen"
                      className="p-1.5 rounded hover:bg-red-950/80 text-slate-500 hover:text-red-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-2">
        <button
          onClick={handleAddSegment}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono border border-slate-700 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>Tambah Segmen</span>
        </button>

        <span className="text-[11px] text-slate-400 font-mono italic">
          ✨ Subtitle otomatis terbagi menjadi 2–3 kata berirama di layar tanpa menumpuk teks.
        </span>
      </div>
    </div>
  );
};
