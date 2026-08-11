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

    onError: () => {
      // Handle the error through your UI/toast if needed.
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
          w-full
          min-w-0
          overflow-x-auto
          overflow-y-hidden
          no-scrollbar
          rounded-3xl
          bg-white
          p-3
          shadow-xl
          sm:p-4
        "
      >
        {/* Horizontal scrolling content */}
        <div
          className="
            flex
            w-max
            min-w-full
            items-center
            gap-3
            sm:gap-4
          "
        >
          {/* Location */}
          <div
            className="
              w-[200px]
              min-w-[200px]
              shrink-0
              text-sm
              sm:w-[240px]
              sm:min-w-[240px]
              md:flex-1
            "
          >
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
          <div
            className="
              w-[200px]
              min-w-[200px]
              shrink-0
              text-sm
              sm:w-[240px]
              sm:min-w-[240px]
              md:flex-1
            "
          >
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
          <div
            className="
              w-[200px]
              min-w-[200px]
              shrink-0
              text-sm
              sm:w-[240px]
              sm:min-w-[240px]
              md:flex-1
            "
          >
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

          {/* Search Button */}
          <div
            className="
              relative
              shrink-0
              text-sm
              transition-transform
              hover:-translate-y-0.5
              md:mr-2
              md:mt-7
            "
          >
            {/* Amber offset layer */}
            <div
              className="
                absolute
                left-1
                top-1
                h-full
                w-full
                rounded-full
                bg-amber-500
              "
            />

            <button
              type="button"
              onClick={handleSearch}
              disabled={filterMutation.isPending}
              className="
                relative
                flex
                min-w-[110px]
                shrink-0
                cursor-pointer
                items-center
                justify-center
                gap-2
                whitespace-nowrap
                rounded-full
                bg-brand-primary
                px-6
                py-3.5
                font-medium
                text-white
                shadow-md
                transition-opacity
                hover:opacity-95
                disabled:cursor-not-allowed
                disabled:opacity-50
                sm:min-w-[130px]
                sm:px-8
                md:w-auto
                md:shadow-none
              "
            >
              <Search className="h-4 w-4 shrink-0" />

              {filterMutation.isPending ? "Searching..." : "Search"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
