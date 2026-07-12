import { useSpring, useInView } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ value, label }: { value: number; label: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Hook to check if element is in view
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const springValue = useSpring(0, { duration: 3000, bounce: 0 }); // Increased duration to 3s

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  useEffect(() => {
    springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return (
    <div ref={containerRef} className="flex flex-col items-center">
      <h3 className="text-5xl md:text-6xl font-bold text-stone-900 mb-2">
        <span ref={ref} />+
      </h3>
      <p className="text-stone-600 font-medium text-lg">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="bg-[#FAF7F0] py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-12">
        <Counter value={500} label="Registered Farmers" />
        <Counter value={30} label="Hub Partners" />
        <Counter value={120} label="Verified Hubs" />
        <Counter value={6} label="States Covered" />
      </div>
    </section>
  );
}
