import { Skeleton } from "@/components/ui/skeleton";

export function PropertyCardSkeleton({
  variant = "vertical",
}: {
  variant?: "vertical" | "horizontal";
}) {
  if (variant === "horizontal") {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm">
        <Skeleton className="w-full sm:w-64 md:w-72 lg:w-80 h-48 sm:h-auto shrink-0" />
        <div className="flex-1 p-5 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-6 w-3/4 rounded-lg" />
            <Skeleton className="h-4 w-1/2 rounded-lg" />
            <Skeleton className="h-12 w-full rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <Skeleton className="h-6 w-24 rounded-lg" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm space-y-4">
      <Skeleton className="w-full aspect-4/3" />
      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-2/3 rounded-lg" />
          <Skeleton className="h-5 w-12 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-1/2 rounded-lg" />
        <div className="flex gap-4">
          <Skeleton className="h-5 w-16 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-lg" />
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <Skeleton className="h-6 w-20 rounded-lg" />
          <Skeleton className="h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function PropertyGridSkeleton({
  count = 6,
  variant = "vertical",
}: {
  count?: number;
  variant?: "vertical" | "horizontal";
}) {
  return (
    <div
      className={
        variant === "horizontal"
          ? "flex flex-col gap-4"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      }
    >
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}
