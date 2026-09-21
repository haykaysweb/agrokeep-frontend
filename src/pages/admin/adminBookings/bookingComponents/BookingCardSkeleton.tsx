export default function BookingCardSkeleton() {
  return (
    <div className="bg-surface-card rounded-2xl shadow-sm border border-border-light/50 overflow-hidden flex flex-col md:flex-row mt-10 animate-pulse">
      <div className="w-full md:w-72 shrink-0 min-h-[180px] md:min-h-full bg-stone-200" />

      <div className="flex-1 p-4 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="h-5 w-1/3 bg-stone-200 rounded" />
          <div className="h-3 w-1/2 bg-stone-200 rounded" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-3 border-t border-border-light/60">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="space-y-1.5">
              <div className="h-2.5 w-16 bg-stone-200 rounded" />
              <div className="h-3.5 w-12 bg-stone-200 rounded" />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="h-8 w-40 bg-stone-200 rounded-full" />
          <div className="h-8 w-32 bg-stone-200 rounded-full" />
        </div>
      </div>
    </div>
  );
}
