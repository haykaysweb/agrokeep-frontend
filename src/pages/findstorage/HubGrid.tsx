import { Link } from "react-router";
import { HubCard } from "./HubCard";
import type { StateGroup } from "@/api/storage";

interface HubsGridProps {
  stateGroups: StateGroup[];
}

export default function HubsGrid({ stateGroups }: HubsGridProps) {
  return (
    <div className="w-full">
      {stateGroups.map((section, idx) => (
        <section
          key={section.state || idx}
          className={`w-full  ${idx !== stateGroups.length - 1 ? "mb-10" : ""}`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 leading-tight">
              Featured <span className="text-[#1B4D3E]">Storage Hubs</span> in{" "}
              {section.state} State
            </h2>

            {/* Desktop See All */}
            <Link
              to={`/storage/all?state=${encodeURIComponent(section.state)}`}
              className="hidden sm:block text-[#1B4D3E] font-bold shrink-0"
            >
              See all →
            </Link>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {section.hubs.map((hub) => {
              const { images, ...restHub } = hub;

              return (
                <HubCard
                  key={hub._id}
                  hub={{
                    ...restHub,
                    location: `${hub.lga}, ${hub.state}`,
                    capacity: String(hub.availableCapacity),
                    image: images?.[0] || "/image 1.svg",
                    unit: hub.unitType,
                  }}
                />
              );
            })}
          </div>

          {/* Mobile See All */}
          <div className="mt-5 flex justify-end sm:hidden">
            <Link
              to={`/storage/all?state=${encodeURIComponent(section.state)}`}
              className="text-[#1B4D3E] font-bold"
            >
              See all →
            </Link>
          </div>
        </section>
      ))}
    </div>
  );
}
