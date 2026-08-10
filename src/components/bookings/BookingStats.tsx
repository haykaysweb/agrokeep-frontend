import { CalendarDays, Box, CheckCircle2 } from "lucide-react";

interface BookingStatsProps {
  upcoming: number;
  active: number;
  completed: number;
}

export default function BookingStats({
  upcoming,
  active,
  completed,
}: BookingStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
      {/* Upcoming */}
      <div className="bg-surface-card rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-border-light/60">
        <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <CalendarDays className="w-5 h-5 text-emerald-600" />
        </div>

        <div>
          <p className="text-[11px] font-medium text-text-subtle">Upcoming</p>

          <p className="text-sm font-bold text-text-main">
            {upcoming} {upcoming === 1 ? "Booking" : "Bookings"}
          </p>
        </div>
      </div>

      {/* Active */}
      <div className="bg-surface-card rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-border-light/60">
        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Box className="w-5 h-5 text-amber-500" />
        </div>

        <div>
          <p className="text-[11px] font-medium text-text-subtle">Active</p>

          <p className="text-sm font-bold text-text-main">
            {active} {active === 1 ? "Booking" : "Bookings"}
          </p>
        </div>
      </div>

      {/* Completed */}
      <div className="bg-surface-card rounded-2xl p-4 flex items-center gap-3 shadow-sm border border-border-light/60">
        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5 text-slate-500" />
        </div>

        <div>
          <p className="text-[11px] font-medium text-text-subtle">Completed</p>

          <p className="text-sm font-bold text-text-main">
            {completed} {completed === 1 ? "Booking" : "Bookings"}
          </p>
        </div>
      </div>
    </div>
  );
}
