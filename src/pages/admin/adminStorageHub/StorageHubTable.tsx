/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getAdminStorageHubsApi } from "@/api/adminStorage";

export function useAdminStorageHubs(searchParams: URLSearchParams) {
  return useQuery({
    // Include searchParams string in the queryKey so React Query refetches when URL filters change
    queryKey: ["adminStorageHubs", searchParams.toString()],
    queryFn: async () => {
      // Pass the searchParams object/string to your API function
      const response = await getAdminStorageHubsApi(searchParams);
      return response;
    },
    staleTime: 1000 * 60 * 5,
  });
}

// Shows "—" instead of "undefined" / blank when the API doesn't return a value
const display = (value: any) =>
  value === undefined || value === null || value === "" ? "—" : value;

const formatNumber = (value: any) =>
  typeof value === "number" ? value.toLocaleString() : display(value);

export default function StorageHubTable() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: axiosResponse,
    isLoading,
    error,
  } = useAdminStorageHubs(searchParams);

  // Extract hubs and pagination from the nested data property
  const responseData = axiosResponse?.data;
  const hubsList: any[] = responseData?.data?.hubs ?? [];
  const pagination = responseData?.data?.pagination;

  // Send me this output so I can match every column to your real data
  useEffect(() => {
    if (axiosResponse) {
      console.log("Storage hubs full response:", axiosResponse);
      console.log("Storage hubs list:", hubsList);
      console.log("Storage hubs first hub:", hubsList[0]);
      console.log("Storage hubs pagination:", pagination);
    }
    if (error) {
      console.log("Storage hubs error:", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [axiosResponse, error]);

  // Real pagination numbers from the API (falls back sensibly if a field is missing)
  const currentPage = pagination?.currentPage ?? 1;
  const limit = pagination?.limit ?? hubsList.length;
  const total = pagination?.total ?? hubsList.length;
  const rangeStart = hubsList.length ? (currentPage - 1) * limit + 1 : 0;
  const rangeEnd = hubsList.length ? rangeStart + hubsList.length - 1 : 0;
  const hasPrevPage = pagination?.hasPrevPage ?? false;
  const hasNextPage = pagination?.hasNextPage ?? false;

  const handleRowClick = (id: string) => {
    navigate(`/admin/storage-hubs/details/${id}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.set("page", newPage.toString());
      return newParams;
    });
  };

  if (error) {
    return (
      <div className="w-full flex items-center justify-center h-64 bg-white rounded-2xl border border-stone-200/80 text-red-600 text-xs font-medium">
        Failed to load storage hubs. Please try again.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden border border-stone-200/80 bg-white rounded-2xl shadow-xs">
      {/* Scrollable table container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200/80 bg-stone-100/70 text-[11px] font-bold tracking-wider text-stone-500 uppercase">
              <th className="w-12 px-4 py-4 text-center">#</th>
              <th className="px-4 py-4 whitespace-nowrap">Hub Name</th>
              <th className="px-4 py-4 whitespace-nowrap">Location</th>
              <th className="px-4 py-4 whitespace-nowrap">Storage Type</th>
              <th className="px-4 py-4 whitespace-nowrap">Capacity</th>
              <th className="px-4 py-4 whitespace-nowrap">
                Available Capacity
              </th>
              <th className="px-4 py-4 whitespace-nowrap">Bookings</th>
              <th className="px-4 py-4 whitespace-nowrap">
                Verification Status
              </th>
              <th className="px-4 py-4 whitespace-nowrap">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
            {isLoading ? (
              // Render skeleton rows while loading
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  <td className="px-4 py-4 text-center">
                    <div className="h-4 w-4 bg-stone-200 rounded mx-auto" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-20" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-28" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-24" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-20" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-16" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-14" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-4 bg-stone-200 rounded w-20" />
                  </td>
                  <td className="px-4 py-4">
                    <div className="h-5 bg-stone-200 rounded-full w-20" />
                  </td>
                </tr>
              ))
            ) : hubsList.length > 0 ? (
              hubsList.map((hub: any, index: number) => {
                return (
                  <tr
                    key={hub._id}
                    onClick={() => handleRowClick(hub._id)}
                    className="group cursor-pointer transition-colors hover:bg-stone-50/80"
                  >
                    {/* Row number (continues across pages) */}
                    <td className="px-4 py-4 text-center font-medium text-stone-500">
                      {rangeStart + index}
                    </td>

                    {/* Hub Name */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="font-semibold text-stone-900">
                        {display(hub.name)}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        ID: {hub._id?.slice(-6)}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="font-medium text-stone-800">
                        {display(hub.lga)}
                      </p>
                      <p className="text-[11px] text-stone-500">
                        {hub.state ? `${hub.state} State` : "—"}
                      </p>
                    </td>

                    {/* Storage Type */}
                    <td className="px-4 py-4 whitespace-nowrap text-stone-700">
                      {display(hub.storageType)}
                    </td>

                    {/* Capacity */}
                    <td className="px-4 py-4 whitespace-nowrap text-stone-700 font-medium">
                      {formatNumber(hub.totalCapacity)} {hub.unitType}
                    </td>

                    {/* Available Capacity */}
                    <td className="px-4 py-4 whitespace-nowrap text-stone-700">
                      {formatNumber(hub.availableCapacity)} {hub.unitType}
                    </td>

                    {/* Bookings */}
                    <td className="px-4 py-4 whitespace-nowrap text-stone-700 font-medium">
                      {display(
                        hub.bookingsCount ??
                          hub.totalBookings ??
                          hub.bookings?.length,
                      )}
                    </td>

                    {/* Verification Status Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${
                          hub.verificationStatus === "verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : hub.verificationStatus === "pending"
                              ? "bg-amber-100 text-amber-800"
                              : hub.verificationStatus === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {display(hub.verificationStatus)}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold capitalize ${
                          hub.status === "active"
                            ? "bg-emerald-100 text-emerald-800"
                            : hub.status === "inactive"
                              ? "bg-stone-200 text-stone-600"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {display(hub.status)}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="h-32 text-center text-stone-400 font-medium"
                >
                  No storage hubs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/80 bg-white px-4 sm:px-6 py-4 text-sm text-stone-500">
        <div className="text-xs sm:text-sm font-medium">
          Showing{" "}
          <span className="text-stone-800 font-semibold">
            {rangeStart}–{rangeEnd}
          </span>{" "}
          of <span className="text-stone-800 font-semibold">{total}</span>{" "}
          storage hubs
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage}
            className="cursor-pointer p-2 rounded-lg border border-stone-200 text-stone-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg bg-[#1B4D3E] font-semibold text-white text-xs shadow-xs"
          >
            {currentPage}
          </button>

          <button
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
            className="cursor-pointer p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
