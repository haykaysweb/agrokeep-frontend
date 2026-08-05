import { useState } from "react";
import { MapPin, Leaf, Warehouse, Search } from "lucide-react";
import { CustomDropdown } from "./CustomDropdown";
import { filterStorageHubs } from "@/api/storage";
import { useMutation } from "@tanstack/react-query";

interface StorageFilterProps {
  onFilterResults?: (results: any[]) => void;
}

export default function StorageFilter({ onFilterResults }: StorageFilterProps) {
  const [location, setLocation] = useState("");
  const [cropType, setCropType] = useState("");
  const [storageType, setStorageType] = useState("");

  // Mutation to handle filtering on the same page
  const filterMutation = useMutation({
    mutationFn: () =>
      filterStorageHubs({
        locationState: location || undefined,
        cropType: cropType || undefined,
        storageType: storageType || undefined,
      }),
    onSuccess: (data) => {
      console.log("Filtered Results:", data);
      if (onFilterResults) {
        onFilterResults(data);
      }
    },
    onError: (error) => {
      console.error("Failed to fetch filtered hubs:", error);
    },
  });

  const handleSearch = () => {
    filterMutation.mutate();
  };

  return (
    <div className="w-[92%] max-w-5xl mx-auto my-6 md:my-0 md:absolute md:-bottom-16 md:left-1/2 md:-translate-x-1/2 bg-white p-4 md:p-6 rounded-3xl shadow-xl hidden md:flex flex-row items-center gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar md:overflow-visible border border-stone-100 z-30">
      
      {/* Location */}
      <div className="w-[260px] shrink-0 snap-start md:w-auto md:flex-1 md:shrink">
        <CustomDropdown 
          label="Location" 
          icon={MapPin} 
          options={["Select state", "Oyo", "Osun", "Ekiti", "Ondo", "Ogun", "Lagos", "Kano"]} 
          onSelect={(val) => setLocation(val === "Select state" ? "" : val)}
        />
      </div>
      
      {/* Crop type */}
      <div className="w-[260px] shrink-0 snap-start md:w-auto md:flex-1 md:shrink">
        <CustomDropdown 
          label="Crop type" 
          icon={Leaf} 
          options={["Select crop type", "Yam", "Cassava", "Tomatoes", "Maize"]} 
          onSelect={(val) => setCropType(val === "Select crop type" ? "" : val)}
        />
      </div>
      
      {/* Storage type */}
      <div className="w-[260px] shrink-0 snap-start md:w-auto md:flex-1 md:shrink">
        <CustomDropdown 
          label="Storage type" 
          icon={Warehouse} 
          options={["Select storage type", "Cold Room", "Cold storage", "Silo", "Warehouse"]} 
          onSelect={(val) => setStorageType(val === "Select storage type" ? "" : val)}
        />
      </div>

      {/* Search Button with Amber Outline Pattern */}
      <div className="relative shrink-0 snap-start md:w-auto mt-0 md:mt-7 md:mr-2">
        <div className="absolute top-1 left-1 w-full h-full bg-amber-500 rounded-full hidden md:block" />
        <button 
          onClick={handleSearch}
          disabled={filterMutation.isPending}
          className="relative w-full md:w-auto bg-[#1B4D3E] text-white px-8 py-3.5 rounded-full font-medium flex items-center justify-center gap-2 hover:bg-[#153d31] transition-transform hover:-translate-y-0.5 shadow-md md:shadow-none whitespace-nowrap cursor-pointer disabled:opacity-50"
        >
          <Search className="h-4 w-4" /> 
          {filterMutation.isPending ? "Searching..." : "Search"}
        </button>
      </div>
      
    </div>
  );
}