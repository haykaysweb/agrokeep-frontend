import {
  Building2,
  CalendarDays,
  CreditCard,
  Grid2x2,
  LogOut,
  Settings,
  Users,
  Warehouse,
} from "lucide-react";
import Logo from "./Logo";
import { NavLink } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import LogoutModal from "./LogoutModal";
import { useState } from "react";

export default function Sidebar() {
  const { handleLogout } = useAuth();
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  return (
    <>
      <aside className="hidden lg:flex lg:flex-col bg-surface-card text-text-main px-2 min-h-screen fixed left-0 top-0 z-40 w-60 shadow-sm pb-6">
        <div className="flex-1">
          <div className="flex items-start justify-start w-full pt-3 pb-8 h-16">
            <div className="w-32">
              <Logo />
            </div>
          </div>

          <section className="mt-4 font-semibold">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                  isActive
                    ? "bg-brand-primary text-text-light border-border-light"
                    : "hover:text-brand-primary"
                }`
              }
            >
              <Grid2x2 />
              <h1>Dashboard</h1>
            </NavLink>

            <NavLink
              to="/admin/bookings"
              className={({ isActive }) =>
                `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                  isActive
                    ? "bg-brand-primary text-text-light"
                    : "hover:text-brand-primary"
                }`
              }
            >
              <CalendarDays /> <h1>Bookings</h1>
            </NavLink>

            <NavLink
              to="/admin/storage-hubs"
              className={({ isActive }) =>
                `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                  isActive
                    ? "bg-brand-primary text-text-light"
                    : "hover:text-brand-primary"
                }`
              }
            >
              <Warehouse /> <h1>Storage Hubs</h1>
            </NavLink>

            <NavLink
              to="/admin/hub-applications"
              className={({ isActive }) =>
                `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                  isActive
                    ? "bg-brand-primary text-text-light"
                    : "hover:text-brand-primary"
                }`
              }
            >
              <Building2 /> <h1>Hub Applications</h1>
            </NavLink>

            <NavLink
              to="/admin/farmers"
              className={({ isActive }) =>
                `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                  isActive
                    ? "bg-brand-primary text-text-light"
                    : "hover:text-brand-primary"
                }`
              }
            >
              <Users /> <h1>Farmers</h1>
            </NavLink>

            <NavLink
              to="/admin/payments"
              className={({ isActive }) =>
                `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
                  isActive
                    ? "bg-brand-primary text-text-light"
                    : "hover:text-brand-primary"
                }`
              }
            >
              <CreditCard /> <h1>Payments</h1>
            </NavLink>
          </section>
        </div>

        {/* Footer group: Settings + Logout pinned at the bottom */}
        <div className="mt-auto pt-4 border-border-base/50 space-y-1">
          <NavLink
            to="/admin/settings"
            className={({ isActive }) =>
              `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 font-semibold ${
                isActive
                  ? "bg-brand-primary text-text-light"
                  : "hover:text-brand-primary text-text-main"
              }`
            }
          >
            <Settings /> <h1>Settings</h1>
          </NavLink>

          <div
            className="p-3 rounded-3xl w-50 flex gap-2 cursor-pointer items-center hover:opacity-80 transition-opacity font-semibold"
            onClick={() => setIsLogoutOpen(true)}
          >
            <LogOut className="text-semantic-error" />
            <p className="text-semantic-error">Logout</p>
          </div>
        </div>
      </aside>

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={() => {
          setIsLogoutOpen(false);
          handleLogout();
        }}
      />
    </>
  );
}
