import { useIsFetching } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";

export function TopLoader() {
  const isFetching = useIsFetching();
  const isLoading = isFetching > 0;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] pointer-events-none">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="w-full h-full relative overflow-hidden"
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0, transition: { duration: 0.3 } }}
          >
            {/* Ambient edge-to-edge optical flare line */}
            <div className="absolute inset-0 bg-brand-primary/20" />

            {/* Multi-node energetic particle streak array */}
            <motion.div
              className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-brand-primary to-white shadow-[0_0_18px_4px_rgba(16,185,129,0.8)]"
              initial={{ x: "-100%", scaleX: 0.4 }}
              animate={{
                x: ["-100%", "350%"],
                scaleX: [0.4, 1.4, 0.4],
              }}
              transition={{
                duration: 1.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Counter-phase micro pulse tracer */}
            <motion.div
              className="absolute inset-y-0 w-1/4 bg-brand-primary/60 blur-[1px]"
              initial={{ x: "400%", scaleX: 0.8 }}
              animate={{ x: ["400%", "-150%"] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
