export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { aiWrapper } from "../../../../lib/ai-wrapper";

export async function POST(request) {
  try {
    const body = await request.json();
    const transcript = (body.transcript || "").trim();

    if (!transcript) {
      return NextResponse.json(
        { success: false, error: "Transcript is required" },
        { status: 400 }
      );
    }

    const parsed = await aiWrapper.parseVoiceIntent(transcript);

    return NextResponse.json({
      success: true,
      intent: parsed.intent || "PRODUCT_LISTING",
      items: parsed.items || [],
      transcript,
      raw: parsed,
    });
  } catch (error) {
    console.error("[Voice Parse API Error]", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to parse voice transcript" },
      { status: 500 }
    );
  }
}
