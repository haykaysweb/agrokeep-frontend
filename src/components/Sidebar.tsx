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

export default function Sidebar() {
  const { handleLogout } = useAuth();

  return (
    <aside className="hidden lg:block bg-surface-card text-text-main px-2 min-h-screen fixed left-0 top-0 z-40 w-60 shadow-sm">
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
            `transition-all duration-300  ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
              isActive
                ? "bg-brand-primary text-text-light  border-border-light"
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

        <NavLink
          to="/admin/settings"
          className={({ isActive }) =>
            `transition-all duration-300 ease-in p-3 mt-15 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
              isActive
                ? "bg-brand-primary text-text-light"
                : "hover:text-brand-primary"
            }`
          }
        >
          <Settings /> <h1>Settings</h1>
        </NavLink>

        <div
          className="p-4 flex gap-2 cursor-pointer items-center hover:opacity-80 transition-opacity"
          onClick={handleLogout}
        >
          <LogOut className="text-semantic-error" />
          <p className="text-semantic-error font-medium">Logout</p>
        </div>
      </section>
    </aside>
  );
}
