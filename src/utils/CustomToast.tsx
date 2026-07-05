import { toast } from 'react-toastify';

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(
      <div className="flex items-start gap-3.5 p-1">
        {/* Unique Organic Leaf / Success Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-sm">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Content */}
        <div className="flex flex-col gap-0.5">
          <p className="font-bold text-stone-900 text-sm tracking-tight">Success</p>
          <p className="text-xs text-stone-500 font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    );
  },

  warning: (message: string) => {
    toast.warning(
      <div className="flex items-start gap-3.5 p-1">
        {/* Unique Warning Gold Shovel / Alert Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 9v4M12 17h.01" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M4.93 4.93a10 10 0 1114.14 14.14A10 10 0 014.93 4.93z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Content */}
        <div className="flex flex-col gap-0.5">
          <p className="font-bold text-stone-900 text-sm tracking-tight">Attention Needed</p>
          <p className="text-xs text-stone-500 font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    );
  },

  error: (message: string) => {
    toast.error(
      <div className="flex items-start gap-3.5 p-1">
        {/* Unique Crimson Error Icon */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-200 shadow-sm">
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        {/* Content */}
        <div className="flex flex-col gap-0.5">
          <p className="font-bold text-stone-900 text-sm tracking-tight">System Error</p>
          <p className="text-xs text-stone-500 font-medium leading-relaxed">{message}</p>
        </div>
      </div>
    );
  }
};