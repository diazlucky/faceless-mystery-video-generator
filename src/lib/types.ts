export type SceneMood =
  | 'crimson_danger'
  | 'cyan_cyber'
  | 'emerald_matrix'
  | 'amber_archive'
  | 'violet_cosmic'
  | 'monochrome_noir';

export type GraphicElement =
  | 'evidence_tag'
  | 'radar_scanner'
  | 'redacted_strip'
  | 'audio_waveform'
  | 'telemetry_coords'
  | 'timeline_marker'
  | 'biometric_scanner'
  | 'kinetic_minimal';

export interface ScriptSegment {
  id: number;
  visualType?: string;
  mood: SceneMood;
  graphicType: GraphicElement;
  tag: string;
  focusWord: string;
  voiceover: string;
  durationInSeconds: number;
  headline?: string;
  subtext?: string;
  highlightWords?: string[];
}

export interface VideoScript {
  title: string;
  hook: string;
  fullScript: string;
  totalDuration: number;
  segments: ScriptSegment[];
}

export interface VideoCompositionProps {
  segments?: ScriptSegment[];
  audioUrl?: string;
  fps?: number;
}
