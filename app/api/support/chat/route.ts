import OpenAI from "openai";
import { NextResponse } from "next/server";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: Request) {
  const { messages } = await request.json();

  const systemPrompt = `You are a support agent for a gift card platform.
    Common issues: Invalid codes, region mismatches, redemption failures.
    If unable to resolve, escalate to human with summary.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
    });

    return NextResponse.json({
      response: response.choices[0].message.content,
    });
  } catch {
    return NextResponse.json({
      response: "I apologize, but I'm having trouble connecting to the support system. Please try again later.",
    });
  }
}