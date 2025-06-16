import { cn } from "../../lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Skeleton component for loading states
 * 
 * Used to show a placeholder while content is loading
 */
export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-200", className)}
      {...props}
    />
  );
}

/**
 * Text Skeleton component for loading text
 * 
 * Creates multiple lines of skeleton loading state for text
 */
export function TextSkeleton({ 
  lines = 3, 
  className 
}: { 
  lines?: number;
  className?: string;
}) {
  return (
    <div className="space-y-2">
      {Array(lines)
        .fill(0)
        .map((_, i) => (
          <Skeleton
            key={i}
            className={cn(
              "h-4",
              i === lines - 1 ? "w-3/4" : "w-full",
              className
            )}
          />
        ))}
    </div>
  );
}

/**
 * Card Skeleton component for loading card content
 * 
 * Creates a skeleton loading state for a card with header and content
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)}>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}