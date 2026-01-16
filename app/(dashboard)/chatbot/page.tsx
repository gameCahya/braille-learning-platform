"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Zap, Volume2, Lightbulb, Shield } from "lucide-react";
import { sendChatMessage } from "@/lib/chat-client"; // ✅ Secure client

export default function ChatbotPage() {
  // ✅ Handler yang aman - NO API KEYS exposed
  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const { data, error, rateLimit } = await sendChatMessage(message);

      if (error) {
        throw new Error(error);
      }

      if (!data) {
        throw new Error("No response from AI");
      }

      // Log rate limit (optional)
      if (rateLimit) {
        console.log(`Rate limit: ${rateLimit.remaining}/${rateLimit.limit} remaining`);
      }

      return data.response;
    } catch (error) {
      console.error("Chat error:", error);
      throw error; // ChatInterface will handle error display
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Braille Tutor</h1>
        <p className="text-muted-foreground">
          Ask me anything about Braille, get instant help with your learning
        </p>
      </div>

      {/* Security Notice */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="font-medium text-green-900 dark:text-green-100">🔒 Your Privacy is Protected</p>
              <p className="text-sm text-green-800 dark:text-green-200">
                All conversations are encrypted and stored securely. Only you can access your chat history.
                We rate-limit requests (20 per hour) to prevent abuse.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio Features Notice */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Volume2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="font-medium">♿ Audio-Enhanced Chat</p>
              <p className="text-sm text-muted-foreground">
                All AI responses can be read aloud. Click the <strong>&quot;Listen&quot;</strong> button 
                on any message, or enable <strong>auto-play</strong> in settings to hear responses 
                automatically. Perfect for screen reader users and audio learners!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Instant Answers</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Get immediate help with Braille characters, dot patterns, and translations
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Smart Examples</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Ask for examples and I&apos;ll show you Braille with clear explanations
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Learning Tips</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-sm">
              Get personalized tips and strategies to improve your Braille skills
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Questions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Start Questions</CardTitle>
          <CardDescription>
            Click any question to get started, or type your own
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              "How do I write 'hello' in Braille?",
              "What are the dots for letter A?",
              "Explain Braille numbers",
              "How to read Braille punctuation?",
              "Tips for learning Braille faster",
              "What's the difference between Grade 1 and 2?",
            ].map((question, i) => (
              <Badge
                key={i}
                variant="outline"
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-2 text-sm"
              >
                {question}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <div className="w-full">
        <ChatInterface
          onSendMessage={handleSendMessage}
          placeholder="Ask me anything about Braille... (Press Enter to send)"
          autoSpeak={false}
        />
      </div>

      {/* Tips Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">Tips for Best Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Use headphones for clear audio playback</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Adjust speech speed in settings (gear icon) to your preference</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Ask for specific examples: &quot;Show me cat in Braille&quot;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Request explanations: &quot;Explain how Braille numbers work&quot;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Get help with practice: &quot;Give me 5 easy words to practice&quot;</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span className="font-semibold text-primary">🔒 Rate limit: 20 messages per hour (resets automatically)</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}