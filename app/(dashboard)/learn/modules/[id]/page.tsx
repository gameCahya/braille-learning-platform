"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle2, Volume2, BookOpen, XCircle, RefreshCw } from "lucide-react";
import { getModuleById } from "@/lib/data/modules";
import { getModuleUUID } from "@/lib/data/moduleMapping";
import BrailleDisplay from "@/components/braille/BrailleDisplay";
import QuizComponent from "@/components/learning/QuizComponent";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

// PASSING GRADE CONSTANT
const PASSING_GRADE = 70; // 70% minimum untuk lulus

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.id as string;
  const moduleUUID = getModuleUUID(moduleId);
  
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizPassed, setQuizPassed] = useState(false); // NEW: Track if passed
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModuleCompleted, setIsModuleCompleted] = useState(false);

  const learningModule = getModuleById(moduleId);

  useEffect(() => {
    async function loadProgress() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && learningModule) {
        const { data, error } = await supabase
          .from("user_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("module_id", moduleUUID)
          .maybeSingle();
        
        if (error) {
          console.error("Error loading progress:", error);
        } else if (data) {
          setIsModuleCompleted(data.completed || false);
        }
      }
      setLoading(false);
    }

    loadProgress();
  }, [moduleId, moduleUUID, learningModule]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-600 dark:text-slate-400">
              Loading module...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!learningModule) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-slate-600 dark:text-slate-400">
              Module not found
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => router.push("/learn/modules")}>
                Back to Modules
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentLesson = learningModule.content.lessons[currentLessonIndex];
  const totalLessons = learningModule.content.lessons.length;
  const progressPercentage = (completedLessons.size / totalLessons) * 100;

  const handleLessonComplete = () => {
    setCompletedLessons((prev) => new Set(prev).add(currentLessonIndex));
    toast.success("Lesson completed!", {
      description: "Great job! Keep learning.",
    });
  };

  const handleNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // NEW: Retry Quiz Function
  const handleRetryQuiz = () => {
    setQuizCompleted(false);
    setQuizScore(0);
    setQuizPassed(false);
    setShowQuiz(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info("Quiz reset. Try again!", {
      description: `You need ${PASSING_GRADE}% to pass.`,
    });
  };

  const handleCompleteModule = async () => {
    // Check if module has exercises and quiz not completed
    if (learningModule.content.exercises && learningModule.content.exercises.length > 0 && !quizCompleted) {
      setShowQuiz(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // NEW: Check if quiz passed
    if (quizCompleted && !quizPassed) {
      toast.error("Quiz not passed!", {
        description: `You need at least ${PASSING_GRADE}% to complete this module. Please retry the quiz.`,
      });
      return;
    }

    setSaving(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please sign in to save progress");
      setSaving(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_progress")
        .upsert(
          {
            user_id: user.id,
            module_id: moduleUUID,
            completed: true,
            score: quizScore || 100,
            completed_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,module_id",
            ignoreDuplicates: false,
          }
        )
        .select()
        .single();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      toast.success("Module completed!", {
        description: "You've finished this module. Great work!",
      });

      if (data) {
        setIsModuleCompleted(true);
      }

      setTimeout(() => {
        router.push("/learn/modules");
      }, 2000);
    } catch (error) {
      console.error("Failed to save progress:", error);
      
      const err = error as { code?: string; message?: string };
      
      if (err.code === "23503") {
        toast.error("Module not found in database", {
          description: "Please contact support if this persists.",
        });
      } else if (err.code === "23505") {
        toast.error("Progress already saved", {
          description: "Your progress has been recorded.",
        });
      } else {
        toast.error("Failed to save progress", {
          description: err.message || "Please try again.",
        });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleQuizComplete = async (score: number, answers: Record<string, string>) => {
    setQuizScore(score);
    setQuizCompleted(true);
    
    // NEW: Check if passed
    const passed = score >= PASSING_GRADE;
    setQuizPassed(passed);
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      try {
        const { error } = await supabase.from("quiz_results").insert({
          user_id: user.id,
          module_id: moduleUUID,
          score,
          total_points: 100,
          correct_answers: Object.values(answers).filter((a) => a === "correct").length,
          total_questions: Object.keys(answers).length,
          answers,
        });

        if (error) {
          console.error("Error saving quiz result:", error);
        } else {
          // NEW: Different toast based on pass/fail
          if (passed) {
            toast.success("Quiz passed! 🎉", {
              description: `You scored ${score}%. Excellent!`,
            });
          } else {
            toast.error("Quiz failed 😞", {
              description: `You scored ${score}%. You need ${PASSING_GRADE}% to pass. Please try again.`,
            });
          }
        }
      } catch (error) {
        console.error("Failed to save quiz result:", error);
      }
    }
  };

  const handleSpeak = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    } else {
      toast.error("Text-to-speech not supported");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Button
          variant="ghost"
          onClick={() => router.push("/learn/modules")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Modules
        </Button>
        
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{learningModule.title}</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              {learningModule.description}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Badge className={
              learningModule.difficulty === "beginner"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : learningModule.difficulty === "intermediate"
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
            }>
              {learningModule.difficulty}
            </Badge>
            {isModuleCompleted && (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Completed
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Your Progress</CardTitle>
          <CardDescription>
            {showQuiz 
              ? `Complete the quiz (minimum ${PASSING_GRADE}% to pass)`
              : `Lesson ${currentLessonIndex + 1} of ${totalLessons}`
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressPercentage} className="mb-2" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {completedLessons.size} of {totalLessons} lessons completed
          </p>
        </CardContent>
      </Card>

      {/* Show Quiz or Lessons */}
      {showQuiz && learningModule.content.exercises ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Module Quiz</CardTitle>
              <CardDescription>
                Test your knowledge. Passing grade: {PASSING_GRADE}%
              </CardDescription>
            </CardHeader>
          </Card>
          
          {!quizCompleted ? (
            <QuizComponent
              exercises={learningModule.content.exercises}
              onComplete={handleQuizComplete}
            />
          ) : (
            <>
              {/* Quiz Result Card */}
              <Card className={quizPassed ? "border-green-500" : "border-red-500"}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {quizPassed ? (
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    ) : (
                      <XCircle className="h-8 w-8 text-red-600" />
                    )}
                    <div>
                      <CardTitle className={quizPassed ? "text-green-700" : "text-red-700"}>
                        {quizPassed ? "Quiz Passed! 🎉" : "Quiz Failed 😞"}
                      </CardTitle>
                      <CardDescription>
                        Your score: {quizScore}% (Passing grade: {PASSING_GRADE}%)
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {quizPassed ? (
                    <p className="text-green-700 dark:text-green-300">
                      Excellent work! You can now complete this module.
                    </p>
                  ) : (
                    <p className="text-red-700 dark:text-red-300">
                      You need at least {PASSING_GRADE}% to pass. Review the lessons and try again!
                    </p>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex gap-3">
                    {!quizPassed && (
                      <Button 
                        onClick={handleRetryQuiz}
                        variant="outline"
                        className="flex-1"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Retry Quiz
                      </Button>
                    )}
                    <Button 
                      onClick={handleCompleteModule} 
                      className="flex-1"
                      disabled={saving || !quizPassed}
                    >
                      {saving ? "Saving..." : "Complete Module"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Current Lesson */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {currentLesson.title}
                  </CardTitle>
                  <CardDescription>
                    Lesson {currentLessonIndex + 1}
                  </CardDescription>
                </div>
                {completedLessons.has(currentLessonIndex) && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Completed
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg">{currentLesson.content}</p>
              </div>

              {currentLesson.braille && (
                <BrailleDisplay
                  text=""
                  braille={currentLesson.braille}
                  showText={false}
                  onSpeak={() => handleSpeak(currentLesson.content)}
                />
              )}

              {currentLesson.example && (
                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardHeader>
                    <CardTitle className="text-base">Example</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{currentLesson.example}</p>
                  </CardContent>
                </Card>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleSpeak(currentLesson.content)}
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  Read Aloud
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Navigation & Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviousLesson}
                  disabled={currentLessonIndex === 0}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <div className="flex gap-2">
                  {!completedLessons.has(currentLessonIndex) && (
                    <Button variant="outline" onClick={handleLessonComplete}>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark Complete
                    </Button>
                  )}

                  {currentLessonIndex === totalLessons - 1 &&
                    completedLessons.size === totalLessons ? (
                    <Button 
                      onClick={handleCompleteModule}
                      disabled={saving}
                    >
                      {saving ? "Saving..." : (
                        learningModule.content.exercises && learningModule.content.exercises.length > 0
                          ? "Take Quiz"
                          : "Complete Module"
                      )}
                    </Button>
                  ) : (
                    <Button
                      onClick={handleNextLesson}
                      disabled={currentLessonIndex === totalLessons - 1}
                    >
                      Next
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Module Summary */}
      {learningModule.content.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Module Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 dark:text-slate-400">
              {learningModule.content.summary}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}