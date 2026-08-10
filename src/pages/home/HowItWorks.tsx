import { motion, type Variants } from "framer-motion";

export default function HowItWorks() {
  // Staggered fade-up animation variants for text steps
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Delays each step by 0.2s
      },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  } as const satisfies Variants;

  // Image fade-in entrance animation
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  } as const satisfies Variants;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-12 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center justify-center">
      {/* Left Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex flex-col space-y-10"
      >
        <motion.div variants={stepVariants}>
          <span className="text-brand-primary font-semibold tracking-wider text-sm">
            How it Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main mt-2 tracking-tight leading-tight">
            From <span className="text-brand-primary">harvest to storage</span>{" "}
            in three steps.
          </h2>
        </motion.div>

        <div className="flex flex-col space-y-4">
          {/* Step 1 */}
          <motion.div
            variants={stepVariants}
            className="flex flex-col space-y-0"
          >
            <h3 className="text-base font-bold text-text-main uppercase tracking-wider">
              STEP ONE:
            </h3>
            <h4 className="text-md text-text-main">
              Search Storage Hubs
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              Filter by location, crop type, storage method, and price to find
              the right hub for your harvest.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            variants={stepVariants}
            className="flex flex-col space-y-0"
          >
            <h3 className="text-base font-bold text-text-main uppercase tracking-wider">
              STEP TWO:
            </h3>
            <h4 className="text-md  text-text-main">
              Book Available Space
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              Reserve your space in minutes with transparent pricing and secure,
              in-platform payment.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            variants={stepVariants}
            className="flex flex-col space-y-0"
          >
            <h3 className="text-base font-bold text-text-main uppercase tracking-wider">
              STEP THREE:
            </h3>
            <h4 className="text-md text-text-main">
              Store & Preserve Harvest
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed max-w-md">
              Deliver your produce, track inventory, and protect your margins
              from post-harvest loss.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Image Container */}
      <motion.div
        variants={imageVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative w-full h-full md:h-[500px] rounded-3xl overflow-hidden shadow-xl"
      >
        <img
          src="https://res.cloudinary.com/dw5bai7mk/image/upload/v1782770375/Frame_36_yiaufb.svg"
          alt="Hands holding a wooden bowl filled with fresh vegetables and herbs"
          className="w-full h-full object-cover"
        />
      </motion.div>
    </section>
  );
}
