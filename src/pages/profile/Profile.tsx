import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  ShieldCheck,
  Lock,
  LogOut,
  Phone,
  HelpCircle,
  X,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changePassword,
  deleteAvatar,
  getUserProfile,
  updateProfile,
  uploadAvatar,
} from "@/api/profile";
import { showToast } from "@/utils/CustomToast";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router";

export default function Profile() {
  const { user: authUser, setUser } = useAuth();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    data: responseData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
  });

  // Extract nested user and stats based on the API response structure
  const user = responseData?.user || responseData;
  const stats = responseData?.stats || user?.stats;

  // Toggle states for notification preferences
  const [bookingUpdates, setBookingUpdates] = useState(true);
  const [paymentNotifications, setPaymentNotifications] = useState(true);
  const [reminderAlerts, setReminderAlerts] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Form input states
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Feedback states
  const [profileError, setProfileError] = useState("");

  // Avatar Preview Modal States
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Change Password Modal States
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  // Eye visibility states for the three password fields
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Mutation for updating profile data
  const updateProfileMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      showToast.success(data?.message || "Profile updated successfully");
      setProfileError("");
      queryClient.invalidateQueries({
        queryKey: ["userProfile"],
      });
      queryClient.invalidateQueries({
        queryKey: ["currentUser"],
      });
    },
    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Failed to update profile.";
      showToast.error(message);
      setProfileError(message);
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatar,
    onSuccess: (response) => {
      showToast.success(response?.message || "Avatar uploaded successfully");
      setProfileError("");
      setIsAvatarModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);

      const updatedUser = response?.data;

      if (updatedUser?.avatarUrl) {
        // Update React Query profile cache
        queryClient.setQueryData(["userProfile"], (oldData: any) => {
          if (!oldData) return oldData;

          if (oldData.user) {
            return {
              ...oldData,
              user: {
                ...oldData.user,
                avatarUrl: updatedUser.avatarUrl,
              },
            };
          }
          return {
            ...oldData,
            avatarUrl: updatedUser.avatarUrl,
          };
        });

        // Update authenticated user immediately
        if (authUser) {
          setUser({
            ...authUser,
            avatarUrl: updatedUser.avatarUrl,
          });
        }
      }
      queryClient.invalidateQueries({
        queryKey: ["userProfile"],
      });
    },

    onError: (err: any) => {
      const message =
        err?.response?.data?.message || "Failed to upload avatar.";
      showToast.error(message);
      setProfileError("");
    },
  });

  const deleteAvatarMutation = useMutation({
    mutationFn: deleteAvatar,
    onSuccess: (response) => {
      showToast.success(response?.message || "Avatar removed successfully");
      setIsAvatarModalOpen(false);
      setProfileError("");
      // Clear avatarUrl from React Query profile cache immediately
      queryClient.setQueryData(["userProfile"], (oldData: any) => {
        if (!oldData) return oldData;

        if (oldData.user) {
          return {
            ...oldData,
            user: {
              ...oldData.user,
              avatarUrl: null,
            },
          };
        }
        return {
          ...oldData,
          avatarUrl: null,
        };
      });

      // Clear avatar from authenticated user immediately
      if (authUser) {
        setUser({
          ...authUser,
          avatarUrl: null,
        });
      }

      // Re-fetch profile data to keep everything in sync
      queryClient.invalidateQueries({
        queryKey: ["userProfile"],
      });
    },

    onError: (err: any) => {
      showToast.error(
        err?.response?.data?.message || "Failed to remove avatar.",
      );
    },
  });

  const handleDeleteAvatar = () => {
    deleteAvatarMutation.mutate();
  };

  // Mutation for changing password
  const passwordMutation = useMutation({
    mutationFn: changePassword,
    onSuccess: (data) => {
      setPasswordSuccess(data?.message || "Password updated successfully");
      setPasswordError("");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccess("");
      }, 2000);
    },
    onError: (err: any) => {
      setPasswordError(
        err?.response?.data?.message ||
          "Failed to update password. Please check your inputs.",
      );
      setPasswordSuccess("");
    },
  });

  // Sync state when profile data successfully loads
  useEffect(() => {
    if (user) {
      if (user.fullName) setFullName(user.fullName);
      if (user.phone) setPhone(user.phone);
      if (user.notificationPreferences) {
        if (user.notificationPreferences.bookingUpdates !== undefined)
          setBookingUpdates(user.notificationPreferences.bookingUpdates);
        if (user.notificationPreferences.paymentNotifications !== undefined)
          setPaymentNotifications(
            user.notificationPreferences.paymentNotifications,
          );
        if (user.notificationPreferences.reminderAlerts !== undefined)
          setReminderAlerts(user.notificationPreferences.reminderAlerts);
        if (user.notificationPreferences.smsNotifications !== undefined)
          setSmsNotifications(user.notificationPreferences.smsNotifications);
        if (user.notificationPreferences.emailNotifications !== undefined)
          setEmailNotifications(
            user.notificationPreferences.emailNotifications,
          );
      }
    }
  }, [user]);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setIsAvatarModalOpen(true);
    }
    // Reset file input value so selecting the same file triggers onChange again if needed
    e.target.value = "";
  };

  const handleConfirmUpload = () => {
    if (selectedFile) {
      uploadAvatarMutation.mutate(selectedFile);
    }
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({ fullName, phone });
  };

  // const handleSavePreferences = () => {
  //   updateProfileMutation.mutate({
  //     notificationPreferences: {
  //       bookingUpdates,
  //       paymentNotifications,
  //       reminderAlerts,
  //       smsNotifications,
  //       emailNotifications,
  //     },
  //   });
  // };

  const handleSaveAll = () => {
    updateProfileMutation.mutate({
      fullName,
      phone,
      notificationPreferences: {
        bookingUpdates,
        paymentNotifications,
        reminderAlerts,
        smsNotifications,
        emailNotifications,
      },
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    passwordMutation.mutate({ currentPassword, newPassword, confirmPassword });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />

          <h2 className="text-lg font-semibold text-text-main">
            Loading Profile...
          </h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">
          Failed to load profile data.
        </p>
      </div>
    );
  }
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-12 py-6 min-h-screen relative">
      {/* Top Header Section */}
      <div className="w-full mb-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          My Profile
        </h1>

        <p className="text-stone-500 text-sm mt-1">
          Keep your details up to date so hub managers can reach you quickly and
          we can match you with the right storage for every harvest.
        </p>

        {profileError && (
          <div className="mt-4 bg-red-50 text-red-600 text-xs p-3 rounded-xl font-medium max-w-md">
            {profileError}
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: User Card */}
        <div className="min-w-0 lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-stone-100 text-center space-y-6">
          <div className="flex flex-col items-center space-y-3">
            {/* Hidden file input for uploading */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />

            {/* Avatar container with upload overlay */}
            <div
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative group w-24 h-24 rounded-full overflow-visible border-2 border-stone-100 shadow-inner bg-brand-primary/10 flex items-center justify-center mx-auto cursor-pointer"
            >
              {/* Inner image or initials container */}
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-stone-100">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user?.fullName || "User"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-brand-primary">
                    {user?.fullName
                      ? user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "U"}
                  </span>
                )}
              </div>

              {/* Persistent Camera Badge (So they always know it's clickable for an upload) */}
              <div className="absolute bottom-0 right-0 bg-[#D9822B] text-white p-2 rounded-full shadow-md border-2 border-white flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="h-4 w-4" />
              </div>

              {/* Full Hover Overlay */}
              <div className="absolute inset-0 bg-black/40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 mb-0.5" />
                <span className="text-[10px] font-semibold">Edit</span>
              </div>
            </div>

            <div className="min-w-0 w-full">
              <h2 className="text-lg font-bold text-stone-900 break-words">
                {user?.fullName || "User"}
              </h2>

              <p className="text-xs text-stone-500 break-words">
                {user?.email || ""}
              </p>

              <p className="text-xs text-stone-400 flex items-center justify-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-[#1B4D3E] shrink-0" />
                <span className="break-words">
                  {user?.location || "Nigeria"}
                </span>
              </p>
            </div>

            <div className="max-w-full bg-emerald-50 text-[#1B4D3E] px-3 py-1 rounded-full text-[11px] font-semibold flex items-center justify-center gap-1 mt-1">
              <ShieldCheck className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                Member since{" "}
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "July 2026"}
              </span>
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl">
            <div className="text-center min-w-0">
              <span className="block text-lg font-bold text-stone-800 truncate">
                {stats?.totalBookings ?? 0}
              </span>

              <span className="block text-[10px] text-stone-400 font-medium truncate">
                Bookings
              </span>
            </div>

            <div className="text-center min-w-0 border-x border-stone-200">
              <span className="block text-lg font-bold text-stone-800 truncate">
                {stats?.hubsUsed ?? 0}
              </span>

              <span className="block text-[10px] text-stone-400 font-medium truncate">
                Hubs used
              </span>
            </div>

            <div className="text-center min-w-0">
              <span className="block text-lg font-bold text-stone-800 truncate">
                {stats?.totalStoredQuantity ?? 0}t
              </span>

              <span className="block text-[10px] text-stone-400 font-medium truncate">
                Stored
              </span>
            </div>
          </div>
          <Link to="/storage/bookings">
            <button className="w-full border-2 border-[#D9822B] hover:bg-orange-50 text-stone-900 py-3 rounded-full text-xs font-bold transition-colors">
              View My Bookings
            </button>
          </Link>
        </div>

        {/* Right Column: Information, Preferences & Security */}
        <div className="min-w-0 lg:col-span-8 space-y-6">
          {/* 1. Personal Information Section */}
          <form
            onSubmit={handleSavePersonalInfo}
            className="w-full min-w-0 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 space-y-6"
          >
            <div className="min-w-0">
              <h3 className="text-base font-bold text-stone-900">
                Personal Information
              </h3>

              <p className="text-xs text-stone-500">
                Used for booking confirmations and hub manager contact.
              </p>
            </div>

            <div className="space-y-4 min-w-0">
              <div className="min-w-0">
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full min-w-0 bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-0">
                <div className="min-w-0">
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Email Address{" "}
                    <span className="text-stone-400 text-[10px]">
                      (email can't be changed)
                    </span>
                  </label>

                  <input
                    type="email"
                    disabled
                    value={user?.email || ""}
                    className="w-full min-w-0 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-500 cursor-not-allowed"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full min-w-0 bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                  />
                </div>
              </div>
            </div>
          </form>

          {/* 2. Notification Preferences Section */}
          <div className="w-full min-w-0 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 space-y-6">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-stone-900">
                Notification Preferences
              </h3>

              <p className="text-xs text-stone-500">
                Choose how AgroKeep keeps you informed.
              </p>
            </div>

            <div className="divide-y divide-stone-100 space-y-4">
              {/* Booking Updates */}
              <div className="flex justify-between items-center gap-4 pt-3 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-stone-800">
                    Booking Updates
                  </p>

                  <p className="text-[11px] text-stone-400 break-words">
                    Confirmations, changes and hub messages
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setBookingUpdates(!bookingUpdates)}
                  className={`w-11 h-6 shrink-0 flex items-center rounded-full p-1 transition-colors ${
                    bookingUpdates ? "bg-[#1B4D3E]" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      bookingUpdates ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Payment Notifications */}
              <div className="flex justify-between items-center gap-4 pt-4 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-stone-800">
                    Payment Notifications
                  </p>

                  <p className="text-[11px] text-stone-400 break-words">
                    Deposits, balances and receipts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentNotifications(!paymentNotifications)}
                  className={`w-11 h-6 shrink-0 flex items-center rounded-full p-1 transition-colors ${
                    paymentNotifications ? "bg-[#1B4D3E]" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      paymentNotifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Reminder Alerts */}
              <div className="flex justify-between items-center gap-4 pt-4 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-stone-800">
                    Reminder Alerts
                  </p>

                  <p className="text-[11px] text-stone-400 break-words">
                    Drop-off and collection reminders
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setReminderAlerts(!reminderAlerts)}
                  className={`w-11 h-6 shrink-0 flex items-center rounded-full p-1 transition-colors ${
                    reminderAlerts ? "bg-[#1B4D3E]" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      reminderAlerts ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* SMS Notifications */}
              <div className="flex justify-between items-center gap-4 pt-4 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-stone-800">
                    SMS Notifications
                  </p>

                  <p className="text-[11px] text-stone-400 break-words">
                    Works without data
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSmsNotifications(!smsNotifications)}
                  className={`w-11 h-6 shrink-0 flex items-center rounded-full p-1 transition-colors ${
                    smsNotifications ? "bg-[#1B4D3E]" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      smsNotifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex justify-between items-center gap-4 pt-4 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-stone-800">
                    Email Notifications
                  </p>

                  <p className="text-[11px] text-stone-400 break-words">
                    Detailed summaries and receipts
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-11 h-6 shrink-0 flex items-center rounded-full p-1 transition-colors ${
                    emailNotifications ? "bg-[#1B4D3E]" : "bg-stone-300"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      emailNotifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* 3. Account Security Section */}
          <div className="w-full min-w-0 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Account Security
              </h3>

              <p className="text-xs text-stone-500">
                Keep your account protected.
              </p>
            </div>

            <div className="flex justify-between items-center gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-100 min-w-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-sm">
                  <Lock className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-800">Password</p>

                  <p className="text-[11px] text-stone-400 truncate">
                    {user?.passwordLastChanged || "Password never changed"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setPasswordError("");
                  setPasswordSuccess("");
                  setIsPasswordModalOpen(true);
                }}
                className="shrink-0 bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Log Out & Save All Actions */}
          <div className="flex justify-between items-center gap-4 pt-2">
            <button
              type="button"
              className="shrink-0 text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-1.5 px-2"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              disabled={updateProfileMutation.isPending}
              className="shrink-0 bg-[#D9822B] hover:bg-[#c47323] text-white px-8 py-3 rounded-full text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
            >
              {updateProfileMutation.isPending
                ? "Saving All..."
                : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Assistance Banner */}
      <div className="w-full mt-16 bg-[#1B4D3E] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row min-w-0">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <HelpCircle className="h-7 w-7 text-white" />
          </div>

          <div className="min-w-0">
            <h3 className="text-xl md:text-2xl font-bold">Need assistance?</h3>

            <p className="text-stone-200 text-xs md:text-sm mt-1">
              Our support team is available 7 days a week.
            </p>
          </div>
        </div>
        <Link to="/contact">
          <button
            type="button"
            className="shrink-0 bg-[#D9822B] hover:bg-[#c47323] text-white px-8 py-3.5 rounded-full text-xs font-bold shadow-md transition-colors flex items-center gap-2"
          >
            Contact Support
            <Phone className="h-3.5 w-3.5" />
          </button>
        </Link>
      </div>

      {/* Avatar Action Modal */}
      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 md:p-8 shadow-xl border border-stone-100 relative space-y-6 text-center">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-stone-900">
                {previewUrl ? "Preview New Avatar" : "Manage Profile Picture"}
              </h3>

              <button
                type="button"
                onClick={() => {
                  setIsAvatarModalOpen(false);
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-stone-100 shadow-md bg-stone-100 mx-auto flex items-center justify-center relative">
              {previewUrl || user?.avatarUrl ? (
                <img
                  src={previewUrl || user?.avatarUrl}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback gracefully if the image fails to load
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-stone-400 bg-brand-primary/10 w-full h-full">
                  <Camera className="h-8 w-8 mb-1 text-brand-primary/60" />
                  <span className="text-xs font-semibold text-stone-500">
                    {user?.fullName
                      ? user.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "Add Photo"}
                  </span>
                </div>
              )}
            </div>

            {!previewUrl ? (
              <div className="space-y-3 pt-1">
                <p className="text-xs text-stone-500 mb-2">
                  What would you like to do with your profile picture?
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setIsAvatarModalOpen(false);
                    fileInputRef.current?.click();
                  }}
                  className="w-full bg-[#D9822B] hover:bg-[#c47323] text-white py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors"
                >
                  Upload New Avatar
                </button>

                {user?.avatarUrl && (
                  <button
                    type="button"
                    onClick={handleDeleteAvatar}
                    disabled={deleteAvatarMutation.isPending}
                    className="w-full border border-red-200 text-red-600 hover:bg-red-50 py-2.5 rounded-full text-xs font-semibold transition-colors disabled:opacity-50"
                  >
                    {deleteAvatarMutation.isPending
                      ? "Removing..."
                      : "Remove Current Avatar"}
                  </button>
                )}
              </div>
            ) : (
              <>
                <p className="text-xs text-stone-500">
                  Do you want to use this image as your new profile picture?
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="flex-1 min-w-0 py-2.5 rounded-full text-xs font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Choose Different
                  </button>

                  <button
                    type="button"
                    onClick={handleConfirmUpload}
                    disabled={uploadAvatarMutation.isPending}
                    className="flex-1 min-w-0 bg-[#D9822B] hover:bg-[#c47323] text-white py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                  >
                    {uploadAvatarMutation.isPending
                      ? "Uploading..."
                      : "Confirm & Upload"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 md:p-8 shadow-xl border border-stone-100 relative space-y-6">
            <div className="flex justify-between items-center">
              <div className="min-w-0">
                <h3 className="text-lg font-bold text-stone-900">
                  Change Password
                </h3>

                <p className="text-xs text-stone-500">
                  Enter your current and new password below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 shrink-0 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {passwordError && (
              <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl font-medium">
                {passwordError}
              </div>
            )}

            {passwordSuccess && (
              <div className="bg-emerald-50 text-[#1B4D3E] text-xs p-3 rounded-xl font-medium">
                {passwordSuccess}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Current Password
                </label>

                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-stone-200 rounded-xl pl-4 pr-10 py-3 text-xs text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-stone-200 rounded-xl pl-4 pr-10 py-3 text-xs text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-stone-200 rounded-xl pl-4 pr-10 py-3 text-xs text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={passwordMutation.isPending}
                  className="bg-[#D9822B] hover:bg-[#c47323] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
                >
                  {passwordMutation.isPending
                    ? "Updating..."
                    : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
