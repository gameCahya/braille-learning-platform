import Link from "next/link";
import { conversations, conversationTopics } from "@/lib/data/conversations";
import { MessageCircle, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConversationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Conversation</h1>
        <p className="text-muted-foreground mt-1">
          Percakapan pendek Bahasa Inggris untuk latihan berbicara di kelas. Guru membacakan, siswa menirukan.
        </p>
      </div>

      {conversationTopics.map((topic) => (
        <div key={topic} className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">{topic}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {conversations
              .filter((c) => c.topic === topic)
              .map((conv) => (
                <Link key={conv.id} href={`/conversation/${conv.id}`}>
                  <Card className="hover:border-primary hover:shadow-sm transition-all cursor-pointer h-full">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between gap-2">
                        <MessageCircle className="h-5 w-5 text-primary mt-0.5 shrink-0" aria-hidden="true" />
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
                      </div>
                      <CardTitle className="text-base">{conv.title}</CardTitle>
                      <CardDescription className="text-sm">{conv.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-xs text-muted-foreground">{conv.lines.length} baris percakapan</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
