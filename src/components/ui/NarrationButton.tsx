"use client";

import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface NarrationButtonProps {
  text: string;
  className?: string;
}

export function NarrationButton({ text, className }: NarrationButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    };
  }, []);

  const toggle = useCallback(async () => {
    if (isPlaying) {
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
      if ("speechSynthesis" in window) speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);

    // Try API first
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 5000) }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const blob = await res.blob();
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onplay = () => { setIsLoading(false); setIsPlaying(true); };
          audio.onended = () => { setIsPlaying(false); audioRef.current = null; URL.revokeObjectURL(url); };
          audio.onerror = () => { setIsPlaying(false); setIsLoading(false); };
          await audio.play();
          return;
        }
      }
    } catch { /* fall through to browser TTS */ }

    // Fallback: browser speech
    setIsLoading(false);
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB";
      utterance.rate = 0.95;
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith("en-GB")) || voices.find(v => v.lang.startsWith("en"));
      if (voice) utterance.voice = voice;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      speechSynthesis.speak(utterance);
    }
  }, [isPlaying, text]);

  return (
    <button
      onClick={toggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-1 text-xs transition-opacity hover:opacity-80 ${
        isPlaying ? "text-[var(--color-gold)]" : "text-[var(--color-text-muted)]"
      } ${className || ""}`}
      title={isPlaying ? "Stop" : "Listen"}
    >
      {isLoading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : isPlaying ? (
        <VolumeX className="h-3.5 w-3.5" />
      ) : (
        <Volume2 className="h-3.5 w-3.5" />
      )}
    </button>
  );
}
