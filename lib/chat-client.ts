// ===================================================================
// Client-Side Chat Handler
// File: lib/chat-client.ts
// ✅ NO API KEYS - Only calls API route
// ===================================================================

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  error?: string;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
}

/**
 * Send message to AI chat API (Server-side only)
 * ✅ API key NEVER exposed to client
 */
export async function sendChatMessage(
  message: string,
  conversationHistory: ChatMessage[] = []
): Promise<{ data?: ChatResponse; error?: string; rateLimit?: RateLimitInfo }> {
  
  // Validate input
  if (!message || message.trim().length === 0) {
    return { error: "Message cannot be empty" };
  }

  if (message.length > 1000) {
    return { error: "Message too long (max 1000 characters)" };
  }

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message.trim(),
        conversationHistory: conversationHistory.slice(-10), // Last 10 messages only
      }),
    });

    // Extract rate limit headers
    const rateLimit: RateLimitInfo = {
      limit: parseInt(response.headers.get("X-RateLimit-Limit") || "20"),
      remaining: parseInt(response.headers.get("X-RateLimit-Remaining") || "0"),
    };

    // Handle errors
    if (!response.ok) {
      const errorData = await response.json();
      
      if (response.status === 401) {
        return { 
          error: "Please sign in to use the AI tutor",
          rateLimit 
        };
      }
      
      if (response.status === 429) {
        return { 
          error: `Rate limit exceeded. Please try again in ${errorData.resetIn || 60} minutes.`,
          rateLimit 
        };
      }

      return { 
        error: errorData.error || "Failed to get AI response",
        rateLimit 
      };
    }

    const data: ChatResponse = await response.json();
    
    return { 
      data,
      rateLimit 
    };

  } catch (error) {
    console.error("Chat client error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Failed to fetch")) {
        return { 
          error: "Network error. Please check your connection and try again." 
        };
      }
    }

    return { 
      error: "Something went wrong. Please try again later." 
    };
  }
}

/**
 * Check remaining rate limit
 */
export async function checkRateLimit(): Promise<RateLimitInfo> {
  try {
    const response = await fetch("/api/chat/rate-limit", {
      method: "GET",
    });

    if (response.ok) {
      const data = await response.json();
      return {
        limit: data.limit,
        remaining: data.remaining,
      };
    }
  } catch (error) {
    console.error("Rate limit check error:", error);
  }

  return { limit: 20, remaining: 0 };
}