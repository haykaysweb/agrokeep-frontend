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
      priorityColor: "bg-semantic-error/10 text-semantic-error border-semantic-error/20",
      borderColor: "border-l-semantic-error",
      title: "5 Payment issues requiring attention",
    },
    {
      id: "2",
      priority: "Medium",
      priorityColor: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      borderColor: "border-l-amber-500",
      title: "5 Hub applications awaiting verification",
    },
    {
      id: "3",
      priority: "Low",
      priorityColor: "bg-blue-500/10 text-blue-600 border-blue-500/20",
      borderColor: "border-l-blue-500",
      title: "2 Storage hubs with low available capacity",
    },
  ]);

  const dismissCard = (id: string) => {
    setActions((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-surface-card rounded-3xl p-4 md:p-6 border border-border-input shadow-xs w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-text-main">Action Required</h2>
          <p className="text-xs text-text-subtle mt-0.5">Items requiring administrative action right now.</p>
        </div>
        <button type="button" className="text-xs font-semibold text-text-subtle hover:text-text-main transition-colors cursor-pointer">
          View Details
        </button>
      </div>

      {/* Action Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actions.map((item) => (
          <div
            key={item.id}
            className={`relative bg-surface-card rounded-2xl p-5 border border-border-input border-l-4 ${item.borderColor} shadow-xs flex flex-col justify-between`}
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
                className="text-text-muted hover:text-text-main transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title / Description */}
            <p className="text-sm font-medium text-text-main mb-6">{item.title}</p>

            {/* Review Button */}
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-1.5 rounded-full border border-border-input text-xs font-semibold text-text-subtle hover:bg-surface-hover transition-colors cursor-pointer"
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