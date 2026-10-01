import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";

import { getVerifiedHubs } from "@/api/verifiedHubsApi";
import type { StorageHub } from "@/api/storageDetails";
import { formatCurrency } from "@/lib/constant";

const getFacilityPrice = (hub: StorageHub) => {
  const unit = hub.unitType?.toLowerCase() || "";

  if (unit.includes("crate")) {
    return hub.pricePerCratePerDay ?? 0;
  }

  return hub.pricePerBagPerDay ?? 0;
};

const getFacilityUnit = (hub: StorageHub) => {
  const unit = hub.unitType?.toLowerCase() || "";

  return unit.includes("crate") ? "crate" : "bag";
};

export default function VerifyHubs() {
  const {
    data: verifiedHubsData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["verified-hubs"],
    queryFn: getVerifiedHubs,
  });

  const hubs = verifiedHubsData?.data ?? [];

  // Fade-up entrance animation
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

  // Staggered card animation
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  if (isPending) {
    return (
      <section className="max-w-7xl mx-auto px-4 md:px-12 py-10">
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="h-3 w-20 rounded bg-background-subtle animate-pulse" />
            <div className="mt-2 h-7 w-64 rounded bg-background-subtle animate-pulse" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="overflow-hidden rounded-[15px] bg-surface-card border border-border-light shadow-sm"
            >
              <div className="h-56 animate-pulse bg-background-subtle" />

              <div className="space-y-3 p-5">
                <div className="h-5 w-3/4 rounded bg-background-subtle animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-background-subtle animate-pulse" />
                <div className="h-8 w-full rounded bg-background-subtle animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (isError || hubs.length === 0) {
    return null;
  }

  return (
    <section
      id="find-storage"
      className="w-full max-w-7xl mx-auto px-4 md:px-12 py-5 flex flex-col space-y-8 font-sans"
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
          <span className="flex gap-2 text-brand-primary font-bold tracking-wider text-sm items-center">
            <img src="/flowerIcon2.svg" alt="" className="w-4 h-4" />
            Verified Hubs
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-text-main tracking-tight">
            Verified Storage Near Your Farm
          </h2>
        </motion.div>

        <Link
          to="/storage"
          className="hidden sm:flex text-brand-primary font-semibold items-center space-x-2 hover:opacity-80 transition"
        >
          <span>See all hubs</span>
          <img src="/Arrow Right.svg" alt="" />
        </Link>
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
            key={hub._id}
            variants={fadeInUpVariants}
            className="h-full min-w-0"
          >
            <article className="mx-auto flex h-full min-w-0 max-w-2xl flex-col overflow-hidden rounded-[15px] border border-border-light bg-surface-card shadow-sm sm:max-w-none">
              {/* Image */}
              <div className="relative h-48 w-full shrink-0 overflow-hidden sm:h-52 md:h-56 lg:h-64 xl:h-70">
                <img
                  src={hub.images?.[0] || "/placeholder-hub.jpg"}
                  alt={hub.name}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.02]"
                  loading="lazy"
                />

                {/* Verified Badge */}
                {hub.isVerified && (
                  <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-[9px] font-bold text-text-main shadow-sm backdrop-blur-sm sm:px-3 sm:py-1.5 sm:text-xs">
                    <img
                      src="/verifiedIcon.svg"
                      alt=""
                      className="h-3 w-3 shrink-0 sm:h-4 sm:w-4"
                    />

                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
                {/* Facility Information */}
                <div className="min-w-0">
                  {/* Name */}
                  <h3 className="line-clamp-2 text-base font-bold leading-snug text-text-main sm:text-lg">
                    {hub.name}
                  </h3>

                  {/* Location + Capacity */}
                  <div className="mt-2 flex min-w-0 flex-wrap gap-x-4 gap-y-1.5 text-[10px] font-medium text-text-subtle sm:gap-x-5 sm:text-xs">
                    {/* Location */}
                    <span className="flex min-w-0 max-w-full items-center gap-1">
                      <img
                        src="/mapIcon2.svg"
                        alt=""
                        className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                      />

                      <span className="truncate">
                        {hub.lga}, {hub.state}
                      </span>
                    </span>

                    {/* Capacity */}
                    <span className="flex min-w-0 max-w-full items-center gap-1">
                      <img
                        src="/cratesIcon.svg"
                        alt=""
                        className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
                      />

                      <span className="truncate">
                        {hub.availableCapacity?.toLocaleString()}{" "}
                        {getFacilityUnit(hub)}
                        {hub.availableCapacity === 1 ? "" : "s"} available
                      </span>
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div
                  className="
            mt-5 flex items-center justify-between gap-3 border-t border-border-light/60 pt-4

            sm:flex-wrap sm:gap-y-4

            lg:flex-nowrap lg:gap-y-0
          "
                >
                  {/* Price */}
                  <div className="min-w-0 shrink-0">
                    <span className="mb-1 block text-[10px] font-medium leading-none text-text-muted">
                      From
                    </span>

                    <div className="whitespace-nowrap text-sm font-bold leading-none text-text-main sm:text-base">
                      {formatCurrency(getFacilityPrice(hub))}

                      <span className="text-[9px] font-normal text-text-subtle sm:text-xs">
                        /{getFacilityUnit(hub)}/day
                      </span>
                    </div>
                  </div>

                  {/* View Details */}
                  <div className="relative shrink-0 sm:order-2 sm:w-full lg:order-none lg:w-auto">
                    <Link
                      to={`/storage/details/${hub.slug}`}
                      className="group relative block w-full lg:w-auto"
                    >
                      {/* Orange Offset */}
                      <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] rounded-full bg-brand-secondary transition-transform group-hover:translate-x-[4px] group-hover:translate-y-[4px]" />

                      {/* Button */}
                      <span
                        className="
                  relative z-10 flex h-9 w-full items-center justify-center gap-2
                  rounded-full bg-brand-primary px-4 text-text-light
                  transition-transform group-hover:-translate-y-[1px]

                  sm:h-10

                  lg:w-auto lg:px-4
                "
                      >
                        <span className="text-xs font-medium sm:text-sm lg:text-sm">
                          View Details
                        </span>

                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-secondary sm:h-6 sm:w-6">
                          <ArrowUpRight
                            className="h-3 w-3 text-text-light sm:h-3.5 sm:w-3.5"
                            strokeWidth={2.5}
                          />
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </motion.div>
        ))}
      </motion.div>

      {/* Mobile view all link */}
      <div className="sm:hidden flex justify-center pt-4">
        <Link
          to="/storage"
          className="text-brand-primary font-semibold flex items-center space-x-2"
        >
          <span>See all hubs</span>
          <img src="/Arrow Right.svg" alt="" />
        </Link>
      </div>
    </section>
  );
}
