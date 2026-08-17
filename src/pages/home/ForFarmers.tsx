import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router";

export default function ForFarmers() {
  const navigate = useNavigate();
  const benefits = [
    "Reduce post-harvest losses by up to 60%",
    "Transparent per-bag, per-crate weekly pricing",
    "Only verified, audited storage facilities",
    "Book in minutes pay securely in-platform",
    "Access storage services anytime with our dedicated USSD code, even in low-connectivity areas",
  ];

  const stats = [
    { label: "Farmers", value: "500+" },
    { label: "Hub Partners", value: "30+" },
    { label: "verified Hubs", value: "120+" },
    { label: "States Covered", value: "6" },
  ];

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" as const },
    },
  };

  return (
    <section className="w-full ">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto px-4 md:px-12 py-10"
      >
        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-16">
          {/* Left Side */}
          <motion.div variants={itemVariants} className="w-full lg:w-1/2">
            <img
              src="https://res.cloudinary.com/dw5bai7mk/image/upload/v1782934443/Frame_73_o9lzlu.svg"
              alt="Fresh farm produce"
              className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl"
            />
          </motion.div>

          {/* Right Side content */}
          <div className="w-full lg:w-1/2 flex flex-col space-y-8">
            <motion.div
              variants={itemVariants}
              className="flex flex-col space-y-4"
            >
              <span className="flex items-center gap-2 text-brand-primary font-bold text-sm tracking-wider">
                <img src="/flowerIcon2.svg" alt="" className="w-4 h-4" />
                For Farmers
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-text-main leading-tight tracking-tight">
                <span className="text-brand-primary">Protect</span> every
                <span className="text-brand-primary"> harvest</span>. Sell on
                your terms.
              </h2>
            </motion.div>

            {/* Benefits List */}
            <motion.ul
              variants={containerVariants}
              className="flex flex-col space-y-4"
            >
              {benefits.map((benefit, index) => (
                <motion.li
                  key={index}
                  variants={itemVariants}
                  className="flex items-start gap-3 text-text-subtle font-medium"
                >
                  <img
                    src="/flowerIcon3.svg"
                    alt=""
                    className="w-5 h-5 mt-0.5 flex-shrink-0"
                  />
                  <span>{benefit}</span>
                </motion.li>
              ))}
            </motion.ul>

            {/* Call to Action */}
            <motion.div
              variants={itemVariants}
              className="relative inline-block w-fit"
            >
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative inline-block cursor-pointer"
                onClick={() => navigate("/storage")}
              >
                <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>
                <span className="relative z-10 flex items-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-text-light">
                  <span className="text-sm font-medium md:text-base">
                    Find Storage
                  </span>
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
                    <ArrowUpRight
                      className="h-3.5 w-3.5 text-text-light"
                      strokeWidth={2.5}
                    />
                  </span>
                </span>
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* Stats Section Integrated at the bottom */}
        <div className="grid grid-cols-2 md:grid-cols-4  gap-8 mt-12 ">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="flex flex-col justify-between text-center space-y-1"
            >
              <h3 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight">
                {stat.value}
              </h3>
              <p className="text-base text-text-subtle font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
