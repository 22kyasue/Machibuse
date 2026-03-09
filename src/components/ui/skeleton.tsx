interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-gray-200 ${className}`}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <Skeleton className="mb-3 h-5 w-3/4" />
      <Skeleton className="mb-2 h-4 w-1/2" />
      <Skeleton className="mb-4 h-3 w-1/3" />
      <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
        <Skeleton className="mx-auto h-8 w-8" />
        <Skeleton className="mx-auto h-8 w-8" />
        <Skeleton className="mx-auto h-8 w-8" />
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
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <Skeleton className="mb-2 h-5 w-2/3" />
          <Skeleton className="mb-1 h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <Skeleton className="mb-2 h-4 w-24" />
            <Skeleton className="h-9 w-12" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton className="mb-4 h-6 w-32" />
          <ListSkeleton count={3} />
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <Skeleton className="mb-4 h-6 w-32" />
          <ListSkeleton count={3} />
        </div>
      </div>
    </div>
  );
}
