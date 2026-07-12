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
    <section className="bg-[#FAF7F0] py-20 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        
        {/* FARMER CARD */}
        <motion.div 
          className="bg-[#1B4D3E] p-10 rounded-3xl text-white flex flex-col items-center text-center overflow-hidden"
        >
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={lineVariants} className="flex items-center justify-center gap-2 mb-4 font-medium opacity-90">🌱 For Farmers</motion.p>
            <motion.h2 variants={lineVariants} className="text-4xl font-bold mb-6">Optimize your harvest with AgroKeep</motion.h2>
            <motion.p variants={lineVariants} className="text-emerald-100 mb-8 max-w-sm mx-auto">Protect your produce, reduce losses, and access trusted storage facilities that safeguard your harvest from farm to market.</motion.p>
            
            {/* EXACT BUTTON STYLE */}
            <motion.div variants={lineVariants} className="inline-block relative">
              <div className="absolute top-1.5 left-1.5 w-full h-full bg-amber-500 rounded-full" />
              <Link to="/find-storage" className="relative flex items-center bg-white text-[#1B4D3E] px-8 py-3 rounded-full font-bold hover:bg-emerald-50 transition-transform hover:-translate-y-0.5">
                Find a storage
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* PARTNER CARD */}
        <motion.div 
          className="bg-white p-10 rounded-3xl border border-stone-100 shadow-sm flex flex-col items-center text-center overflow-hidden"
        >
          <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.p variants={lineVariants} className="flex items-center justify-center gap-2 mb-4 font-medium text-stone-500 ">🏠 Hub Partner Program</motion.p>
            <motion.h2 variants={lineVariants} className="text-4xl font-bold mb-6 text-stone-900">Own a warehouse or storage facility?</motion.h2>
            <motion.p variants={lineVariants} className="text-stone-600 mb-8 max-w-sm mx-auto">Join AgroKeep's verified storage network and earn from your unused space. We handle discovery, bookings, and payments — you focus on safe storage.</motion.p>
            
            {/* EXACT BUTTON STYLE */}
            <motion.div variants={lineVariants} className="inline-block relative">
              <div className="absolute top-1.5 left-1.5 w-full h-full bg-amber-500 rounded-full" />
              <Link to="/partner/register" className="relative flex items-center bg-[#1B4D3E] text-white px-8 py-3 rounded-full font-bold hover:bg-[#153d31] transition-transform hover:-translate-y-0.5">
                Become a Hub Partner
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}