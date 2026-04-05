"use client";

import { useCallback, useRef, useState } from "react";

interface TTSState {
  isPlaying: boolean;
  isLoading: boolean;
  activeSection: number | null;
}

export function useTTS() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef(false);
  const useApiFallbackRef = useRef(true); // start with API, fallback to browser
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isLoading: false,
    activeSection: null,
  });

  /** Speak via server-side API (Python edge-tts) */
  const speakViaAPI = useCallback(async (text: string): Promise<boolean> => {
    if (abortRef.current) return false;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.slice(0, 10000) }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok || abortRef.current) return false;

      const blob = await res.blob();
      if (abortRef.current || blob.size === 0) return false;

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
        if (abortRef.current) { resolve(false); return; }
        audio.play().catch(() => resolve(false));
      });
    } catch {
      clearTimeout(timeout);
      return false;
    }
  }, []);

  /** Speak via browser Web Speech API (works everywhere, lower quality) */
  const speakViaBrowser = useCallback((text: string): Promise<boolean> => {
    if (abortRef.current) return Promise.resolve(false);
    if (!("speechSynthesis" in window)) return Promise.resolve(false);

    return new Promise<boolean>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB";
      utterance.rate = 0.95;

      // Try to find a good British voice
      const voices = speechSynthesis.getVoices();
      const british = voices.find(
        (v) => v.lang.startsWith("en-GB") && v.name.includes("Female")
      ) || voices.find(
        (v) => v.lang.startsWith("en-GB")
      ) || voices.find(
        (v) => v.lang.startsWith("en")
      );
      if (british) utterance.voice = british;

      utterance.onend = () => resolve(!abortRef.current);
      utterance.onerror = () => resolve(false);

      if (abortRef.current) { resolve(false); return; }
      speechSynthesis.speak(utterance);
    });
  }, []);

  /** Speak a single chunk — tries API first, falls back to browser */
  const speakChunk = useCallback(async (text: string): Promise<boolean> => {
    if (abortRef.current) return false;

    if (useApiFallbackRef.current) {
      const ok = await speakViaAPI(text);
      if (ok) return true;
      // API failed — switch to browser for remaining chunks
      if (!abortRef.current) {
        console.log("TTS API unavailable, using browser speech");
        useApiFallbackRef.current = false;
        return speakViaBrowser(text);
      }
      return false;
    }

    return speakViaBrowser(text);
  }, [speakViaAPI, speakViaBrowser]);

  /** Toggle narration for a section */
  const toggleNarration = useCallback(
    async (sectionIndex: number, segments: string[]) => {
      if (state.activeSection === sectionIndex && state.isPlaying) {
        stop();
        return;
      }

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.activeSection, state.isPlaying, speakChunk]
  );

  const stopInternal = useCallback(() => {
    abortRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel();
    }
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
