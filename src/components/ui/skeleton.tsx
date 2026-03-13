interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-slate-100 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <Skeleton className="mb-3 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mb-4 h-3 w-1/3" />
      <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
        <Skeleton className="mx-auto h-8 w-8 rounded-full" />
        <Skeleton className="mx-auto h-8 w-8 rounded-full" />
        <Skeleton className="mx-auto h-8 w-8 rounded-full" />
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"
        >
          <Skeleton className="mb-2 h-5 w-2/3" />
          <Skeleton className="mb-1.5 h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <Skeleton className="mb-3 h-3 w-16" />
            <Skeleton className="h-10 w-14" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <Skeleton className="mb-4 h-5 w-24" />
          <ListSkeleton count={3} />
        </div>
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <Skeleton className="mb-4 h-5 w-24" />
          <ListSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}
