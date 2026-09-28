import { useState } from "react";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface StorageHub {
  id: string;
  name: string;
  code: string;
  locationMain: string;
  locationSub: string;
  storageType: string;
  capacity: string;
  availableCapacity: string;
  bookings: number;
  verificationStatus: "Verified" | "Pending" | "Needs update";
  status: "Active" | "Inactive" | "Suspended" | "Deactivated";
}

const dummyStorageHubs: StorageHub[] = [
  {
    id: "1",
    name: "AgroKeep Ibadan Central",
    code: "HUB-042",
    locationMain: "Bodija, Ibadan",
    locationSub: "Ibadan North, Oyo",
    storageType: "Dry Storage",
    capacity: "2,500 Bags",
    availableCapacity: "500 Bags",
    bookings: 24,
    verificationStatus: "Verified",
    status: "Active",
  },
  {
    id: "2",
    name: "Ogbomoso Grains Hub",
    code: "HUB-041",
    locationMain: "Ogbomoso Road, Oyo",
    locationSub: "Akinyele, Oyo",
    storageType: "Hermetic Store",
    capacity: "900 Bags",
    availableCapacity: "171 bags",
    bookings: 18,
    verificationStatus: "Verified",
    status: "Active",
  },
  {
    id: "3",
    name: "Gateway Storage Hub",
    code: "HUB-040",
    locationMain: "Lafenwa, Abeokuta",
    locationSub: "Abeokuta South, Ogun",
    storageType: "Warehouse",
    capacity: "360 pallets",
    availableCapacity: "104 pallets",
    bookings: 15,
    verificationStatus: "Verified",
    status: "Active",
  },
  {
    id: "4",
    name: "GreenHarvest Osogbo",
    code: "HUB-039",
    locationMain: "Oke-Baale, Osogbo",
    locationSub: "Osogbo, Osun",
    storageType: "Brick Chamber",
    capacity: "540 crates",
    availableCapacity: "227 crates",
    bookings: 12,
    verificationStatus: "Verified",
    status: "Active",
  },
  {
    id: "5",
    name: "HarvestSafe Akure",
    code: "HUB-038",
    locationMain: "Oba-Ile, Akure",
    locationSub: "Akure South, Ondo",
    storageType: "Cold Storage",
    capacity: "180 pallets",
    availableCapacity: "52 pallets",
    bookings: 9,
    verificationStatus: "Verified",
    status: "Active",
  },
  {
    id: "6",
    name: "Saki Cold Chain",
    code: "HUB-036",
    locationMain: "Saki, Oyo",
    locationSub: "Saki West, Oyo",
    storageType: "Cold Storage",
    capacity: "140 crates",
    availableCapacity: "11 crates",
    bookings: 21,
    verificationStatus: "Pending",
    status: "Inactive",
  },
  {
    id: "7",
    name: "Abeokuta Maize Silo",
    code: "HUB-035",
    locationMain: "Sagamu Interchange",
    locationSub: "Sagamu, Ogun",
    storageType: "Silo",
    capacity: "1,200 bags",
    availableCapacity: "10 Bags",
    bookings: 27,
    verificationStatus: "Needs update",
    status: "Suspended",
  },
];

export default function StorageHubTable() {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const navigate = useNavigate();

  const allSelected =
    dummyStorageHubs.length > 0 && selectedRows.length === dummyStorageHubs.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
    } else {
      setSelectedRows(dummyStorageHubs.map((hub) => hub.id));
    }
  };

  const handleSelectRow = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleRowClick = () => {
    // Navigate safely to your storage hub details page
    navigate("/admin/storage-hubs/details");
  };

  return (
    <div className="w-full overflow-hidden border border-stone-200/80 bg-white rounded-2xl shadow-xs">
      {/* Scrollable table container */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200/80 bg-stone-100/70 text-[11px] font-bold tracking-wider text-stone-500 uppercase">
              <th className="w-12 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all storage hubs"
                  className="size-4 cursor-pointer rounded border-stone-300 accent-emerald-800"
                />
              </th>
              <th className="px-4 py-4 whitespace-nowrap">Hub Name</th>
              <th className="px-4 py-4 whitespace-nowrap">Location</th>
              <th className="px-4 py-4 whitespace-nowrap">Storage Type</th>
              <th className="px-4 py-4 whitespace-nowrap">Capacity</th>
              <th className="px-4 py-4 whitespace-nowrap">Available Capacity</th>
              <th className="px-4 py-4 whitespace-nowrap">Bookings</th>
              <th className="px-4 py-4 whitespace-nowrap">Verification Status</th>
              <th className="px-4 py-4 whitespace-nowrap">Status</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
            {dummyStorageHubs.length > 0 ? (
              dummyStorageHubs.map((hub) => {
                const isSelected = selectedRows.includes(hub.id);

                return (
                  <tr
                    key={hub.id}
                    onClick={() => handleRowClick()}
                    className={`group cursor-pointer transition-colors hover:bg-stone-50/80 ${
                      isSelected ? "bg-stone-50/80" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td
                      className="px-4 py-4 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(hub.id)}
                        aria-label={`Select hub ${hub.name}`}
                        className="size-4 cursor-pointer rounded border-stone-300 accent-emerald-800"
                      />
                    </td>

                    {/* Hub Name & Code */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="font-semibold text-stone-900">{hub.name}</p>
                      <p className="text-[11px] text-stone-500">{hub.code}</p>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="font-medium text-stone-800">{hub.locationMain}</p>
                      <p className="text-[11px] text-stone-500">{hub.locationSub}</p>
                    </td>

                    {/* Storage Type */}
                    <td className="px-4 py-4 whitespace-nowrap text-stone-700">
                      {hub.storageType}
                    </td>

                    {/* Capacity */}
                    <td className="px-4 py-4 whitespace-nowrap text-stone-700 font-medium">
                      {hub.capacity}
                    </td>

                    {/* Available Capacity */}
                    <td className="px-4 py-4 whitespace-nowrap text-stone-700">
                      {hub.availableCapacity}
                    </td>

                    {/* Bookings */}
                    <td className="px-4 py-4 whitespace-nowrap text-stone-700 font-medium">
                      {hub.bookings}
                    </td>

                    {/* Verification Status Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                          hub.verificationStatus === "Verified"
                            ? "bg-emerald-100 text-emerald-800"
                            : hub.verificationStatus === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-stone-200 text-stone-700"
                        }`}
                      >
                        {hub.verificationStatus}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${
                          hub.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : hub.status === "Inactive"
                            ? "bg-stone-200 text-stone-600"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {hub.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={9}
                  className="h-36 text-center text-sm font-medium text-stone-400"
                >
                  No storage hubs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/80 bg-white px-4 sm:px-6 py-4 text-sm text-stone-500">
        <div className="text-xs sm:text-sm font-medium">
          Showing <span className="text-stone-800 font-semibold">1–7</span> of <span className="text-stone-800 font-semibold">42</span> storage hubs
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled
            className="cursor-pointer p-2 rounded-lg border border-stone-200 text-stone-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            className="flex size-8 items-center justify-center rounded-lg bg-[#1B4D3E] font-semibold text-white text-xs shadow-xs"
          >
            1
          </button>

          <button
            type="button"
            className="cursor-pointer p-2 rounded-lg border border-stone-200 text-stone-500 hover:bg-stone-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}