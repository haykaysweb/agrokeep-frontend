import { useEffect, useRef, useState } from "react";
import { useIsFetching } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

const SHOW_DELAY = 150; // ms to wait before showing, so instant requests never flash the bar
const MIN_VISIBLE = 450; // ms the bar stays up once shown, so it never blinks
const FADE_DELAY = 300; // ms the completed bar stays before fading out

export function TopLoader() {
  // Only count requests that have no cached data yet (a real loading state).
  // Silent background refreshes of cached data are ignored.
  const loadingCount = useIsFetching({
    predicate: (query) => query.state.data === undefined,
  });
  const isLoading = loadingCount > 0;

  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const shownAt = useRef(0);

  // 1. Show the bar only if loading lasts longer than SHOW_DELAY
  useEffect(() => {
    if (!isLoading) return;

    const timer = setTimeout(() => {
      shownAt.current = Date.now();
      setProgress((p) => (p > 0 && p < 100 ? p : 12));
      setVisible(true);
    }, SHOW_DELAY);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // 2. Creep forward while loading (slows down as it nears 90%)
  useEffect(() => {
    if (!visible || !isLoading) return;

    const interval = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.12 : p));
    }, 300);

    return () => clearInterval(interval);
  }, [visible, isLoading]);

  // 3. When loading ends: jump to 100%, then fade out
  useEffect(() => {
    if (isLoading || !visible) return;

    const remaining = Math.max(MIN_VISIBLE - (Date.now() - shownAt.current), 0);
    const completeTimer = setTimeout(() => setProgress(100), remaining);
    const hideTimer = setTimeout(
      () => setVisible(false),
      remaining + FADE_DELAY,
    );

    return () => {
      clearTimeout(completeTimer);
      clearTimeout(hideTimer);
    };
  }, [isLoading, visible]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px]"
    >
      <AnimatePresence onExitComplete={() => setProgress(0)}>
        {visible && (
          <motion.div
            className="relative h-full"
            initial={{ opacity: 0, width: "0%" }}
            animate={{ opacity: 1, width: `${progress}%` }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.2 },
              width: {
                duration: progress === 100 ? 0.25 : 0.5,
                ease: "easeOut",
              },
            }}
          >
            {/* Soft glow behind the bar */}
            <div className="absolute inset-x-0 -inset-y-px bg-brand-primary/50 blur-[5px]" />

            {/* Main bar */}
            <div className="relative h-full rounded-r-full bg-linear-to-r from-brand-primary/70 to-brand-primary" />

            {/* Glowing tip at the leading edge */}
            <div className="absolute top-1/2 right-0 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-brand-secondary blur-[3px]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
