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
  const {
    data: stateGroups = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["storageHubsGroupedByState"],
    queryFn: getStorageHubsGroupedByState,
  });

  return (
    <div className="relative">
      {/* Hero Banner */}
      <section className="relative h-[calc(100vh-80px)] flex flex-col gap-10 items-center justify-center text-center text-white bg-stone-900">
        <img
          src="/frame400.jpg"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
          alt="Storage Hub"
        />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl px-4 md:px-12 font-bold mb-6">
            Verified Storage Hubs
          </h1>
          <p className="text-lg md:text-xl font-light px-4 md:px-12">
            Find verified storage hubs across Southwest Nigeria.
          </p>
        </div>

        {/* Filter Component with callback to update search view */}

        <StorageFilter onFilterResults={(data) => setFilteredResults(data)} />
      </section>

      {/* Content */}
      <main className="mt-20 py-15 max-w-7xl mx-auto px-4 md:px-12 ">
        {isLoading ? (
          <div className="h-[calc(100vh-80px)] flex items-center justify-center px-4">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />

              <h2 className="text-lg font-semibold text-text-main">
                Loading Storage Hubs...
              </h2>
            </div>
          </div>
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
                  <div
                    key={hub._id}
                    className="bg-white rounded-3xl shadow-sm border border-stone-200 flex flex-col justify-between space-y-4 overflow-hidden h-full"
                  >
                    {hub.images?.[0] && (
                      <div className="w-full h-48 overflow-hidden bg-stone-100">
                        <img
                          src={hub.images[0]}
                          alt={hub.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4 h-2 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-lg text-stone-900">
                          {hub.name}
                        </h3>
                        <p className="text-xs text-stone-500 mt-0.5">
                          {hub.lga}, {hub.state}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                        <span className="text-xs font-medium text-stone-600">
                          Available:{" "}
                          <strong className="text-stone-900">
                            {hub.availableCapacity} {hub.unitType}
                          </strong>
                        </span>
                        <span className="text-xs font-bold text-[#1B4D3E] bg-emerald-50 px-3 py-1 rounded-full">
                          {hub.storageType}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-stone-500 py-16 text-center bg-white rounded-3xl border border-stone-200">
                No storage hubs found matching your filter criteria.
              </p>
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
