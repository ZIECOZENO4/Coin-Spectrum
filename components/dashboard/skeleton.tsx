import { Skeleton } from "../ui/skeleton";

export const SkeletonDemo = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-32 p-4 mx-auto">
    <Skeleton className="h-12 w-12 rounded-full" />
    <Skeleton className="h-12 w-12 rounded-full" />
    <Skeleton className="h-12 w-12 rounded-full" />
    <Skeleton className="h-12 w-12 rounded-full" />
  </div>
);
