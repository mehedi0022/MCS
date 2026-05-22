import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-base shadow-xs transition-[color,border-color,box-shadow,background-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground/90 hover:border-primary/30 focus-visible:border-primary/45 focus-visible:bg-background focus-visible:shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-primary)_14%,transparent)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:aria-invalid:border-destructive/60",
        className
      )}
      {...props}
    />
  )
}

export { Input }
