import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "../ui/Buttons";

const images = [
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?q=80&w=1920&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=1920&auto=format&fit=crop",
];

export default function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="home"
      className="relative w-full h-[90vh] md:min-h-screen overflow-visible "
    >
      {/* Animated Background Slider */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      </AnimatePresence>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Hero Content */}
      <div className="relative z-10 mx-auto flex h-[85vh] md:min-h-screen w-full max-w-7xl flex-col justify-between px-4 md:px-12">
        <div className="flex flex-1 items-center">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              A Journey Into
              <br />
              Optimal Harvest
              <br />
              Management
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-8 flex flex-wrap gap-6"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative inline-block"
              >
                {/* Orange Offset */}
                <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>

                {/* Button */}
                <span className="relative z-10 flex h-10 items-center gap-3 rounded-full bg-brand-primary px-8 py-3 text-text-light">
                  <span className="text-sm font-medium md:text-base">
                    Explore Hubs
                  </span>

                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
                    <ArrowUpRight
                      className="h-4 w-4 text-text-light"
                      strokeWidth={2.5}
                    />
                  </span>
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative inline-block"
              >
                {/* Orange Offset */}
                <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>

                {/* Button */}
                <span className="relative z-10 flex h-10 items-center rounded-full bg-white px-8 py-3 text-brand-primary font-medium text-sm md:text-base">
                  Learn more
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Side Info Panel */}
          <motion.aside
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute right-20 bottom-30 hidden max-w-md rounded-xl border border-white/20 bg-white/10 py-4 px-6 shadow-2xl backdrop-blur-md lg:block"
          >
            <p className="text-center font-light leading-relaxed text-white md:text-lg">
              "Empowering farmers and agribusinesses with reliable storage
              infrastructure that preserves harvests, improves profitability,
              and strengthens food security."
            </p>
          </motion.aside>
        </div>
      </div>

      {/* Overlapping Search Hub Section with Framer Motion entry animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="hidden md:block absolute -bottom-17 left-0 right-0 z-20 mx-auto w-full max-w-7xl px-4 md:px-12"
      >
        <div className="rounded-[32px] bg-brand-primary p-4 shadow-2xl md:p-6">
          {/* Top Instruction Row */}
          <div className="mb-4 flex items-center gap-3 text-white">
            <Search className="h-5 w-5 shrink-0 text-white/70" />
            <p className="text-sm font-normal md:text-base">
              Search, book, and secure verified storage hubs for your
              agricultural produce — before harvest.
            </p>
          </div>

          {/* Inputs & Button Row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            {/* Location Input Group */}
            <div className="flex flex-1 flex-col gap-1.5 md:max-w-xs">
              <label className="flex items-center gap-2 text-xs font-light text-white/70">
                <img src="/mapIcon.png" alt="" />
                Location
              </label>
              <input
                type="text"
                placeholder="Oyo, Osun"
                className="h-9 w-full rounded-full border border-white/20 bg-surface-card px-4 text-sm text-surface-alt outline-none focus:border-white"
              />
            </div>

            {/* Crop Type Input Group */}
            <div className="flex flex-1 flex-col gap-1.5 md:max-w-sm">
              <label className="flex items-center gap-2 text-xs font-light text-white/70">
                <img src="/flowerIcon.png" alt="" />
                Crop type
              </label>
              <input
                type="text"
                placeholder="Yam, Cassava, Tomato"
                className="h-9 w-full rounded-full border border-white/20 bg-surface-card px-4 text-sm text-surface-alt outline-none focus:border-white"
              />
            </div>

            {/* Find a Hub Button */}
            <PrimaryButton text="Find a Hub" type="submit" />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
