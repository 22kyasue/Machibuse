import { Skeleton, ListSkeleton } from "@/components/ui/skeleton";

export default function UnitDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div>
        <Skeleton className="mb-2 h-8 w-72" />
        <Skeleton className="mb-2 h-4 w-48" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Skeleton className="mb-4 h-64 w-full" />
      </div>
      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <Skeleton className="mb-3 h-6 w-32" />
        <div className="grid grid-cols-3 gap-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
      <div>
        <Skeleton className="mb-3 h-6 w-32" />
        <ListSkeleton count={2} />
      </div>
    </div>
  );
}
