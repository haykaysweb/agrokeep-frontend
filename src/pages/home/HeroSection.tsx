import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { PrimaryButton } from "@/components/ui/Buttons";

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
    <section id="hero" className="relative w-full overflow-visible">
      {/* Hero Background */}
      <div className="relative min-h-[calc(100svh-80px)] lg:min-h-[calc(100svh-80px)]">
        {/* Animated Background Slider */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${images[currentIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45" />
        {/* Hero Content */}
        <div className="relative z-10 mx-auto flex min-h-[calc(100svh-80px)] w-full max-w-7xl items-center px-4 sm:px-6 md:min-h-[calc(100svh-80px)] md:px-12">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-2xl"
          >
            <h1 className="max-w-2xl text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              A Journey Into
              <br />
              Optimal Harvest
              <br />
              Management
            </h1>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mt-7 flex flex-wrap gap-5 sm:mt-8"
            >
              {/* Explore Hubs */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative inline-block"
              >
                <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary" />

                <span className="relative z-10 flex h-10 items-center gap-3 rounded-full bg-brand-primary px-5 text-text-light sm:px-7">
                  <span className="text-sm font-medium sm:text-base">
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

              {/* Learn More */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="relative inline-block"
              >
                <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary" />

                <span className="relative z-10 flex h-10 items-center rounded-full bg-white px-6 font-medium text-brand-primary sm:px-8">
                  <span className="text-sm sm:text-base">Learn more</span>
                </span>
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Side Information Panel */}
          <motion.aside
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="absolute bottom-24 right-6 hidden w-[390px] max-w-[38%] rounded-xl border border-white/20 bg-black/20 px-6 py-5 shadow-2xl backdrop-blur-md xl:bottom-35 xl:right-12 xl:block"
          >
            <p className="text-center text-base font-light leading-relaxed text-white xl:text-lg">
              "Empowering farmers and agribusinesses with reliable storage
              infrastructure that preserves harvests, improves profitability,
              and strengthens food security."
            </p>
          </motion.aside>
        </div>
      </div>

      {/* Search Hub Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="relative z-20 mx-auto -mt-16 w-full max-w-7xl px-4 sm:-mt-10 sm:px-6 md:-mt-20 md:px-12"
      >
        <div className="rounded-[24px] bg-brand-primary p-4 shadow-2xl sm:rounded-[28px] md:p-6">
          {/* Instruction */}
          <div className="mb-4 flex items-start gap-3 text-white">
            <Search className="mt-0.5 h-5 w-5 shrink-0 text-white/70" />

            <p className="text-sm font-normal leading-relaxed md:text-base truncate">
              Search, book, and secure verified storage hubs for your
              agricultural produce — before harvest.
            </p>
          </div>

          {/* Search Inputs */}
          <div className="no-scrollbar flex w-full gap-4 overflow-x-auto pb-1 md:overflow-visible md:pb-0">
            {/* Location */}
            <div className="flex w-[240px] shrink-0 flex-col gap-1.5 md:w-auto md:flex-1">
              <label className="flex items-center gap-2 text-xs font-light text-white/70">
                <img src="/mapIcon.png" alt="" className="h-4 w-4 shrink-0" />
                Location
              </label>

              <input
                type="text"
                placeholder="Oyo, Osun"
                className="h-10 w-full rounded-full border border-white/20 bg-surface-card px-4 text-sm text-text-main outline-none transition-colors placeholder:text-text-muted focus:border-white"
              />
            </div>

            {/* Crop Type */}
            <div className="flex w-[240px] shrink-0 flex-col gap-1.5 md:w-auto md:flex-1">
              <label className="flex items-center gap-2 text-xs font-light text-white/70">
                <img
                  src="/flowerIcon.png"
                  alt=""
                  className="h-4 w-4 shrink-0"
                />
                Crop type
              </label>

              <input
                type="text"
                placeholder="Yam, Cassava, Tomato"
                className="h-10 w-full rounded-full border border-white/20 bg-surface-card px-4 text-sm text-text-main outline-none transition-colors placeholder:text-text-muted focus:border-white"
              />
            </div>

            {/* Find Hub */}
            <div className="flex shrink-0 items-end">
              <PrimaryButton text="Find a Hub" type="submit" />
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
