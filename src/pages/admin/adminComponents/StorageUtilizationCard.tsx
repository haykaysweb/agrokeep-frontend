export default function StorageUtilizationCard() {
  const hubData = [
    { name: "Oyo", percentage: 72, color: "bg-amber-500" },
    { name: "Ogun", percentage: 64, color: "bg-emerald-600" },
    { name: "Osun", percentage: 92, color: "bg-red-500" },
    { name: "Ondo", percentage: 59, color: "bg-emerald-600" },
    { name: "Ekiti", percentage: 49, color: "bg-emerald-600" },
  ];

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 border border-stone-100 shadow-xs flex flex-col justify-between w-full">
      {/* Card Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900">
            Storage Utilization
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Storage occupancy across AgroKeep hubs.
          </p>
        </div>
        <button
          type="button"
          className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors whitespace-nowrap"
        >
          View Hubs
        </button>
      </div>

      {/* Donut Chart Representation */}
      <div className="flex items-center justify-center py-4 relative">
        <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="56"
              stroke="currentColor"
              strokeWidth="14"
              className="text-stone-200 fill-none"
            />
            <circle
              cx="72"
              cy="72"
              r="56"
              stroke="currentColor"
              strokeWidth="14"
              strokeDasharray="351.8"
              strokeDashoffset={351.8 * (1 - 0.68)}
              strokeLinecap="round"
              className="text-[#1E5E3A] fill-none"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-stone-900">68%</span>
            <span className="text-[11px] font-medium text-stone-500">
              Occupied
            </span>
          </div>
        </div>

        <div className="ml-6 space-y-2 text-xs">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-[#1E5E3A] shrink-0" />
            <span className="text-stone-700 font-medium">Occupied</span>
          </div>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-300 shrink-0" />
            <span className="text-stone-500">Available</span>
          </div>
        </div>
      </div>

      {/* Hub State Progress Bars */}
      <div className="space-y-3 pt-2">
        {hubData.map((hub, index) => (
          <div
            key={index}
            className="flex items-center justify-between gap-4 text-xs"
          >
            <span className="w-10 font-medium text-stone-700">{hub.name}</span>
            <div className="flex-1 bg-stone-100 h-2 rounded-full overflow-hidden">
              <div
                style={{ width: `${hub.percentage}%` }}
                className={`h-full rounded-full ${hub.color}`}
              />
            </div>
            <span className="w-24 text-right text-stone-500 font-medium whitespace-nowrap">
              {hub.percentage}% occupied
            </span>
          </div>
        ))}
      </div>

      {/* Bottom Legend */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-5 border-t border-stone-100 text-[10px] sm:text-xs text-stone-500">
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
          <span>Healthy 0–69%</span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
          <span>Getting full 70–89%</span>
        </div>
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <span>Nearly full 90–100%</span>
        </div>
      </div>
    </div>
  );
}
