interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export default function Skeleton({
  rows = 4,
  columns = 5,
}: TableSkeletonProps) {
  return (
    <div className="w-full overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-stone-200/80 bg-stone-50/80">
              <th className="py-4 px-6 w-16">
                <div className="skeleton h-3 w-4 rounded-md"></div>
              </th>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <th className="py-4 px-6" key={colIndex}>
                  <div className="skeleton h-3 w-24 rounded-md"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                <td className="py-4 px-6">
                  <div className="skeleton h-3 w-4 rounded-md"></div>
                </td>
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td className="py-4 px-6" key={colIndex}>
                    <div className="skeleton h-4 w-32 rounded-md"></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

interface DashboardCardSkeletonProps {
  rows?: number;
  columns?: number;
}

export function DashboardCardSkeleton({
  rows = 4,
  columns = 5,
}: DashboardCardSkeletonProps) {
  return (
    <div className="w-full space-y-6">
      {/* Top Stat Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-stone-200/80 bg-white p-6 space-y-4 shadow-xs"
          >
            <div className="flex gap-4 items-center">
              <div className="skeleton size-12 rounded-xl shrink-0"></div>
              <div className="space-y-2 w-full">
                <div className="skeleton h-3 w-16 rounded-md"></div>
                <div className="skeleton h-5 w-24 rounded-md"></div>
              </div>
            </div>
            <div className="skeleton h-3 w-32 rounded-md"></div>
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <Skeleton rows={rows} columns={columns} />
    </div>
  );
}
