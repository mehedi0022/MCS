"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProjectNavbar({ id }: { id: number | string }) {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-white/5 dark:bg-[#020617]/80">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link
          href="/projects"
          className="group flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase transition-colors hover:text-primary dark:text-slate-400"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Portfolio
        </Link>
        <div className="hidden items-center gap-6 md:flex">
          <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase dark:text-slate-600">
            Ref: MCS-{id} 2026
          </span>
          <Button
            size="sm"
            className="rounded-full px-6 font-bold tracking-tighter shadow-lg shadow-primary/20"
          >
            REQUEST DOSSIER
          </Button>
        </div>
      </div>
    </nav>
  )
}
