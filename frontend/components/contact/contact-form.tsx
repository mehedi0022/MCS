"use client"

import React from "react"
import { Send, Anchor } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactForm() {
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Handle submission logic here
  }

  return (
    <div className="glass-strong shadow-maritime-xl relative overflow-hidden rounded-[2.5rem] p-8 sm:p-12 dark:bg-white/5">
      {/* Decorative Anchor background icon */}
      <Anchor className="absolute -top-12 -right-12 h-64 w-64 rotate-12 text-primary/5 dark:text-white/5" />

      <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Doe"
              className="h-12 w-full rounded-2xl border border-border/50 bg-background/50 px-4 text-sm transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/5 dark:focus:border-maritime-teal"
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Work Email
            </label>
            <input
              type="email"
              placeholder="john@company.com"
              className="h-12 w-full rounded-2xl border border-border/50 bg-background/50 px-4 text-sm transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/5 dark:focus:border-maritime-teal"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Subject
          </label>
          <select className="h-12 w-full rounded-2xl border border-border/50 bg-background/50 px-4 text-sm transition-all outline-none focus:border-primary dark:border-white/10 dark:bg-white/5 dark:text-maritime-horizon">
            <option>Port Development Inquiry</option>
            <option>Offshore Strategy</option>
            <option>Sustainability Consulting</option>
            <option>Fleet Technology</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-xs font-bold tracking-widest text-muted-foreground uppercase">
            Message
          </label>
          <textarea
            rows={5}
            placeholder="Tell us about your project requirements..."
            className="w-full rounded-2xl border border-border/50 bg-background/50 p-4 text-sm transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 dark:border-white/10 dark:bg-white/5 dark:focus:border-maritime-teal"
          />
        </div>

        <Button
          type="submit"
          className="group shadow-maritime hover:shadow-maritime-lg h-14 w-full rounded-2xl bg-primary text-base font-bold text-primary-foreground transition-all hover:-translate-y-1 active:scale-[0.98]"
        >
          Send Message
          <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </Button>

        <p className="text-center text-xs text-muted-foreground">
          By submitting, you agree to our{" "}
          <a href="/privacy" className="underline hover:text-primary">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="underline hover:text-primary">
            Terms of Service
          </a>
          .
        </p>
      </form>
    </div>
  )
}
