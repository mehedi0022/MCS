import { Globe, Layers, Gauge, ShieldCheck } from "lucide-react"

export function ProjectMeta({ category }: { category: string }) {
  const items = [
    { icon: <Globe size={18} />, label: "Deployment", value: "Global" },
    { icon: <Layers size={18} />, label: "Sector", value: category },
    {
      icon: <Gauge size={18} />,
      label: "Status",
      value: "Operational",
      color: "text-emerald-500",
    },
    { icon: <ShieldCheck size={18} />, label: "Security", value: "Encrypted" },
  ]

  return (
    <div className="grid grid-cols-2 gap-8 border-y border-slate-200 py-8 md:grid-cols-4 dark:border-white/5">
      {items.map((item, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            {item.icon}
            <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
              {item.label}
            </span>
          </div>
          <p
            className={`text-sm font-bold tracking-tight dark:text-white ${item.color || "text-slate-900"}`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  )
}
