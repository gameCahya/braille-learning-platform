"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Zap, Volume2, Lightbulb } from "lucide-react";

export default function ChatbotPage() {
  const [autoSpeak, setAutoSpeak] = useState(true);

  // Handle sending message to AI API
  const handleSendMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          conversationHistory: [], // You can add history here if needed
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      return data.response || "I'm sorry, I couldn't process that. Could you try again?";
    } catch (error) {
      console.error("Chat API error:", error);
      throw error;
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

      {/* Audio Features Notice */}
      <Card className="border-primary bg-primary/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Volume2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="space-y-2 flex-1">
              <p className="font-medium">♿ Audio-Enhanced Chat</p>
              <p className="text-sm text-muted-foreground">
                All AI responses can be read aloud. Click the <strong>"Listen"</strong> button 
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
              Ask for examples and I'll show you Braille with clear explanations
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
                onClick={() => {
                  // This would need to trigger the chat input
                  // For now, just a visual indicator
                }}
              >
                {question}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card>
        <CardContent className="p-0">
          <ChatInterface
            onSendMessage={handleSendMessage}
            placeholder="Ask me anything about Braille... (Press Enter to send)"
            autoSpeak={autoSpeak}
          />
        </CardContent>
      </Card>

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
              <span>Ask for specific examples: "Show me cat in Braille"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Request explanations: "Explain how Braille numbers work"</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Get help with practice: "Give me 5 easy words to practice"</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}