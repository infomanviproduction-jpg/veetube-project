export function VideoCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-fade-in">
      <div className="aspect-video w-full rounded-xl skeleton" />
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full skeleton shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-full rounded skeleton" />
          <div className="h-4 w-2/3 rounded skeleton" />
          <div className="h-3 w-1/2 rounded skeleton" />
        </div>
      </div>
    </div>
  );
}

export function VideoGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
      {Array.from({ length: count }).map((_, i) => (
        <VideoCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function SearchResultSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex flex-col sm:flex-row gap-4">
          <div className="aspect-video w-full sm:w-80 rounded-xl skeleton shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-5 w-3/4 rounded skeleton" />
            <div className="h-3 w-1/2 rounded skeleton" />
            <div className="h-3 w-1/3 rounded skeleton" />
            <div className="h-3 w-full rounded skeleton" />
          </div>
        </div>
      ))}
    </div>
  );
}
