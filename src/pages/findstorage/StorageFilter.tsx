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
    <div
      className="
        absolute
        z-30
        left-1/2
        -translate-x-1/2
        -bottom-16
        w-full
        max-w-7xl
        px-4
        sm:px-6
        md:px-12
      "
    >
      {/* Filter Box */}
      <div
        className="
          hidden
          md:flex
          w-full
          flex-row
          items-center
          gap-4
          overflow-x-auto
          snap-x
          snap-mandatory
          scroll-smooth
          no-scrollbar
          md:overflow-visible

          bg-white
          p-4
          rounded-3xl
          shadow-xl
          border
          border-stone-100
        "
      >
        {/* Location */}
        <div className="w-[260px] shrink-0 text-sm snap-start md:w-auto md:flex-1 md:shrink">
          <CustomDropdown
            label="Location"
            icon={MapPin}
            options={[
              "Select state",
              "Oyo",
              "Osun",
              "Ekiti",
              "Ondo",
              "Ogun",
              "Lagos",
              "Kano",
            ]}
            onSelect={(val) => setLocation(val === "Select state" ? "" : val)}
          />
        </div>

        {/* Crop type */}
        <div className="w-[260px] text-sm shrink-0 snap-start md:w-auto md:flex-1 md:shrink">
          <CustomDropdown
            label="Crop type"
            icon={Leaf}
            options={[
              "Select crop type",
              "Yam",
              "Cassava",
              "Tomatoes",
              "Maize",
            ]}
            onSelect={(val) =>
              setCropType(val === "Select crop type" ? "" : val)
            }
          />
        </div>

        {/* Storage type */}
        <div className="w-[260px] text-sm shrink-0 snap-start md:w-auto md:flex-1 md:shrink">
          <CustomDropdown
            label="Storage type"
            icon={Warehouse}
            options={[
              "Select storage type",
              "Cold Room",
              "Cold storage",
              "Silo",
              "Warehouse",
            ]}
            onSelect={(val) =>
              setStorageType(val === "Select storage type" ? "" : val)
            }
          />
        </div>

        {/* Search Button with Amber Outline Pattern */}
        <div
          className="relative text-sm mt-0 shrink-0 snap-start md:mt-7 md:mr-2 hover:-translate-y-0.5"
          
        >
          <div className="absolute left-1 top-1 hidden h-full w-full rounded-full bg-amber-500 md:block" />

          <button
            onClick={handleSearch}
            disabled={filterMutation.isPending}
            className="
              relative
              flex
              w-full
              items-center
              justify-center
              gap-2
              whitespace-nowrap
              rounded-full
              bg-brand-primary
              px-8
              py-3.5
              font-medium
              text-white
              shadow-md
              transition-transform
              md:w-auto
              md:shadow-none
              cursor-pointer
              disabled:opacity-50
            "
          >
            <Search className="h-4 w-4" />

            {filterMutation.isPending ? "Searching..." : "Search"}
          </button>
        </div>
      </div>
    </div>
  );
}


