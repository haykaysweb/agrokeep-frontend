import { MapPin, ShoppingBag, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface Hub {
  _id?: string;
  name: string;
  location?: string;
  address?: string;
  capacity?: string | number;
  availableCapacity?: string | number;
  unitType?: string;
  unit?: string;
  image?: string;
  images?: string[];
  pricePerBagPerDay?: number;
  pricePerCratePerDay?: number;
  priceWeeklyFlat?: number;
  priceBulk100Units?: number;
  [key: string]: any;
}

export function HubCard({ hub }: { hub: Hub }) {
  // Normalize fields that differ between raw API shape and mapped shape
  const unit = hub.unitType || hub.unit || "units";
  const location = hub.location || hub.address || "";
  const capacity = hub.capacity ?? hub.availableCapacity ?? "";
  const image = hub.image || hub.images?.[0] || "";

  // Dynamically select price based on the available unit type or property
  const rawPrice =
    unit.toLowerCase().includes("crate")
      ? hub.pricePerCratePerDay || hub.pricePerBagPerDay
      : hub.pricePerBagPerDay || hub.pricePerCratePerDay;

  const displayPrice =
    rawPrice || hub.priceWeeklyFlat || hub.priceBulk100Units || 0;

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-4 rounded-3xl border border-stone-100 shadow-sm overflow-hidden flex flex-col justify-between"
    >
      {/* Image with Verified Badge */}
      <div className="relative mb-4">
        <img
          src={image}
          alt={hub.name}
          className="w-full h-56 object-cover rounded-2xl bg-stone-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/image 1.svg";
          }}
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-stone-700 shadow-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Verified
        </div>
      </div>

      {/* Content */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-stone-900 mb-2 line-clamp-1">
          {hub.name}
        </h3>
        <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4 shrink-0" />{" "}
            <span className="line-clamp-1">{location}</span>
          </div>
          <div className="flex items-center gap-1">
            <ShoppingBag className="h-4 w-4 shrink-0" /> {capacity}{" "}
            available
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-2 border-t border-stone-50">
        <div>
          <p className="text-xs text-stone-400">From</p>
          <p className="text-lg font-bold text-stone-900">
            ₦{displayPrice}
            <span className="text-sm font-normal text-stone-500">
              /{unit}
            </span>
          </p>
        </div>

        <div className="relative shrink-0 snap-start md:w-auto mt-0">
          <div className="absolute top-1 left-1 w-full h-full bg-amber-500 rounded-full " />
          <button className="relative w-full md:w-auto bg-[#1B4D3E] text-white px-5 py-2.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#153d31] transition-transform hover:-translate-y-0.5 shadow-md md:shadow-none text-sm whitespace-nowrap">
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
}