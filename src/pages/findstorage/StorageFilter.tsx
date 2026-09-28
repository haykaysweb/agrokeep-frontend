import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Leaf, Warehouse, Search } from "lucide-react";
import { CustomDropdown } from "./CustomDropdown";
import { filterStorageHubs, type Hub } from "@/api/storage";
import { useMutation } from "@tanstack/react-query";

interface StorageFilterProps {
  onFilterResults?: (results: Hub[]) => void;
}

export default function StorageFilter({ onFilterResults }: StorageFilterProps) {
  const [location, setLocation] = useState("");
  const [cropType, setCropType] = useState("");
  const [storageType, setStorageType] = useState("");

  const filterMutation = useMutation({
    mutationFn: () =>
      filterStorageHubs({
        locationState: location || undefined,
        cropType: cropType || undefined,
        storageType: storageType || undefined,
      }),

    onSuccess: (data) => {
      onFilterResults?.(data);
    },

    onError: (error) => {
      console.error("Failed to fetch filtered hubs:", error);
    },
  });

  const handleSearch = () => {
    filterMutation.mutate();
  };

  return (
    <div className="absolute max-w-7xl mx-auto bottom-[-4rem] left-1/2 z-30 w-full -translate-x-1/2 px-4 sm:px-6 md:px-12">
      <div className="w-full rounded-3xl border border-stone-100 bg-white p-4 shadow-xl">
        <div className="flex w-full items-end gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:overflow-visible md:pb-0">
          {/* Location */}
          <div className="w-[240px] min-w-[240px]  shrink-0 sm:w-[260px] sm:min-w-[260px] md:min-w-0 md:flex-1">
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

          {/* Crop Type */}
          <div className="w-[240px] min-w-[240px] shrink-0 sm:w-[260px] sm:min-w-[260px] md:min-w-0 md:flex-1">
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

          {/* Storage Type */}
          <div className="w-[240px] min-w-[240px] shrink-0 sm:w-[260px] sm:min-w-[260px] md:min-w-0 md:flex-1">
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

          {/* Search */}
          <div className="flex min-w-[150px] shrink-0 items-end pb-0.5">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={handleSearch}
              disabled={filterMutation.isPending}
              className="relative inline-block cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary" />

              <span className="relative z-10 flex h-12 items-center gap-3 rounded-full bg-brand-primary px-5 text-text-light sm:px-7">
                <span>
                  <Search />
                </span>
                <span className="whitespace-nowrap text-sm font-medium sm:text-base">
                  {filterMutation.isPending ? "Searching..." : "Search"}
                </span>
              </span>
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
