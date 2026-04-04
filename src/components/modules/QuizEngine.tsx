"use client";

import { useState, useCallback } from "react";
import {
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowRight,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { NarrationButton } from "@/components/ui/NarrationButton";
import type { QuizQuestion } from "@/types";

interface QuizEngineProps {
  questions: QuizQuestion[];
  onComplete?: (score: number, total: number) => void;
  className?: string;
}

type QuizState = "answering" | "feedback" | "summary";

export function QuizEngine({
  questions,
  onComplete,
  className,
}: QuizEngineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [state, setState] = useState<QuizState>("answering");
  const [answers, setAnswers] = useState<boolean[]>([]);

  const question = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const score = answers.filter(Boolean).length;

  const handleSubmit = useCallback(() => {
    if (selectedOption === null) return;
    const isCorrect = question.options[selectedOption].isCorrect;
    setAnswers((prev) => [...prev, isCorrect]);
    setState("feedback");
  }, [selectedOption, question]);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      setState("summary");
      onComplete?.(
        score + (answers.length === currentIndex ? 0 : 0),
        questions.length
      );
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setState("answering");
    }
  }, [
    isLastQuestion,
    score,
    answers.length,
    currentIndex,
    questions.length,
    onComplete,
  ]);

  const handleRestart = useCallback(() => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setState("answering");
  }, []);

  if (state === "summary") {
    const finalScore = answers.filter(Boolean).length;
    const percentage = Math.round((finalScore / questions.length) * 100);
    const passed = percentage >= 80;

    return (
      <div className={cn("panel p-6 text-center", className)}>
        <Trophy
          className={cn(
            "h-12 w-12 mx-auto mb-4",
            passed ? "text-gold" : "text-[var(--color-text-faint)]"
          )}
        />

        <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
          {passed ? "Excellent Work!" : "Keep Studying"}
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-4">
          You scored{" "}
          <span className="font-mono font-medium">{finalScore}</span> out of{" "}
          <span className="font-mono font-medium">{questions.length}</span> (
          <span className="font-mono font-medium">{percentage}%</span>)
        </p>

        {/* Score bar */}
        <div className="w-full max-w-xs mx-auto mb-6">
          <div className="h-2 rounded-sm bg-[var(--color-surface-sunken)] overflow-hidden">
            <div
              className={cn(
                "h-full rounded-sm transition-[width] duration-700 ease-out",
                passed
                  ? "bg-[var(--color-gold)]"
                  : "bg-[var(--color-status-caution)]"
              )}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-xs text-[var(--color-text-muted)] mt-2">
            {passed
              ? "You passed! 80% required."
              : "You need 80% to pass. Try again!"}
          </p>
        </div>

        <Button
          variant="secondary"
          onClick={handleRestart}
          icon={<RotateCcw className="h-4 w-4" />}
        >
          Retry Quiz
        </Button>
      </div>
    );
  }

  const isCorrect =
    state === "feedback" && selectedOption !== null
      ? question.options[selectedOption].isCorrect
      : null;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <span className="label-caps">
          Question <span className="font-mono">{currentIndex + 1}</span> of{" "}
          <span className="font-mono">{questions.length}</span>
        </span>
        <div className="flex gap-1">
          {questions.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 w-5 rounded-sm transition-colors",
                i < currentIndex
                  ? answers[i]
                    ? "bg-[var(--color-status-operational)]"
                    : "bg-[var(--color-status-warning)] opacity-70"
                  : i === currentIndex
                  ? "bg-[var(--color-gold)]"
                  : "bg-[var(--color-surface-sunken)]"
              )}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="panel p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-sm font-medium text-[var(--color-text-primary)] leading-relaxed flex-1">
            {question.question}
          </p>
          <NarrationButton text={question.question} className="mt-0.5 flex-shrink-0" />
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2">
        {question.options.map((option, i) => {
          const isSelected = selectedOption === i;
          const showCorrect = state === "feedback" && option.isCorrect;
          const showWrong =
            state === "feedback" && isSelected && !option.isCorrect;

          return (
            <button
              key={i}
              onClick={() => state === "answering" && setSelectedOption(i)}
              disabled={state === "feedback"}
              className={cn(
                "w-full flex items-center gap-3 rounded border p-3 text-left text-sm transition-colors duration-150",
                state === "answering" &&
                  !isSelected &&
                  "border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] hover:border-[var(--color-border-default)] hover:bg-[var(--color-surface-overlay)] text-[var(--color-text-secondary)] cursor-pointer",
                state === "answering" &&
                  isSelected &&
                  "border-l-[3px] border-l-[var(--color-gold)] border-t-[var(--color-border-subtle)] border-r-[var(--color-border-subtle)] border-b-[var(--color-border-subtle)] bg-[var(--color-gold-dim)] text-[var(--color-text-primary)] cursor-pointer pl-2.5",
                showCorrect &&
                  "border-[rgba(34,197,94,0.30)] bg-[rgba(34,197,94,0.06)] text-[var(--color-status-operational)]",
                showWrong &&
                  "border-[rgba(239,68,68,0.30)] bg-[rgba(239,68,68,0.06)] text-[var(--color-status-warning)]",
                state === "feedback" &&
                  !showCorrect &&
                  !showWrong &&
                  "border-[var(--color-border-subtle)] bg-[var(--color-surface-raised)] text-[var(--color-text-faint)] opacity-50"
              )}
            >
              {/* Option letter */}
              <span
                className={cn(
                  "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-sm text-xs font-mono font-semibold",
                  state === "answering" &&
                    !isSelected &&
                    "bg-[var(--color-surface-sunken)] text-[var(--color-text-muted)]",
                  state === "answering" &&
                    isSelected &&
                    "bg-[var(--color-gold-dim)] text-gold",
                  showCorrect &&
                    "bg-[rgba(34,197,94,0.12)] text-[var(--color-status-operational)]",
                  showWrong &&
                    "bg-[rgba(239,68,68,0.12)] text-[var(--color-status-warning)]",
                  state === "feedback" &&
                    !showCorrect &&
                    !showWrong &&
                    "bg-[var(--color-surface-sunken)] text-[var(--color-text-faint)]"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>

              <span className="flex-1">{option.text}</span>

              {showCorrect && (
                <CheckCircle2 className="h-4 w-4 text-[var(--color-status-operational)] flex-shrink-0" />
              )}
              {showWrong && (
                <XCircle className="h-4 w-4 text-[var(--color-status-warning)] flex-shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback explanation */}
      {state === "feedback" && (
        <div
          className={cn(
            "rounded border p-3 text-sm leading-relaxed",
            isCorrect
              ? "border-[rgba(34,197,94,0.20)] bg-[rgba(34,197,94,0.04)] text-[var(--color-status-operational)]"
              : "border-[rgba(234,179,8,0.20)] bg-[rgba(234,179,8,0.04)] text-[var(--color-status-caution)]"
          )}
        >
          <p className="font-semibold mb-1">
            {isCorrect ? "Correct!" : "Not quite."}
          </p>
          <p className="text-[var(--color-text-secondary)]">
            {question.explanation}
          </p>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex justify-end gap-3">
        {state === "answering" && (
          <Button onClick={handleSubmit} disabled={selectedOption === null}>
            Submit Answer
          </Button>
        )}
        {state === "feedback" && (
          <Button
            onClick={handleNext}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            {isLastQuestion ? "See Results" : "Next Question"}
          </Button>
        )}
      </div>
    </div>
  );
}
