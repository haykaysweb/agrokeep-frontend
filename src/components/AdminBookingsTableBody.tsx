import { useState } from "react";
import Pagination from "./Pagination";

interface TableColumn {
  uid: string;
  name: string;
}

interface PaginationInfo {
  total: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface TableRow {
  _id?: string;
  id?: string;
  [key: string]: unknown;
}

interface TableBodyProps {
  tableColumns: readonly TableColumn[];
  tableData: TableRow[];
  renderCell: (item: TableRow, columnUid: string) => React.ReactNode;
  isLoading?: boolean;
  pagination?: PaginationInfo;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: TableRow) => void;
  itemLabel?: string;
  emptyMessage?: string;
  skeletonRowCount?: number;
  minHeight?: string;
}

export default function TableBody({
  tableColumns,
  tableData,
  renderCell,
  isLoading = false,
  pagination,
  onPageChange,
  onRowClick,
  itemLabel = "items",
  emptyMessage = "No data available to show",
  skeletonRowCount = 8,
  minHeight = "min-h-[420px]",
}: TableBodyProps) {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const getRowId = (item: TableRow, index: number) => {
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

  const itemsPerPage = 10;
  const startItem = pagination
    ? (pagination.currentPage - 1) * itemsPerPage + 1
    : null;
  const endItem = pagination
    ? Math.min(pagination.currentPage * itemsPerPage, pagination.total)
    : null;

  return (
    <div
      className={`flex w-full flex-col overflow-hidden border border-stone-200/80 bg-surface-card shadow-xs ${minHeight}`}
    >
      <div className="w-full flex-1 overflow-x-auto">
        <table className="w-full min-w-[750px] border-collapse text-left">
          <thead>
            <tr className="border-b border-stone-200/80 bg-border-input text-[11px] font-semibold tracking-wider text-stone-500 uppercase">
              <th className="w-12 px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                  aria-label="Select all rows"
                  disabled={isLoading}
                  className="size-4 cursor-pointer rounded border-stone-300 bg-border-input accent-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
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
            {isLoading ? (
              Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <tr key={`skeleton-${rowIndex}`}>
                  <td className="px-4 py-4">
                    <div className="mx-auto size-4 animate-pulse rounded bg-stone-200" />
                  </td>
                  {tableColumns.map((column) => (
                    <td key={column.uid} className="px-4 py-4">
                      <div className="h-3.5 w-full max-w-24 animate-pulse rounded bg-stone-200" />
                    </td>
                  ))}
                </tr>
              ))
            ) : tableData.length > 0 ? (
              tableData.map((item, index) => {
                const rowId = getRowId(item, index);
                const isSelected = selectedRows.includes(rowId);

                return (
                  <tr
                    key={rowId}
                    onClick={onRowClick ? () => onRowClick(item) : undefined}
                    className={`group transition-colors hover:bg-stone-50/60 ${
                      onRowClick ? "cursor-pointer" : ""
                    } ${isSelected ? "bg-stone-50/60" : ""}`}
                  >
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
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && onPageChange && tableData.length > 0 && (
        <div className="mt-auto flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-200/80 bg-surface-card px-4 sm:px-6 py-4">
          <div className="text-xs sm:text-sm text-[#4B5563]">
            Showing {startItem}-{endItem} of {pagination.total} {itemLabel}
          </div>

          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            hasNextPage={pagination.hasNextPage}
            hasPrevPage={pagination.hasPrevPage}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
