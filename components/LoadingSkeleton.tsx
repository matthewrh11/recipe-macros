import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-7 w-2/3" />
        <Skeleton className="h-4 w-1/4" />
      </div>

      {/* Toggle placeholder */}
      <Skeleton className="h-9 w-52" />

      {/* Macro cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 flex flex-col gap-2">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-8 w-20" />
          </div>
        ))}
      </div>

      {/* Ingredient list */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-32" />
        <div className="flex flex-col gap-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
