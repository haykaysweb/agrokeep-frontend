import { useState } from "react";
import { SlidersHorizontal, ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { HubCard } from "./HubCard";
import { filterStorageHubs } from "@/api/storage";
import SupportBanner from "./SupportBanner";

export default function SeeAllHubsPage() {
  const [searchParams] = useSearchParams();
  const selectedStateParam = searchParams.get("state") || "OYO";

  // Filter states
  const [selectedLga, setSelectedLga] = useState<string>("");
  const [selectedCrop, setSelectedCrop] = useState<string>("");
  const [selectedStorageType, setSelectedStorageType] = useState<string>("");

  // Fetch filtered data using the backend API
  const { data: filteredHubs = [], isLoading, error } = useQuery({
    queryKey: ["filterHubs", selectedStateParam, selectedLga, selectedCrop, selectedStorageType],
    queryFn: () =>
      filterStorageHubs({
        locationState: selectedStateParam,
        lga: selectedLga !== "" ? selectedLga : undefined,
        cropType: selectedCrop !== "" ? selectedCrop : undefined,
        storageType: selectedStorageType !== "" ? selectedStorageType : undefined,
      }),
  });

  return (
    <div className="bg-[#FAF7F0] min-h-screen">
      
      {/* 1. Hero Section */}
      <div className="relative bg-stone-900 py-24 px-6 text-center text-white">
        <div className="absolute inset-0 opacity-40 overflow-hidden">
          <img src="/frame400.jpg" alt="Storage Background" className="w-full h-full object-cover" />
        </div>
        <div className="relative max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Verified Storage Hubs</h1>
          <p className="text-stone-300 text-sm md:text-base">Find verified storage hubs across Southwest Nigeria.</p>
        </div>

        {/* Filter Bar */}
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl bg-white p-3 md:p-4 rounded-full shadow-lg flex items-center gap-3 overflow-x-auto no-scrollbar border border-stone-100 z-30">
          
          <button className="bg-white hover:bg-stone-50 text-stone-800 px-5 py-2.5 rounded-full text-xs font-semibold flex items-center gap-2 shrink-0 border border-stone-200 transition-colors">
            <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
          </button>

          <div className="h-5 w-[1px] bg-stone-200 shrink-0" />

          <button 
            onClick={() => { setSelectedLga(""); setSelectedCrop(""); setSelectedStorageType(""); }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${!selectedLga && !selectedCrop && !selectedStorageType ? "bg-[#1B4D3E] text-white" : "bg-white text-stone-600 hover:bg-stone-50 border border-stone-200"}`}
          >
            All
          </button>

          {/* L.G.A Filter Dropdown */}
          <select 
            value={selectedLga}
            onChange={(e) => setSelectedLga(e.target.value)}
            className="bg-white hover:bg-stone-50 text-stone-600 px-5 py-2.5 rounded-full text-xs font-medium shrink-0 border border-stone-200 outline-none cursor-pointer appearance-none pr-8 relative"
          >
            <option value="">L.G.A</option>
            <option value="Ibadan">Ibadan</option>
            <option value="Ogbomoso South">Ogbomoso South</option>
          </select>

          {/* Crop Type Filter Dropdown (Customized) */}
          <select 
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="bg-white hover:bg-stone-50 text-stone-600 px-5 py-2.5 rounded-full text-xs font-medium shrink-0 border border-stone-200 outline-none cursor-pointer appearance-none pr-8 relative"
          >
            <option value="">Crop Type</option>
            <option value="yam">Yam</option>
            <option value="cassava">Cassava</option>
            <option value="maize">Maize</option>
          </select>

          {/* Storage Type Filter Dropdown */}
          <select 
            value={selectedStorageType}
            onChange={(e) => setSelectedStorageType(e.target.value)}
            className="bg-white hover:bg-stone-50 text-stone-600 px-5 py-2.5 rounded-full text-xs font-medium shrink-0 border border-stone-200 outline-none cursor-pointer"
          >
            <option value="">Storage Type</option>
            <option value="Silo">Silo</option>
            <option value="Cold Storage">Cold Storage</option>
            <option value="Warehouse">Warehouse</option>
          </select>

          <button className="bg-white hover:bg-stone-50 text-stone-500 px-5 py-2.5 rounded-full text-xs font-medium shrink-0 border border-stone-200 flex items-center gap-1 transition-colors">
            Availability <ChevronDown className="h-3 w-3" />
          </button>

        </div>
      </div>

      {/* 2. Main Content Grid & Map View */}
      <div className="max-w-7xl mx-auto px-6 mt-20">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-8">
          {filteredHubs.length} Verified <span className="text-[#1B4D3E]">Storage Hubs in {selectedStateParam} State</span>
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Hubs Grid */}
          <div className="lg:col-span-8">
            {isLoading ? (
              <p className="text-stone-500 py-10">Loading filtered hubs...</p>
            ) : error ? (
              <p className="text-red-500 py-10">Failed to load storage data from server.</p>
            ) : filteredHubs.length === 0 ? (
              <p className="text-stone-500 py-10">No storage hubs found matching this filter.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredHubs.map((hub) => (
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
                      image: hub.images && hub.images.length > 0 ? hub.images[0] : "/image 1.svg",
                    }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Interactive Map Sidebar */}
          <div className="lg:col-span-4 sticky top-6">
            <div className="bg-[#E6E2D3] p-4 rounded-3xl border border-stone-200 shadow-sm">
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden bg-[#C5D1B3] flex items-center justify-center">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[11px] font-bold text-stone-700 shadow-sm flex items-center gap-1">
                  📍 Southwest Nigeria
                </div>
                <span className="text-xs font-medium text-stone-600 bg-white/80 px-4 py-2 rounded-full shadow">
                  Interactive Map Component Area
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mt-12 mb-16">
          <button className="p-2 text-stone-400 hover:text-stone-700"><ChevronLeft className="h-4 w-4" /></button>
          <button className="w-8 h-8 rounded-full bg-[#1B4D3E] text-white text-xs font-bold flex items-center justify-center">1</button>
          <button className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-600 text-xs font-medium flex items-center justify-center">2</button>
          <button className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-600 text-xs font-medium flex items-center justify-center">3</button>
          <button className="w-8 h-8 rounded-full hover:bg-stone-200 text-stone-600 text-xs font-medium flex items-center justify-center">4</button>
          <button className="p-2 text-stone-600 hover:text-stone-900"><ChevronRight className="h-4 w-4" /></button>
        </div>

      </div>

      {/* 3. Support Banner Component */}
      <SupportBanner />

    </div>
  );
}