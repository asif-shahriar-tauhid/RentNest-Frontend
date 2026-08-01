import { PropertyGridSkeleton } from "@/components/property/PropertySkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProperties() {
  return (
    <div className="bg-background min-h-screen pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-72 shrink-0 space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-2xl" />
          </aside>
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <Skeleton className="h-4 w-64 rounded-md" />
            </div>
            <PropertyGridSkeleton count={4} variant="horizontal" />
          </div>
        </div>
      </div>
    </div>
  );
}
