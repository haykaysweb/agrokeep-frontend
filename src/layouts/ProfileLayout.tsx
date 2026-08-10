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

export default function ProfilePage() {
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
  const [profileSuccess, setProfileSuccess] = useState("");
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
      setProfileSuccess(response?.message || "Avatar uploaded successfully");
      setProfileError("");
      setIsAvatarModalOpen(false);
      setSelectedFile(null);
      setPreviewUrl(null);

      // Map backend's 'avatarUrl' directly into your query cache
      const updatedUser = response?.data;
      if (updatedUser) {
        queryClient.setQueryData(["userProfile"], (oldData: any) => {
          if (!oldData) return oldData;
          if (oldData.user) {
            return {
              ...oldData,
              user: { ...oldData.user, avatarUrl: updatedUser.avatarUrl },
            };
          }
          return { ...oldData, avatarUrl: updatedUser.avatarUrl };
        });
      }

      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setTimeout(() => setProfileSuccess(""), 3000);
    },
    onError: (err: any) => {
      setProfileError(
        err?.response?.data?.message || "Failed to upload avatar.",
      );
      setProfileSuccess("");
    },
  });

  // 1. Add delete avatar mutation
  const deleteAvatarMutation = useMutation({
    mutationFn: deleteAvatar,
    onSuccess: (response) => {
      setProfileSuccess(response?.message || "Avatar removed successfully");
      setProfileError("");
      setIsAvatarModalOpen(false);

      // Clear avatarUrl from cache immediately
      const updatedUser = response?.data;
      if (updatedUser) {
        queryClient.setQueryData(["userProfile"], (oldData: any) => {
          if (!oldData) return oldData;
          if (oldData.user) {
            return { ...oldData, user: { ...oldData.user, avatarUrl: null } };
          }
          return { ...oldData, avatarUrl: null };
        });
      }

      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
      setTimeout(() => setProfileSuccess(""), 3000);
    },
    onError: (err: any) => {
      setProfileError(
        err?.response?.data?.message || "Failed to remove avatar.",
      );
      setProfileSuccess("");
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

  const handleSavePreferences = () => {
    updateProfileMutation.mutate({
      notificationPreferences: {
        bookingUpdates,
        paymentNotifications,
        reminderAlerts,
        smsNotifications,
        emailNotifications,
      },
    });
  };

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
      <div className="bg-[#FAF7F0] min-h-screen flex items-center justify-center">
        <p className="text-stone-500 text-sm font-medium">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#FAF7F0] min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm font-medium">
          Failed to load profile data.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F0] min-h-screen py-10 px-4 md:px-8 relative">
      {/* Top Header Section */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-stone-900 tracking-tight">
          My Profile
        </h1>
        <p className="text-stone-500 text-sm mt-1">
          Keep your details up to date so hub managers can reach you quickly and
          we can match you with the right storage for every harvest.
        </p>
        {profileSuccess && (
          <div className="mt-4 bg-emerald-50 text-[#1B4D3E] text-xs p-3 rounded-xl font-medium max-w-md">
            {profileSuccess}
          </div>
        )}
        {profileError && (
          <div className="mt-4 bg-red-50 text-red-600 text-xs p-3 rounded-xl font-medium max-w-md">
            {profileError}
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: User Card */}
        <div className="lg:col-span-4 bg-white rounded-3xl p-6 shadow-sm border border-stone-100 text-center space-y-6">
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
              className="relative group w-24 h-24 rounded-full overflow-hidden border-2 border-stone-100 shadow-inner bg-stone-100 mx-auto cursor-pointer"
            >
              <img
                src={user?.avatarUrl || "/avatar-adebayo.jpg"}
                alt={user?.fullName || "User"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 mb-0.5" />
                <span className="text-[10px] font-semibold">Edit</span>
              </div>
            </div>

            {/* Hidden file input controlled by the modal */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />

            <div>
              <h2 className="text-lg font-bold text-stone-900">
                {user?.fullName || "User"}
              </h2>
              <p className="text-xs text-stone-500">{user?.email || ""}</p>
              <p className="text-xs text-stone-400 flex items-center justify-center gap-1 mt-1">
                <MapPin className="h-3 w-3 text-[#1B4D3E]" />{" "}
                {user?.location || "Nigeria"}
              </p>
            </div>
            <div className="bg-emerald-50 text-[#1B4D3E] px-3 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Member since{" "}
              {user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })
                : "July 2026"}
            </div>
          </div>

          <hr className="border-stone-100" />

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 bg-stone-50 p-3 rounded-2xl">
            <div className="text-center">
              <span className="block text-lg font-bold text-stone-800">
                {stats?.totalBookings ?? 0}
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                Bookings
              </span>
            </div>
            <div className="text-center border-x border-stone-200">
              <span className="block text-lg font-bold text-stone-800">
                {stats?.hubsUsed ?? 0}
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                Hubs used
              </span>
            </div>
            <div className="text-center">
              <span className="block text-lg font-bold text-stone-800">
                {stats?.totalStoredQuantity ?? 0}t
              </span>
              <span className="text-[10px] text-stone-400 font-medium">
                Stored
              </span>
            </div>
          </div>

          <button className="w-full border-2 border-[#D9822B] hover:bg-orange-50 text-stone-900 py-3 rounded-full text-xs font-bold transition-colors">
            View My Bookings
          </button>
        </div>

        {/* Right Column: Information, Preferences & Security */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Personal Information Section */}
          <form
            onSubmit={handleSavePersonalInfo}
            className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 space-y-6"
          >
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Personal Information
              </h3>
              <p className="text-xs text-stone-500">
                Used for booking confirmations and hub manager contact.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
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
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234..."
                    className="w-full bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-800 focus:outline-none focus:border-[#1B4D3E]"
                  />
                </div>
              </div>
            </div>

            {/* <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className="bg-[#D9822B] hover:bg-[#c47323] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </button>
            </div> */}
          </form>

          {/* 2. Notification Preferences Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Notification Preferences
              </h3>
              <p className="text-xs text-stone-500">
                Choose how AgroKeep keeps you informed.
              </p>
            </div>

            <div className="divide-y divide-stone-100 space-y-4">
              <div className="flex justify-between items-center pt-3">
                <div>
                  <p className="text-xs font-bold text-stone-800">
                    Booking Updates
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Confirmations, changes and hub messages
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setBookingUpdates(!bookingUpdates)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${bookingUpdates ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${bookingUpdates ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-xs font-bold text-stone-800">
                    Payment Notifications
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Deposits, balances and receipts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPaymentNotifications(!paymentNotifications)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${paymentNotifications ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${paymentNotifications ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-xs font-bold text-stone-800">
                    Reminder Alerts
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Drop-off and collection reminders
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setReminderAlerts(!reminderAlerts)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${reminderAlerts ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${reminderAlerts ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-xs font-bold text-stone-800">
                    SMS Notifications
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Works without data
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSmsNotifications(!smsNotifications)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${smsNotifications ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${smsNotifications ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              <div className="flex justify-between items-center pt-4">
                <div>
                  <p className="text-xs font-bold text-stone-800">
                    Email Notifications
                  </p>
                  <p className="text-[11px] text-stone-400">
                    Detailed summaries and receipts
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${emailNotifications ? "bg-[#1B4D3E]" : "bg-stone-300"}`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${emailNotifications ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>
            </div>

            {/* <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSavePreferences}
                disabled={updateProfileMutation.isPending}
                className="bg-[#D9822B] hover:bg-[#c47323] text-white px-6 py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {updateProfileMutation.isPending
                  ? "Saving..."
                  : "Save Preferences"}
              </button>
            </div> */}
          </div>

          {/* 3. Account Security Section */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-stone-100 space-y-6">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Account Security
              </h3>
              <p className="text-xs text-stone-500">
                Keep your account protected.
              </p>
            </div>

            <div className="flex justify-between items-center bg-stone-50 p-4 rounded-2xl border border-stone-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-700 shadow-sm">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-800">Password</p>
                  <p className="text-[11px] text-stone-400">
                    {user?.passwordLastChanged || "Password never changed"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setPasswordError("");
                  setPasswordSuccess("");
                  setIsPasswordModalOpen(true);
                }}
                className="bg-white hover:bg-stone-100 text-stone-800 border border-stone-200 px-4 py-2 rounded-full text-xs font-semibold shadow-sm transition-colors"
              >
                Change Password
              </button>
            </div>
          </div>

          {/* Log Out & Save All Actions */}
          <div className="flex justify-between items-center pt-2">
            <button className="text-red-500 hover:text-red-600 text-xs font-bold flex items-center gap-1.5 px-2">
              <LogOut className="h-4 w-4" /> Log out
            </button>
            <button
              onClick={handleSaveAll}
              disabled={updateProfileMutation.isPending}
              className="bg-[#D9822B] hover:bg-[#c47323] text-white px-8 py-3 rounded-full text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
            >
              {updateProfileMutation.isPending
                ? "Saving All..."
                : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Assistance Banner */}
      <div className="max-w-7xl mx-auto mt-16 bg-[#1B4D3E] rounded-3xl p-8 md:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="flex items-center gap-5 text-center md:text-left flex-col md:flex-row">
          <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
            <HelpCircle className="h-7 w-7 text-white" />
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-bold">Need assistance?</h3>
            <p className="text-stone-200 text-xs md:text-sm mt-1">
              Our support team is available 7 days a week.
            </p>
          </div>
        </div>
        <button className="bg-[#D9822B] hover:bg-[#c47323] text-white px-8 py-3.5 rounded-full text-xs font-bold shadow-md transition-colors flex items-center gap-2">
          Contact Support <Phone className="h-3.5 w-3.5" />
        </button>
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

            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-stone-100 shadow-md bg-stone-100 mx-auto">
              <img
                src={previewUrl || user?.avatarUrl || "/avatar-adebayo.jpg"}
                alt="Avatar Preview"
                className="w-full h-full object-cover"
              />
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
                    className="flex-1 py-2.5 rounded-full text-xs font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
                  >
                    Choose Different
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmUpload}
                    disabled={uploadAvatarMutation.isPending}
                    className="flex-1 bg-[#D9822B] hover:bg-[#c47323] text-white py-2.5 rounded-full text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
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
              <div>
                <h3 className="text-lg font-bold text-stone-900">
                  Change Password
                </h3>
                <p className="text-xs text-stone-500">
                  Enter your current and new password below.
                </p>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-600 transition-colors"
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
