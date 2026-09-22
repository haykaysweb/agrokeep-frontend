import { Mail } from "lucide-react";
import { useState } from "react";
import {
  emailBookingSchema,
  type EmailBookingFormValues,
} from "@/lib/SchemaTypes";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface AdminBookingContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  farmerName: string;
  bookingRef: string;
  hubName: string;
  phoneNumber: string;
  email: string;
  // onSendSms?: (message: string) => Promise<void> | void;
  onSendEmail?: (payload: EmailBookingFormValues) => Promise<void> | void;
}

type ContactView = "hub" | "call" | "sms" | "email";

export default function AdminBookingContactModal({
  isOpen,
  onClose,
  farmerName,
  bookingRef,
  hubName,
  phoneNumber,
  email,
  // onSendSms,
  onSendEmail,
}: AdminBookingContactModalProps) {
  const [view, setView] = useState<ContactView>("hub");
  const [smsMessage, setSmsMessage] = useState("");

  const [template, setTemplate] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEmailDropdownOpen, setIsEmailDropdownOpen] = useState(false);
  const [emailTemplate, setEmailTemplate] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EmailBookingFormValues>({
    resolver: zodResolver(emailBookingSchema),
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      subject: "Re: Storage Booking Update",
      message: "",
    },
  });

  const watchedMessage = useWatch({ control, name: "message" }) || "";

  if (!isOpen) return null;

  const onSubmitEmail = async (data: EmailBookingFormValues) => {
    if (onSendEmail) {
      await onSendEmail(data);
    }
    handleResetAndClose();
  };

  const handleResetAndClose = () => {
    setView("hub");
    setSmsMessage("");
    setEmailTemplate("");
    setTemplate("");
    reset();
    onClose();
  };

  const firstName = farmerName?.split(" ")[0] || "Farmer";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-surface-card rounded-2xl p-4 sm:p-6 w-[95%] sm:w-full max-w-lg border border-card-border shadow-xl relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-6 right-6 text-text-main p-1 text-2xl cursor-pointer font-bold leading-none rounded-lg hover:bg-surface-alt/20 transition-colors"
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Modal Header */}
        <div className="mb-6 pr-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-text-main leading-snug">
            Contact {farmerName}
          </h3>
          <p className="text-sm text-text-muted mt-1.5 leading-normal">
            Booking - {bookingRef} &bull; {hubName}
          </p>
        </div>

        {/* VIEW 1: Hub Selection / Main Options */}
        {view === "hub" && (
          <div className="space-y-3.5">
            <button
              onClick={() => setView("call")}
              className="w-full py-3.5 px-4 border border-card-border text-text-main font-medium rounded-2xl hover:bg-brand-primary hover:text-white hover:border-transparent transition-all duration-200 text-base cursor-pointer text-center"
            >
              Call {farmerName.split(" ")[0]}
            </button>
            <button
              onClick={() => setView("sms")}
              className="w-full py-3.5 px-4 border border-card-border text-text-main font-medium rounded-2xl hover:bg-brand-primary hover:text-white hover:border-transparent transition-all duration-200 text-base cursor-pointer text-center"
            >
              Send SMS Update
            </button>
            <button
              onClick={() => setView("email")}
              className="w-full py-3.5 px-4 border border-card-border text-text-main font-medium rounded-2xl hover:bg-brand-primary hover:text-white hover:border-transparent transition-all duration-200 text-base cursor-pointer text-center"
            >
              Send Email Update
            </button>
          </div>
        )}

        {/* VIEW 2: Call Confirmation */}
        {view === "call" && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 p-4 border border-border-input rounded-2xl ">
              <img src="/Phone Rounded.svg" alt="phone-icon" />
              <div className="flex flex-col text-text-main font-medium ">
                <label className="text-sm font-medium text-text-main block">
                  Phone Number
                </label>
                <p className="text-xs font-medium text-text-muted">
                  {phoneNumber}
                </p>
              </div>
            </div>
            <div className="flex items-end justify-end gap-3 pt-2">
              <a
                href={`tel:${phoneNumber.replace(/\s+/g, "")}`}
                className="py-1 px-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors text-center cursor-pointer"
              >
                Call now
              </a>
              <button
                onClick={() => setView("hub")}
                className="py-1 px-2 border border-border-base text-text-main  rounded-xl hover:bg-backgroundTwo transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* VIEW 3: Send SMS Update */}
        {view === "sms" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 p-4 border border-border-input rounded-2xl ">
              <img src="/Phone Rounded.svg" alt="phone-icon" />
              <div className="flex flex-col text-text-main font-medium ">
                <label className="text-sm font-medium text-text-main block">
                  Phone Number
                </label>
                <p className="text-xs font-medium text-text-muted">
                  {phoneNumber}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-main block mb-1.5">
                Quick Templates
              </label>
              <div className="relative">
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3.5 py-2.5 pr-10 border border-border-input rounded-xl text-sm text-text-main bg-surface-card flex items-center justify-between focus:outline-none focus:border-brand-primary text-left cursor-pointer"
                >
                  <span className="truncate">
                    {template ===
                    "Your crop storage update is ready for review at the hub."
                      ? "Storage Update Notification"
                      : template ===
                          "Please note your storage duration is nearing completion."
                        ? "Duration Notice"
                        : template === "storage_update"
                          ? "Storage Booking Status Report"
                          : "Select a template"}
                  </span>
                </button>

                {/* Rotating SVG Icon */}
                <div
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted transition-transform duration-200 ${
                    isDropdownOpen ? "rotate-180 text-brand-primary" : ""
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-surface-card border border-border-input rounded-xl shadow-lg overflow-hidden py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setTemplate("");
                        setSmsMessage("");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm text-text-muted hover:bg-backgroundTwo transition-colors cursor-pointer"
                    >
                      Select a template
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const val =
                          "Your crop storage update is ready for review at the hub.";
                        setTemplate(val);
                        setSmsMessage(val);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm text-text-main hover:bg-backgroundTwo transition-colors cursor-pointer"
                    >
                      Storage Update Notification
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const val =
                          "Please note your storage duration is nearing completion.";
                        setTemplate(val);
                        setSmsMessage(val);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm text-text-main hover:bg-backgroundTwo transition-colors cursor-pointer"
                    >
                      Duration Notice
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-main block mb-1.5">
                Message
              </label>
              <textarea
                rows={4}
                maxLength={160}
                value={smsMessage}
                onChange={(e) => setSmsMessage(e.target.value)}
                placeholder="Type here..."
                className="w-full px-3.5 py-2.5 border border-border-input rounded-xl text-sm text-text-main bg-surface-card focus:outline-none focus:border-brand-primary resize-none"
              />
              <div className="text-right text-xs text-text-muted mt-1">
                {smsMessage.length}/160
              </div>
            </div>

            <div className="flex items-end justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  alert(`SMS sent to ${phoneNumber}`);
                  handleResetAndClose();
                }}
                className=" py-1 px-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors cursor-pointer"
              >
                Send SMS
              </button>
              <button
                onClick={() => setView("hub")}
                className=" py-1 px-2 border border-border-base text-text-main  rounded-xl hover:bg-backgroundTwo transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* VIEW 4: Send Email Update */}
        {view === "email" && (
          <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-4">
            <div className="flex items-center gap-2 p-4 border border-border-input rounded-2xl ">
              <Mail className="text-brand-primary" />
              <div className="flex flex-col text-text-main font-medium ">
                <label className="text-sm font-medium text-text-main block">
                  Email Address
                </label>
                <p className="text-xs font-medium text-text-muted">{email}</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-main block mb-1.5">
                Quick Templates
              </label>
              <div className="relative">
                {/* Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsEmailDropdownOpen(!isEmailDropdownOpen)}
                  className="w-full px-3.5 py-2.5 pr-10 border border-border-input rounded-xl text-sm text-text-main bg-surface-card flex items-center justify-between focus:outline-none focus:border-brand-primary text-left cursor-pointer"
                >
                  <span className="truncate">
                    {emailTemplate === "storage_update"
                      ? "Storage Booking Status Report"
                      : "Select a template"}
                  </span>
                </button>

                {/* Rotating SVG Icon */}
                <div
                  onClick={() => setIsEmailDropdownOpen(!isEmailDropdownOpen)}
                  className={`absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted transition-transform duration-200 ${
                    isEmailDropdownOpen ? "rotate-180 text-brand-primary" : ""
                  }`}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>

                {/* Dropdown Menu */}
                {isEmailDropdownOpen && (
                  <div className="absolute z-20 mt-1 w-full bg-surface-card border border-border-input rounded-xl shadow-lg overflow-hidden py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEmailTemplate("storage_update");
                        setValue(
                          "message",
                          `Dear ${firstName}, here is your comprehensive storage booking status report.`,
                          { shouldValidate: true },
                        );
                        setValue("subject", `Storage Report - ${bookingRef}`, {
                          shouldValidate: true,
                        });
                        setIsEmailDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm text-text-muted hover:bg-backgroundTwo transition-colors cursor-pointer"
                    >
                      Select a template
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEmailTemplate("storage_update");
                        setValue(
                          "message",
                          `Dear ${firstName}, here is your comprehensive storage booking status report.`,
                          { shouldValidate: true },
                        );
                        setValue("subject", `Storage Report - ${bookingRef}`);
                        setIsEmailDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-sm text-text-main hover:bg-backgroundTwo transition-colors cursor-pointer"
                    >
                      Storage Booking Status Report
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-main block mb-1.5">
                Subject
              </label>
              <input
                type="text"
                {...register("subject")}
                placeholder="Enter email subject"
                className="w-full px-3.5 py-2.5 border border-border-input rounded-xl text-sm text-text-main bg-surface-card focus:outline-none focus:border-brand-primary"
              />
            </div>
            {errors.subject && (
              <p className="text-xs text-semantic-error mt-1">
                {errors.subject.message}
              </p>
            )}

            <div>
              <label className="text-xs font-medium text-text-main block mb-1.5">
                Message
              </label>
              <textarea
                rows={5}
                maxLength={1000}
                {...register("message")}
                placeholder="Type here..."
                className="w-full px-3.5 py-2.5 border border-border-input rounded-xl text-sm text-text-main bg-surface-card focus:outline-none focus:border-brand-primary resize-none"
              />

              <div className="text-right text-xs text-text-muted mt-1">
                {watchedMessage.length}/1000
              </div>
            </div>
            {errors.message && (
              <p className="text-xs text-semantic-error mt-1">
                {errors.message.message}
              </p>
            )}

            <div className="flex items-end justify-end gap-3 pt-2">
              <button
                type="submit"

                disabled={isSubmitting}
                className="py-1 px-2 bg-brand-primary text-white rounded-xl hover:bg-brand-primary/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Email"}
              </button>
              <button
                type="button"
                onClick={() => setView("hub")}
                disabled={isSubmitting}
                className="py-1 px-2 border border-border-base text-text-main rounded-xl hover:bg-backgroundTwo transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
