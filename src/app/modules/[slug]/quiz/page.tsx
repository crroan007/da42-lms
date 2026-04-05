"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, CheckCircle2, XCircle, RotateCcw, Trophy, Lock, Unlock } from "lucide-react";
import { useProgress } from "@/hooks/useProgress";
import type { QuizQuestion } from "@/types";

export default function QuizPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(true);
  const { saveQuizScore } = useProgress();
  const scoreSavedRef = useRef(false);

  useEffect(() => {
    fetch(`/api/quiz/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progressPercent = totalQuestions > 0 ? Math.round(((currentIndex + (finished ? 1 : 0)) / totalQuestions) * 100) : 0;

  function handleSelect(optionIndex: number) {
    if (showExplanation) return;
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    if (currentQuestion.options[optionIndex].isCorrect) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setFinished(true);
    }
  }

  function handleRestart() {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setFinished(false);
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link href={`/modules/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-gold transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Module
        </Link>
        <div className="panel p-6 text-center">
          <p className="text-text-secondary text-sm">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link href={`/modules/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-gold transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Module
        </Link>
        <div className="panel p-6 text-center">
          <Trophy className="h-10 w-10 text-text-faint mx-auto mb-3" />
          <h1 className="text-lg font-semibold text-text-primary mb-1">No Quiz Available</h1>
          <p className="text-text-secondary text-sm">A quiz for this module has not been created yet.</p>
        </div>
      </div>
    );
  }

  if (finished) {
    const percent = Math.round((score / totalQuestions) * 100);
    const perfect = score === totalQuestions;

    // Save score once
    if (!scoreSavedRef.current) {
      scoreSavedRef.current = true;
      saveQuizScore(slug, score, totalQuestions);
    }

    return (
      <div className="max-w-3xl mx-auto space-y-4">
        <Link href={`/modules/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-gold transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Module
        </Link>
        <div className="panel p-6 text-center">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded mb-3 ${perfect ? "bg-status-operational/10" : "bg-status-caution/10"}`}>
            {perfect ? (
              <Unlock className="h-8 w-8 text-status-operational" />
            ) : (
              <Lock className="h-8 w-8 text-status-caution" />
            )}
          </div>
          <h1 className="text-xl font-semibold text-text-primary mb-1">
            {perfect ? "Perfect Score — Next Module Unlocked!" : "Not Quite — 100% Required"}
          </h1>
          <p className="text-3xl font-semibold text-gold font-mono mb-1">{percent}%</p>
          <p className="text-text-secondary text-sm mb-4">
            You scored <span className="font-mono">{score}</span> out of <span className="font-mono">{totalQuestions}</span>.
            {!perfect && " Review the material and try again — you need a perfect score to proceed."}
          </p>
          <div className="flex items-center justify-center gap-3">
            {!perfect && (
              <button
                onClick={() => { scoreSavedRef.current = false; handleRestart(); }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded border border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary transition-colors"
              >
                <RotateCcw className="h-4 w-4" />
                Retry Quiz
              </button>
            )}
            <Link
              href={perfect ? "/modules" : `/modules/${slug}`}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gold text-surface-base font-semibold hover:opacity-90 transition-opacity"
            >
              {perfect ? "Continue to Modules" : "Review Material"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <Link href={`/modules/${slug}`} className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-gold transition-colors">
        <ChevronLeft className="h-4 w-4" /> Back to Module
      </Link>

      {/* Progress bar */}
      <div className="panel p-3">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm text-text-secondary">Question <span className="font-mono">{currentIndex + 1}</span> of <span className="font-mono">{totalQuestions}</span></span>
          <span className="text-sm text-gold font-mono font-medium">{progressPercent}%</span>
        </div>
        <div className="h-1 rounded-sm bg-surface-overlay">
          <div
            className="h-full rounded-sm bg-gold transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="panel p-4">
        <h2 className="text-base font-semibold text-text-primary mb-4">
          {currentQuestion.question}
        </h2>

        <div className="space-y-2">
          {currentQuestion.options.map((option, i) => {
            let borderClass = "border-border-subtle hover:border-border-strong";
            let bgClass = "";

            if (showExplanation) {
              if (option.isCorrect) {
                borderClass = "border-status-operational/50";
                bgClass = "bg-status-operational/5";
              } else if (i === selectedOption && !option.isCorrect) {
                borderClass = "border-status-warning/50";
                bgClass = "bg-status-warning/5";
              } else {
                borderClass = "border-border-subtle";
              }
            } else if (i === selectedOption) {
              borderClass = "border-gold/50";
              bgClass = "bg-gold-dim";
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={showExplanation}
                className={`w-full text-left p-3 rounded border ${borderClass} ${bgClass} transition-colors duration-150 ${
                  !showExplanation ? "cursor-pointer" : "cursor-default"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-sm border border-border-default text-xs font-mono font-medium text-text-muted flex-shrink-0">
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span className="text-sm text-text-primary">{option.text}</span>
                  {showExplanation && option.isCorrect && (
                    <CheckCircle2 className="h-4 w-4 text-status-operational ml-auto flex-shrink-0" />
                  )}
                  {showExplanation && i === selectedOption && !option.isCorrect && (
                    <XCircle className="h-4 w-4 text-status-warning ml-auto flex-shrink-0" />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Explanation */}
        {showExplanation && (
          <div className="mt-4 p-3 rounded-sm surface-sunken border border-border-subtle">
            <p className="text-sm text-text-secondary leading-relaxed">
              {currentQuestion.explanation}
            </p>
          </div>
        )}

        {/* Next button */}
        {showExplanation && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-4 py-2 rounded bg-gold text-surface-base font-semibold hover:opacity-90 transition-opacity"
            >
              {currentIndex < totalQuestions - 1 ? "Next Question" : "See Results"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
