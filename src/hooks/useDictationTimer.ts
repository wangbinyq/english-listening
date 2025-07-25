import { useState, useEffect, useRef } from 'react';

interface DictationTimer {
  /** Total time spent on dictation in seconds */
  totalTime: number;
  /** Whether the timer is currently running */
  isRunning: boolean;
  /** Start the timer */
  start: () => void;
  /** Pause the timer */
  pause: () => void;
  /** Reset the timer */
  reset: () => void;
}

export const useDictationTimer = (): DictationTimer => {
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [wasRunning, setWasRunning] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef(0);
  const animationFrameRef = useRef<number>(0);

  // Update the timer every frame while running
  useEffect(() => {
    if (isRunning) {
      const updateTimer = () => {
        if (startTimeRef.current !== null) {
          const elapsed = (Date.now() - startTimeRef.current) / 1000;
          setTotalTime(accumulatedTimeRef.current + elapsed);
        }
        animationFrameRef.current = requestAnimationFrame(updateTimer);
      };

      animationFrameRef.current = requestAnimationFrame(updateTimer);

      return () => {
        cancelAnimationFrame(animationFrameRef.current);
      };
    }
  }, [isRunning]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Pause timer when page is hidden
        if (isRunning) {
          pause();
        }
      } else {
        // Resume timer when page becomes visible again
        // We need to restart the timer if it was running before the page was hidden
        if (wasRunning && !isRunning) {
          start();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, wasRunning]);

  const start = () => {
    // Only start if not already running
    if (!isRunning) {
      // If this is the first time starting, set the start time
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }
      setIsRunning(true);
      setWasRunning(true);
    }
  };

  const pause = () => {
    // Only pause if currently running
    if (isRunning) {
      // Add elapsed time to accumulated time
      if (startTimeRef.current !== null) {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        accumulatedTimeRef.current += elapsed;
        startTimeRef.current = null;
      }
      setIsRunning(false);
      // Don't change wasRunning here - we want to remember if it was running before hiding
    }
  };

  const reset = () => {
    // Cancel any ongoing animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Reset all state
    setTotalTime(0);
    setIsRunning(false);
    setWasRunning(false);
    startTimeRef.current = null;
    accumulatedTimeRef.current = 0;
  };

  return {
    totalTime,
    isRunning,
    start,
    pause,
    reset
  };
};