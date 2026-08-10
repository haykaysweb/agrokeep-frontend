import { useState } from "react";
import FacilityLocationCard from "@/components/FacilityLocationCard";
import { MOCK_FACILITIES } from "@/lib/types";
import type { StorageFacility } from "@/types/facility";

export default function StorageDetailsMap() {
  // Manage selected facility state inside this component
  const [selectedFacility, setSelectedFacility] = useState<StorageFacility>(
    MOCK_FACILITIES[0]
  );

  return (
    <div className="w-full">
      {/* Optional: Location Switcher for testing/demo */}
      <div className="mb-3">
        <div className="flex flex-wrap gap-2">
          {MOCK_FACILITIES.map((facility) => (
            <button
              key={facility.id}
              onClick={() => setSelectedFacility(facility)}
              type="button"
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                selectedFacility.id === facility.id
                  ? "bg-brand-primary text-text-light shadow-xs"
                  : "bg-surface-card text-text-subtle border border-border-light hover:bg-background-subtle"
              }`}
            >
              {facility.name}
            </button>
          ))}
        </div>
      </div>

      {/* Render the Map & Details Card */}
      <FacilityLocationCard
        facilities={MOCK_FACILITIES}
        selectedFacility={selectedFacility}
        onSelectFacility={(facility) => setSelectedFacility(facility)}
      />
    </div>
  );
}