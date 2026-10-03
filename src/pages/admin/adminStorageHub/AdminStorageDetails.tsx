import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, Edit3, Loader2 } from "lucide-react";
import { getAdminStorageHubDetailsApi } from "@/api/adminStorage";

import StorageOverviewTab from "./components/StorageOverviewTab";
import StorageLocationTab from "./components/StorageLocationTab";
import StorageVerificationTab from "./components/StorageVerificationTab";
import StorageActivityTab from "./components/StorageActivityTab";
import EditHubModal from "./components/EditHubModal"; // Import your new modal

// Define strict types matching your exact API data structure
export interface Booking {
  _id: string;
  bookingId: string;
  bookingStatus: string;
  cropType: string;
  dropOffDate: string;
  durationInDays: number;
  fullName: string;
  hubName: string;
  location: string;
  quantity: number;
  totalAmount: number;
  unitType: string;
}

export interface VerificationDocument {
  _dId?: string;
  type: string;
  fileName: string;
  fileSize: string;
  status: string;
}

export interface StorageHub {
  id: string;
  name: string;
  status: string;
  verificationStatus: string;
  aboutFacility: string;
  images: string[];
  locationContact: {
    address: string;
    lga: string;
    proximityText: string;
    state: string;
  };
  overview: {
    activeBookingsCount: number;
    availableCapacity: number;
    features: string[];
    occupancyPercent: number;
    priceBulk100Units: number;
    pricePerBagPerDay: number;
    pricePerCratePerDay: number;
    priceWeeklyFlat: number;
    recentBookings: Booking[];
    storageType: string;
    supportedCrops: string[];
    totalCapacity: number;
    unitType: string;
  };
  verificationDocuments: VerificationDocument[];
}

export default function AdminStorageDetails() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();

  const {
    data: axiosResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["adminStorageHubDetails", id],
    queryFn: async () => {
      const response = await getAdminStorageHubDetailsApi(id || "");
      return response;
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

  const hub = (axiosResponse?.data?.data || axiosResponse?.data) as unknown as
    StorageHub | undefined;

  const [activeTab, setActiveTab] = useState("Overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const rawImages = hub?.images || [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
  ];
  const imagesList = rawImages
    .map((img) => (typeof img === "string" ? img : ""))
    .filter(Boolean);
  const [selectedPhoto, setActivePhoto] = useState<string>("");

  // Derived during render, so no effect is needed: shows the clicked photo,
  // or falls back to the first image whenever the images change
  const activePhoto = imagesList.includes(selectedPhoto)
    ? selectedPhoto
    : imagesList[0] || "";

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSaveHubChanges = async (updatedData: any) => {
    console.log("Saving hub updates:", updatedData);

    // Invalidate both the individual hub details and any general hub listings so the UI updates immediately
    await queryClient.invalidateQueries({
      queryKey: ["adminStorageHubDetails", id],
    });
    await queryClient.invalidateQueries({ queryKey: ["adminStorageHubs"] });
  };

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-[#FAF8F5]">
        <Loader2 className="h-8 w-8 animate-spin text-[#1B4D3E]" />
      </div>
    );
  }

  if (error || !hub) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] gap-4">
        <p className="text-xs font-medium text-rose-600">
          Failed to load storage hub details.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-[#1B4D3E] text-white text-xs rounded-full font-semibold cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const supportedCrops = hub.overview?.supportedCrops || [];

  return (
    <div className="w-full min-h-screen bg-[#FAF8F5] py-6 md:px-4 sm:px-8 font-sans">
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6 max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back to Storage Hubs</span>
        </button>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="inline-flex items-center gap-2 bg-[#1B4D3E] hover:bg-[#153e31] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>Edit Hub</span>
        </button>
      </div>

      {/* Main Hero Card */}
      <div className="max-w-7xl mx-auto bg-white border border-stone-200/80 rounded-2xl md:p-6 p-4  sm:p-8 shadow-xs w-full mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="relative w-full h-[260px] sm:h-[280px] rounded-xl overflow-hidden bg-stone-100 border border-stone-200/60 shadow-xs">
              <img
                src={activePhoto || imagesList[0]}
                alt="Facility"
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>
            {imagesList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {imagesList.map((photo: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setActivePhoto(photo)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      activePhoto === photo
                        ? "border-[#1B4D3E] ring-2 ring-[#1B4D3E]/20"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={photo}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 capitalize">
                ✓ {hub.verificationStatus || "Verified"}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 capitalize">
                {hub.status || "Active"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {hub.name}
            </h1>
            <p className="text-xs text-stone-500 flex items-center gap-1.5">
              <span>
                📍 {hub.locationContact?.lga}, {hub.locationContact?.state}
              </span>
              <span>•</span>
              <span>{hub.locationContact?.proximityText}</span>
            </p>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mt-1">
              {hub.aboutFacility}
            </p>

            {supportedCrops.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-stone-100">
                {supportedCrops.map((crop: string) => (
                  <span
                    key={crop}
                    className="px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-full font-medium"
                  >
                    {crop}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="max-w-7xl mx-auto flex items-center gap-8 border-b border-stone-200 mb-6 text-xs sm:text-sm font-medium overflow-x-auto">
        {[
          "Overview",
          "Location & Contact",
          "Verification Documents",
          "Activity Log",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 transition-colors relative shrink-0 cursor-pointer ${
              activeTab === tab
                ? "text-stone-900 font-semibold"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1B4D3E]" />
            )}
          </button>
        ))}
      </div>

      {/* Conditional Tab Rendering */}
      <div className="max-w-7xl mx-auto">
        {activeTab === "Overview" && <StorageOverviewTab hub={hub} />}
        {activeTab === "Location & Contact" && <StorageLocationTab hub={hub} />}
        {activeTab === "Verification Documents" && (
          <StorageVerificationTab hub={hub} />
        )}
        {activeTab === "Activity Log" && <StorageActivityTab hub={hub} />}
      </div>

      {/* Edit Hub Slide-Over / Modal */}
      <EditHubModal
        hub={hub}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveHubChanges}
      />
    </div>
  );
}
