import { Skeleton, CardSkeleton, ListSkeleton } from "@/components/ui/skeleton";

export default function MansionDetailLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-32" />
      <div>
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="mb-1 h-4 w-48" />
        <Skeleton className="h-3 w-40" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm text-center">
            <Skeleton className="mx-auto mb-1 h-8 w-12" />
            <Skeleton className="mx-auto h-3 w-16" />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-10 w-36" />
        <Skeleton className="h-10 w-44" />
      </div>
      <div>
        <Skeleton className="mb-4 h-6 w-40" />
        <ListSkeleton count={3} />
      </div>
    </div>
  );
}
