import Groq from "groq-sdk";

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw new Error("GROQ_API_KEY is not set in environment variables");
}

const groq = new Groq({
  apiKey: apiKey,
});

const SYSTEM_PROMPT = `You are a helpful English and Braille learning tutor for visually impaired students. Your role is to:

1. Help students learn English through Braille
2. Answer questions about Braille characters and how to write them
3. Explain English words, grammar, and sentence structure clearly
4. Provide examples in both text and Braille when relevant
5. Be patient, encouraging, and supportive
6. Keep responses clear and concise
7. Use simple language that's easy to understand

When explaining Braille:
- Describe the dot patterns (e.g., "Letter A is dot 1")
- Provide the Braille symbol when possible
- Give examples of words using the characters

Always be encouraging and positive in your teaching approach.`;

export async function sendMessageToGemini(
  userMessage: string,
  conversationHistory?: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    // Build messages array
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
    ];

    // Add conversation history
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.slice(-6).forEach((msg) => {
        messages.push({
          role: msg.role === "user" ? "user" : "assistant",
          content: msg.content,
        });
      });
    }

    // Add current user message
    messages.push({
      role: "user",
      content: userMessage,
    });

    const completion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.1-8b-instant", // Fast and free
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 0.8,
    });

    const response = completion.choices[0]?.message?.content || "";
    
    if (!response) {
      throw new Error("No response from AI");
    }

    return response;
  } catch (error) {
    console.error("Groq API error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("API key is invalid or missing");
      }
      if (error.message.includes("quota") || error.message.includes("rate limit")) {
        throw new Error("API rate limit exceeded. Please try again later.");
      }
    }
    
    throw new Error("Failed to get response from AI tutor");
  }
}

// Helper function to check if API key is configured
export function isGeminiConfigured(): boolean {
  return !!apiKey;
}