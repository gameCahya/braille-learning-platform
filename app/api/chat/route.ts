import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// ✅ Define proper type for messages
type ChatRole = "system" | "user" | "assistant";

interface ChatMessage {
  role: ChatRole;
  content: string;
}

interface HistoryMessage {
  role: string;
  content: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: HistoryMessage[];
}

const systemPrompt = `You are a helpful and patient Braille learning assistant. Your role is to:
- Help students learn Braille characters and patterns
- Explain dot patterns clearly (e.g., "Letter A is dot 1")
- Provide examples when teaching
- Answer questions about Braille in simple English
- Be encouraging and supportive
- Keep responses concise and clear (max 3-4 sentences unless asked for more)

When explaining Braille:
- Always mention the dot pattern
- Show the Braille character when relevant
- Give practical examples
- Use simple, easy-to-understand language

Important rules:
- Never make up information
- If you don't know something, say so
- Be patient and encouraging
- Adapt your teaching style to the student's level`;

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, conversationHistory = [] } = body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is not configured");
      return NextResponse.json(
        { error: "AI service is not configured" },
        { status: 500 }
      );
    }

    // Safety: Limit conversation history to prevent token overflow
    const limitedHistory = conversationHistory.slice(-10); // Last 10 messages

    // ✅ FIX: Explicitly type the mapped array with proper type
    const historyMessages: ChatMessage[] = limitedHistory.map((msg: HistoryMessage) => ({
      role: (msg.role === "user" ? "user" : "assistant") as ChatRole,
      content: String(msg.content || "").slice(0, 500), // Limit length
    }));

    // Build messages array with proper typing
    const messages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
      { role: "user", content: message.slice(0, 500) }, // Limit input length
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 800,
      top_p: 0.9,
    });

    const aiResponse = completion.choices[0]?.message?.content || "";

    if (!aiResponse) {
      throw new Error("No response from AI");
    }

    return NextResponse.json({
      response: aiResponse,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error("Chat API error:", error);

    // Handle specific Groq errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "AI service authentication failed" },
          { status: 500 }
        );
      }

      if (error.message.includes("rate limit") || error.message.includes("quota")) {
        return NextResponse.json(
          { error: "AI service is temporarily busy. Please try again in a moment." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { 
        error: "Failed to process your message",
        message: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}