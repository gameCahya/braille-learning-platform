// ===================================================================
// LAYER 1: API Route (Server-Side Only)
// File: app/api/chat/route.ts
// ===================================================================

import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// ✅ API key HANYA ada di server
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!, // Server-side only
});

// ✅ Rate limiting state (in-memory)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 20; // 20 requests
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  // Reset if window expired
  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }

  // Check limit
  if (userLimit.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }

  // Increment count
  userLimit.count++;
  return { allowed: true, remaining: RATE_LIMIT - userLimit.count };
}

// ✅ Validate & sanitize input
function validateMessage(message: unknown): string {
  if (typeof message !== "string") {
    throw new Error("Message must be a string");
  }
  
  const trimmed = message.trim();
  
  if (trimmed.length === 0) {
    throw new Error("Message cannot be empty");
  }
  
  if (trimmed.length > 1000) {
    throw new Error("Message too long (max 1000 characters)");
  }
  
  return trimmed;
}

export async function POST(request: NextRequest) {
  try {
    // ===================================================================
    // LAYER 2: Authentication Check
    // ===================================================================
    
    // Get user from Supabase session
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in." },
        { status: 401 }
      );
    }

    // ===================================================================
    // LAYER 3: Rate Limiting
    // ===================================================================
    
    const userIdentifier = user.id;
    const rateLimit = checkRateLimit(userIdentifier);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. Please try again later.",
          resetIn: RATE_WINDOW / 1000 / 60, // minutes
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": RATE_LIMIT.toString(),
            "X-RateLimit-Remaining": "0",
          }
        }
      );
    }

    // ===================================================================
    // Request Validation
    // ===================================================================
    
    const body = await request.json();
    const message = validateMessage(body.message);
    const conversationHistory = body.conversationHistory || [];

    // Validate conversation history
    if (!Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { error: "Invalid conversation history" },
        { status: 400 }
      );
    }

    // Limit conversation history to last 10 messages
    const limitedHistory = conversationHistory.slice(-10);

    // ===================================================================
    // Call Groq API (Server-Side Only)
    // ===================================================================
    
    const systemPrompt = `You are a helpful English and Braille learning tutor for visually impaired students. Your role is to:

1. Help students learn English through Braille
2. Answer questions about Braille characters and how to write them
3. Explain English words, grammar, and sentence structure clearly
4. Provide examples in both text and Braille when relevant
5. Be patient, encouraging, and supportive
6. Keep responses clear and concise (max 3-4 sentences unless asked for more)
7. Use simple language that's easy to understand

When explaining Braille:
- Describe the dot patterns (e.g., "Letter A is dot 1")
- Provide the Braille symbol when possible
- Give examples of words using the characters

Always be encouraging and positive in your teaching approach.`;

    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      { role: "system", content: systemPrompt },
      ...limitedHistory.slice(0, 10).map((msg: any) => ({
        role: msg.role === "user" ? "user" : "assistant",
        content: String(msg.content || "").slice(0, 500), // Limit length
      })),
      { role: "user", content: message },
    ];

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.1-8b-instant",
      temperature: 0.7,
      max_tokens: 500,
      top_p: 0.8,
    });

    const aiResponse = completion.choices[0]?.message?.content || 
      "I'm sorry, I couldn't generate a response. Please try again.";

    // ===================================================================
    // Save to Database (Optional - for chat history)
    // ===================================================================
    
    try {
      await supabase.from("chat_history").insert({
        user_id: user.id,
        message: message,
        response: aiResponse,
      });
    } catch (dbError) {
      // Log error but don't fail request
      console.error("Failed to save chat history:", dbError);
    }

    // ===================================================================
    // Return Response with Rate Limit Headers
    // ===================================================================
    
    return NextResponse.json(
      {
        response: aiResponse,
        timestamp: new Date().toISOString(),
      },
      {
        status: 200,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT.toString(),
          "X-RateLimit-Remaining": rateLimit.remaining.toString(),
        },
      }
    );

  } catch (error) {
    console.error("Chat API error:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "Service configuration error" },
          { status: 500 }
        );
      }

      if (error.message.includes("quota") || error.message.includes("rate limit")) {
        return NextResponse.json(
          { error: "AI service temporarily unavailable. Please try again later." },
          { status: 503 }
        );
      }

      // Validation errors
      if (error.message.includes("Message")) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ===================================================================
// OPTIONS handler for CORS (if needed)
// ===================================================================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}