import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border border-emerald-200",
        secondary:
          "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
        destructive:
          "bg-red-100 text-red-800 hover:bg-red-200 border border-red-200",
        outline:
          "text-slate-700 border border-slate-200 hover:bg-slate-100",
        success:
          "bg-green-100 text-green-800 hover:bg-green-200 border border-green-200",
        warning:
          "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-200",
        info:
          "bg-blue-100 text-blue-800 hover:bg-blue-200 border border-blue-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };