/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { X, ChevronDown, Plus, ArrowRight } from "lucide-react";

interface AddStorageHubModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddStorageHubModal({
  isOpen,
  onClose,
}: AddStorageHubModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    hubName: "",
    hubOwner: "",
    contactPerson: "",
    phoneNumber: "",
    emailAddress: "",
    state: "",
    lga: "",
    address: "",
    storageType: "",
    capacityValue: "",
    capacityUnit: "Bags",
    environments: {
      naturalVentilation: true,
      controlledHumidity: false,
      truckAccess: true,
      pestControl: true,
      powerBackup: true,
      security247: true,
      fireSafety: true,
      insurance: true,
    },
    crops: ["Rice", "Maize", "Millet", "Garri", "Sorghum", "Beans", "Yam"],
    newCropInput: "",
    pricePerBag: "",
    pricePerCrate: "",
    serviceFee: "2.5",
    bulkDiscount: true,
    longTermDiscount: true,
  });

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEnvironment = (key: keyof typeof formData.environments) => {
    setFormData((prev) => ({
      ...prev,
      environments: {
        ...prev.environments,
        [key]: !prev.environments[key],
      },
    }));
  };

  const removeCrop = (cropToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      crops: prev.crops.filter((crop) => crop !== cropToRemove),
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl overflow-hidden my-8 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200/80 bg-stone-50/50">
          <div>
            <h2 className="text-xl font-bold text-stone-900 tracking-tight">
              Add Storage Hub
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Add a new storage facility to AgroKeep.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200/60 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Stepper Header */}
        <div className="px-6 py-4 bg-stone-100/60 border-b border-stone-200/80 flex items-center justify-center gap-4 text-xs font-semibold text-stone-500">
          <div className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full text-white ${currentStep === 1 ? "bg-[#1B4D3E]" : "bg-emerald-800"}`}
            >
              1
            </span>
            <span
              className={currentStep === 1 ? "text-stone-900 font-bold" : ""}
            >
              Information
            </span>
          </div>
          <div className="w-12 h-px bg-stone-300" />
          <div className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full ${currentStep === 2 ? "bg-[#1B4D3E] text-white" : "bg-stone-200 text-stone-600"}`}
            >
              2
            </span>
            <span
              className={currentStep === 2 ? "text-stone-900 font-bold" : ""}
            >
              Documents
            </span>
          </div>
          <div className="w-12 h-px bg-stone-300" />
          <div className="flex items-center gap-2">
            <span
              className={`flex size-6 items-center justify-center rounded-full ${currentStep === 3 ? "bg-[#1B4D3E] text-white" : "bg-stone-200 text-stone-600"}`}
            >
              3
            </span>
            <span
              className={currentStep === 3 ? "text-stone-900 font-bold" : ""}
            >
              Review
            </span>
          </div>
        </div>

        {/* Modal Body / Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs">
          {/* 1. Basic Information Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1B4D3E]" /> Basic
              Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-stone-600">Hub Name*</label>
                <input
                  type="text"
                  placeholder="Agrokeep Ibadan Hub"
                  value={formData.hubName}
                  onChange={(e) => handleInputChange("hubName", e.target.value)}
                  className="px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-stone-600">Hub Owner*</label>
                <input
                  type="text"
                  placeholder="Adewale Farms Ltd."
                  value={formData.hubOwner}
                  onChange={(e) =>
                    handleInputChange("hubOwner", e.target.value)
                  }
                  className="px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-stone-600">
                  Contact Person*
                </label>
                <input
                  type="text"
                  placeholder="Adewale Ogun"
                  value={formData.contactPerson}
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                  className="px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-stone-600">
                  Phone Number*
                </label>
                <input
                  type="text"
                  placeholder="+234 806 777 7777"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    handleInputChange("phoneNumber", e.target.value)
                  }
                  className="px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-stone-600">
                Email Address*
              </label>
              <input
                type="email"
                placeholder="KM 4, Lagos Ibadan expressway, Oyo State"
                value={formData.emailAddress}
                onChange={(e) =>
                  handleInputChange("emailAddress", e.target.value)
                }
                className="px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
              />
            </div>
          </div>

          <hr className="border-stone-200/80" />

          {/* 2. Location Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1B4D3E]" /> Location
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-stone-600">State*</label>
                <div className="relative">
                  <select
                    value={formData.state}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-[#1B4D3E] pr-8"
                  >
                    <option value="">Select state</option>
                    <option value="Oyo">Oyo</option>
                    <option value="Ogun">Ogun</option>
                    <option value="Lagos">Lagos</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-stone-600">LGA*</label>
                <div className="relative">
                  <select
                    value={formData.lga}
                    onChange={(e) => handleInputChange("lga", e.target.value)}
                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-[#1B4D3E] pr-8"
                  >
                    <option value="">Select LGA</option>
                    <option value="Ibadan North">Ibadan North</option>
                    <option value="Ibadan Southwest">Ibadan Southwest</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-medium text-stone-600">Address*</label>
              <input
                type="text"
                placeholder="adewale.a@mail.com"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
              />
            </div>
          </div>

          <hr className="border-stone-200/80" />

          {/* 3. Storage Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1B4D3E]" /> Storage
              Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-stone-600">
                  Storage Type*
                </label>
                <div className="relative">
                  <select
                    value={formData.storageType}
                    onChange={(e) =>
                      handleInputChange("storageType", e.target.value)
                    }
                    className="w-full appearance-none bg-white border border-stone-200 rounded-xl px-3.5 py-2.5 text-stone-800 focus:outline-none focus:border-[#1B4D3E] pr-8"
                  >
                    <option value="">Select storage type</option>
                    <option value="Dry Storage">Dry Storage</option>
                    <option value="Cold Storage">Cold Storage</option>
                    <option value="Warehouse">Warehouse</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-medium text-stone-600">
                  Configured Capacity*
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="2500"
                    value={formData.capacityValue}
                    onChange={(e) =>
                      handleInputChange("capacityValue", e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                  />
                  <select
                    value={formData.capacityUnit}
                    onChange={(e) =>
                      handleInputChange("capacityUnit", e.target.value)
                    }
                    className="w-32 bg-white border border-stone-200 rounded-xl px-3 py-2.5 text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                  >
                    <option value="Bags">Bags</option>
                    <option value="Crates">Crates</option>
                    <option value="Tonnes">Tonnes</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-stone-200/80" />

          {/* 4. Storage Requirement */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1B4D3E]" /> Storage
              Requirement
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Environment Checklist */}
              <div className="p-4 border border-stone-200 rounded-2xl space-y-3 bg-stone-50/40">
                <label className="font-semibold text-stone-800 block mb-2">
                  Storage Environment
                </label>
                {[
                  { key: "naturalVentilation", label: "Natural Ventilation" },
                  { key: "controlledHumidity", label: "Controlled Humidity" },
                  { key: "truckAccess", label: "Truck Access" },
                  { key: "pestControl", label: "Pest Control" },
                  { key: "powerBackup", label: "Power Backup" },
                  { key: "security247", label: "24/7 Security" },
                  { key: "fireSafety", label: "Fire Safety" },
                  { key: "insurance", label: "Insurance" },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center gap-3 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={
                        formData.environments[
                          item.key as keyof typeof formData.environments
                        ]
                      }
                      onChange={() =>
                        toggleEnvironment(
                          item.key as keyof typeof formData.environments,
                        )
                      }
                      className="size-4 rounded border-stone-300 accent-[#1B4D3E] cursor-pointer"
                    />
                    <span className="text-stone-700">{item.label}</span>
                  </label>
                ))}
              </div>

              {/* Supported Crops */}
              <div className="p-4 border border-stone-200 rounded-2xl space-y-3 bg-stone-50/40 flex flex-col justify-between">
                <div>
                  <label className="font-semibold text-stone-800 block mb-2">
                    Supported Crops
                  </label>
                  <div className="relative mb-3">
                    <select className="w-full appearance-none bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-stone-700 focus:outline-none pr-8">
                      <option>Select crops</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400 pointer-events-none" />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {formData.crops.map((crop) => (
                      <span
                        key={crop}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-stone-200 rounded-full text-stone-800 font-medium text-xs shadow-xs"
                      >
                        {crop}
                        <button
                          type="button"
                          onClick={() => removeCrop(crop)}
                          className="text-stone-400 hover:text-stone-700 cursor-pointer"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[#1B4D3E] font-semibold hover:underline mt-4 cursor-pointer text-xs"
                >
                  <Plus className="size-3.5" /> + Add more
                </button>
              </div>
            </div>
          </div>

          <hr className="border-stone-200/80" />

          {/* 5. Pricing & Discounts */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <span className="size-2 rounded-full bg-[#1B4D3E]" /> Pricing &
              Discounts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Pricing Form */}
              <div className="p-4 border border-stone-200 rounded-2xl space-y-4 bg-stone-50/40">
                <label className="font-semibold text-stone-800 block">
                  Pricing
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-stone-500">
                      Per Bag/Day*
                    </label>
                    <input
                      type="text"
                      placeholder="₦450"
                      value={formData.pricePerBag}
                      onChange={(e) =>
                        handleInputChange("pricePerBag", e.target.value)
                      }
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[11px] text-stone-500">
                      Per Crate/Day*
                    </label>
                    <input
                      type="text"
                      placeholder="₦650"
                      value={formData.pricePerCrate}
                      onChange={(e) =>
                        handleInputChange("pricePerCrate", e.target.value)
                      }
                      className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] text-stone-500">
                    Service fee*
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.serviceFee}
                      onChange={(e) =>
                        handleInputChange("serviceFee", e.target.value)
                      }
                      className="w-full pl-3 pr-10 py-2 bg-white border border-stone-200 rounded-xl text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 font-semibold">
                      %
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400 mt-0.5">
                    % charged on the total booking*
                  </span>
                </div>
              </div>

              {/* Discount Rules */}
              <div className="p-4 border border-stone-200 rounded-2xl space-y-3 bg-stone-50/40 flex flex-col justify-between">
                <div>
                  <label className="font-semibold text-stone-800 block mb-3">
                    Discount Rules
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.bulkDiscount}
                        onChange={(e) =>
                          handleInputChange("bulkDiscount", e.target.checked)
                        }
                        className="mt-0.5 size-4 rounded border-stone-300 accent-[#1B4D3E] cursor-pointer"
                      />
                      <div>
                        <p className="font-medium text-stone-800">
                          Bulk Discount
                        </p>
                        <p className="text-[11px] text-stone-500">
                          5% for 100+ bags/crates
                        </p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.longTermDiscount}
                        onChange={(e) =>
                          handleInputChange(
                            "longTermDiscount",
                            e.target.checked,
                          )
                        }
                        className="mt-0.5 size-4 rounded border-stone-300 accent-[#1B4D3E] cursor-pointer"
                      />
                      <div>
                        <p className="font-medium text-stone-800">
                          Long-term Discount
                        </p>
                        <p className="text-[11px] text-stone-500">
                          8% for 100+ bags/crates longer than a month
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <p className="text-[10px] text-stone-400 italic mt-2">
                  Highest eligible discount only**
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-50 border-t border-stone-200/80">
          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="px-5 py-2.5 rounded-full border border-stone-300 text-stone-600 font-semibold text-xs hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            Back
          </button>

          <button
            type="button"
            onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
            className="inline-flex items-center gap-2 bg-[#1B4D3E] hover:bg-[#153e31] text-white px-6 py-2.5 rounded-full font-semibold text-xs shadow-sm transition-all cursor-pointer"
          >
            <span>Upload Documents</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
