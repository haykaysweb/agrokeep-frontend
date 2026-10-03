/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { getStorageHubActivityLogApi } from "@/api/adminStorage";
import { History, Loader2 } from "lucide-react";

export default function StorageActivityTab({ hub }: { hub: any }) {
  console.log("Activity Log Data:", hub);

  const hubId = hub?.id || hub?._id;
  const [apiLogs, setApiLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivityLogs = async () => {
      if (!hubId) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const response = await getStorageHubActivityLogApi(hubId);
        console.log("New Activity Log API Response:", response);
        const fetchedLogs =
          response?.data?.data?.activityLog ||
          response?.data?.activityLog ||
          [];
        setApiLogs(fetchedLogs);
      } catch (err: any) {
        console.error("Failed to fetch activity logs from API:", err);
        setError("Failed to load activity logs.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivityLogs();
  }, [hubId]);

  // Map real API logs to match the UI table structure
  const logs = apiLogs.map((item) => {
    const dateObj = item.createdAt ? new Date(item.createdAt) : new Date();
    const date = dateObj.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const time = dateObj.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const fullName = item.performedBy?.fullName || "System Admin";
    const initials = fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const actionLabel = item.action
      ? item.action
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase())
      : "System Action";
    let pillBg = "bg-stone-100 text-stone-800";
    if (item.action?.includes("verified") || item.action?.includes("created")) {
      pillBg = "bg-emerald-100 text-emerald-800";
    } else if (item.action?.includes("updated")) {
      pillBg = "bg-amber-100 text-amber-800";
    } else if (item.action?.includes("uploaded")) {
      pillBg = "bg-blue-100 text-blue-800";
    } else if (item.action?.includes("suspended")) {
      pillBg = "bg-rose-100 text-rose-800";
    }

    return {
      _id: item._id,
      date,
      time,
      user: fullName,
      initials,
      role: item.performedBy?.role || "Admin",
      action: actionLabel,
      actionPillBg: pillBg,
      description: actionLabel,
      details: item.details || "No details provided",
    };
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-fadeIn">
      <div className="bg-white rounded-2xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200/80 bg-[#1B4D3E] text-white text-[11px] font-bold tracking-wider uppercase">
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Action</th>
                <th className="px-6 py-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-stone-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="h-6 w-6 animate-spin text-[#1B4D3E]" />
                      <span>Loading activity logs...</span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-rose-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-stone-400"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <History className="h-8 w-8 text-stone-300" />
                      <span className="text-stone-600 font-medium">
                        No activity logs found
                      </span>
                      <span className="text-[11px] text-stone-400">
                        Actions performed on this storage hub will appear here.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log: any, index: number) => (
                  <tr key={log._id || index} className="hover:bg-stone-50/80">
                    <td className="px-6 py-4 align-top">
                      <span className="font-bold text-stone-900 block">
                        {log.date}
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {log.time}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-800 font-bold flex items-center justify-center text-[10px] shrink-0 overflow-hidden">
                          {log.initials}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block">
                            {log.user}
                          </span>
                          <span className="text-[11px] text-stone-400">
                            {log.role}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${log.actionPillBg}`}
                        >
                          {log.action}
                        </span>
                        <span className="font-medium text-stone-900 text-[11px]">
                          {log.description}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top text-stone-600 whitespace-pre-line leading-relaxed">
                      {log.details}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {!isLoading && logs.length > 0 && (
          <div className="p-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>
              Showing 1–{logs.length} of {logs.length} Activities
            </span>
            <div className="flex items-center gap-2">
              <button className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 cursor-pointer">
                ⟨
              </button>
              <button className="w-7 h-7 rounded-lg bg-[#1B4D3E] text-white font-semibold flex items-center justify-center">
                1
              </button>
              <button className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center hover:bg-stone-50 cursor-pointer">
                ⟩
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
