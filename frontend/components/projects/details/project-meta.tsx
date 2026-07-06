import { CalendarDays, Globe, Layers, UserRound } from "lucide-react"

interface ProjectMetaProps {
  year?: number | null
  date?: string | null
  location?: string | null
  category?: string | null
  client?: string | null
}

export function ProjectMeta({
  year,
  location,
  category,
  client,
}: ProjectMetaProps) {
  const items = [
    {
      icon: <CalendarDays size={18} />,
      label: "Year",
      value: year ? `${year}` : "-",
    },
    { icon: <Globe size={18} />, label: "Location", value: location || "-" },
    { icon: <Layers size={18} />, label: "Category", value: category || "-" },
    {
      icon: <UserRound size={18} />,
      label: "Client",
      value: client || "-",
      color: "text-slate-900 dark:text-white",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-8 border-y border-slate-200 py-8 md:grid-cols-4 dark:border-white/5">
      {items.map((item, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            {item.icon}
            <span className="text-[8px] md:text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
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
