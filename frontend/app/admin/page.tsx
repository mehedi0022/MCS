"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowUpRight,
  BriefcaseBusiness,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  LogOut,
  MessageCircleWarning,
  Plus,
  Compass,
  Route,
  Settings,
  ShieldCheck,
  ShipWheel,
  Users,
} from "lucide-react"
import { HeroSlidesManager } from "@/components/admin/HeroSlidesManager"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { cn } from "@/lib/utils"

type Summary = {
  services: number
  projects: number
  messages: number
  unreadMessages: number
  heroSlides: number
}

type MeResponse = {
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard, active: true },
  { label: "Services", href: "/admin/services", icon: BriefcaseBusiness },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Messages", href: "/admin/messages", icon: Inbox },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "What We Do", href: "/admin/what-we-do", icon: Compass },
  { label: "Journey", href: "/admin/journey", icon: Route },
  { label: "Settings", href: "/admin/settings", icon: Settings },
]

const emptySummary: Summary = {
  services: 0,
  projects: 0,
  messages: 0,
  unreadMessages: 0,
  heroSlides: 0,
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [summary, setSummary] = useState<Summary>(emptySummary)
  const [user, setUser] = useState<MeResponse["user"] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [me, stats] = await Promise.all([
          api.get("/auth/me"),
          api.get("/dashboard/summary"),
        ])
        setUser(me.data.data.user)
        setSummary(stats.data.data)
      } catch {
        router.replace("/login")
      } finally {
        setIsLoading(false)
      }
    }

    loadDashboard()
  }, [router])

  async function handleLogout() {
    await api.post("/auth/logout")
    router.replace("/login")
    router.refresh()
  }

  const stats = [
    {
      label: "Hero slides",
      value: summary.heroSlides,
      icon: LayoutDashboard,
      tone: "text-maritime-sea",
    },
    {
      label: "Published services",
      value: summary.services,
      icon: BriefcaseBusiness,
      tone: "text-maritime-ocean",
    },
    {
      label: "Project entries",
      value: summary.projects,
      icon: FolderKanban,
      tone: "text-maritime-teal",
    },
    {
      label: "Total messages",
      value: summary.messages,
      icon: Inbox,
      tone: "text-maritime-brass",
    },
    {
      label: "Unread messages",
      value: summary.unreadMessages,
      icon: MessageCircleWarning,
      tone: "text-destructive",
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-24 text-foreground">
      <div className="container mx-auto grid gap-6 px-6 pb-12 lg:grid-cols-[260px_1fr]">
        <aside className="shadow-maritime-sm h-fit border border-border bg-card p-4">
          <div className="mb-6 flex items-center gap-3 border-b border-border pb-4">
            <div className="flex size-10 items-center justify-center bg-primary text-primary-foreground">
              <ShipWheel className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold tracking-wide uppercase">
                MCS Admin
              </p>
              <p className="text-xs text-muted-foreground">Operations desk</p>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex h-11 w-full items-center gap-3 px-3 text-left text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground",
                  item.active &&
                    "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="space-y-6">
          <section className="shadow-maritime-sm flex flex-col justify-between gap-4 border border-border bg-card p-5 md:flex-row md:items-center">
            <div>
              <div className="mb-2 flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-primary uppercase">
                <ShieldCheck className="size-4" />
                Protected dashboard
              </div>
              <h1 className="text-3xl font-bold tracking-tight">
                Welcome back{user?.name ? `, ${user.name}` : ""}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage services, project records, contact messages, and admin
                operations from one place.
              </p>
            </div>

            <div className="flex gap-2">
              <Button className="h-11 gap-2 rounded-none">
                <Plus className="size-4" />
                New Entry
              </Button>
              <Button
                variant="outline"
                className="h-11 gap-2 rounded-none"
                onClick={handleLogout}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="shadow-maritime-sm border border-border bg-card p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <stat.icon className={cn("size-5", stat.tone)} />
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold">
                  {isLoading ? "-" : stat.value}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {stat.label}
                </p>
              </div>
            ))}
          </section>

          <HeroSlidesManager />
        </main>
      </div>
    </div>
  )
}
