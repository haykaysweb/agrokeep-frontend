import { MapPin, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";

interface Hub {
  _id?: string;
  name: string;

  location?: string;
  address?: string;
  lga?: string;
  state?: string;

  capacity?: string | number;
  availableCapacity?: string | number;

  unitType?: string;
  unit?: string;

  image?: string;
  images?: string[];

  isVerified?: boolean;

  pricePerBagPerDay?: number;
  pricePerCratePerDay?: number;
  priceWeeklyFlat?: number;
  priceBulk100Units?: number;

  [key: string]: any;
}

export function HubCard({ hub }: { hub: Hub }) {
  const navigate = useNavigate();
  const unit = hub.unitType || hub.unit || "units";

  const location =
    hub.location ||
    hub.address ||
    [hub.lga, hub.state].filter(Boolean).join(", ");

  const capacity = hub.capacity ?? hub.availableCapacity ?? "";

  const image = hub.image || hub.images?.[0] || "/placeholder-hub.jpg";

  // Dynamically select the appropriate daily price
  // based on the storage unit type.
  const rawPrice = unit.toLowerCase().includes("crate")
    ? hub.pricePerCratePerDay || hub.pricePerBagPerDay
    : hub.pricePerBagPerDay || hub.pricePerCratePerDay;

  const displayPrice =
    rawPrice || hub.priceWeeklyFlat || hub.priceBulk100Units || 0;

  return (
    <article className="h-full min-w-0 overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm flex flex-col transition-transform duration-300 hover:-translate-y-1">
      <div className="relative w-full h-44 sm:h-48 lg:h-52 shrink-0 overflow-hidden">
        <img
          src={image}
          alt={hub.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.02]"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;

            if (target.src.includes("/image 1.svg")) return;

            target.src = "/image 1.svg";
          }}
        />

        {/* Verified Badge */}
        {hub.isVerified && (
          <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] sm:text-[10px] font-medium text-stone-700 shadow-sm">
            <CheckCircle2 className="h-3 w-3 text-emerald-600" />

            <span>Verified</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-4">
        {/* Facility Information */}
        <div className="min-w-0">
          {/* Name */}
          <h3 className="text-sm sm:text-base font-bold text-stone-900 mb-1 line-clamp-2">
            {hub.name}
          </h3>

          {/* Location + Capacity */}
          <div className="flex  items-center gap-x-3 gap-y-1.5 text-[10px] sm:text-xs text-stone-500">
            {/* Location */}
            {location && (
              <div className="flex items-center gap-1 min-w-0 max-w-full">
                <MapPin className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />

                <span className="truncate">{location}</span>
              </div>
            )}

            {/* Capacity */}
            {capacity !== "" && (
              <div className="flex items-center gap-1 shrink-0">
                <ShoppingBag className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />

                <span>
                  {typeof capacity === "number"
                    ? capacity.toLocaleString()
                    : capacity}{" "}
                  available
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-end justify-between gap-2 border-t border-stone-100 pt-3">
          {/* Price */}
          <div className="min-w-0 shrink-0">
            <p className="text-[9px] sm:text-[10px] text-stone-400">From</p>

            <p className="text-sm sm:text-lg font-bold text-stone-900 whitespace-nowrap">
              ₦{displayPrice.toLocaleString()}
              <span className="text-[9px] sm:text-[10px] font-normal text-stone-500">
                /{unit}/day
              </span>
            </p>
          </div>

          {/* Book Now */}
          <div className="relative shrink-0" onClick={() => navigate(`/storage/details/${hub.slug}`)}>
            {/* Amber offset */}
            <div className="absolute top-1 left-1 w-full h-full bg-brand-secondary rounded-full" />

            {/* Button */}
            <button
              type="button"
              className="relative bg-brand-primary text-white px-6 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium flex items-center justify-center text-[9px] sm:text-[13px] whitespace-nowrap hover:bg-[#153d31] transition-transform cursor-pointer"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
