import { useEffect, useState } from "react";
import AdminDrawer from "./AdminDrawer";
import UserAvatar from "./UserAvatar";
import { CalendarDays } from "lucide-react";

export default function AdminNav() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className={`fixed top-0 left-0 lg:left-60 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md border-b border-stone-200/60 shadow-xs"
          : "bg-white border-b border-stone-100 shadow-none"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
          <CalendarDays className="h-4 w-4" />
          <p className="text-center">{currentDate}</p>
        </div>

        <div className="flex gap-6 items-center">
          <div className="hidden md:block">
            <UserAvatar />
          </div>

          <AdminDrawer />
        </div>
      </div>
    </header>
  );
}
