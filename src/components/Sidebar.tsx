import { Building2, CalendarDays, CarFront, CreditCard, Grid2x2, LogOut, Settings, UserCog, Users, Warehouse } from "lucide-react";
import Logo from "./Logo";
import { NavLink } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Sidebar() {
  const { handleLogout } = useAuth();

  return (
    <aside className="hidden bg-[#FFFFFF] text-black  px-2 mx-auto  lg:block  min-h-screen fixed z-40 w-60">
      <div className="p-4 flex">
        <Logo />
      </div>

      <NavLink
        to="/admin"
        end
        className={({ isActive }) =>
          `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
            isActive ? "bg-[#1E5E3A] text-white  border-3" : "hover:text-[#1E5E3A] "
          }`
        }
      >
        <Grid2x2 /> <h1>Dashboard</h1>
      </NavLink>

      <NavLink
        to="/admin/bookings"
        className={({ isActive }) =>
          `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
            isActive ? "bg-[#1E5E3A] text-white  border-3" : "hover:text-[#1E5E3A] "
          }`
        }
      >
        <CalendarDays /> <h1>Bookings</h1>
      </NavLink>

      <NavLink
        to="/admin/storage-hubs"
       className={({ isActive }) =>
          `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
            isActive ? "bg-[#1E5E3A] text-white  border-3" : "hover:text-[#1E5E3A] "
          }`
        }
      >
        <Warehouse/> <h1>Storage Hubs</h1>
      </NavLink>

      <NavLink
        to="/admin/hub-applications"
       className={({ isActive }) =>
          `transition-all duration-300 ease-in p-3 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
            isActive ? "bg-[#1E5E3A] text-white  border-3" : "hover:text-[#1E5E3A] "
          }`
        }
      >
        <Building2 /> <h1>Hub Applications</h1>
      </NavLink>

      <NavLink
        to="/admin/farmers"
        className={({ isActive }) =>
          `transition-all duration-300 ease-in p-3  flex items-center gap-2 rounded-3xl w-50 mb-3 ${
            isActive ? "bg-[#1E5E3A] text-white  border-3" : "hover:text-[#1E5E3A] "
          }`
        }
      >
        <Users/> <h1>Farmers</h1>
      </NavLink>
      <NavLink
        to="/admin/payments"
        className={({ isActive }) =>
          `transition-all duration-300 ease-in p-3  flex items-center gap-2 rounded-3xl w-50 mb-3 ${
            isActive ? "bg-[#1E5E3A] text-white  border-3" : "hover:text-[#1E5E3A] "
          }`
        }
      >
        <CreditCard/> <h1>Payments</h1>
      </NavLink>
      <NavLink
        to="/admin/settings"
        className={({ isActive }) =>
          `transition-all duration-300 ease-in p-3 mt-15 flex items-center gap-2 rounded-3xl w-50 mb-3 ${
            isActive ? "bg-[#1E5E3A] text-white  border-3" : "hover:text-[#1E5E3A] "
          }`
        }
      >
        <Settings/> <h1>Settings</h1>
      </NavLink>

      <div className="p-4 flex gap-2" onClick={handleLogout}>
        <LogOut /> <p className="text-red-600">Logout</p>
      </div>
    </aside>
  );
}