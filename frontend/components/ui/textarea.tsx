import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-base shadow-xs transition-[color,border-color,box-shadow,background-color] outline-none placeholder:text-muted-foreground/90 hover:border-primary/30 focus-visible:border-primary/45 focus-visible:bg-background focus-visible:shadow-[0_0_0_2px_color-mix(in_oklab,var(--color-primary)_14%,transparent)] disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm dark:aria-invalid:border-destructive/60",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
