import { Mail, Phone, X, Copy, UserCheck, UserX } from "lucide-react";
import { showToast } from "@/utils/CustomToast";

interface AdminBookingViewProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmer: {
    userId: string | null;
    fullName: string;
    phoneNumber: string;
    email: string;
  };
  bookingRef: string;
  hubName: string;
  bookingStatus: string;
}

export default function AdminBookingViewProfileModal({
  isOpen,
  onClose,
  farmer,
  bookingRef,
  hubName,
  bookingStatus,
}: AdminBookingViewProfileModalProps) {
  if (!isOpen) return null;

  const initials = farmer.fullName
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const isRegistered = Boolean(farmer.userId);

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showToast.success(`${label} copied`);
    } catch {
      showToast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-surface-card rounded-2xl p-6 w-full max-w-md border border-card-border shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-main p-1 rounded-lg hover:bg-background-subtle transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header: Avatar + Name + Registration Badge */}
        <div className="flex flex-col items-center text-center gap-3 pt-2">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-xl font-bold text-brand-primary">
            {initials}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-text-main">
              {farmer.fullName}
            </h2>

            <span
              className={`inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                isRegistered
                  ? "bg-brand-primary/10 text-brand-primary"
                  : "bg-background-subtle text-text-subtle"
              }`}
            >
              {isRegistered ? (
                <UserCheck className="w-3 h-3" />
              ) : (
                <UserX className="w-3 h-3" />
              )}
              {isRegistered ? "Registered Customer" : "Guest Booking"}
            </span>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-6 space-y-2">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
            Contact
          </p>

          <div className="flex items-center justify-between bg-background-subtle rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <Phone className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-sm text-text-main truncate">
                {farmer.phoneNumber}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(farmer.phoneNumber, "Phone number")}
                className="p-1.5 rounded-md hover:bg-surface-card text-text-muted hover:text-text-main transition-colors cursor-pointer"
                aria-label="Copy phone number"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() =>
                  window.open(`tel:${farmer.phoneNumber}`, "_blank")
                }
                className="px-3.5 py-1 rounded-md text-xs font-medium bg-brand-primary text-text-light hover:opacity-90 transition-opacity cursor-pointer"
              >
                Call
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-background-subtle rounded-lg px-3 py-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="w-4 h-4 text-text-muted shrink-0" />
              <span className="text-sm text-text-main truncate">
                {farmer.email}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => handleCopy(farmer.email, "Email")}
                className="p-1.5 rounded-md hover:bg-surface-card text-text-muted hover:text-text-main transition-colors cursor-pointer"
                aria-label="Copy email"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => window.open(`mailto:${farmer.email}`, "_blank")}
                className="px-2.5 py-1 rounded-md text-xs font-medium border border-border-input text-text-main hover:bg-surface-card transition-colors cursor-pointer"
              >
                Email
              </button>
            </div>
          </div>
        </div>

        {/* Current Booking Context */}
        <div className="mt-6 space-y-2">
          <p className="text-xs font-medium text-text-muted uppercase tracking-wide">
            This Booking
          </p>

          <div className="bg-background-subtle rounded-lg px-3 py-2.5 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-text-muted">Booking Ref</span>
              <span className="font-medium text-text-main">{bookingRef}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Storage Hub</span>
              <span className="font-medium text-text-main truncate max-w-[60%] text-right">
                {hubName}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">Status</span>
              <span className="font-medium text-text-main capitalize">
                {bookingStatus.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>

        {/* Placeholder for richer profile data, once available */}
        {isRegistered && (
          <p className="mt-6 text-[11px] text-text-muted text-center italic">
            Full booking history and account stats for this customer aren't
            available here yet.
          </p>
        )}
      </div>
    </div>
  );
}
