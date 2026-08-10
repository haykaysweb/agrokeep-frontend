import { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { HubCard } from "./HubCard";
import { filterStorageHubs } from "@/api/storage";
import SupportBanner from "./SupportBanner";
import Pagination from "@/components/Pagination";

export default function SeeAllHubsPage() {
  const [searchParams] = useSearchParams();
  const selectedStateParam = searchParams.get("state") || "OYO";

  // Filter states
  const [selectedLga, setSelectedLga] = useState("");
  const [selectedCrop, setSelectedCrop] = useState("");
  const [selectedStorageType, setSelectedStorageType] = useState("");

  // Fetch filtered data using the backend API
  const {
    data: filteredHubs = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "filterHubs",
      selectedStateParam,
      selectedLga,
      selectedCrop,
      selectedStorageType,
    ],
    queryFn: () =>
      filterStorageHubs({
        locationState: selectedStateParam,
        lga: selectedLga !== "" ? selectedLga : undefined,
        cropType: selectedCrop !== "" ? selectedCrop : undefined,
        storageType:
          selectedStorageType !== "" ? selectedStorageType : undefined,
      }),
  });

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="relative h-[420px] overflow-visible">
        {/* Hero Background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 min-h-[calc(100svh-80px)] lg:min-h-[calc(100svh-80px)]"
          style={{
            backgroundImage: 'url("/frame400.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/45 min-h-[calc(100svh-80px)] lg:min-h-[calc(100svh-80px)]" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl min-h-[calc(100svh-80px)] lg:min-h-[calc(100svh-80px)] mx-auto flex justify-center items-center px-4 md:px-12">
          <div className="w-full">
            <h1 className="text-3xl font-bold leading-tight text-center text-white sm:text-4xl md:text-5xl">
              Verified Storage Hubs
            </h1>

            <p className="mt-3 text-center text-sm text-white/90 sm:text-base md:text-lg">
              Find verified storage hubs across Southwest Nigeria.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="absolute -bottom-37 left-1/2 z-30 flex w-full max-w-6xl -translate-x-1/2 justify-between items-center gap-3 overflow-x-auto rounded-3xl border border-stone-100 bg-white p-3 shadow-lg no-scrollbar md:p-6">
          <button className="flex cursor-pointer shrink-0 items-center gap-2 rounded-full border border-stone-200 bg-white px-10 py-3 text-xs font-semibold text-stone-800 transition-colors hover:bg-stone-50">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
          </button>

          <div className="h-5 w-[1px] shrink-0 bg-stone-200" />

          <button
            onClick={() => {
              setSelectedLga("");
              setSelectedCrop("");
              setSelectedStorageType("");
            }}
            className={`shrink-0 rounded-full cursor-pointer px-5 py-3 text-xs font-semibold transition-colors ${
              !selectedLga && !selectedCrop && !selectedStorageType
                ? "bg-[#1B4D3E] text-white"
                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
            }`}
          >
            All
          </button>

          {/* L.G.A Filter Dropdown */}
          <select
            value={selectedLga}
            onChange={(e) => setSelectedLga(e.target.value)}
            className="relative shrink-0 cursor-pointer appearance-none rounded-full border border-stone-200 bg-white px-5 py-3 pr-8 text-xs font-medium text-stone-600 outline-none hover:bg-stone-50"
          >
            <option value="">Select state / LGA</option>
            <option value="Ibadan">Ibadan</option>
            <option value="Ogbomoso South">Ogbomoso South</option>
          </select>

          {/* Crop Type Filter Dropdown */}
          <select
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="relative shrink-0 cursor-pointer appearance-none rounded-full border border-stone-200 bg-white px-5 py-3 pr-8 text-xs font-medium text-stone-600 outline-none hover:bg-stone-50"
          >
            <option value="">Select crop type</option>
            <option value="yam">Yam</option>
            <option value="cassava">Cassava</option>
            <option value="maize">Maize</option>
          </select>

          {/* Storage Type Filter Dropdown */}
          <select
            value={selectedStorageType}
            onChange={(e) => setSelectedStorageType(e.target.value)}
            className="shrink-0 cursor-pointer rounded-full border border-stone-200 bg-white px-5 py-3 text-xs font-medium text-stone-600 outline-none hover:bg-stone-50"
          >
            <option value="">Select storage type</option>
            <option value="Silo">Silo</option>
            <option value="Cold Storage">Cold Storage</option>
            <option value="Warehouse">Warehouse</option>
          </select>

          <button className="flex shrink-0 items-center gap-1 rounded-full border border-stone-200 bg-white px-5 py-3 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-50">
            Availability
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>
      </section>

      {/* 2. Main Content Grid & Map View */}
      <div className="mx-auto mt-50 max-w-7xl px-4 sm:px-6 md:px-12">
        <h2 className="mb-8 text-2xl font-bold text-stone-900 md:text-3xl">
          {filteredHubs.length} Verified{" "}
          <span className="text-[#1B4D3E]">
            Storage Hubs in {selectedStateParam} State
          </span>
        </h2>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          {/* Hubs Grid */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <p className="py-10 text-stone-500">Loading filtered hubs...</p>
            ) : error ? (
              <p className="py-10 text-red-500">
                Failed to load storage data from server.
              </p>
            ) : filteredHubs.length === 0 ? (
              <p className="py-10 text-stone-500">
                No storage hubs found matching this filter.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {filteredHubs.map((hub) => {
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
            )}
          </div>

          {/* Interactive Map Sidebar */}
          <div className="sticky top-6 lg:col-span-4">
            <div className="rounded-3xl border border-stone-200 bg-[#E6E2D3] p-4 shadow-sm">
              <div className="relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-2xl bg-[#C5D1B3]">
                <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-stone-700 shadow-sm backdrop-blur-sm">
                  📍 Southwest Nigeria
                </div>

                <span className="rounded-full bg-white/80 px-4 py-2 text-xs font-medium text-stone-600 shadow">
                  Interactive Map Component Area
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pagination */}
        {/* <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          hasNextPage={pagination.hasNextPage}
          hasPrevPage={pagination.hasPrevPage}
          onPageChange={setCurrentPage}
        /> */}
      </div>

      {/* Support Banner Component */}
      <SupportBanner />
    </div>
  );
}
