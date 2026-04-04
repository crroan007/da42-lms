"use client";

import { useCallback, useRef, useState } from "react";

interface TTSState {
  isPlaying: boolean;
  isLoading: boolean;
  /** Which section is currently being narrated (by index) */
  activeSection: number | null;
}

export function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef(false);
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isLoading: false,
    activeSection: null,
  });

  /** Speak a single text chunk. Returns a promise that resolves when done. */
  const speakChunk = useCallback(async (text: string): Promise<boolean> => {
    if (abortRef.current) return false;

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 10000) }),
      });

      if (!res.ok || abortRef.current) return false;

      const blob = await res.blob();
      if (abortRef.current) return false;

      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audioRef.current = audio;

      return new Promise<boolean>((resolve) => {
        audio.onended = () => {
          URL.revokeObjectURL(url);
          resolve(!abortRef.current);
        };
        audio.onerror = () => {
          URL.revokeObjectURL(url);
          resolve(false);
        };
        if (abortRef.current) {
          resolve(false);
          return;
        }
        audio.play().catch(() => resolve(false));
      });
    } catch {
      return false;
    }
  }, []);

  /**
   * Toggle narration for a sequence of text segments.
   * If already playing this section, stops. If playing another section, switches.
   * Reads through all segments in order until done or toggled off.
   */
  const toggleNarration = useCallback(
    async (sectionIndex: number, segments: string[]) => {
      // If already playing this section, stop
      if (state.activeSection === sectionIndex && state.isPlaying) {
        stop();
        return;
      }

      // Stop any current playback
      stopInternal();

      abortRef.current = false;
      setState({ isPlaying: true, isLoading: true, activeSection: sectionIndex });

      for (const segment of segments) {
        if (abortRef.current) break;
        if (!segment.trim()) continue;

        setState((s) => ({ ...s, isLoading: true }));
        const shouldContinue = await speakChunk(segment);
        setState((s) => ({ ...s, isLoading: false }));

        if (!shouldContinue || abortRef.current) break;
      }

      if (!abortRef.current) {
        setState({ isPlaying: false, isLoading: false, activeSection: null });
      }
    },
    [state.activeSection, state.isPlaying, speakChunk]
  );

  const stopInternal = useCallback(() => {
    abortRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    speechSynthesis.cancel();
  }, []);

  const stop = useCallback(() => {
    stopInternal();
    setState({ isPlaying: false, isLoading: false, activeSection: null });
  }, [stopInternal]);

  return {
    toggleNarration,
    stop,
    isPlaying: state.isPlaying,
    isLoading: state.isLoading,
    activeSection: state.activeSection,
  };
}
