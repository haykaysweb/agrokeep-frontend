import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

export interface DateRange {
  startDate: string | null; // ISO string, e.g. "2026-09-01T00:00:00.000Z"
  endDate: string | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
}

const toIsoStartOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.toISOString();
};

const toIsoEndOfDay = (date: Date) => {
  const copy = new Date(date);
  copy.setHours(23, 59, 59, 999);
  return copy.toISOString();
};

const formatShort = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isBetween = (day: Date, start: Date, end: Date) =>
  day.getTime() >= start.getTime() && day.getTime() <= end.getTime();

export default function AdminBookingsDateRangePicker({
  value,
  onChange,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [pendingStart, setPendingStart] = useState<Date | null>(
    value.startDate ? new Date(value.startDate) : null,
  );
  const [pendingEnd, setPendingEnd] = useState<Date | null>(
    value.endDate ? new Date(value.endDate) : null,
  );
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const POPOVER_WIDTH = 300;
  const VIEWPORT_MARGIN = 12;

  const updatePosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();

    let left = rect.left + window.scrollX;

    // If the popover would overflow the right edge of the viewport,
    // align it to the trigger's right edge instead.
    const wouldOverflowRight =
      rect.left + POPOVER_WIDTH > window.innerWidth - VIEWPORT_MARGIN;

    if (wouldOverflowRight) {
      left = rect.right + window.scrollX - POPOVER_WIDTH;
    }

    // Final safety clamp so it never goes off the left edge either
    // (e.g. on very narrow screens).
    left = Math.max(VIEWPORT_MARGIN, left);

    setMenuPosition({
      top: rect.bottom + window.scrollY + 8,
      left,
    });
  };

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
      setPendingStart(value.startDate ? new Date(value.startDate) : null);
      setPendingEnd(value.endDate ? new Date(value.endDate) : null);
      setViewMonth(value.startDate ? new Date(value.startDate) : new Date());
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleReposition = () => updatePosition();
    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        menuRef.current?.contains(e.target as Node)
      ) {
        return;
      }
      setIsOpen(false);
    };

    window.addEventListener("scroll", handleReposition, true);
    window.addEventListener("resize", handleReposition);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleReposition, true);
      window.removeEventListener("resize", handleReposition);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleDayClick = (day: Date) => {
    if (!pendingStart || (pendingStart && pendingEnd)) {
      setPendingStart(day);
      setPendingEnd(null);
      return;
    }

    if (day < pendingStart) {
      setPendingStart(day);
      setPendingEnd(null);
      return;
    }

    setPendingEnd(day);
  };

  const applyRange = (start: Date, end: Date) => {
    onChange({
      startDate: toIsoStartOfDay(start),
      endDate: toIsoEndOfDay(end),
    });
    setIsOpen(false);
  };

  const handleApply = () => {
    if (pendingStart && pendingEnd) {
      applyRange(pendingStart, pendingEnd);
    } else if (pendingStart) {
      applyRange(pendingStart, pendingStart);
    }
  };

  const handleClear = () => {
    setPendingStart(null);
    setPendingEnd(null);
    onChange({ startDate: null, endDate: null });
    setIsOpen(false);
  };

  const applyPreset = (preset: "today" | "week" | "month") => {
    const today = new Date();

    if (preset === "today") {
      applyRange(today, today);
      return;
    }

    if (preset === "week") {
      const start = new Date(today);
      start.setDate(today.getDate() - 6);
      applyRange(start, today);
      return;
    }

    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    applyRange(start, today);
  };

  // Build the calendar grid for viewMonth
  const year = viewMonth.getFullYear();
  const month = viewMonth.getMonth();
  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarCells: (Date | null)[] = [
    ...Array.from({ length: startWeekday }, () => null),
    ...Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, month, i + 1),
    ),
  ];

  const monthLabel = viewMonth.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const displayLabel =
    value.startDate && value.endDate
      ? isSameDay(new Date(value.startDate), new Date(value.endDate))
        ? formatShort(value.startDate)
        : `${formatShort(value.startDate)} - ${formatShort(value.endDate)}`
      : "All Dates";

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-text-subtle">Date Range</label>

      <button
        ref={triggerRef}
        type="button"
        onClick={handleToggle}
        className="flex w-full items-center gap-2 rounded-[25px] border border-border-input bg-surface-card px-3 py-2.5 text-left text-xs sm:text-sm text-text-subtle shadow-xs cursor-pointer"
      >
        <Calendar className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{displayLabel}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={menuRef}
            style={{
              position: "absolute",
              top: menuPosition.top,
              left: menuPosition.left,
            }}
            className="z-[100] w-[300px] rounded-2xl border border-border-input bg-surface-card p-4 shadow-xl"
          >
            {/* Quick presets */}
            <div className="mb-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyPreset("today")}
                className="rounded-full border border-border-input px-3 py-1 text-xs text-text-main hover:bg-background-subtle cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => applyPreset("week")}
                className="rounded-full border border-border-input px-3 py-1 text-xs text-text-main hover:bg-background-subtle cursor-pointer"
              >
                Last 7 days
              </button>
              <button
                type="button"
                onClick={() => applyPreset("month")}
                className="rounded-full border border-border-input px-3 py-1 text-xs text-text-main hover:bg-background-subtle cursor-pointer"
              >
                This month
              </button>
            </div>

            {/* Month navigation */}
            <div className="mb-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setViewMonth(new Date(year, month - 1, 1))}
                className="rounded-full p-1 text-text-subtle hover:bg-background-subtle cursor-pointer"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-sm font-semibold text-text-main">
                {monthLabel}
              </span>
              <button
                type="button"
                onClick={() => setViewMonth(new Date(year, month + 1, 1))}
                className="rounded-full p-1 text-text-subtle hover:bg-background-subtle cursor-pointer"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="mb-1 grid grid-cols-7 text-center text-[10px] font-medium text-text-muted">
              {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>

            {/* Day grid */}
            <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
              {calendarCells.map((day, index) => {
                if (!day) return <span key={`empty-${index}`} />;

                const isStart = pendingStart && isSameDay(day, pendingStart);
                const isEnd = pendingEnd && isSameDay(day, pendingEnd);
                const isInRange =
                  pendingStart &&
                  pendingEnd &&
                  isBetween(day, pendingStart, pendingEnd);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => handleDayClick(day)}
                    className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full cursor-pointer transition-colors ${
                      isStart || isEnd
                        ? "bg-brand-primary text-text-light font-semibold"
                        : isInRange
                          ? "bg-brand-primary/15 text-brand-primary"
                          : "text-text-main hover:bg-background-subtle"
                    }`}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer actions */}
            <div className="mt-3 flex items-center justify-between border-t border-border-light pt-3">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs font-medium text-text-subtle hover:text-text-main cursor-pointer"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!pendingStart}
                className="rounded-full bg-brand-primary px-4 py-1.5 text-xs font-semibold text-text-light disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
