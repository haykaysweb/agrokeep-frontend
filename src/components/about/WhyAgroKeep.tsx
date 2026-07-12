import { motion } from "framer-motion";

const features = [
  {
    title: "Verified Storage Network",
    description:
      "Every storage facility undergoes a rigorous verification process to ensure quality, safety, and reliability for your produce.",
  },
  {
    title: "Fast & Transparent Booking",
    description:
      "Search, compare pricing, check real-time availability, and reserve storage within minutes, no phone tag, no hidden fees.",
  },
  {
    title: "Built for Nigerian Agriculture",
    description:
      "Designed around local crops, regional markets, and the realities of farming in Nigeria — with both web and USSD access.",
  },
];

// Container variant to stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function WhyAgroKeepSection() {
  return (
    <section className="py-18 max-w-7xl mx-auto px-4 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* LEFT - Text Content with Staggered Animation */}
        <motion.div
          className="w-full lg:w-1/2"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.p
            variants={itemVariants}
            className="flex items-center gap-2 text-brand-primary font-medium mb-4"
          >
            <img src="/flowerIcon3.svg" alt="" className="w-5 h-5" />
            Why AgroKeep
          </motion.p>
          <motion.h2
            variants={itemVariants}
            className="text-5xl font-bold text-text-main mb-12"
          >
            Why Thousands Will <span className="text-brand-primary">Trust</span>{" "}
            AgroKeep
          </motion.h2>

          <div className="space-y-10">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="flex gap-4"
              >
                <div className="mt-1">
                  <img src="/flowerIcon3.svg" alt="" className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-text-main mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-subtle leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* RIGHT - Image with a LONGER delay */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
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