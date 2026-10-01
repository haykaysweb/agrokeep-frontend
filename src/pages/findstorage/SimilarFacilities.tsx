import { Star } from "lucide-react";
import type { StorageHub } from "@/api/storageDetails";
import { formatCurrency } from "@/lib/constant";

interface SimilarFacilitiesProps {
  facilities?: StorageHub["similarFacilities"];
}

const getPrice = (facility: StorageHub) => {
  const unit = facility.unitType?.toLowerCase() || "";

  if (unit.includes("crate")) {
    return facility.pricePerCratePerDay;
  }

  return facility.pricePerBagPerDay;
};

const getUnit = (facility: StorageHub) => {
  const unit = facility.unitType?.toLowerCase() || "";

  return unit.includes("crate") ? "crate" : "bag";
};

export default function SimilarFacilities({
  facilities = [],
}: SimilarFacilitiesProps) {
  if (facilities.length === 0) {
    return null;
  }
  return (
    <section className="w-full">
      <h2 className="mb-3 text-base font-semibold text-text-main sm:text-lg md:text-2xl">
        Similar Facilities Nearby
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {facilities.map((facility) => (
          <article
            key={facility._id}
            className="overflow-hidden rounded-2xl bg-surface-card shadow-sm"
          >
            {/* Image */}
            <div className="aspect-[1.75/1] w-full overflow-hidden cursor-pointer">
              <img
                src={facility.images?.[0] || "/placeholder-hub.jpg"}
                alt={facility.name}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>

            {/* Details */}
            <div className="p-3">
              {/* Name + Rating */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="min-w-0 line-clamp-2 text-sm font-semibold leading-tight text-text-main">
                  {facility.name}
                </h3>

                <div className="flex shrink-0 items-center gap-1">
                  <Star
                    className="h-3.5 w-3.5 fill-brand-secondary text-brand-secondary"
                    strokeWidth={1.5}
                  />

                  <span className="text-xs font-medium text-text-main">
                    {facility.rating}
                  </span>
                </div>
              </div>

              {/* Location */}
              <p className="mt-1 text-[10px] text-text-muted">
                {facility.lga}, {facility.state}
              </p>

              {/* Price */}
              <div className="mt-2">
                <p className="text-[10px] text-text-muted">From</p>

                <div className="flex items-baseline">
                  <span className="text-sm font-semibold text-text-main">
                    {formatCurrency(getPrice(facility))}
                  </span>

                  <span className="ml-0.5 text-[9px] text-text-muted">
                    /{getUnit(facility)}/day
                  </span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
