"use client"

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Clock3,
  Inbox,
  Loader2,
  MailOpen,
  MessageSquareReply,
  RefreshCcw,
  RotateCcw,
  Send,
  Trash2,
} from "lucide-react"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

type ContactMessage = {
  id: string
  name: string
  email: string
  phone?: string | null
  subject?: string | null
  message: string
  status: "NEW" | "READ" | "ARCHIVED"
  repliedAt?: string | null
  replyMessage?: string | null
  repliedBy?: string | null
  createdAt: string
}

const statusColors: Record<ContactMessage["status"], string> = {
  NEW: "bg-emerald-500/10 text-emerald-600",
  READ: "bg-sky-500/10 text-sky-600",
  ARCHIVED: "bg-zinc-500/10 text-zinc-600",
}

export default function AdminMessagesPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [inboxCount, setInboxCount] = useState(0)
  const [trashCount, setTrashCount] = useState(0)
  const [selectedId, setSelectedId] = useState<string>("")
  const [replyMessage, setReplyMessage] = useState("")
  const [replySubject, setReplySubject] = useState("")
  const [activeTab, setActiveTab] = useState<"inbox" | "trash">("inbox")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const selected = useMemo(
    () => messages.find((message) => message.id === selectedId),
    [messages, selectedId]
  )

  const loadMessages = useCallback(async () => {
    setLoading(true)
    setError("")

    try {
      const [activeResponse, inboxResponse, trashResponse] = await Promise.all([
        api.get<ApiResponse<ContactMessage[]>>("/messages", {
          params: { view: activeTab },
        }),
        api.get<ApiResponse<ContactMessage[]>>("/messages", {
          params: { view: "inbox" },
        }),
        api.get<ApiResponse<ContactMessage[]>>("/messages", {
          params: { view: "trash" },
        }),
      ])

      const rows = activeResponse.data.data
      setMessages(rows)
      setInboxCount(inboxResponse.data.data.length)
      setTrashCount(trashResponse.data.data.length)
      setSelectedId((current) =>
        rows.some((row) => row.id === current) ? current : (rows[0]?.id ?? "")
      )
    } catch (loadError) {
      if (getApiErrorMessage(loadError).toLowerCase().includes("auth")) {
        router.replace("/login")
      } else {
        setError(getApiErrorMessage(loadError))
      }
    } finally {
      setLoading(false)
    }
  }, [activeTab, router])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadMessages()
    }, 0)

    return () => window.clearTimeout(timer)
  }, [loadMessages])

  async function updateStatus(status: ContactMessage["status"]) {
    if (!selected) {
      return
    }

    try {
      setSaving(true)
      await api.patch(`/messages/${selected.id}/status`, { status })
      await loadMessages()
    } catch (statusError) {
      setError(getApiErrorMessage(statusError))
    } finally {
      setSaving(false)
    }
  }

  async function sendReply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selected) {
      return
    }

    try {
      setSaving(true)
      setError("")
      await api.post(`/messages/${selected.id}/reply`, {
        replyMessage,
        subject: replySubject || undefined,
      })
      setReplyMessage("")
      setReplySubject("")
      await loadMessages()
    } catch (replyError) {
      setError(getApiErrorMessage(replyError))
    } finally {
      setSaving(false)
    }
  }

  async function deleteSelectedMessage() {
    if (!selected) {
      return
    }

    const messageText =
      activeTab === "trash"
        ? "Delete this message permanently? This action cannot be undone."
        : "Move this message to trash?"

    const ok = window.confirm(messageText)
    if (!ok) {
      return
    }

    try {
      setSaving(true)
      setError("")
      await api.delete(`/messages/${selected.id}`, {
        params: activeTab === "trash" ? { force: true } : undefined,
      })

      const remaining = messages.filter((message) => message.id !== selected.id)
      setMessages(remaining)
      setSelectedId(remaining[0]?.id ?? "")
      setReplyMessage("")
      setReplySubject("")
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError))
    } finally {
      setSaving(false)
    }
  }

  async function restoreSelectedMessage() {
    if (!selected) {
      return
    }

    try {
      setSaving(true)
      setError("")
      await api.post(`/messages/${selected.id}/restore`)
      await loadMessages()
    } catch (restoreError) {
      setError(getApiErrorMessage(restoreError))
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="container mx-auto space-y-6 px-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border border-border bg-card p-4 shadow-maritime-sm">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex h-9 items-center gap-2 border border-border px-3 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              Back
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Messages</h1>
              <p className="text-sm text-muted-foreground">
                View enquiries, manage trash, and send replies.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className="h-10 rounded-none"
            onClick={loadMessages}
          >
            <RefreshCcw className="size-4" />
          </Button>
        </div>

        {error && (
          <div className="border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <section className="border border-border bg-card p-4 shadow-maritime-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <button
                onClick={() => setActiveTab("inbox")}
                className={cn(
                  "inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-bold uppercase tracking-wide",
                  activeTab === "inbox"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <Inbox className="size-4" />
                Inbox ({inboxCount})
              </button>
              <button
                onClick={() => setActiveTab("trash")}
                className={cn(
                  "inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-bold uppercase tracking-wide",
                  activeTab === "trash"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-muted"
                )}
              >
                <Trash2 className="size-4" />
                Trash ({trashCount})
              </button>
            </div>

            <div className="space-y-3">
              {loading ? (
                <div className="flex h-56 items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              ) : messages.length === 0 ? (
                <div className="flex h-56 items-center justify-center text-sm text-muted-foreground">
                  No messages yet.
                </div>
              ) : (
                messages.map((message) => (
                  <button
                    key={message.id}
                    onClick={() => setSelectedId(message.id)}
                    className={cn(
                      "w-full border border-border/70 p-3 text-left hover:bg-muted/40",
                      selectedId === message.id && "border-primary/40 bg-primary/5"
                    )}
                  >
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="line-clamp-1 text-sm font-bold">
                        {message.name}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-1 text-[10px] font-bold uppercase",
                          statusColors[message.status]
                        )}
                      >
                        {message.status}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-xs text-muted-foreground">
                      {message.subject || "General inquiry"}
                    </p>
                    <p className="line-clamp-2 pt-1 text-xs text-muted-foreground">
                      {message.message}
                    </p>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="border border-border bg-card p-5 shadow-maritime-sm">
            {!selected ? (
              <div className="flex h-80 items-center justify-center text-muted-foreground">
                Select a message to view details.
              </div>
            ) : (
              <div className="space-y-5">
                <div className="border border-border/80 p-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-xl font-bold">{selected.subject || "General inquiry"}</h2>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-bold",
                        statusColors[selected.status]
                      )}
                    >
                      {selected.status}
                    </span>
                  </div>
                  <div className="grid gap-2 text-sm md:grid-cols-2">
                    <p>
                      <span className="font-semibold">Name:</span> {selected.name}
                    </p>
                    <p>
                      <span className="font-semibold">Email:</span> {selected.email}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {selected.phone || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Received:</span>{" "}
                      {new Date(selected.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {selected.message}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {activeTab === "inbox" ? (
                    <>
                      <Button
                        variant="outline"
                        className="rounded-none"
                        onClick={() => updateStatus("READ")}
                        disabled={saving}
                      >
                        <MailOpen className="size-4" />
                        Mark Read
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-none"
                        onClick={() => updateStatus("ARCHIVED")}
                        disabled={saving}
                      >
                        <Clock3 className="size-4" />
                        Archive
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-none"
                        onClick={() => updateStatus("NEW")}
                        disabled={saving}
                      >
                        <Inbox className="size-4" />
                        Mark New
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-none"
                        onClick={deleteSelectedMessage}
                        disabled={saving}
                      >
                        <Trash2 className="size-4" />
                        Move To Trash
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        className="rounded-none"
                        onClick={restoreSelectedMessage}
                        disabled={saving}
                      >
                        <RotateCcw className="size-4" />
                        Restore
                      </Button>
                      <Button
                        variant="destructive"
                        className="rounded-none"
                        onClick={deleteSelectedMessage}
                        disabled={saving}
                      >
                        <Trash2 className="size-4" />
                        Delete Permanently
                      </Button>
                    </>
                  )}
                </div>

                {activeTab === "inbox" && (
                  <form
                    onSubmit={sendReply}
                    className="space-y-3 border border-border/80 p-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-primary">
                      <MessageSquareReply className="size-4" />
                      Reply via email
                    </div>
                    <input
                      type="text"
                      placeholder="Subject (optional)"
                      className="h-10 w-full border border-input bg-transparent px-3 text-sm outline-none focus:border-ring"
                      value={replySubject}
                      onChange={(event) => setReplySubject(event.target.value)}
                    />
                    <Textarea
                      required
                      placeholder="Write your reply..."
                      className="min-h-32 border-input px-3"
                      value={replyMessage}
                      onChange={(event) => setReplyMessage(event.target.value)}
                    />
                    <Button
                      type="submit"
                      className="h-11 gap-2 rounded-none"
                      disabled={saving || replyMessage.trim().length < 10}
                    >
                      {saving ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                      Send Reply
                    </Button>
                  </form>
                )}

                {selected.repliedAt && (
                  <div className="border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                    <p className="font-semibold">
                      Replied on {new Date(selected.repliedAt).toLocaleString()}
                    </p>
                    <p className="mt-2 whitespace-pre-line">{selected.replyMessage}</p>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}
