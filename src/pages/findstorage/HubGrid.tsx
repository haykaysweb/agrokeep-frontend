import { Link } from "react-router";
import { HubCard } from "./HubCard";
import type { StateGroup } from "@/api/storage";

interface HubsGridProps {
  stateGroups: StateGroup[];
}

export default function HubsGrid({ stateGroups }: HubsGridProps) {
  return (
    <div className="bg-[#FAF7F0] py-10 md:px-6 space-y-16">
      {stateGroups.map((section, idx) => (
        <section key={section.state || idx} className="max-w-7xl mx-auto">
          <div className="flex justify-between gap-3 md:gap-0 items-end mb-6">
            <h2 className="text-3xl font-bold text-stone-900">
              Featured{" "}
              <span className="text-[#1B4D3E]">
                Storage Hubs in {section.state} State
              </span>
            </h2>
            <Link to={`/storage/all?state=${encodeURIComponent(section.state)}`}className="text-[#1B4D3E]  font-bold">
              See all →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {section.hubs.map((hub) => (
              <HubCard
                key={hub._id}
                hub={{
                  name: hub.name,
                  location: `${hub.lga}, ${hub.state}`,
                  capacity: `${hub.availableCapacity} ${hub.unitType}`,
                price: hub.pricePerBagPerWeek50kg > 0 
  ? String(hub.pricePerBagPerWeek50kg) 
  : String(hub.pricePerCratePerWeek50kg),
                  unit: hub.unitType,
                  image: hub.images,
                }}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
