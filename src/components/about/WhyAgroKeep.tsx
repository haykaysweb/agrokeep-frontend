import { motion } from "framer-motion";
import { ShieldCheck, Zap, Wheat } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Storage Network",
    description: "Every storage facility undergoes a rigorous verification process to ensure quality, safety, and reliability for your produce."
  },
  {
    icon: Zap,
    title: "Fast & Transparent Booking",
    description: "Search, compare pricing, check real-time availability, and reserve storage within minutes, no phone tag, no hidden fees."
  },
  {
    icon: Wheat,
    title: "Built for Nigerian Agriculture",
    description: "Designed around local crops, regional markets, and the realities of farming in Nigeria — with both web and USSD access."
  }
];

// 💡 Container variant to stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3, // Delays each child by 0.3s
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function WhyAgroKeepSection() {
  return (
    <section className="bg-[#FAF7F0] py-20 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        
        {/* LEFT: Text Content with Staggered Animation */}
        <motion.div 
          className="w-full lg:w-1/2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p variants={itemVariants} className="flex items-center gap-2 text-[#1B4D3E] font-medium mb-4">
            🌱 Why AgroKeep
          </motion.p>
          <motion.h2 variants={itemVariants} className="text-5xl font-bold text-stone-900 mb-12">
            Why Thousands Will <span className="text-[#1B4D3E]">Trust</span> AgroKeep
          </motion.h2>

          <div className="space-y-10">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants} className="flex gap-4">
                <div className="mt-1">
                  <feature.icon className="h-7 w-7 text-[#1B4D3E]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-2">{feature.title}</h3>
                  <p className="text-stone-600 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT: Image with a LONGER delay */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }} // 💡 Image waits until text is done
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <img 
            src="https://res.cloudinary.com/dxgzbqdpb/image/upload/v1783699833/Frame_36_b0gyxb.svg" 
            alt="Farmer working" 
            className="rounded-3xl shadow-2xl w-full h-[550px] object-cover"
          />
        </motion.div>

      </div>
    </section>
  );
}