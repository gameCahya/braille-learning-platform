"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { speak, stopSpeaking, getTTS } from "@/lib/speech";
import { Send, Volume2, VolumeX, Loader2, Settings, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  isPlaying?: boolean;
}

interface ChatInterfaceProps {
  onSendMessage?: (message: string) => Promise<string>;
  placeholder?: string;
  autoSpeak?: boolean;
}

export function ChatInterface({ 
  onSendMessage,
  placeholder = "Ask me anything about Braille...",
  autoSpeak = true
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your Braille learning assistant. I can help you with:\n\n• Learning Braille characters\n• Understanding dot patterns\n• Practicing words and sentences\n• Answering questions about Braille\n\nHow can I help you today?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState(0.85);
  const [showSettings, setShowSettings] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new message
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let response: string;
      
      if (onSendMessage) {
        response = await onSendMessage(userMessage.content);
      } else {
        // Default mock response for testing
        response = await mockAIResponse(userMessage.content);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Auto-speak AI response if enabled
      if (autoSpeak) {
        await handleSpeak(assistantMessage.id, response);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  // Mock AI response for testing
  const mockAIResponse = async (userInput: string): Promise<string> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("hello") || lowerInput.includes("hi")) {
      return "Hello! I'm here to help you learn Braille. What would you like to know?";
    }
    
    if (lowerInput.includes("how") && lowerInput.includes("braille")) {
      return "Braille is a tactile writing system used by people who are blind or visually impaired. It uses raised dots arranged in cells of up to six dots. Each combination represents a letter, number, or punctuation mark.";
    }
    
    if (lowerInput.includes("cat")) {
      return "The word 'cat' in Braille is: ⠉⠁⠞\n\nBreakdown:\n• C = ⠉ (dots 1-4)\n• A = ⠁ (dot 1)\n• T = ⠞ (dots 2-3-4-5)";
    }
    
    return `I understand you're asking about: "${userInput}". Let me help you with that! Braille is read by touch, using raised dots. Would you like to learn more about specific letters or words?`;
  };

  // Handle speak message with better voice quality
  const handleSpeak = async (messageId: string, text: string) => {
    if (currentPlayingId === messageId) {
      stopSpeaking();
      setCurrentPlayingId(null);
      updateMessagePlayingState(messageId, false);
      return;
    }

    if (currentPlayingId) {
      stopSpeaking();
      updateMessagePlayingState(currentPlayingId, false);
    }

    try {
      setCurrentPlayingId(messageId);
      updateMessagePlayingState(messageId, true);

      const tts = getTTS();
      const bestVoice = tts.getBestVoice();

      await speak(text, {
        rate: speechRate,
        pitch: 1.0,
        volume: 1.0,
        voiceName: bestVoice?.name
      });

      setCurrentPlayingId(null);
      updateMessagePlayingState(messageId, false);
    } catch (error) {
      console.error("Speech error:", error);
      setCurrentPlayingId(null);
      updateMessagePlayingState(messageId, false);
      toast.error("Could not play audio");
    }
  };

  const updateMessagePlayingState = (messageId: string, isPlaying: boolean) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, isPlaying } : msg
      )
    );
  };

  const handleStopAll = () => {
    stopSpeaking();
    if (currentPlayingId) {
      updateMessagePlayingState(currentPlayingId, false);
      setCurrentPlayingId(null);
    }
  };

  const handleClearChat = () => {
    handleStopAll();
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Chat cleared. How can I help you?",
        timestamp: new Date(),
      }
    ]);
    toast.success("Chat cleared");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div 
      className="flex flex-col border rounded-lg bg-background overflow-hidden"
      style={{ height: '600px' }} // Inline style untuk ensure fixed height
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 bg-primary">
            <AvatarFallback>AI</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">Braille Tutor</h3>
            <p className="text-xs text-muted-foreground">Always here to help</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {showSettings && (
            <Badge variant="outline" className="text-xs">
              Speed: {speechRate}x
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            aria-label="Toggle settings"
          >
            <Settings className="h-4 w-4" />
          </Button>

          {currentPlayingId && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleStopAll}
              aria-label="Stop all audio"
              className="text-destructive"
            >
              <VolumeX className="h-4 w-4" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            aria-label="Clear chat"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="m-4 p-4 space-y-3 bg-muted/50 border rounded-lg shrink-0">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              Speech Speed
              <span className="text-muted-foreground">{speechRate}x</span>
            </label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.05"
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full"
              aria-label="Speech speed"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Slower</span>
              <span>Normal</span>
              <span>Faster</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="auto-speak"
              checked={autoSpeak}
              onChange={(e) => {
                toast.info(e.target.checked ? "Auto-speak enabled" : "Auto-speak disabled");
              }}
              className="rounded"
            />
            <label htmlFor="auto-speak" className="text-sm">
              Auto-play AI responses
            </label>
          </div>
        </div>
      )}

      {/* Messages - Native Scroll */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
        style={{ minHeight: 0 }} // Critical for flexbox
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 items-start",
              message.role === "user" ? "flex-row-reverse" : "flex-row"
            )}
          >
            <Avatar className={cn(
              "h-8 w-8 shrink-0",
              message.role === "user" ? "bg-primary" : "bg-muted"
            )}>
              <AvatarFallback>
                {message.role === "user" ? "You" : "AI"}
              </AvatarFallback>
            </Avatar>

            <div
              className={cn(
                "flex flex-col gap-2 max-w-[80%]",
                message.role === "user" ? "items-end" : "items-start"
              )}
            >
              <Card
                className={cn(
                  "p-3",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted",
                  message.isPlaying && "ring-2 ring-primary"
                )}
              >
                <p className="text-sm whitespace-pre-wrap break-words">
                  {message.content}
                </p>
              </Card>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {message.role === "assistant" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-2"
                    onClick={() => handleSpeak(message.id, message.content)}
                    aria-label={message.isPlaying ? "Stop reading" : "Read message"}
                  >
                    {message.isPlaying ? (
                      <>
                        <VolumeX className="h-3 w-3 mr-1" />
                        <span className="text-xs">Stop</span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-3 w-3 mr-1" />
                        <span className="text-xs">Listen</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3 items-start">
            <Avatar className="h-8 w-8 bg-muted">
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <Card className="p-3 bg-muted">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">
                  Thinking...
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-muted/50 shrink-0">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
            aria-label="Message input"
          />
          <Button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            size="icon"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Press Enter to send • Click Listen to hear messages
        </p>
      </div>
    </div>
  );
}