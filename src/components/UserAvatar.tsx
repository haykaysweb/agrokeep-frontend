import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, ChevronDown, Book, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { logoutUserApi } from "@/api/auth";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { showToast } from "@/utils/CustomToast";
import { navigateWithDelay } from "@/utils/navigation";
import LogoutModal from "./LogoutModal";

interface UserAvatarProps {
  name?: string; // Optional now, since we can fallback to cached user data
}

export default function UserAvatar({ name }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const { user, setUser } = useAuth();

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Pull the latest profile data straight from the cache to stay fully synced
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: profileData } = useQuery<any>({
    queryKey: ["userProfile"],
    queryFn: async () => null,
    enabled: false,
    staleTime: Infinity,
  });

  // Resolve the current profile details dynamically
  const currentUser = profileData?.user || profileData || user;
  const displayName = name || currentUser?.fullName || "User";
  const avatarUrl = currentUser?.avatarUrl;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Open logout confirmation modal
  const initiateLogout = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  // Perform the actual logout
  const handleLogout = async () => {
    setIsLogoutModalOpen(false);

    try {
      await logoutUserApi();

      showToast.success("Logged out successfully");

      setUser(null);

      // Clear cached current user
      queryClient.setQueryData(["currentUser"], null);
      queryClient.setQueryData(["userProfile"], null);

      navigateWithDelay(navigate, "/auth/login");
    } catch {
      showToast.error("Failed to log out. Please try again.");
    }
  };

  // Replace the old 'initial' calculation with this:
  const initial = currentUser?.fullName
    ? currentUser.fullName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : name
      ? name
          .split(" ")
          .map((n: string) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  return (
    <>
      <div ref={dropdownRef} className="relative">
        {/* User menu trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          aria-label="Open user menu"
          className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-white border border-stone-200 hover:bg-stone-50 transition-colors shadow-sm"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary text-white text-sm font-semibold overflow-hidden">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              initial
            )}
          </div>

          {/* User name */}
          <span className="text-sm font-medium text-stone-800">
            {displayName}
          </span>

          {/* Dropdown arrow */}
          <ChevronDown
            className={`h-4 w-4 text-stone-500 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.15 }}
              role="menu"
              aria-label="User menu"
              className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-stone-100 py-2 z-50"
            >
              {/* Profile */}
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className="flex items-center gap-3 px-4 py-3 text-text-main hover:bg-stone-50 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>

              {/* My Bookings */}
              <Link
                to="/storage/bookings"
                onClick={() => setIsOpen(false)}
                role="menuitem"
                className="flex items-center gap-3 px-4 py-3 text-text-main hover:bg-stone-50 transition-colors"
              >
                <Book className="h-4 w-4" />
                <span>My Bookings</span>
              </Link>
              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  role="menuitem"
                  className="flex items-center gap-3 px-4 py-3 text-text-main hover:bg-stone-50 transition-colors"
                >
                  <Lock className="h-4 w-4" />
                  <span>Admin</span>
                </Link>
              )}
              <hr className="border-stone-100 my-1" />

              {/* Logout */}
              <button
                onClick={initiateLogout}
                className="flex w-full items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Logout confirmation modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
