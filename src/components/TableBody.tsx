import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

interface TableColumn {
  uid: string;
  name: string;
}

interface TableBodyProps {
  tableColumns: readonly TableColumn[];
  tableData: any[];
  renderCell: (item: any, columnUid: string) => any;
}

export default function TableBody({
  tableColumns,
  tableData,
  renderCell,
}: TableBodyProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const navigate = useNavigate();

  const getRowId = (item: any, index: number) => {
    return item._id || item.id || String(index);
  };

  const allSelected =
    tableData.length > 0 && selectedRows.length === tableData.length;

  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedRows([]);
      return;
    }

    const allRowIds = tableData.map((item, index) => getRowId(item, index));

    setSelectedRows(allRowIds);
  };

  const handleSelectRow = (rowId: string) => {
    setSelectedRows((previousRows) =>
      previousRows.includes(rowId)
        ? previousRows.filter((id) => id !== rowId)
        : [...previousRows, rowId],
    );
  };

  const handleRowClick = () => {
    navigate("/admin/bookings/details");
  };

  return (
    <div className="w-full overflow-hidden border border-stone-200/80 bg-surface-card shadow-xs">
      {/* Scrollable container for small screens */}
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[750px] border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200/80 bg-border-input text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              {/* Checkbox Column */}
              <th className="w-12 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                  className="size-4 cursor-pointer rounded border-stone-300 bg-border-input accent-emerald-700"
                />
              </th>

              {tableColumns.map((column) => (
                <th key={column.uid} className="px-4 py-4 whitespace-nowrap">
                  {column.name}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 text-xs text-stone-700">
            {tableData.length > 0 ? (
              tableData.map((item, index) => {
                const rowId = getRowId(item, index);
                const isSelected = selectedRows.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    onClick={handleRowClick}
                    className={`group cursor-pointer transition-colors hover:bg-stone-50/60 ${
                      isSelected ? "bg-stone-50/60" : ""
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td
                      className="px-4 py-4 text-center"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        aria-label={`Select row ${index + 1}`}
                        className="size-4 cursor-pointer rounded border-stone-300 accent-emerald-700"
                      />
                    </td>

                    {tableColumns.map((column) => (
                      <td
                        key={column.uid}
                        className="px-4 py-4 whitespace-nowrap"
                      >
                        {renderCell(item, column.uid)}
                      </td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={tableColumns.length + 1}
                  className="h-36 text-center text-sm font-medium text-stone-400"
                >
                  No data available to show
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer - Fully Responsive */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/80 bg-surface-card px-4 sm:px-6 py-4 text-sm text-[#4B5563]">
        <div className="text-xs sm:text-sm">Showing 1-10 of 248 bookings</div>

        <div className="flex items-center gap-1 text-stone-400">
          <button
            type="button"
            disabled
            className="cursor-pointer px-2 py-1 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            className="flex size-7 items-center justify-center rounded-full bg-emerald-800 font-medium text-white text-xs sm:text-sm"
          >
            1
          </button>

          <button
            type="button"
            className="cursor-pointer px-2 py-1 hover:text-stone-700"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
