/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { MapPin, Phone, Mail, Navigation, X, Loader2 } from "lucide-react";
import { contactStorageHubOwnerApi } from "@/api/adminStorage";

export default function StorageLocationTab({ hub }: { hub: any }) {
  console.log("Location & Contact Data:", hub);

  const [isMainModalOpen, setIsMainModalOpen] = useState(false);
  const [modalView, setModalView] = useState<"menu" | "email">("menu");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loc = hub?.locationContact || {};
  const owner = hub?.owner || {};

  // Mapped accurately from hub.locationContact and hub owner fields
  const hubOwnerName = loc.hubOwnerName || owner.name || hub?.name || "N/A";
  const contactName =
    loc.contactPersonName ||
    owner.name ||
    owner.contactPerson ||
    hub?.name ||
    "Hub Contact";
  const contactPhone =
    loc.contactPhoneNumber ||
    owner.phone ||
    owner.phoneNumber ||
    loc.phone ||
    "N/A";
  const contactEmail = loc.contactEmail || owner.email || loc.email || "N/A";

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const hubId = hub?.id || hub?._id;

    if (!hubId) {
      alert("Hub ID is missing from the hub object.");
      console.error("Missing Hub ID, full hub object:", hub);
      return;
    }

    setIsSubmitting(true);

    try {
      const response: any = await contactStorageHubOwnerApi(hubId, {
        subject,
        message,
      });

      console.log("Contact API Raw Response:", response);
      const responseData = response?.data || response;
      console.log("Contact API Response Data:", responseData);

      if (responseData?.success !== false) {
        alert(responseData?.message || "Email sent successfully!");
        setSubject("");
        setMessage("");
        setIsMainModalOpen(false);
        setModalView("menu");
      } else {
        alert(
          responseData?.message || "Failed to send email. Please try again.",
        );
      }
    } catch (error: any) {
      console.error("Contact Hub Error Object:", error);
      console.error("Contact Hub Error Response Data:", error?.response?.data);
      alert(
        error?.response?.data?.message ||
          error?.message ||
          "An error occurred while sending the email.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      {/* Location Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-base font-bold text-stone-900">Location</h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Map Preview Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-stone-200/80 p-5 shadow-xs flex flex-col gap-4">
            <div className="relative w-full h-[280px] rounded-xl overflow-hidden bg-[#D8E2DC] flex items-center justify-center">
              {/* Simulated Map Visual */}
              <div className="absolute inset-0 opacity-80 bg-[radial-gradient(#C4D4C8_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200/40 to-amber-100/30" />
              <div className="relative bg-amber-600 text-white p-3 rounded-full shadow-lg animate-bounce">
                <MapPin className="h-6 w-6" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs">
              <div className="flex items-start gap-2.5">
                <Navigation className="h-4 w-4 text-stone-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 block">
                    Driving directions
                  </span>
                  <span className="text-stone-500">
                    {loc.proximityText ||
                      loc.drivingDirections ||
                      "Off Old Oyo Rd, 2.4 km from Challenge interchange"}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 text-stone-500 mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-stone-900 block">
                    Nearest markets
                  </span>
                  <span className="text-stone-500 whitespace-pre-line">
                    {loc.nearestMarkets ||
                      "Challenge Central - 6.2 km (12 mins)\nDugbe Market - 8km (15 mins)"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details Side Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 font-medium">State</span>
                <span className="font-bold text-stone-900 text-sm">
                  {loc.state || "Oyo"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 font-medium">LGA</span>
                <span className="font-bold text-stone-900 text-sm">
                  {loc.lga || "Ibadan North"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 font-medium">Adress</span>
                <span className="font-bold text-stone-900 text-sm">
                  {loc.address || "KM 4 Lagos Ibadan exp. Oyo State"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 font-medium">
                  Nearest Landmark
                </span>
                <span className="font-bold text-stone-900 text-sm">
                  {loc.nearestLandmark || "Town Centre"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-stone-400 font-medium">
                  Distance from Nearest Landmark
                </span>
                <span className="font-bold text-stone-900 text-sm">
                  {loc.distanceFromLandmark || "8km from Town Centre"}
                </span>
              </div>
            </div>

            <button className="w-full mt-6 py-2.5 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 hover:bg-stone-50 transition-colors cursor-pointer">
              View on map
            </button>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="flex flex-col gap-4 mt-4">
        <h2 className="text-base font-bold text-stone-900">Contact</h2>
        <div className="bg-white rounded-2xl border border-stone-200/80 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs">
            <div className="flex flex-col gap-1">
              <span className="text-stone-400 font-medium">Hub Owner</span>
              <span className="font-bold text-stone-900 text-sm">
                {hubOwnerName}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-stone-400 font-medium">Contact Person</span>
              <span className="font-bold text-stone-900 text-sm">
                {contactName}
              </span>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-stone-600">
                <span className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-stone-400" />{" "}
                  {contactPhone}
                </span>
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-stone-400" /> {contactEmail}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setModalView("menu");
              setIsMainModalOpen(true);
            }}
            className="bg-[#1B4D3E] hover:bg-[#153e31] text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer shrink-0"
          >
            Contact Hub
          </button>
        </div>
      </div>

      {/* Contact Hub Modal (Multi-step mapping dynamic phone & email) */}
      {isMainModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-stone-200 max-w-lg w-full p-6 shadow-2xl flex flex-col gap-6 animate-fadeIn">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Contact {contactName}
                </h3>
                <div className="flex items-center gap-4 text-xs text-stone-500 mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {contactPhone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {contactEmail}
                  </span>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsMainModalOpen(false);
                  setModalView("menu");
                }}
                className="text-stone-400 hover:text-stone-700 cursor-pointer p-1"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* View 1: Action Menu (Call or Send Email) */}
            {modalView === "menu" && (
              <div className="flex flex-col gap-3 py-4">
                <a
                  href={`tel:${contactPhone}`}
                  className="w-full py-3 bg-[#1B4D3E] hover:bg-[#153e31] text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <Phone className="h-4 w-4" />
                  <span>Call {contactName}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setModalView("email")}
                  className="w-full py-3 bg-white border border-stone-200 hover:bg-stone-50 text-stone-800 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Mail className="h-4 w-4 text-stone-500" />
                  <span>Send Email</span>
                </button>
              </div>
            )}

            {/* View 2: Send Email Form */}
            {modalView === "email" && (
              <form
                onSubmit={handleSendMessage}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-medium text-stone-700">
                    Quick Templates
                  </label>
                  <select
                    onChange={(e) => {
                      if (e.target.value) setSubject(e.target.value);
                    }}
                    defaultValue=""
                    className="w-full p-3 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E] text-stone-800 text-xs"
                  >
                    <option value="" disabled>
                      Select a template
                    </option>
                    <option value="Re: Storage Booking Update">
                      Re: Storage Booking Update
                    </option>
                    <option value="Re: Storage Hub Verification">
                      Re: Storage Hub Verification
                    </option>
                    <option value="Inquiry Regarding Facility Capacity">
                      Inquiry Regarding Facility Capacity
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <label className="font-medium text-stone-700">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Re: Storage Booking Update"
                    className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E] text-stone-800 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <label className="font-medium text-stone-700">
                      Message
                    </label>
                    <span className="text-[10px] text-stone-400">
                      {message.length}/1000
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    required
                    maxLength={1000}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type here..."
                    className="w-full p-3 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 focus:border-[#1B4D3E] text-stone-800 text-xs"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalView("menu")}
                    className="px-4 py-2 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50 cursor-pointer"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 bg-[#1B4D3E] hover:bg-[#153e31] text-white px-5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Email</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
