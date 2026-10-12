import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { VideoScript, SceneMood, GraphicElement } from "@/lib/types";

const SYSTEM_PROMPT = `You are an elite motion graphic video director for viral vertical mystery & conspiracy videos (TikTok / Shorts / Reels).
Target audience: US viewers. Tone: Suspenseful, intriguing, casual US English.

Design aesthetic principles:
- MODERN & CINEMATIC (not cluttered, not overwhelming).
- Keep on-screen text minimal, punchy, and high-impact.
- For every scene, choose the visual MOOD and GRAPHIC ELEMENT that perfectly matches the storyline beat.

AVAILABLE MOODS (Color & Lighting Atmosphere):
- "crimson_danger": Red glow / dark warning. Best for intense hooks, dangerous coverups, government secrets.
- "cyan_cyber": Electric cyan / sci-fi navy. Best for satellites, GPS coordinates, oceanic trench, radars, Area 51.
- "emerald_matrix": Emerald green / encrypted logs. Best for ciphers, leaked audio, intercepted messages.
- "amber_archive": Warm amber / vintage declassified. Best for Cold War, historical dossiers, erased records.
- "violet_cosmic": Deep violet / celestial mystery. Best for deep space, paranormal, unexplained anomalies.
- "monochrome_noir": Sleek silver / noir forensic. Best for cold cases, crime evidence, forensic analysis.

AVAILABLE GRAPHIC ELEMENTS:
- "evidence_tag": Minimal glassmorphic evidence marker with item ID.
- "radar_scanner": Sleek vector rotating radar sweep with target acquisition.
- "redacted_strip": Declassified file with sliding animated black redaction bar.
- "audio_waveform": Pulsing audio frequency bars for intercepted wiretaps/tapes.
- "telemetry_coords": Target crosshair and live GPS coordinates.
- "timeline_marker": Minimalist milestone year / chronology marker.
- "biometric_scanner": Futuristic retina/fingerprint lock scan.
- "kinetic_minimal": Minimalist typographic focal layout.

CRITICAL INSTRUCTIONS:
- Total video duration: 60 to 90 seconds.
- Create 8 to 14 sequential segments.
- Duration per segment: 4 to 8 seconds.
- "fullScript": The ENTIRE continuous narration text written as a seamless story (easy to read for Voice Over recording).
- "focusWord": MUST be only 1 to 3 BOLD WORDS (e.g. "PROJECT HAARP", "DEEP TRENCH", "EVIDENCE DESTROYED").
- "tag": Short metadata tag (e.g. "FILE #804", "NEVADA DESERT", "OCT 14 1968").
- "voiceover": 1-2 punchy spoken sentences in Casual US English corresponding to that segment.

Return strictly a valid JSON object matching this schema:
{
  "title": "Catchy Mystery Title",
  "hook": "Opening hook sentence",
  "totalDuration": Number,
  "fullScript": "The complete full voiceover narration text in one continuous story...",
  "segments": [
    {
      "id": 1,
      "mood": "crimson_danger" | "cyan_cyber" | "emerald_matrix" | "amber_archive" | "violet_cosmic" | "monochrome_noir",
      "graphicType": "evidence_tag" | "radar_scanner" | "redacted_strip" | "audio_waveform" | "telemetry_coords" | "timeline_marker" | "biometric_scanner" | "kinetic_minimal",
      "tag": "CASE FILE #804",
      "focusWord": "SECRET PROJECT",
      "voiceover": "For fifty years, this file remained sealed under maximum security.",
      "durationInSeconds": 5
    }
  ]
}`;

function extractJsonString(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.replace(/^```json\s*/i, "").replace(/\s*```$/, "");
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
  }

  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return cleaned.slice(firstBrace, lastBrace + 1);
  }
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const { topic, model } = await req.json();

    if (!topic || typeof topic !== "string" || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Mystery topic is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.LLM_API_KEY;
    const baseURL = process.env.LLM_BASE_URL || "http://localhost:20128/v1";
    const modelName = model || process.env.LLM_MODEL || "kr/claude-sonnet-4.5";

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "LLM_API_KEY belum dikonfigurasi di .env.local. Silakan periksa pengaturan API key.",
        },
        { status: 401 }
      );
    }

    const aiClient = new OpenAI({
      apiKey,
      baseURL,
    });

    const messages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      {
        role: "user" as const,
        content: `Create a modern, high-suspense 60-90s vertical video script about: "${topic}". Match each visual scene dynamically to the story beats with aesthetic modern motion graphics. Output strictly valid JSON.`,
      },
    ];

    let rawResponse = "";

    try {
      const completion = await aiClient.chat.completions.create({
        model: modelName,
        messages,
        temperature: 0.7,
      });
      rawResponse = completion.choices[0]?.message?.content || "";
    } catch (apiErr: any) {
      console.error("Primary model call error:", apiErr.message);
      // Fallback to kr/deepseek-3.2 or kr/auto if model is unavailable
      if (modelName !== "kr/deepseek-3.2") {
        console.warn("Attempting fallback to kr/deepseek-3.2...");
        const fallback = await aiClient.chat.completions.create({
          model: "kr/deepseek-3.2",
          messages,
          temperature: 0.7,
        });
        rawResponse = fallback.choices[0]?.message?.content || "";
      } else {
        throw apiErr;
      }
    }

    if (!rawResponse) {
      throw new Error("No response received from 9Router LLM");
    }

    const jsonString = extractJsonString(rawResponse);
    let parsedData: any;
    try {
      parsedData = JSON.parse(jsonString);
    } catch (parseErr: any) {
      console.error("JSON parse error:", parseErr, "Raw was:", jsonString.slice(0, 200));
      throw new Error("Format respon LLM bukan JSON yang valid. Silakan coba klik Generate lagi.");
    }

    if (!Array.isArray(parsedData.segments) || parsedData.segments.length === 0) {
      throw new Error("Struktur naskah tidak valid: array segmen kosong");
    }

    const validMoods: SceneMood[] = [
      "crimson_danger",
      "cyan_cyber",
      "emerald_matrix",
      "amber_archive",
      "violet_cosmic",
      "monochrome_noir",
    ];

    const validGraphics: GraphicElement[] = [
      "evidence_tag",
      "radar_scanner",
      "redacted_strip",
      "audio_waveform",
      "telemetry_coords",
      "timeline_marker",
      "biometric_scanner",
      "kinetic_minimal",
    ];

    parsedData.segments = parsedData.segments.map((seg: any, idx: number) => {
      const rawFocus = seg.focusWord || seg.headline || "CLASSIFIED";
      const focusWords = rawFocus.split(/\s+/).filter(Boolean).slice(0, 3).join(" ");

      return {
        id: idx + 1,
        mood: validMoods.includes(seg.mood) ? seg.mood : "crimson_danger",
        graphicType: validGraphics.includes(seg.graphicType)
          ? seg.graphicType
          : "evidence_tag",
        tag: seg.tag || `SEC // ${idx + 1}`,
        focusWord: focusWords.toUpperCase(),
        voiceover: seg.voiceover || "",
        durationInSeconds: Number(seg.durationInSeconds) || 5,
        highlightWords: Array.isArray(seg.highlightWords) ? seg.highlightWords : [],
      };
    });

    parsedData.totalDuration = parsedData.segments.reduce(
      (sum: number, s: any) => sum + s.durationInSeconds,
      0
    );

    // Ensure fullScript is always present
    if (!parsedData.fullScript || typeof parsedData.fullScript !== "string") {
      parsedData.fullScript = parsedData.segments
        .map((s: any) => s.voiceover)
        .filter(Boolean)
        .join(" ");
    }

    return NextResponse.json({ success: true, script: parsedData as VideoScript });
  } catch (error: any) {
    console.error("Error in /api/generate:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to generate mystery script",
      },
      { status: 500 }
    );
  }
}
