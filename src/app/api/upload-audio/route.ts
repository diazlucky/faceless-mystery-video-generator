import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("audio") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = path.extname(file.name) || ".mp3";
    const filename = `voiceover-${Date.now()}${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const audioUrl = `/uploads/${filename}`;
    return NextResponse.json({ success: true, audioUrl, filename });
  } catch (error: any) {
    console.error("Audio upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload audio" },
      { status: 500 }
    );
  }
}

