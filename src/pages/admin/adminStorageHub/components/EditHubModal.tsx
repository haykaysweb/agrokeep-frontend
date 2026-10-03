/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useRef } from "react";
import {
  X,
  Upload,
  Loader2,
  ShieldCheck,
  Power,
  Info,
  MapPin,
  Warehouse,
  CreditCard,
  LocateFixed,
} from "lucide-react";
import {
  editStorageHubDetailApi,
  uploadVerificationDocumentsApi,
} from "@/api/adminStorage";
import { showToast } from "@/utils/CustomToast";

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const CROP_OPTIONS = [
  "Rice",
  "Maize",
  "Millet",
  "Cassava",
  "Yam",
  "Beans",
  "Sorghum",
  "Cowpea",
  "Groundnut",
  "Soybean",
  "Sesame",
  "Ginger",
];

// Labels must match the strings stored in hub.features
const FEATURE_OPTIONS = [
  "Natural Ventilation",
  "Controlled Humidity",
  "Truck Access",
  "Pest Control",
  "Power Backup",
  "24/7 Security",
  "Fire Safety",
  "Insurance",
];

const ACCEPTED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const inputCls = "w-full p-2.5 border border-stone-300 rounded-xl bg-white";
const labelCls = "block font-semibold text-stone-700 mb-1";

const SectionTitle = ({
  icon: Icon,
  children,
}: {
  icon: any;
  children: React.ReactNode;
}) => (
  <h3 className="flex items-center gap-2 font-semibold text-[#1B4D3E] text-sm">
    <Icon className="h-4 w-4" />
    {children}
  </h3>
);

const notifySuccess = (message: string) => showToast.success(message);
const notifyError = (message: string) => showToast.error(message);

const getErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message || error?.message || fallback;

const getSuccessMessage = (res: any, fallback: string) =>
  typeof res?.data?.message === "string" && res.data.message
    ? res.data.message
    : fallback;

const toNum = (v: any) =>
  v === "" || v === null || v === undefined ? undefined : Number(v);

const formatGps = (lat: any, lng: any) =>
  lat !== undefined && lat !== null && lng !== undefined && lng !== null
    ? `${lat}, ${lng}`
    : "";

// Accepts "7.3775, 3.947" or "7.4012° N, 3.9124° E"
const parseGps = (value: string) => {
  const nums = value.match(/-?\d+(\.\d+)?/g);
  if (!nums || nums.length < 2) return {};
  return { latitude: Number(nums[0]), longitude: Number(nums[1]) };
};

// The `hub` prop can be the raw API document or a view-model the parent page built from it.
// These helpers look for the raw field name first, then common aliases, checking the top
// level first and then nested objects (overview, locationContact, etc.).
const findDeep = (obj: any, keys: string[], maxDepth = 4) => {
  for (const key of keys) {
    let level: any[] = [obj];
    for (let d = 0; d <= maxDepth && level.length; d++) {
      const next: any[] = [];
      for (const node of level) {
        if (node && typeof node === "object" && !Array.isArray(node)) {
          const v = node[key];
          if (v !== undefined && v !== null && v !== "") return v;
          next.push(
            ...Object.values(node).filter(
              (x) => x && typeof x === "object" && !Array.isArray(x),
            ),
          );
        }
      }
      level = next;
    }
  }
  return undefined;
};

const pickStr = (h: any, ...keys: string[]) => {
  const v = findDeep(h, keys);
  return v === undefined ? "" : String(v);
};

// Strips currency symbols / % / commas in case the parent passes formatted strings like "₦480"
const pickNum = (h: any, ...keys: string[]) => {
  const v = findDeep(h, keys);
  if (v === undefined) return "";
  const n =
    typeof v === "number" ? v : parseFloat(String(v).replace(/[^\d.-]/g, ""));
  return Number.isNaN(n) ? "" : n;
};

const ENV_LABELS: Record<string, string> = {
  naturalVentilation: "Natural Ventilation",
  controlledHumidity: "Controlled Humidity",
  truckAccess: "Truck Access",
  pestControl: "Pest Control",
  powerBackup: "Power Backup",
  security247: "24/7 Security",
  fireSafety: "Fire Safety",
  insurance: "Insurance",
};

const pickFeatures = (h: any): string[] => {
  const features = findDeep(h, ["features"]);
  if (Array.isArray(features)) return [...features];
  const env = findDeep(h, ["environments"]);
  if (env && typeof env === "object") {
    return Object.entries(env)
      .filter(([, on]) => on)
      .map(([k]) => ENV_LABELS[k])
      .filter(Boolean);
  }
  return [];
};

const getInitialFormData = (h: any) => {
  const lat = findDeep(h, ["latitude", "lat"]);
  const lng = findDeep(h, ["longitude", "lng", "lon"]);
  const bag = pickNum(h, "pricePerBagPerDay");
  const bulk = pickNum(h, "priceBulk100Units");
  const crops = findDeep(h, ["supportedCrops"]);

  return {
    verificationStatus: (
      pickStr(h, "verificationStatus") || "pending"
    ).toLowerCase(),
    status: (pickStr(h, "status") || "active").toLowerCase(),
    name: pickStr(h, "name", "hubName"),
    hubOwnerName: pickStr(h, "hubOwnerName", "hubOwner", "ownerName", "owner"),
    contactPersonName: pickStr(
      h,
      "contactPersonName",
      "contactPerson",
      "contactName",
      "manager",
    ),
    contactPhoneNumber: pickStr(
      h,
      "contactPhoneNumber",
      "contactPhone",
      "phoneNumber",
      "phone",
    ),
    contactEmail: pickStr(h, "contactEmail", "email"),
    aboutFacility: pickStr(h, "aboutFacility", "description", "about"),
    state: pickStr(h, "state"),
    lga: pickStr(h, "lga"),
    address: pickStr(h, "address"),
    nearestLandmark: pickStr(h, "nearestLandmark"),
    proximityText: pickStr(
      h,
      "proximityText",
      "distanceFromLandmark",
      "proximity",
    ), // "Distance from Landmark"
    drivingDirections: pickStr(h, "drivingDirections"),
    specNearestMajorMarket: pickStr(
      h,
      "specNearestMajorMarket",
      "nearestMajorMarket",
      "nearestMarket",
    ),
    gps:
      lat !== undefined && lng !== undefined
        ? formatGps(lat, lng)
        : pickStr(h, "gpsCoordinates"),
    storageType: pickStr(h, "storageType"),
    totalCapacity: pickNum(
      h,
      "totalCapacity",
      "configuredCapacity",
      "capacity",
    ),
    unitType: (pickStr(h, "unitType", "capacityUnit") || "bags").toLowerCase(),
    features: pickFeatures(h),
    supportedCrops: Array.isArray(crops) ? [...crops] : [],
    pricePerBagPerDay: bag,
    pricePerCratePerDay: pickNum(h, "pricePerCratePerDay"),
    serviceFee: pickNum(h, "serviceFee", "serviceCharge"),
    initialDeposit: pickNum(h, "initialDeposit"),
    // Bulk discount is derived from your data: a bulk price below the daily price means it's on
    bulkDiscount:
      typeof findDeep(h, ["bulkDiscount"]) === "boolean"
        ? findDeep(h, ["bulkDiscount"])
        : bag !== "" && bulk !== "" && Number(bulk) < Number(bag),
    longTermDiscount: Boolean(findDeep(h, ["longTermDiscount"])),
  };
};

function EditHubModalForm({
  hub,
  onClose,
  onSave,
}: {
  hub: any;
  onClose: () => void;
  onSave: (updatedData: any) => Promise<void>;
}) {
  // State is initialised from `hub` when this component mounts. The wrapper below
  // remounts it (via `key`) whenever the modal opens or the hub changes, so the
  // form never needs to copy props into state from inside an effect.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState(() => getInitialFormData(hub));
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [showCustomCrop, setShowCustomCrop] = useState(false);
  const [customCrop, setCustomCrop] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeatureChange = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(label)
        ? prev.features.filter((f: string) => f !== label)
        : [...prev.features, label],
    }));
  };

  const addCrop = (raw: string) => {
    const crop = raw.trim();
    if (!crop) return;
    const formatted = crop.charAt(0).toUpperCase() + crop.slice(1);
    setFormData((prev) =>
      prev.supportedCrops.some(
        (c: string) => c.toLowerCase() === formatted.toLowerCase(),
      )
        ? prev
        : { ...prev, supportedCrops: [...prev.supportedCrops, formatted] },
    );
  };

  const removeCrop = (cropToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      supportedCrops: prev.supportedCrops.filter(
        (c: string) => c !== cropToRemove,
      ),
    }));
  };

  const useCurrentLocation = () => {
    if (!navigator.geolocation) {
      notifyError("Geolocation is not supported by this browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setFormData((prev) => ({
          ...prev,
          gps: formatGps(pos.coords.latitude, pos.coords.longitude),
        })),
      () => notifyError("Could not get your current location."),
    );
  };

  // ---- Document upload helpers ----
  const addFiles = (incoming: FileList | File[] | null) => {
    if (!incoming) return;
    const valid: File[] = [];
    Array.from(incoming).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        notifyError(`${file.name}: only PDF, JPG and PNG files are allowed.`);
      } else if (file.size > MAX_FILE_SIZE) {
        notifyError(`${file.name}: file is larger than 10MB.`);
      } else {
        valid.push(file);
      }
    });
    if (valid.length) setFiles((prev) => [...prev, ...valid]);
  };

  const removeFile = (index: number) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const initial = getInitialFormData(hub);
    const bagPrice = toNum(formData.pricePerBagPerDay);

    // Payload uses the backend's real field names
    const payload: Record<string, any> = {
      name: formData.name,
      hubOwnerName: formData.hubOwnerName,
      contactPersonName: formData.contactPersonName,
      contactPhoneNumber: formData.contactPhoneNumber,
      contactEmail: formData.contactEmail,
      aboutFacility: formData.aboutFacility,
      state: formData.state,
      lga: formData.lga,
      address: formData.address,
      proximityText: formData.proximityText,
      specNearestMajorMarket: formData.specNearestMajorMarket,
      ...parseGps(formData.gps),
      storageType: formData.storageType,
      totalCapacity: toNum(formData.totalCapacity),
      unitType: formData.unitType,
      features: formData.features,
      supportedCrops: formData.supportedCrops,
      pricePerBagPerDay: bagPrice,
      pricePerCratePerDay: toNum(formData.pricePerCratePerDay),
      longTermDiscount: formData.longTermDiscount,
    };

    // Bulk discount checkbox -> priceBulk100Units (5% off the daily bag price)
    if (bagPrice !== undefined) {
      payload.priceBulk100Units = formData.bulkDiscount
        ? Math.round(bagPrice * 0.95)
        : bagPrice;
      // Keep the weekly flat rate in step with the daily price when the price is changed
      if (bagPrice !== toNum(initial.pricePerBagPerDay)) {
        payload.priceWeeklyFlat = Math.round(bagPrice * 7);
      }
    }

    // Fields that aren't on your hub document yet: only sent when filled in
    if (formData.nearestLandmark)
      payload.nearestLandmark = formData.nearestLandmark;
    if (formData.drivingDirections)
      payload.drivingDirections = formData.drivingDirections;
    if (formData.serviceFee !== "")
      payload.serviceFee = toNum(formData.serviceFee);
    if (formData.initialDeposit !== "")
      payload.initialDeposit = toNum(formData.initialDeposit);

    // Only send status fields when they actually changed, so we don't
    // trigger a status-change entry in the activity log on every save.
    if (formData.verificationStatus !== initial.verificationStatus) {
      payload.verificationStatus = formData.verificationStatus;
    }
    if (formData.status !== initial.status) {
      payload.status = formData.status;
    }

    try {
      const hubId = hub?._id || hub?.id || hub?.hubId;

      if (!hubId) {
        console.error("Hub ID missing! Received hub:", hub);
        notifyError("Hub ID could not be found.");
        return;
      }

      // 1. Save hub details
      let updatedHub: any;
      try {
        const response = await editStorageHubDetailApi(hubId, payload);

        // Merge into the existing hub so images, documents, activityLog etc.
        // are never wiped from parent state if the API returns a partial object.
        const returned = response?.data?.data ?? response?.data;
        updatedHub = {
          ...hub,
          ...payload,
          ...(returned && typeof returned === "object" ? returned : {}),
        };
        notifySuccess(getSuccessMessage(response, "Hub updated successfully"));
      } catch (error: any) {
        console.error("Failed to update hub:", error);
        notifyError(
          getErrorMessage(error, "Failed to update hub. Please try again."),
        );
        return;
      }

      // 2. Upload any selected documents one by one
      const failedUploads: string[] = [];
      let uploadedCount = 0;
      for (const file of files) {
        try {
          const body = new FormData();
          body.append("file", file);
          const uploadRes = await uploadVerificationDocumentsApi(hubId, body);
          const uploaded = uploadRes?.data?.data ?? uploadRes?.data;
          if (uploaded && typeof uploaded === "object" && uploaded._id) {
            updatedHub = { ...updatedHub, ...uploaded };
          }
          uploadedCount += 1;
        } catch (uploadError) {
          console.error(`Failed to upload ${file.name}:`, uploadError);
          failedUploads.push(file.name);
          notifyError(
            `${file.name}: ${getErrorMessage(uploadError, "upload failed")}`,
          );
        }
      }
      if (uploadedCount > 0) {
        notifySuccess(
          `${uploadedCount} document${uploadedCount > 1 ? "s" : ""} uploaded successfully`,
        );
      }

      await onSave(updatedHub);

      if (failedUploads.length) {
        // Hub details were saved; keep the modal open with only the files that failed
        setFiles((prev) => prev.filter((f) => failedUploads.includes(f.name)));
        return;
      }

      onClose();
    } catch (error: any) {
      console.error("Unexpected error while saving hub:", error);
      notifyError(
        getErrorMessage(error, "Something went wrong. Please try again."),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Make sure the saved value always appears in a select, even if it isn't in the preset list
  const stateOptions =
    NIGERIAN_STATES.includes(formData.state) || !formData.state
      ? NIGERIAN_STATES
      : [formData.state, ...NIGERIAN_STATES];
  const storageTypeOptions = Array.from(
    new Set(
      ["Dry Storage", "Hermetic Hub", formData.storageType].filter(Boolean),
    ),
  );
  const unitOptions = Array.from(
    new Set(["bags", "crates", formData.unitType].filter(Boolean)),
  );
  const availableCropOptions = CROP_OPTIONS.filter(
    (c) => !formData.supportedCrops.includes(c),
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 sm:p-6 animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between bg-white shrink-0">
          <div>
            <h2 className="text-base font-bold text-stone-900">Edit Hub</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Update the details, facility information and status of this
              storage hub
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 overflow-y-auto text-xs text-stone-800"
        >
          {/* Top Status Selectors */}
          <div className="grid grid-cols-2 gap-4 pb-2">
            <div>
              <label className="flex items-center gap-2 font-semibold text-stone-700 mb-1.5">
                <ShieldCheck className="h-4 w-4 text-[#1B4D3E]" />
                Verification Status
              </label>
              <select
                name="verificationStatus"
                value={formData.verificationStatus}
                onChange={handleChange}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-800 font-medium"
              >
                <option value="verified">Verified</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 font-semibold text-stone-700 mb-1.5">
                <Power className="h-4 w-4 text-[#1B4D3E]" />
                Hub Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-800 font-medium"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <SectionTitle icon={Info}>Basic Information</SectionTitle>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Hub Name*</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Hub Owner*</label>
                <input
                  type="text"
                  name="hubOwnerName"
                  required
                  value={formData.hubOwnerName}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Contact Person*</label>
                <input
                  type="text"
                  name="contactPersonName"
                  required
                  value={formData.contactPersonName}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Phone Number*</label>
                <input
                  type="text"
                  name="contactPhoneNumber"
                  required
                  value={formData.contactPhoneNumber}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Email Address*</label>
              <input
                type="email"
                name="contactEmail"
                required
                value={formData.contactEmail}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>About Facility*</label>
              <textarea
                name="aboutFacility"
                rows={4}
                required
                value={formData.aboutFacility}
                onChange={handleChange}
                className="w-full p-3 border border-stone-300 rounded-xl"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <SectionTitle icon={MapPin}>Location</SectionTitle>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>State*</label>
                <select
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="" disabled>
                    Select state
                  </option>
                  {stateOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>LGA*</label>
                <input
                  type="text"
                  name="lga"
                  required
                  value={formData.lga}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Address*</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nearest Landmark</label>
                <input
                  type="text"
                  name="nearestLandmark"
                  value={formData.nearestLandmark}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Distance from Landmark*</label>
                <input
                  type="text"
                  name="proximityText"
                  required
                  value={formData.proximityText}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Driving Directions</label>
              <input
                type="text"
                name="drivingDirections"
                value={formData.drivingDirections}
                onChange={handleChange}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Nearest Market*</label>
                <input
                  type="text"
                  name="specNearestMajorMarket"
                  required
                  value={formData.specNearestMajorMarket}
                  onChange={handleChange}
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>GPS Coordinates*</label>
                <div className="relative">
                  <input
                    type="text"
                    name="gps"
                    required
                    placeholder="7.3775, 3.947"
                    value={formData.gps}
                    onChange={handleChange}
                    className={`${inputCls} pr-10`}
                  />
                  <button
                    type="button"
                    onClick={useCurrentLocation}
                    title="Use current location"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 cursor-pointer"
                  >
                    <LocateFixed className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Information */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <SectionTitle icon={Info}>Storage Information</SectionTitle>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Storage Type*</label>
                <select
                  name="storageType"
                  required
                  value={formData.storageType}
                  onChange={handleChange}
                  className={inputCls}
                >
                  <option value="" disabled>
                    Select storage type
                  </option>
                  {storageTypeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Configured Capacity*</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="totalCapacity"
                    required
                    min={0}
                    value={formData.totalCapacity}
                    onChange={handleChange}
                    className="w-3/5 p-2.5 border border-stone-300 rounded-xl bg-white"
                  />
                  <select
                    name="unitType"
                    required
                    value={formData.unitType}
                    onChange={handleChange}
                    className="w-2/5 p-2.5 border border-stone-300 rounded-xl bg-white capitalize"
                  >
                    {unitOptions.map((u) => (
                      <option key={u} value={u} className="capitalize">
                        {u.charAt(0).toUpperCase() + u.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Storage Requirement */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <SectionTitle icon={Warehouse}>Storage Requirement</SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-stone-200 rounded-2xl bg-stone-50/50 space-y-3">
                <span className="font-bold text-stone-900 block mb-2">
                  Storage Environment
                </span>
                {FEATURE_OPTIONS.map((label) => (
                  <label
                    key={label}
                    className="flex items-center gap-2.5 text-stone-700 cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={formData.features.includes(label)}
                      onChange={() => handleFeatureChange(label)}
                      className="w-4 h-4 rounded border-stone-300 accent-[#1B4D3E] cursor-pointer"
                    />
                    <span className="font-medium text-xs">{label}</span>
                  </label>
                ))}
              </div>

              <div className="p-4 border border-stone-200 rounded-2xl bg-stone-50/50 flex flex-col gap-3">
                <span className="font-bold text-stone-900 block">
                  Supported Crops
                </span>

                <select
                  value=""
                  onChange={(e) => addCrop(e.target.value)}
                  className="w-full p-2.5 bg-white border border-stone-300 rounded-xl text-stone-700"
                >
                  <option value="" disabled>
                    Select crops
                  </option>
                  {availableCropOptions.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-1.5">
                  {formData.supportedCrops?.map((crop: string) => (
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
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                {showCustomCrop ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={customCrop}
                      placeholder="Type a crop"
                      onChange={(e) => setCustomCrop(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCrop(customCrop);
                          setCustomCrop("");
                        }
                      }}
                      className="w-full p-2.5 bg-white border border-stone-300 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        addCrop(customCrop);
                        setCustomCrop("");
                      }}
                      className="px-4 py-2.5 border border-stone-300 rounded-xl font-semibold text-stone-700 bg-white hover:bg-stone-50 cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowCustomCrop(true)}
                    className="self-start text-[#1B4D3E] font-medium hover:underline cursor-pointer"
                  >
                    + Add more
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Pricing & Discounts */}
          <div className="space-y-4 pt-2 border-t border-stone-200">
            <SectionTitle icon={CreditCard}>Pricing & Discounts</SectionTitle>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 border border-stone-200 rounded-2xl bg-stone-50/50 space-y-4">
                <span className="font-bold text-stone-900 block">Pricing</span>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Per Bag/ Day*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
                        ₦
                      </span>
                      <input
                        type="number"
                        name="pricePerBagPerDay"
                        required
                        min={0}
                        value={formData.pricePerBagPerDay}
                        onChange={handleChange}
                        className={`${inputCls} pl-7`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Per Crate/ Day*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500">
                        ₦
                      </span>
                      <input
                        type="number"
                        name="pricePerCratePerDay"
                        required
                        min={0}
                        value={formData.pricePerCratePerDay}
                        onChange={handleChange}
                        className={`${inputCls} pl-7`}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Service fee</label>
                    <div className="flex">
                      <input
                        type="number"
                        name="serviceFee"
                        min={0}
                        step="any"
                        value={formData.serviceFee}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-l-xl"
                      />
                      <span className="px-3 flex items-center bg-stone-200 border border-l-0 border-stone-300 rounded-r-xl text-stone-600">
                        %
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Initial Deposit</label>
                    <div className="flex">
                      <input
                        type="number"
                        name="initialDeposit"
                        min={0}
                        step="any"
                        value={formData.initialDeposit}
                        onChange={handleChange}
                        className="w-full p-2.5 bg-white border border-stone-300 rounded-l-xl"
                      />
                      <span className="px-3 flex items-center bg-stone-200 border border-l-0 border-stone-300 rounded-r-xl text-stone-600">
                        %
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-stone-500 block">
                  % charged on the total booking
                </span>
              </div>

              <div className="p-4 border border-stone-200 rounded-2xl bg-stone-50/50 flex flex-col justify-between">
                <div className="space-y-4">
                  <span className="font-bold text-stone-900 block">
                    Discount Rules
                  </span>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bulkDiscount}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          bulkDiscount: !prev.bulkDiscount,
                        }))
                      }
                      className="w-4 h-4 mt-0.5 rounded border-stone-300 accent-[#1B4D3E] cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Bulk Discount
                      </span>
                      <span className="text-[11px] text-stone-500">
                        5% for 100+ bags/crates
                      </span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.longTermDiscount}
                      onChange={() =>
                        setFormData((prev) => ({
                          ...prev,
                          longTermDiscount: !prev.longTermDiscount,
                        }))
                      }
                      className="w-4 h-4 mt-0.5 rounded border-stone-300 accent-[#1B4D3E] cursor-pointer"
                    />
                    <div>
                      <span className="font-bold text-stone-900 block">
                        Long-term Discount
                      </span>
                      <span className="text-[11px] text-stone-500">
                        8% for 100+ bags/crates longer than a month
                      </span>
                    </div>
                  </label>
                </div>
                <span className="text-[11px] text-stone-500 block mt-3">
                  Highest eligible discount only**
                </span>
              </div>
            </div>

            <div className="px-4 py-2.5 rounded-lg bg-[#E3EDE6] text-[#1B4D3E]">
              Discounts are automatically applied during booking based on the
              eligible criteria
            </div>
          </div>

          {/* Upload Documents */}
          <div className="space-y-2 pt-2 border-t border-stone-200">
            <SectionTitle icon={Upload}>
              Upload Documents (Optional)
            </SectionTitle>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                addFiles(e.target.files);
                e.target.value = ""; // allow re-selecting the same file
              }}
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-stone-400 gap-2 cursor-pointer transition-colors ${
                isDragging
                  ? "border-[#1B4D3E] bg-[#E3EDE6]/50"
                  : "border-stone-300 bg-stone-50/50"
              }`}
            >
              <Upload className="h-8 w-8 text-stone-400" />
              <span className="text-stone-700 font-medium text-center">
                Drag & drop or click to upload
              </span>
              <span className="text-[11px] text-stone-500">
                PDF, JPG, PNG formats (Max 10MB)
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-1 px-4 py-1.5 border border-stone-300 rounded-full text-stone-700 bg-white hover:bg-stone-50 cursor-pointer"
              >
                Browse file
              </button>
            </div>

            {files.length > 0 && (
              <ul className="space-y-1.5 pt-1">
                {files.map((file, index) => (
                  <li
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between gap-3 px-3 py-2 border border-stone-200 rounded-xl bg-stone-50/50"
                  >
                    <span className="truncate text-stone-800 font-medium">
                      {file.name}
                    </span>
                    <span className="flex items-center gap-3 shrink-0 text-stone-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-stone-300 rounded-xl font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#1B4D3E] text-white rounded-xl font-semibold hover:bg-[#153e31] flex items-center gap-2 cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Save changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditHubModal({
  hub,
  isOpen,
  onClose,
  onSave,
}: {
  hub: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedData: any) => Promise<void>;
}) {
  if (!isOpen) return null;

  // Changing the key remounts the form so it re-prefills from the latest hub data
  return (
    <EditHubModalForm
      key={`${hub?._id ?? hub?.id ?? "hub"}-${hub?.updatedAt ?? ""}`}
      hub={hub}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
