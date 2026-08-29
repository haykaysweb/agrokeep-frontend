import { useState } from "react";
import { AlertCircle, X } from "lucide-react";

interface ActionItem {
  id: string;
  priority: "High" | "Medium" | "Low";
  priorityColor: string;
  borderColor: string;
  title: string;
}

export default function ActionRequiredCard() {
  const [actions, setActions] = useState<ActionItem[]>([
    {
      id: "1",
      priority: "High",
      priorityColor: "bg-red-50 text-red-600 border-red-200",
      borderColor: "border-l-red-500",
      title: "5 Payment issues requiring attention",
    },
    {
      id: "2",
      priority: "Medium",
      priorityColor: "bg-amber-50 text-amber-600 border-amber-200",
      borderColor: "border-l-amber-500",
      title: "5 Hub applications awaiting verification",
    },
    {
      id: "3",
      priority: "Low",
      priorityColor: "bg-blue-50 text-blue-600 border-blue-200",
      borderColor: "border-l-blue-500",
      title: "2 Storage hubs with low available capacity",
    },
  ]);

  const dismissCard = (id: string) => {
    setActions((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white rounded-3xl p-4 md:p-6 border border-stone-100 shadow-xs w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-stone-900">Action Required</h2>
          <p className="text-xs text-stone-500 mt-0.5">Items requiring administrative action right now.</p>
        </div>
        <button type="button" className="text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors">
          View Details
        </button>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((item) => (
          <div
            key={item.id}
            className={`relative bg-white rounded-2xl p-5 border border-stone-200/80 border-l-4 ${item.borderColor} shadow-xs flex flex-col justify-between`}
          >
            {/* Top Row: Priority Tag & Dismiss X */}
            <div className="flex items-center justify-between mb-3">
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${item.priorityColor}`}>
                <AlertCircle className="w-3 h-3" />
                {item.priority}
              </span>
              <button
                onClick={() => dismissCard(item.id)}
                type="button"
                className="text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title / Description */}
            <p className="text-sm font-medium text-stone-800 mb-6">{item.title}</p>

            {/* Review Button */}
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-1.5 rounded-full border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Review
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}