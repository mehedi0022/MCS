import { ShieldCheck } from "lucide-react"

interface ProjectHeaderProps {
  title: string
  summary: string
}

export function ProjectHeader({ title, summary }: ProjectHeaderProps) {
  return (
    <header className="space-y-6">
      {/* Verification Badge */}
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-primary uppercase">
        <ShieldCheck className="h-3.5 w-3.5" />
        Verified Case Study
      </div>

      {/* Main Title */}
      <h1 className="font-heading text-2xl leading-[1.1] font-bold tracking-tight text-slate-900 md:text-5xl dark:text-white">
        {title}
      </h1>

      {/* Project Summary */}
      <p className="max-w-3xl text-base leading-relaxed text-slate-500 md:text-xl dark:text-slate-400">
        {summary}
      </p>
    </header>
  )
}
