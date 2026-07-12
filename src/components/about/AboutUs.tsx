import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function AboutUs() {
  return (
    <>
      {/* hero section for the contact us */}
      <section
        className="relative w-full h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://res.cloudinary.com/dw5bai7mk/image/upload/v1783426371/photo-1625246333195-78d9c38ad449_arunqi.avif')`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Semi-transparent overlay */}
        <div className="absolute inset-0 bg-overlay-dark/70" />

        {/* Content Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-2xl text-text-light"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-sans">
            About AgroKeep
          </h2>
          <p className="text-lg md:text-xl font-light text-text-light/90 mb-8">
            AgroKeep exists to help farmers preserve what they work so hard to
            grow by connecting them with trusted, accessible storage
            facilities before post-harvest losses occur.
          </p>

          <div className="flex gap-4 justify-center">
            {/* 1. "Find Storage" Button */}
            <motion.div 
              whileHover={{ y: -4 }} 
              className="relative inline-block"
            >
              <div className="absolute top-1.5 left-1.5 w-full h-full bg-amber-500 rounded-full" />
              <button className="relative flex items-center gap-2 bg-[#1B4D3E] text-white px-8 py-3 rounded-full font-medium hover:bg-[#153d31] transition-colors">
                Find Storage
                <span className="bg-amber-500 rounded-full p-1">
                  <ArrowUpRight className="h-4 w-4 text-white" />
                </span>
              </button>
            </motion.div>

            {/* 2. "Become a Hub Partner" Button */}
            <motion.div 
              whileHover={{ y: -4 }} 
              className="relative inline-block"
            >
              <div className="absolute top-1.5 left-1.5 w-full h-full bg-amber-500 rounded-full" />
              <button className="relative bg-white text-[#1B4D3E] px-8 py-3 rounded-full font-medium hover:bg-stone-50 transition-colors">
                Become a Hub Partner
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Content section in the about page */}
      <main className="w-full max-w-7xl mx-auto px-4 md:px-12">
        {/* content goes in here */}
      </main>
    </>
  );
}