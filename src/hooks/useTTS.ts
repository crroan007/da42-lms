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
  const useApiRef = useRef(true);
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isLoading: false,
    activeSection: null,
  });

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
        audio.onended = () => { URL.revokeObjectURL(url); resolve(!abortRef.current); };
        audio.onerror = () => { URL.revokeObjectURL(url); resolve(false); };
        if (abortRef.current) { resolve(false); return; }
        audio.play().catch(() => resolve(false));
      });
    } catch {
      clearTimeout(timeout);
      return false;
    }
  }, []);

  const speakViaBrowser = useCallback((text: string): Promise<boolean> => {
    if (abortRef.current) return Promise.resolve(false);
    if (!("speechSynthesis" in window)) return Promise.resolve(false);
    return new Promise<boolean>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-GB";
      utterance.rate = 0.95;
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith("en-GB")) || voices.find(v => v.lang.startsWith("en"));
      if (voice) utterance.voice = voice;
      utterance.onend = () => resolve(!abortRef.current);
      utterance.onerror = () => resolve(false);
      if (abortRef.current) { resolve(false); return; }
      speechSynthesis.speak(utterance);
    });
  }, []);

  const speakChunk = useCallback(async (text: string): Promise<boolean> => {
    if (abortRef.current) return false;
    if (useApiRef.current) {
      const ok = await speakViaAPI(text);
      if (ok) return true;
      if (!abortRef.current) {
        useApiRef.current = false;
        return speakViaBrowser(text);
      }
      return false;
    }
    return speakViaBrowser(text);
  }, [speakViaAPI, speakViaBrowser]);

  /**
   * Start narration from a section, continuing through all subsequent sections.
   * allSections is a 2D array: allSections[sectionIndex] = segments for that section.
   * Starts at startSection and reads through all sections until stopped.
   */
  const toggleNarration = useCallback(
    async (startSection: number, allSections: string[][]) => {
      // If playing this or any section, stop
      if (state.isPlaying) {
        stop();
        return;
      }

      stopInternal();
      abortRef.current = false;

      // Read from startSection through end
      for (let secIdx = startSection; secIdx < allSections.length; secIdx++) {
        if (abortRef.current) break;

        setState({ isPlaying: true, isLoading: false, activeSection: secIdx });
        const segments = allSections[secIdx];

        for (const segment of segments) {
          if (abortRef.current) break;
          if (!segment.trim()) continue;

          setState((s) => ({ ...s, isLoading: true }));
          const ok = await speakChunk(segment);
          setState((s) => ({ ...s, isLoading: false }));

          if (!ok || abortRef.current) break;
        }

        if (abortRef.current) break;
      }

      if (!abortRef.current) {
        setState({ isPlaying: false, isLoading: false, activeSection: null });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.isPlaying, speakChunk]
  );

  const stopInternal = useCallback(() => {
    abortRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if ("speechSynthesis" in window) speechSynthesis.cancel();
  }, []);

  const stop = useCallback(() => {
    stopInternal();
    setState({ isPlaying: false, isLoading: false, activeSection: null });
  }, [stopInternal]);

  return { toggleNarration, stop, isPlaying: state.isPlaying, isLoading: state.isLoading, activeSection: state.activeSection };
}
