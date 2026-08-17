import { useEffect, useRef, useState } from 'react';

// Counts elapsed seconds since mount, using wall-clock time rather than an
// incrementing tick counter -- immune to setInterval throttling (e.g. mobile
// browsers slow it down heavily when the screen locks or the tab backgrounds),
// and self-corrects instantly when the tab regains focus.
export function useElapsedTimer(): number {
  const startRef = useRef<number>(Date.now());
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const tick = () => setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, []);

  return elapsed;
}

export interface CountdownTimer {
  remaining: number;
  active: boolean;
  /** Starts (or restarts) the countdown from `seconds`. */
  start: (seconds: number) => void;
  /** Stops the countdown and resets the displayed time to 0. */
  stop: () => void;
  /** Adds (or subtracts) time from the current countdown without resetting it. */
  addSeconds: (delta: number) => void;
  /** Pauses if running, resumes (re-anchored from the current remaining time) if paused. */
  toggleActive: () => void;
}

// Countdown timer against a fixed wall-clock deadline rather than a decrementing
// tick counter, for the same background-throttling reason as useElapsedTimer.
// `onComplete` is read via a ref internally so passing a new inline closure each
// render doesn't tear down and recreate the interval/visibilitychange listener.
export function useCountdownTimer(onComplete: () => void): CountdownTimer {
  const [remaining, setRemaining] = useState(0);
  const [active, setActive] = useState(false);
  const endTimeRef = useRef(0);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (!active) return;

    const tick = () => {
      const rem = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
      setRemaining(rem);
      if (rem === 0) {
        setActive(false);
        onCompleteRef.current();
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [active]);

  const start = (seconds: number) => {
    endTimeRef.current = Date.now() + seconds * 1000;
    setRemaining(seconds);
    setActive(true);
  };

  const stop = () => {
    setActive(false);
    setRemaining(0);
  };

  const addSeconds = (delta: number) => {
    endTimeRef.current += delta * 1000;
    setRemaining((prev) => Math.max(0, prev + delta));
  };

  const toggleActive = () => {
    setActive((prev) => {
      const next = !prev;
      if (next) {
        // Resuming from pause: re-anchor the deadline from whatever time was left.
        endTimeRef.current = Date.now() + remaining * 1000;
      }
      return next;
    });
  };

  return { remaining, active, start, stop, addSeconds, toggleActive };
}
