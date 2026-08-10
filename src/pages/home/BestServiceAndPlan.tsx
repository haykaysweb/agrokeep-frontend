import { motion, type Variants } from "framer-motion";

export default function BestServiceAndPlan() {
  const services = [
    {
      title: "Verified Storage Hubs",
      description: "Every facility audited for safety, hygiene, and capacity.",
      imageSrc:
        "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782769172/Frame_21_tnp1v2.svg",
      imageAlt: "Cassava root harvest being held",
    },
    {
      title: "Secure Payments",
      description: "Pay only when your booking is confirmed by the hub.",
      imageSrc:
        "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782769218/Frame_21_1_np6zjh.svg",
      imageAlt: "Counting cash or secure transaction",
    },
    {
      title: "Transparent Pricing",
      description: "Clear per-bag, per-crate, per-week rates. No surprises.",
      imageSrc:
        "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782769240/Frame_21_2_ywkvav.svg",
      imageAlt: "Calculator over financial charts",
    },
    {
      title: "Regional Coverage",
      description: "Hundreds of hubs across the six Southwest states.",
      imageSrc:
        "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782769273/Frame_21_3_ma8gsk.svg",
      imageAlt: "Aerial view of green landscape and community",
    },
  ];

  // Container variants for staggering children
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Staggers each card animation by 0.2 seconds
      },
    },
  };

  // Individual card variants for fade-up entrance
  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const, // Correct type assertion for bezier array
      },
    },
  };

  // Image hover zoom effect variants
  const imageHoverVariants: Variants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.4,
        ease: [0.42, 0, 0.58, 1] as const,
      },
    },
    initial: {
      scale: 1,
      transition: {
        duration: 0.4,
        ease: [0.42, 0, 0.58, 1] as const,
      },
    },
  };

  return (
    <>
      <section className="w-full max-w-7xl flex flex-col justify-between px-4 md:px-12 py-6 mx-auto mt-20 md:mt-0">
        <div className="flex items-center justify-center md:mb-5 md:mt-15">
          <h2 className="text-center text-3xl font-bold tracking-tight text-text-main sm:text-4xl md:text-5xl">
            Giving <span className="text-brand-primary">Best Services</span> &{" "}
            <span className="text-brand-primary">Best Plans</span>
          </h2>
        </div>
      </section>

      {/* content section for this page */}
      <main className="bg-brand-primary">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto px-4 md:px-12 py-15"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="flex flex-col overflow-hidden"
            >
              {/* Image Container with Framer Motion hover zoom */}
              <motion.div
                whileHover="hover"
                initial="initial"
                className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl cursor-pointer"
              >
                <motion.img
                  variants={imageHoverVariants}
                  src={service.imageSrc}
                  alt={service.imageAlt}
                  className="w-full h-full object-cover rounded-2xl"
                />
              </motion.div>

              {/* Text Content */}
              <div className="flex flex-col pt-4 text-white">
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </>
  );
}