import { NextRequest, NextResponse } from "next/server";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
import path from "path";
import fs from "fs/promises";
import { ScriptSegment } from "@/lib/types";

let cachedBundleLocation: string | null = null;

async function getOrBundle() {
  if (cachedBundleLocation) {
    try {
      await fs.access(cachedBundleLocation);
      return cachedBundleLocation;
    } catch {
      cachedBundleLocation = null;
    }
  }

  const entryPoint = path.join(process.cwd(), "src", "remotion", "entry.ts");
  const bundleLocation = await bundle({
    entryPoint,
    webpackOverride: (config) => {
      return {
        ...config,
        resolve: {
          ...config.resolve,
          alias: {
            ...config.resolve?.alias,
            "@": path.join(process.cwd(), "src"),
          },
        },
      };
    },
  });

  cachedBundleLocation = bundleLocation;
  return bundleLocation;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const segments: ScriptSegment[] = body.segments;
    let audioUrl: string | undefined = body.audioUrl;

    if (!Array.isArray(segments) || segments.length === 0) {
      return NextResponse.json(
        { error: "No segments provided for video rendering" },
        { status: 400 }
      );
    }

    const host = req.headers.get("host") || "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";

    // If audioUrl is relative, convert to absolute URL so Remotion browser can fetch it
    if (audioUrl && audioUrl.startsWith("/")) {
      audioUrl = `${protocol}://${host}${audioUrl}`;
    }

    const fps = 30;
    const totalDurationSeconds = segments.reduce(
      (acc, seg) => acc + (Number(seg.durationInSeconds) || 4),
      0
    );
    const durationInFrames = Math.max(30, Math.round(totalDurationSeconds * fps));

    console.log(`[Render] Starting render for ${segments.length} segments (${durationInFrames} frames, ${totalDurationSeconds}s)...`);

    // 1. Get or create Remotion bundle
    const bundleLocation = await getOrBundle();

    // 2. Select composition
    const composition = await selectComposition({
      serveUrl: bundleLocation,
      id: "FacelessMysteryVideo",
      inputProps: {
        segments,
        audioUrl,
      },
    });

    // 3. Ensure render output directory exists
    const rendersDir = path.join(process.cwd(), "public", "renders");
    await fs.mkdir(rendersDir, { recursive: true });

    const filename = `mystery-video-${Date.now()}.mp4`;
    const outputLocation = path.join(rendersDir, filename);

    // 4. Render Media to MP4
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
      },
      serveUrl: bundleLocation,
      codec: "h264",
      outputLocation,
      inputProps: {
        segments,
        audioUrl,
      },
      imageFormat: "jpeg",
      crf: 18,
    });

    console.log(`[Render] Successfully rendered: ${outputLocation}`);

    return NextResponse.json({
      success: true,
      downloadUrl: `/renders/${filename}`,
      filename,
      totalDuration: totalDurationSeconds,
    });
  } catch (error: any) {
    console.error("[Render Error]:", error);
    return NextResponse.json(
      {
        error: error.message || "Failed to render video MP4",
      },
      { status: 500 }
    );
  }
}

