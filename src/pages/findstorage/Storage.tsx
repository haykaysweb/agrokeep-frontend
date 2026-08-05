import { useState } from "react";
import HubsGrid from "./HubGrid";
import StorageFilter from "./StorageFilter";
import SupportBanner from "./SupportBanner";
import { getStorageHubsGroupedByState } from "@/api/storage";
import { useQuery } from "@tanstack/react-query";

export default function HubsPage() {
  // Local state to store filtered results when the search button is triggered
  const [filteredResults, setFilteredResults] = useState<any[] | null>(null);

  // Use React Query to fetch the storage hubs on page load
  const { data: stateGroups = [], isLoading, error } = useQuery({
    queryKey: ["storageHubsGroupedByState"],
    queryFn: getStorageHubsGroupedByState,
  });

  return (
    <div className="relative bg-[#FAF7F0]">
      {/* Hero Banner */}
      <section className="relative h-[500px] flex flex-col gap-10 items-center justify-center text-center text-white bg-stone-900">
        <img 
          src="/frame400.jpg" 
          className="absolute inset-0 w-full h-full object-cover opacity-60" 
          alt="Storage Hub"
        />
        <div className="relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Verified Storage Hubs</h1>
          <p className="text-lg md:text-xl font-light">
            Find verified storage hubs across Southwest Nigeria.
          </p>
        </div>

        {/* Filter Component with callback to update search view */}
        <StorageFilter onFilterResults={(data) => setFilteredResults(data)} />
      </section>

      {/* Content */}
      <main className="pt-24 px-6 max-w-7xl mx-auto pb-20">
        {isLoading ? (
          <div className="py-20 text-center text-stone-600 font-medium">Loading storage hubs...</div>
        ) : error ? (
          <div className="py-20 text-center text-red-500 font-medium">
            Error: {(error as Error).message || "Failed to fetch storage hubs."}
          </div>
        ) : filteredResults !== null ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-stone-900">
                Search Results ({filteredResults.length})
              </h2>
              <button 
                onClick={() => setFilteredResults(null)} 
                className="text-xs font-semibold text-[#1B4D3E] hover:underline"
              >
                Clear Search 
              </button>
            </div>
            
            {filteredResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResults.map((hub) => (
                  <div key={hub._id} className="bg-white rounded-3xl p-5 shadow-sm border border-stone-200 flex flex-col justify-between space-y-4">
                    {hub.images?.[0] && (
                      <div className="w-full h-48 rounded-2xl overflow-hidden bg-stone-100">
                        <img src={hub.images[0]} alt={hub.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-lg text-stone-900">{hub.name}</h3>
                      <p className="text-xs text-stone-500 mt-0.5">{hub.lga}, {hub.state}</p>
                    </div>
                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs font-medium text-stone-600">Available: <strong className="text-stone-900">{hub.availableCapacity} {hub.unitType}</strong></span>
                      <span className="text-xs font-bold text-[#1B4D3E] bg-emerald-50 px-3 py-1 rounded-full">{hub.storageType}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 py-16 text-center bg-white rounded-3xl border border-stone-200">No storage hubs found matching your filter criteria.</p>
            )}
          </div>
        ) : (
          <HubsGrid stateGroups={stateGroups} />
        )}
      </main>

      <SupportBanner />
    </div>
  );
}