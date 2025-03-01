import { reteLimit } from "@/lib/rateLimiter";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // rate limiting
  await reteLimit(request);
  // text as json
  const { text } = await request.json();
  // check the text exists or not
  if (!text || typeof text != "string") {
    return NextResponse.json({ message: "Invalid text" }, { status: 400 });
  }

  // gemini api for summarization
}
