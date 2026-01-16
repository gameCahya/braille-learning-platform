// functions/api/chat.ts

/**
 * Cloudflare Worker untuk AI Chat
 * Auto-deployed dengan Cloudflare Pages
 */

interface Env {
  GROQ_API_KEY: string;
}

interface ChatRequest {
  message: string;
  conversationHistory?: Array<{
    role: string;
    content: string;
  }>;
}

export async function onRequestPost(context: {
  request: Request;
  env: Env;
}): Promise<Response> {
  const { request, env } = context;

  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Parse request body
    const body: ChatRequest = await request.json();
    const { message, conversationHistory = [] } = body;

    // Validate input
    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Build messages array
    const messages = [
      {
        role: 'system',
        content: `You are a helpful and patient Braille learning assistant. Your role is to:
- Help students learn Braille characters and patterns
- Explain dot patterns clearly
- Provide examples when teaching
- Answer questions about Braille in simple English
- Be encouraging and supportive
- Keep responses concise and clear (max 3-4 sentences unless asked for more)

When explaining Braille:
- Always mention the dot pattern (e.g., "dots 1-4")
- Show the Braille character when relevant
- Give practical examples
- Use simple, easy-to-understand language`,
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message,
      },
    ];

    // Call Groq API
    const groqResponse = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: messages,
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          stream: false,
        }),
      }
    );

    // Check Groq API response
    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error('Groq API error:', errorText);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to get AI response',
          details: 'AI service temporarily unavailable'
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        }
      );
    }

    // Parse Groq response
    const groqData = await groqResponse.json();
    const aiResponse = groqData.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    // Return success response
    return new Response(
      JSON.stringify({
        response: aiResponse,
        timestamp: new Date().toISOString(),
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );

  } catch (error) {
    console.error('Worker error:', error);

    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      }
    );
  }
}