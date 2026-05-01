import Link from "next/link"
import { Compass, ArrowLeft, Anchor } from "lucide-react"

export default function NotFound() {
  return (
    <div className="bg-maritime-surface texture-maritime-noise relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden dark:bg-maritime-abyss">
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-maritime-ocean/10 blur-[120px] dark:bg-maritime-teal/10" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-[80px] dark:bg-primary/10" />

      {/* Grid Pattern Overlay (Premium SaaS touch) */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)] bg-[size:24px_24px]" />

      <div className="relative z-10 container flex flex-col items-center px-6 text-center">
        {/* Animated Compass Icon */}
        <div className="shadow-maritime-lg mb-8 flex h-20 w-20 items-center justify-center rounded-2xl border border-border/50 bg-background/50 backdrop-blur-xl dark:border-white/10 dark:bg-white/5">
          <Compass className="h-10 w-10 animate-[spin_10s_linear_infinite] text-maritime-ocean dark:text-maritime-teal" />
        </div>

        {/* 404 Typography */}
        <h1 className="bg-gradient-to-b from-maritime-navy to-maritime-sea bg-clip-text text-[8rem] leading-none font-bold tracking-tighter text-transparent sm:text-[12rem] dark:from-white dark:to-white/20">
          404
        </h1>

        <div className="mt-4 max-w-lg space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl dark:text-maritime-horizon">
            Navigated off the chart.
          </h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            It looks like the page you are looking for has drifted away or
            doesn't exist. Let's get you back to familiar waters.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group shadow-maritime hover:shadow-maritime-lg flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-8 font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:bg-primary/90"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Return to Port
          </Link>
          <Link
            href="/contact"
            className="group flex h-12 items-center justify-center gap-2 rounded-full border border-border/50 bg-background/50 px-8 font-medium text-foreground backdrop-blur-md transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:text-maritime-foam"
          >
            <Anchor className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary dark:group-hover:text-maritime-foam" />
            Contact Support
          </Link>
        </div>
      </div>
      <div className="pointer-events-none absolute right-0 bottom-0 left-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}
