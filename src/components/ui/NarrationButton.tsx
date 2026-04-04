"use client";

import { Volume2, VolumeX, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface NarrationButtonProps {
  text: string;
  className?: string;
}

/** Standalone narration button for single text chunks (e.g., quiz questions) */
export function NarrationButton({ text, className }: NarrationButtonProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const toggle = useCallback(async () => {
    // If playing, stop
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 10000) }),
      });
      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      audio.onplay = () => { setIsLoading(false); setIsPlaying(true); };
      audio.onended = () => { setIsPlaying(false); audioRef.current = null; URL.revokeObjectURL(url); };
      audio.onerror = () => { setIsPlaying(false); setIsLoading(false); };

      await audio.play();
    } catch {
      setIsLoading(false);
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
