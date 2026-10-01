import { useMemo, useState } from "react";
import HubsGrid from "./HubGrid";
import StorageFilter from "./StorageFilter";
import SupportBanner from "./SupportBanner";
import { getStorageHubsGroupedByState, type Hub } from "@/api/storage";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router";
import Seo from "@/components/Seo";

export default function HubsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const locationStateParam = searchParams.get("locationState");
  const cropTypeParam = searchParams.get("cropType");

  // Results from the explicit "Search" button in StorageFilter
  const [manualFilterResults, setManualFilterResults] = useState<Hub[] | null>(
    null,
  );

  const {
    data: stateGroups = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["storageHubsGroupedByState"],
    queryFn: getStorageHubsGroupedByState,
  });

  // Results derived purely from the URL — a render-time computation, not
  // something that belongs in an effect.
  const urlFilteredResults = useMemo(() => {
    if (!(locationStateParam || cropTypeParam) || stateGroups.length === 0) {
      return null;
    }

    const allHubs = stateGroups.flatMap((group) => group.hubs ?? []);

    return allHubs.filter((hub) => {
      const matchesState = locationStateParam
        ? hub.state?.toLowerCase().includes(locationStateParam.toLowerCase())
        : true;

      const matchesCrop = cropTypeParam
        ? hub.crops?.some((crop) =>
            crop.toLowerCase().includes(cropTypeParam.toLowerCase()),
          )
        : true;

      return matchesState && matchesCrop;
    });
  }, [locationStateParam, cropTypeParam, stateGroups]);

  const displayedResults = manualFilterResults ?? urlFilteredResults;

  const handleClearSearch = () => {
    setManualFilterResults(null);
    if (locationStateParam || cropTypeParam) {
      navigate("/storage");
    }
  };

  return (
    <>
      <Seo
        title="Find Storage Hubs"
        description="Search and filter verified agricultural storage hubs across Nigeria by location, crop type, and availability."
      />
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
          <StorageFilter
            onFilterResults={(data) => setManualFilterResults(data)}
          />
        </section>

        {/* Content */}
        <main className="mt-15 py-15 max-w-7xl mx-auto px-4 md:px-12 ">
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
              Error: {error.message || "Failed to fetch storage hubs."}
            </div>
          ) : displayedResults !== null ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-stone-900">
                  Search Results ({displayedResults.length})
                </h2>
                <button
                  onClick={handleClearSearch}
                  className="text-xs font-semibold text-[#1B4D3E] hover:underline"
                >
                  Clear Search
                </button>
              </div>

              {displayedResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayedResults.map((hub) => (
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
                          <div
                            className="relative shrink-0"
                            onClick={() =>
                              hub.slug &&
                              navigate(`/storage/details/${hub.slug}`)
                            }
                          >
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
    </>
  );
}
