"use client"

import React, { useState } from "react"
import {
  Send,
  Anchor,
  Loader2,
  CheckCircle2,
  Building2,
  Phone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { api, getApiErrorMessage } from "@/lib/api"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function ContactForm() {
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    service: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsPending(true)
    try {
      await api.post("/messages", {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phoneNumber,
        subject: `${formData.service || "General Inquiry"} - ${formData.companyName}`,
        message: formData.message,
      })

      setIsSuccess(true)
      setFormData({
        fullName: "",
        email: "",
        companyName: "",
        phoneNumber: "",
        service: "",
        message: "",
      })
    } catch (submitError) {
      setError(getApiErrorMessage(submitError))
    } finally {
      setIsPending(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="relative flex min-h-[600px] animate-in flex-col items-center justify-center overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-xl duration-500 zoom-in-95 fade-in dark:border-white/10 dark:bg-[#020617]/80">
        <div className="mb-6 rounded-full bg-emerald-500/10 p-4 dark:bg-emerald-500/20">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        </div>
        <h3 className="text-3xl font-bold text-foreground">Inquiry Received</h3>
        <p className="mt-4 max-w-xs text-muted-foreground">
          We have successfully logged your project brief. A senior consultant
          will reach out shortly.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setIsSuccess(false)
            setError("")
          }}
          className="mt-8 rounded-full border-primary/20 hover:bg-primary/5"
        >
          New Inquiry
        </Button>
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-8 shadow-xl sm:p-12 dark:border-white/10 dark:bg-[#020617]/80">
      <Anchor className="pointer-events-none absolute -top-12 -right-12 h-64 w-64 rotate-12 text-primary/5 dark:text-primary/10" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
        {error && (
          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 p-4 text-sm font-semibold text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-3">
            <label className="ml-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Full Name
            </label>
            <Input
              required
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 px-5 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-slate-900/50"
            />
          </div>

          {/* Email Address */}
          <div className="space-y-3">
            <label className="ml-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Email Address
            </label>
            <Input
              required
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 px-5 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-slate-900/50"
            />
          </div>

          {/* Company Name */}
          <div className="space-y-3">
            <label className="ml-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Company Name
            </label>
            <div className="relative">
              <Input
                required
                placeholder="Company Name"
                value={formData.companyName}
                onChange={(e) =>
                  setFormData({ ...formData, companyName: e.target.value })
                }
                className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 pr-5 pl-12 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-slate-900/50"
              />
              <Building2 className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            </div>
          </div>

          {/* Phone Number */}
          <div className="space-y-3">
            <label className="ml-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
              Phone Number
            </label>
            <div className="relative">
              <Input
                required
                type="tel"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) =>
                  setFormData({ ...formData, phoneNumber: e.target.value })
                }
                className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 pr-5 pl-12 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-slate-900/50"
              />
              <Phone className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
            </div>
          </div>
        </div>
        {/* Service of Interest */}
        <div className="space-y-3">
          <label className="ml-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Service of Interest
          </label>
          <Select
            required
            value={formData.service}
            onValueChange={(value) =>
              setFormData({ ...formData, service: value || "" })
            }
          >
            <SelectTrigger className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 px-5 text-left text-sm transition-all focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-slate-900/50">
              <SelectValue placeholder="Select a maritime service" />
            </SelectTrigger>
            <SelectContent className="glass-modal rounded-2xl border-border/50 bg-background/95 shadow-2xl dark:bg-maritime-abyss/98">
              <SelectItem
                value="Port Development & Logistics"
                className="cursor-pointer rounded-xl py-3"
              >
                Port Development & Logistics
              </SelectItem>
              <SelectItem
                value="Offshore Engineering"
                className="cursor-pointer rounded-xl py-3"
              >
                Offshore Engineering
              </SelectItem>
              <SelectItem
                value="Fleet Tech Integration"
                className="cursor-pointer rounded-xl py-3"
              >
                Fleet Tech Integration
              </SelectItem>
              <SelectItem
                value="Environmental Compliance"
                className="cursor-pointer rounded-xl py-3"
              >
                Environmental Compliance
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Message */}
        <div className="space-y-3">
          <label className="ml-1 text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase">
            Brief Message
          </label>
          <Textarea
            required
            placeholder="Describe your requirements..."
            value={formData.message}
            onChange={(e) =>
              setFormData({ ...formData, message: e.target.value })
            }
            className="min-h-[120px] w-full rounded-[1.5rem] border-slate-200 bg-slate-50 p-5 text-sm transition-all focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-slate-900/50"
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isPending}
          className="group shadow-maritime hover:shadow-maritime-lg h-16 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground transition-all hover:-translate-y-1 active:scale-[0.98] disabled:opacity-70"
        >
          {isPending ? (
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>TRANSMITTING...</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <span>SEND ENQUIRY</span>
              <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </div>
          )}
        </Button>
      </form>
    </div>
  )
}
