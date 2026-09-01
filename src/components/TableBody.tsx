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
      {/* Only allow horizontal scrolling when the screen is too small */}
      <div className="w-full overflow-x-auto lg:overflow-x-visible">
        <table className="w-full table-fixed border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200/80 bg-border-input text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              {/* Checkbox */}
              <th className="w-[3%] px-3 py-4">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                  className="size-4 cursor-pointer rounded border-stone-300 bg-border-input"
                />
              </th>

              {tableColumns.map((column) => (
                <th key={column.uid} className="px-2 py-4 whitespace-nowrap">
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
                      className="px-3 py-4"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(rowId)}
                        aria-label={`Select row ${index + 1}`}
                        className="size-4 cursor-pointer rounded border-stone-300"
                      />
                    </td>

                    {tableColumns.map((column) => (
                      <td key={column.uid} className="px-2 py-4">
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

      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-stone-200/80 bg-surface-card px-3 py-6 text-sm text-[#4B5563]">
        <div>Showing 1-10 of 248 bookings</div>

        <div className="flex items-center gap-1 text-stone-400">
          <button
            type="button"
            disabled
            className="cursor-pointer px-2 py-1 hover:text-stone-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            className="flex size-6 items-center justify-center rounded-full bg-emerald-800 font-medium text-white"
          >
            1
          </button>

          <button
            type="button"
            className="cursor-pointer px-2 py-1 hover:text-stone-700"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
