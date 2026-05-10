"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2, Save, Users } from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type UserItem = {
  id: string
  name: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

type UserFormState = {
  name: string
  email: string
  password: string
  role: string
}

const emptyForm: UserFormState = {
  name: "",
  email: "",
  password: "",
  role: "ADMIN",
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<UserItem[]>([])
  const [roles, setRoles] = useState<string[]>(["ADMIN"])
  const [form, setForm] = useState<UserFormState>(emptyForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    void loadData()
  }, [])

  async function loadData() {
    try {
      setIsLoading(true)
      setError("")

      const [usersResponse, rolesResponse] = await Promise.all([
        api.get<ApiResponse<UserItem[]>>("/users"),
        api.get<ApiResponse<string[]>>("/users/roles"),
      ])

      const roleList = rolesResponse.data.data
      setUsers(usersResponse.data.data)
      setRoles(roleList)
      setForm((current) => ({
        ...current,
        role: roleList[0] ?? "ADMIN",
      }))
    } catch (loadError) {
      const message = getApiErrorMessage(loadError)
      if (message.toLowerCase().includes("auth")) {
        router.replace("/login")
        return
      }
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }

  function updateField<K extends keyof UserFormState>(key: K, value: UserFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccess("")
    setIsSaving(true)

    try {
      await api.post("/users", form)
      setSuccess("User created successfully.")
      setForm({
        name: "",
        email: "",
        password: "",
        role: roles[0] ?? "ADMIN",
      })
      await loadData()
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsSaving(false)
    }
  }

  async function toggleUserStatus(user: UserItem) {
    try {
      setError("")
      setSuccess("")
      setStatusUpdatingId(user.id)
      await api.patch(`/users/${user.id}/status`, {
        isActive: !user.isActive,
      })
      setSuccess(
        user.isActive ? "User deactivated successfully." : "User activated successfully."
      )
      await loadData()
    } catch (statusError) {
      setError(getApiErrorMessage(statusError))
    } finally {
      setStatusUpdatingId(null)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto space-y-6 px-6">
        <div className="flex items-center justify-between border border-border bg-card p-4 shadow-maritime-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex h-9 items-center gap-2 border border-border px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Users</h1>
              <p className="text-sm text-muted-foreground">
                Create and manage admin user accounts.
              </p>
            </div>
          </div>
          <div className="inline-flex h-10 items-center gap-2 border border-border px-3 text-sm font-semibold">
            <Users className="size-4" />
            {users.length} Users
          </div>
        </div>

        {error && (
          <div className="border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}
        {success && (
          <div className="border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
            {success}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          <section className="border border-border bg-card p-5 shadow-maritime-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              User List
            </h2>
            {isLoading ? (
              <div className="flex h-56 items-center justify-center">
                <Loader2 className="size-5 animate-spin text-primary" />
              </div>
            ) : users.length === 0 ? (
              <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
                No users found.
              </div>
            ) : (
              <div className="space-y-2">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="grid gap-3 border border-border/80 p-3 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="flex items-center gap-2 md:flex-col md:items-end">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary">
                        {user.role}
                      </p>
                      <span
                        className={`px-2 py-1 text-[10px] font-bold uppercase ${
                          user.isActive
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                            : "bg-destructive/10 text-destructive"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </p>
                      <Button
                        type="button"
                        variant={user.isActive ? "destructive" : "outline"}
                        size="sm"
                        className="rounded-none"
                        onClick={() => toggleUserStatus(user)}
                        disabled={statusUpdatingId === user.id}
                      >
                        {statusUpdatingId === user.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : null}
                        {user.isActive ? "Deactivate" : "Activate"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="border border-border bg-card p-5 shadow-maritime-sm">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Create User
            </h2>
            <form onSubmit={submitForm} className="space-y-4">
              <Input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="border-input px-3"
              />
              <Input
                required
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="border-input px-3"
              />
              <Input
                required
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => updateField("password", e.target.value)}
                className="border-input px-3"
              />
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Role
                </label>
                <select
                  value={form.role}
                  onChange={(e) => updateField("role", e.target.value)}
                  className="h-10 w-full border border-input bg-background px-3 text-sm"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-none"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Save className="size-4" />
                )}
                Create User
              </Button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}
