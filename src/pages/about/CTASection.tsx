import { motion } from "framer-motion";
import { Link } from "react-router";

// Variants to stagger lines
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const lineVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CTASection() {
  return (
    <section className="py-18">
      <div className="max-w-7xl px-4 md:px-12 mx-auto grid md:grid-cols-2 gap-8">
        {/* FARMER CARD */}
        <motion.div className="bg-brand-primary p-10 rounded-3xl text-text-light flex flex-col items-center text-center overflow-hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p
              variants={lineVariants}
              className="flex items-center justify-center gap-2 mb-4 font-medium opacity-90"
            >
              <img src="/icon4.svg" alt="" className="w-5 h-5" /> For Farmers
            </motion.p>
            <motion.h2
              variants={lineVariants}
              className="text-4xl font-bold mb-6"
            >
              Optimize your harvest with AgroKeep
            </motion.h2>
            <motion.p
              variants={lineVariants}
              className="text-white/80 mb-8 max-w-sm mx-auto"
            >
              Protect your produce, reduce losses, and access trusted storage
              facilities that safeguard your harvest from farm to market.
            </motion.p>

            {/* EXACT BUTTON STYLE */}
            <motion.div
              variants={lineVariants}
              className="inline-block relative"
            >
              <div className="absolute top-1.5 left-1.5 w-full h-full bg-brand-secondary rounded-full" />
              <Link
                to="/storage"
                className="relative flex items-center bg-text-light text-brand-primary px-8 py-3 rounded-full font-bold hover:bg-stone-50 transition-transform hover:-translate-y-0.5"
              >
                Find a storage
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* PARTNER CARD */}
        <motion.div className="bg-surface-card p-10 rounded-3xl border border-border-light shadow-sm flex flex-col items-center text-center overflow-hidden">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.p
              variants={lineVariants}
              className="flex items-center justify-center gap-2 mb-4 font-medium text-text-subtle"
            >
              <img src="/house.svg" alt="" className="w-5 h-5" /> Hub Partner
              Program
            </motion.p>
            <motion.h2
              variants={lineVariants}
              className="text-4xl font-bold mb-6 text-text-main"
            >
              Own a warehouse or storage facility?
            </motion.h2>
            <motion.p
              variants={lineVariants}
              className="text-text-subtle mb-8 max-w-sm mx-auto"
            >
              Join AgroKeep's verified storage network and earn from your unused
              space. We handle discovery, bookings, and payments — you focus on
              safe storage.
            </motion.p>

            {/* EXACT BUTTON STYLE */}
            <motion.div
              variants={lineVariants}
              className="inline-block relative"
            >
              <div className="absolute top-1.5 left-1.5 w-full h-full bg-brand-secondary rounded-full" />
              <Link
                to="/partner/register"
                className="relative flex items-center bg-brand-primary text-white px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-transform hover:-translate-y-0.5"
              >
                Become a Hub Partner
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
