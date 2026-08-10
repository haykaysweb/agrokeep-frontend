import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Book, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import UserAvatar from "./UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import Logo from "./Logo";
import { logoutUserApi } from "@/api/auth";
import { navigateWithDelay } from "@/utils/navigation";
import { showToast } from "@/utils/CustomToast";
import LogoutModal from "./LogoutModal";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Find storage", href: "/storage" },
  { name: "About us", href: "/about" },
  { name: "Contact us", href: "/contact" },
];

export default function Navbar() {
  const { user, isAuthenticating, setUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const initiateLogout = () => {
    setIsOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogout = async () => {
    setIsLogoutModalOpen(false);
    try {
      await logoutUserApi();
      showToast.success("Logged out successfully");
      navigateWithDelay(navigate, "/auth/login");
    } catch (error) {
      showToast.error("Failed to log out.");
    } finally {
      setUser(null);
      queryClient.setQueryData(["currentUser"], null);
    }
  };

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`sticky top-0 z-50 w-full transition-colors duration-300 ${
          isScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border-light"
            : "bg-background border-transparent"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto px-4 md:px-12 h-20 flex items-center justify-between">
          <Logo />

          <ul className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.href}
                  className="text-text-subtle font-medium text-base hover:text-brand-primary transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden lg:flex items-center gap-6 min-h-[40px]">
            {isAuthenticating ? (
              <div className="flex items-center gap-6">
                <div className="h-6 w-16 animate-pulse rounded bg-border-light/50" />
                <div className="h-10 w-32 animate-pulse rounded-full bg-border-light/50" />
              </div>
            ) : user ? (
              <UserAvatar name={user.fullName || "User"} />
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="text-text-main font-medium hover:text-brand-primary transition-colors"
                >
                  Sign in
                </Link>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="relative inline-block"
                >
                  <span className="absolute inset-0 translate-x-[4px] translate-y-[4px] rounded-full bg-brand-secondary"></span>
                  <span className="relative z-10 flex h-10 items-center gap-3 rounded-full bg-brand-primary px-4 py-3 text-text-light">
                    <Link
                      to="/auth/register"
                      className="text-sm font-medium md:text-base"
                    >
                      Get Started
                    </Link>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-secondary">
                      <ArrowUpRight
                        className="h-3 w-3 text-text-light"
                        strokeWidth={2.5}
                      />
                    </span>
                  </span>
                </motion.button>
              </>
            )}
          </div>

          <button
            className="lg:hidden p-2 text-text-main"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden absolute top-20 left-0 w-full bg-background backdrop-blur-sm border-b border-border-light overflow-hidden"
            >
              {user && (
                <div className="max-w-7xl mx-auto px-4 md:px-12 pt-6 pb-2">
                  <div className="flex items-center gap-3 py-4 rounded-xl">
                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-brand-primary text-white font-semibold">
                      {user.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-text-main">
                        {user.fullName}
                      </p>
                      <p className="text-xs text-stone-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <ul className="flex flex-col p-6 gap-6 max-w-7xl mx-auto px-4 md:px-12">
                <Link
                  to="/storage/bookings"
                  className="flex items-center gap-3  text-text-main hover:bg-stone-50 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Book className="h-5 w-5" />
                  My Bookings
                </Link>
                <hr className="border-stone-100" />
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-text-subtle text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}

                <div className="mt-4 border-t border-border-light flex flex-col gap-4">
                  {user ? (
                    <button
                      onClick={initiateLogout}
                      className="text-red-600 font-medium text-lg text-left py-4"
                    >
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        className="bg-brand-primary text-text-light py-3 px-6 rounded-full text-center font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/auth/register"
                        className="bg-brand-primary text-text-light py-3 px-6 rounded-full text-center"
                        onClick={() => setIsOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
