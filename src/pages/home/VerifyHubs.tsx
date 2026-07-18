import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";

export default function VerifyHubs() {
  const hubs = [
    {
      id: 1,
      title: "Ibadan Central Hermetic Hub",
      location: "Ibadan, Oyo",
      capacity: "1,200 bags available",
      price: "N450",
      unit: "/bag/week",
      imageSrc:
        "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782775935/Frame_47_vdonh0.svg",
      imageAlt: "Large modern metal grain storage silos",
      verified: true,
    },
    {
      id: 2,
      title: "Osogbo Yam Brick Chamber",
      location: "Osogbo, Osun",
      capacity: "640 crates available",
      price: "N320",
      unit: "/crate/week",
      imageSrc:
        "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782769218/Frame_21_1_np6zjh.svg",
      imageAlt: "Traditional brick storage chamber filled with yams in crates",
      verified: true,
    },
    {
      id: 3,
      title: "Abeokuta Cold Storage",
      location: "Abeokuta, Ogun",
      capacity: "320 crates available",
      price: "N780",
      unit: "/crate/week",
      imageSrc:
        "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782769240/Frame_21_2_ywkvav.svg",
      imageAlt: "Cold storage facility filled with crated tomatoes",
      verified: true,
    },
    // {
    //   id: 4,
    //   title: "Iseyin Grain Reserve",
    //   location: "Iseyin, Oyo",
    //   capacity: "1,290 bags available",
    //   price: "N410",
    //   unit: "/bag/week",
    //   imageSrc:
    //     "https://res.cloudinary.com/dw5bai7mk/image/upload/v1782769273/Frame_21_3_ma8gsk.svg",
    //   imageAlt: "Grain reserve storage facility",
    //   verified: true,
    // },
  ];

  // Fade-up entrance animation variants
  const fadeInUpVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  // Staggered container variants to animate boxes gracefully
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <section
      id="find-storage"
      className="w-full max-w-7xl mx-auto px-4 md:px-12 py-18 flex flex-col space-y-8 font-sans"
    >
      {/* Header */}
      <div className="flex justify-between items-end">
        <motion.div
          variants={fadeInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="flex flex-col space-y-1"
        >
          <span className="flex gap-2 text-brand-primary font-bold tracking-wider  text-sm items-center">
            <img src="/flowerIcon2.svg" alt="" className="w-4 h-4" />
            Verified Hubs
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight">
            Verified Storage Near Your Farm
          </h2>
        </motion.div>
        <a
          href="/hubs"
          className="hidden sm:flex text-brand-primary font-semibold items-center space-x-2 hover:opacity-80 transition"
        >
          <span>Sell all hubs</span>
          <img src="/Arrow Right.svg" alt="" />
        </a>
      </div>

      {/* 4 Columns Grid on desktop with Staggered Entrance */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {hubs.map((hub) => (
          <motion.div
            key={hub.id}
            variants={fadeInUpVariants}
            className="h-full"
          >
            <div className="flex flex-col bg-surface-card rounded-[15px] overflow-hidden border border-border-light shadow-sm max-w-2xl mx-auto sm:max-w-none h-full">
              {/* Image Container - flush to the card top */}
              <div className="relative w-full h-56 sm:h-56 md:h-70 overflow-hidden flex-shrink-0">
                <img
                  src={hub.imageSrc}
                  alt={hub.imageAlt}
                  className="w-full h-full object-cover"
                />
                {hub.verified && (
                  <div className="absolute top-4 left-3 bg-white/90 backdrop-blur-sm text-text-main text-xs font-bold px-3 py-1.5 rounded-full flex items-center space-x-1 shadow-sm">
                    <img src="/verifiedIcon.svg" alt="" className="w-4 h-4" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
                <div className="flex flex-col space-y-2">
                  <h3 className="text-lg font-bold text-text-main line-clamp-1 leading-snug">
                    {hub.title}
                  </h3>
                  <div className="flex  gap-5 text-text-subtle text-xs font-medium">
                    <span className="flex items-center space-x-1">
                      <img
                        src="/mapIcon2.svg"
                        alt=""
                        className="w-4 h-4 flex-shrink-0"
                      />
                      <span className="truncate">{hub.location}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <img
                        src="/cratesIcon.svg"
                        alt=""
                        className="w-4 h-4 flex-shrink-0"
                      />
                      <span className="truncate">{hub.capacity}</span>
                    </span>
                  </div>
                </div>

                {/* Footer  */}
                <div className="flex justify-between items-center pt-4 gap-x-2 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-text-muted font-medium leading-none mb-0.5">
                      From
                    </span>
                    <div className="text-base font-bold text-text-main whitespace-nowrap leading-none">
                      {hub.price}
                      <span className="text-xs font-normal text-text-subtle">
                        {hub.unit}
                      </span>
                    </div>
                  </div>
                  <div className="relative inline-block">
                    <motion.a
                      href="#get-started"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="relative inline-block"
                    >
                      {/* Orange Offset */}
                      <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>

                      {/* Button */}
                      <span className="relative z-10 flex items-center gap-2 rounded-full bg-brand-primary px-4 py-1 text-text-light">
                        <span className="text-sm font-medium md:text-base">
                          View Details
                        </span>

                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
                          <ArrowUpRight
                            className="h-3.5 w-3.5 text-text-light"
                            strokeWidth={2.5}
                          />
                        </span>
                      </span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile view all link */}
      <div className="sm:hidden flex justify-center pt-4">
        <Link
          to="/storage"
          className="text-brand-primary font-semibold flex items-center space-x-2"
        >
          <span>Sell all hubs</span>
          <img src="/Arrow Right.svg" alt="" />
        </Link>
      </div>
    </section>
  );
}
