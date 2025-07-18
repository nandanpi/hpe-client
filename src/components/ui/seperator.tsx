/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react";
import { cn } from "../../lib/utils"; 

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("shrink-0 bg-zinc-200 dark:bg-zinc-700 h-[1px] w-full", className)}
      {...props}
    />
  )
);
Separator.displayName = "Separator";

export { Separator };

