import { ShieldCheck } from "lucide-react"

interface ProjectHeaderProps {
  title: string
  description: string
}

export function ProjectHeader({ title, description }: ProjectHeaderProps) {
  return (
    <header className="space-y-6">
      {/* Verification Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
        <ShieldCheck className="h-3.5 w-3.5" />
        Verified Case Study
      </div>

      {/* Main Title */}
      <h1 className="font-heading text-4xl leading-[1.1] font-bold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
        {title}
      </h1>

      {/* Project Summary */}
      <p className="max-w-3xl text-xl leading-relaxed text-slate-500 dark:text-slate-400">
        {description}
      </p>
    </header>
  )
}
