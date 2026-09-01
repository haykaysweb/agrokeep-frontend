import {
  Calendar,
  Warehouse,
  Building2,
  Wallet,
  TrendingUp,
  Minus,
} from "lucide-react";

interface StatItem {
  title: string;
  value: string | number;
  trend: string;
  isPositive: boolean;
  isNeutral?: boolean;
  icon: React.ReactNode;
}

export default function AdminStatsGrid() {
  const statsData: StatItem[] = [
    {
      title: "Total Bookings",
      value: "248",
      trend: "+12.4%",
      isPositive: true,
      icon: <Calendar className="h-6 w-6 text-blue-600" />,
    },
    {
      title: "Active Storage",
      value: "86",
      trend: "+8.1%",
      isPositive: true,
      icon: <Warehouse className="h-6 w-6 text-brand-primary" />,
    },
    {
      title: "Storage Hubs",
      value: "42",
      trend: "0%",
      isPositive: false,
      isNeutral: true,
      icon: <Building2 className="h-6 w-6 text-amber-600" />,
    },
    {
      title: "Revenue",
      value: "₦8.4M",
      trend: "+15.7%",
      isPositive: true,
      icon: <Wallet className="h-6 w-6 text-brand-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className="bg-surface-card rounded-2xl p-5 border border-border-input shadow-xs flex justify-between items-start transition-all hover:shadow-md"
        >
          {/* Left Side: Title, Value, and Trend */}
          <div className="space-y-2">
            <span className="text-sm font-medium text-text-subtle block whitespace-nowrap">
              {stat.title}
            </span>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-main tracking-tight whitespace-nowrap">
              {stat.value}
            </h2>
            <div className="flex items-center gap-1.5 pt-0.5 whitespace-nowrap">
              {stat.isNeutral ? (
                <Minus className="h-3.5 w-3.5 text-text-muted shrink-0" />
              ) : (
                <TrendingUp className="h-3.5 w-3.5 text-brand-primary shrink-0" />
              )}
              <span
                className={`text-xs font-semibold ${
                  stat.isNeutral ? "text-text-subtle" : "text-brand-primary"
                }`}
              >
                {stat.trend}
              </span>
            </div>
          </div>

          {/* Right Side: Feature Icon Container */}
          <div className="p-3 rounded-xl bg-surface-hover border border-border-input flex items-center justify-center shrink-0">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}