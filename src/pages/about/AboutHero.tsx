import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function AboutHero() {
  const navigate = useNavigate()
  return (
    <>
      {/* hero section for the contact us */}
      <section
        className="relative w-full h-[600px] md:h-[400px] flex items-center justify-center"
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
          className="relative z-10 text-center px-4 max-w-[938px] text-color-text-light"
        >
          <h2 className="text-4xl md:text-5xl text-text-light font-bold mb-4 font-sans">
            About AgroKeep
          </h2>
          <p className="text-lg md:text-xl font-light text-text-light/90 mb-8">
            AgroKeep exists to help farmers preserve what they work so hard to
            grow by connecting them with trusted, accessible storage facilities
            before post-harvest losses occur.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full px-4">
            {/* "Find Storage" Button */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative inline-block w-full sm:w-auto"
              onClick={() => navigate("/storage")}
            >
              <div className="absolute top-1  left-1 w-full h-full bg-brand-secondary rounded-full" />
              <button className="relative flex items-center justify-center gap-2 bg-brand-primary text-text-light px-6 sm:px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-colors w-full sm:w-auto cursor-pointer">
                Find Storage
                <span className="bg-brand-secondary rounded-full p-1">
                  <ArrowUpRight className="h-4 w-4 text-text-light" />
                </span>
              </button>
            </motion.div>

            {/* "Become a Hub Partner" Button */}
            <motion.div
              whileHover={{ y: -4 }}
              className="relative inline-block w-full sm:w-auto"
            >
              <div className="absolute top-1 left-1 w-full h-full bg-brand-secondary rounded-full" />
              <button className="relative bg-surface-card text-brand-primary px-6 sm:px-8 py-3 rounded-full font-medium hover:bg-stone-50 transition-colors w-full sm:w-auto cursor-pointer">
                Become a Hub Partner
              </button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </>
  );
}
