import { Skeleton, ListSkeleton } from "@/components/ui/skeleton";

export default function WatchlistLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-5 w-28" />
      </div>
      <div>
        <Skeleton className="mb-3 h-6 w-40" />
        <ListSkeleton count={3} />
      </div>
    </div>
  );
}
