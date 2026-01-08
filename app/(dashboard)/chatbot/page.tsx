"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, BookOpen, MessageCircle, Sparkles } from "lucide-react";
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatbotPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Bot className="h-8 w-8 text-blue-600" />
          AI Tutor
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Get instant help with English and Braille learning
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <BookOpen className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle className="text-base">Learn Braille</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Ask about any Braille character or pattern
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle className="text-base">Practice English</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get help with grammar, vocabulary, and more
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Sparkles className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle className="text-base">Instant Answers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get responses in seconds, anytime you need
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Try asking:</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {[
            "How do I write 'hello' in Braille?",
            "What is the difference between capital and lowercase in Braille?",
            "Explain the Braille number system",
            "Help me practice common English phrases",
          ].map((suggestion) => (
            <Badge
              key={suggestion}
              variant="outline"
              className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {suggestion}
            </Badge>
          ))}
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <ChatInterface />
    </div>
  );
}