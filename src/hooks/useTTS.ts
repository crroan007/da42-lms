"use client";

import { useCallback, useRef, useState, useEffect } from "react";

interface TTSState {
  isPlaying: boolean;
  isLoading: boolean;
  activeSection: number | null;
}

type AudioManifest = Record<string, { file: string; hash: string; slug: string; section: number }>;

export function useTTS(moduleSlug?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const abortRef = useRef(false);
  const manifestRef = useRef<AudioManifest | null>(null);
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isLoading: false,
    activeSection: null,
  });

  // Load manifest once
  useEffect(() => {
    fetch("/audio/lessons/manifest.json")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => { manifestRef.current = data; })
      .catch(() => {});
  }, []);

  /** Play a pre-generated audio file. Returns true if completed successfully. */
  const playStaticAudio = useCallback(async (sectionIndex: number): Promise<boolean> => {
    if (abortRef.current || !manifestRef.current || !moduleSlug) return false;

    const key = `${moduleSlug}_s${sectionIndex}`;
    const entry = manifestRef.current[key];
    if (!entry) return false;

    const url = `/audio/lessons/${entry.file}`;

    try {
      const audio = new Audio(url);
      audioRef.current = audio;

      return new Promise<boolean>((resolve) => {
        audio.onended = () => resolve(!abortRef.current);
        audio.onerror = () => resolve(false);
        if (abortRef.current) { resolve(false); return; }
        audio.play().catch(() => resolve(false));
      });
    } catch {
      return false;
    }
  }, [moduleSlug]);

  /** Fallback: speak via browser Web Speech API */
  const speakViaBrowser = useCallback((segments: string[]): Promise<boolean> => {
    if (abortRef.current || !("speechSynthesis" in window)) return Promise.resolve(false);

    const fullText = segments.join(" ");
    return new Promise<boolean>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(fullText);
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

  /**
   * Toggle narration starting from a section, auto-advancing through all sections.
   * Uses pre-generated static MP3 files first, falls back to browser TTS.
   */
  const toggleNarration = useCallback(
    async (startSection: number, allSections: string[][]) => {
      if (state.isPlaying) {
        stop();
        return;
      }

      stopInternal();
      abortRef.current = false;

      for (let secIdx = startSection; secIdx < allSections.length; secIdx++) {
        if (abortRef.current) break;

        setState({ isPlaying: true, isLoading: true, activeSection: secIdx });

        // Try pre-generated static audio first
        const ok = await playStaticAudio(secIdx);

        if (ok) {
          setState((s) => ({ ...s, isLoading: false }));
          continue; // Move to next section
        }

        // Fallback to browser TTS for this section
        if (!abortRef.current) {
          setState((s) => ({ ...s, isLoading: false }));
          const browserOk = await speakViaBrowser(allSections[secIdx]);
          if (!browserOk || abortRef.current) break;
        }
      }

      if (!abortRef.current) {
        setState({ isPlaying: false, isLoading: false, activeSection: null });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.isPlaying, playStaticAudio, speakViaBrowser]
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
