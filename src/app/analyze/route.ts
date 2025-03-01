import { reteLimit } from "@/lib/rateLimiter";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // rate limiting
    await reteLimit(request);
    // text as json
    const { text } = await request.json();
    // check the text exists or not
    if (!text || typeof text != "string") {
      return NextResponse.json({ message: "Invalid text" }, { status: 400 });
    }

    const summary = await summarizeWithGemini(text);

    if (summary) {
      return new Response(JSON.stringify({ summary }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to generate summary" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error in API route:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function summarizeWithGemini(text: string) {
  try {
    // Configure Gemini (API key)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

    // Select the model
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    // Construct the prompt
    const prompt = `
      Please summarize this document in clear, concise bullet points. 
      Focus on key findings, main arguments, and critical data.

      Document content: 
      ${text}
    `;

    // Make the API call
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    // Return the summary
    return summary;
  } catch (error) {
    console.error("Failed to generate summary:", error);
    return null;
  }
}
