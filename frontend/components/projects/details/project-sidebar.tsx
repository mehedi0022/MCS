import { Globe, Layers, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ProjectSidebar({ category }: { category: string }) {
  return (
    <div className="sticky top-32 space-y-6">
      <div className="rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-white/5">
        <h4 className="mb-8 text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
          Project Parameters
        </h4>

        <div className="space-y-8">
          <SidebarItem
            icon={<Globe />}
            label="Deployment"
            value="International Waters"
          />
          <SidebarItem icon={<Layers />} label="Category" value={category} />
          <SidebarItem
            icon={<Gauge />}
            label="Status"
            value="Active"
            isStatus
          />
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8 dark:border-white/10">
          <Button className="h-14 w-full rounded-2xl bg-primary font-bold tracking-widest uppercase transition-all hover:bg-primary/90">
            Download Full Specs
          </Button>
        </div>
      </div>
      <p className="text-center text-[10px] font-bold tracking-widest text-slate-400 uppercase opacity-50">
        Authorized Access Only // MCS Global
      </p>
    </div>
  )
}

function SidebarItem({
  icon,
  label,
  value,
  isStatus,
}: {
  icon: any
  label: string
  value: string
  isStatus?: boolean
}) {
  return (
    <div className="flex items-center gap-5">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-primary shadow-inner dark:bg-white/5">
        {icon}
      </div>
      <div>
        <p className="mb-0.5 text-[10px] font-bold tracking-tighter text-slate-400 uppercase">
          {label}
        </p>
        <p
          className={cn(
            "text-sm font-bold tracking-tight",
            isStatus ? "text-emerald-500" : "text-slate-900 dark:text-white"
          )}
        >
          {value}
        </p>
      </div>
    </div>
  )
}
