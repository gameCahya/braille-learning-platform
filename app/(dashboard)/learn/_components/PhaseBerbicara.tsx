"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Upload, Play, Square, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Lesson } from "@/types";

interface Props {
  lessons: Lesson[];
  moduleId: string;
}

export default function PhaseBerbicara({ lessons, moduleId }: Props) {
  const [audioMap, setAudioMap] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetLessonRef = useRef<Lesson | null>(null);

  useEffect(() => {
    loadAudio();
    return () => {
      audioRef.current?.pause();
      window.speechSynthesis.cancel();
    };
  }, [moduleId]);

  const loadAudio = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("module_audio")
      .select("lesson_id, audio_url")
      .eq("module_id", moduleId);

    if (data) {
      const map: Record<string, string> = {};
      data.forEach((row) => {
        map[row.lesson_id] = row.audio_url;
      });
      setAudioMap(map);
    }
  };

  const handleSpeak = (text: string) => {
    window.speechSynthesis.cancel();
    setTimeout(() => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }, 100);
  };

  const handleUploadClick = (lesson: Lesson) => {
    targetLessonRef.current = lesson;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const lesson = targetLessonRef.current;
    if (!file || !lesson) return;
    e.target.value = "";

    setUploading(lesson.id);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Silakan masuk terlebih dahulu");
      setUploading(null);
      return;
    }

    const ext = file.name.split(".").pop() ?? "mp3";
    const path = `${moduleId}/${lesson.id}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from("module-audio")
      .upload(path, file, { upsert: true });

    if (uploadError) {
      toast.error("Gagal upload audio", { description: uploadError.message });
      setUploading(null);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("module-audio").getPublicUrl(path);

    const { error: dbError } = await supabase.from("module_audio").upsert(
      {
        module_id: moduleId,
        lesson_id: lesson.id,
        audio_url: publicUrl,
        uploaded_by: user.id,
      },
      { onConflict: "module_id,lesson_id" }
    );

    if (dbError) {
      toast.error("Gagal menyimpan data audio");
    } else {
      setAudioMap((prev) => ({ ...prev, [lesson.id]: publicUrl }));
      toast.success("Audio berhasil diunggah");
    }
    setUploading(null);
  };

  const handlePlayAudio = (lessonId: string, url: string) => {
    if (playingId === lessonId) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => {
      toast.error("Gagal memutar audio");
      setPlayingId(null);
    };
    audio.play();
    setPlayingId(lessonId);
  };

  const handleDeleteAudio = async (lesson: Lesson) => {
    const supabase = createClient();
    await supabase
      .from("module_audio")
      .delete()
      .eq("module_id", moduleId)
      .eq("lesson_id", lesson.id);

    audioRef.current?.pause();
    if (playingId === lesson.id) setPlayingId(null);

    setAudioMap((prev) => {
      const next = { ...prev };
      delete next[lesson.id];
      return next;
    });
    toast.success("Audio dihapus");
  };

  return (
    <Card>
      {/* Input file tersembunyi — satu untuk semua lesson */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <CardHeader>
        <div className="flex items-center gap-2">
          <Mic className="h-5 w-5 text-orange-600" />
          <CardTitle>Fase Berbicara</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">
          Siswa ucapkan kata di depan kelas. Upload audio panduan untuk diputar guru.
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {lessons.map((lesson) => (
          <div key={lesson.id}>
            {lesson.words && lesson.words.length > 0 ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  {lesson.title}
                </p>
                <div className="space-y-2">
                  {lesson.words.map((word) => {
                    const uploadedUrl = audioMap[word.id];
                    const isUploading = uploading === word.id;
                    const isCurrentlyPlaying = playingId === word.id;

                    return (
                      <div
                        key={word.id}
                        className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-card"
                      >
                        <div className="min-w-0 flex-1 flex items-center gap-3">
                          {word.image && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={word.image}
                              alt={word.imageAlt || word.indonesian}
                              className="h-10 w-10 object-cover rounded-lg border shrink-0"
                            />
                          )}
                          <div>
                            <p className="font-semibold text-base leading-tight">{word.indonesian}</p>
                            <p className="text-xs text-muted-foreground">{word.english}</p>
                            <p className="text-sm font-mono text-blue-600 dark:text-blue-400" aria-label={`Braille untuk "${word.indonesian}"`}>{word.braille}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {uploadedUrl && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-400 hidden sm:flex">
                              Audio
                            </Badge>
                          )}
                          <Button variant="outline" size="icon" title="Putar TTS" onClick={() => handleSpeak(`${word.indonesian}. ${word.english}`)}>
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          {uploadedUrl && (
                            <Button
                              variant={isCurrentlyPlaying ? "default" : "outline"}
                              size="icon"
                              title={isCurrentlyPlaying ? "Berhenti" : "Putar audio"}
                              onClick={() => handlePlayAudio(word.id, uploadedUrl)}
                            >
                              {isCurrentlyPlaying ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="icon"
                            title={uploadedUrl ? "Ganti audio" : "Upload audio"}
                            disabled={isUploading}
                            onClick={() => {
                              targetLessonRef.current = { ...lesson, id: word.id };
                              fileInputRef.current?.click();
                            }}
                          >
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          </Button>
                          {uploadedUrl && (
                            <Button
                              variant="outline"
                              size="icon"
                              title="Hapus audio"
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteAudio({ ...lesson, id: word.id })}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              (() => {
                const uploadedUrl = audioMap[lesson.id];
                const isUploading = uploading === lesson.id;
                const isCurrentlyPlaying = playingId === lesson.id;
                return (
                  <div className="flex items-center justify-between gap-3 p-4 rounded-xl border bg-card">
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-lg truncate">{lesson.title}</p>
                      {lesson.content && (
                        <p className="text-sm text-muted-foreground truncate">{lesson.content}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {uploadedUrl && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-400 hidden sm:flex">
                          Audio
                        </Badge>
                      )}
                      <Button variant="outline" size="icon" title="Putar TTS" onClick={() => handleSpeak(lesson.title)}>
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      {uploadedUrl && (
                        <Button
                          variant={isCurrentlyPlaying ? "default" : "outline"}
                          size="icon"
                          title={isCurrentlyPlaying ? "Berhenti" : "Putar audio"}
                          onClick={() => handlePlayAudio(lesson.id, uploadedUrl)}
                        >
                          {isCurrentlyPlaying ? <Square className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="icon"
                        title={uploadedUrl ? "Ganti audio" : "Upload audio"}
                        disabled={isUploading}
                        onClick={() => handleUploadClick(lesson)}
                      >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      </Button>
                      {uploadedUrl && (
                        <Button
                          variant="outline"
                          size="icon"
                          title="Hapus audio"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteAudio(lesson)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
