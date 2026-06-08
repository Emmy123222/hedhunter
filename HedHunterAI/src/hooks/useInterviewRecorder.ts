"use client";
import { useState, useRef, useCallback } from "react";
import type { RecordingState } from "@/types/interview";

export function useInterviewRecorder() {
  const [state, setState] = useState<RecordingState>({ isRecording: false, isPaused: false, duration: 0, audioBlob: null, audioUrl: null, error: null });
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const url  = URL.createObjectURL(blob);
        setState(s => ({ ...s, isRecording: false, audioBlob: blob, audioUrl: url }));
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start(250);
      mediaRef.current = recorder;
      timerRef.current = setInterval(() => setState(s => ({ ...s, duration: s.duration + 1 })), 1000);
      setState(s => ({ ...s, isRecording: true, error: null }));
    } catch (e: any) {
      setState(s => ({ ...s, error: e.message }));
    }
  }, []);

  const stop = useCallback(() => {
    mediaRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    stop();
    setState({ isRecording: false, isPaused: false, duration: 0, audioBlob: null, audioUrl: null, error: null });
  }, [stop]);

  return { ...state, start, stop, reset };
}
