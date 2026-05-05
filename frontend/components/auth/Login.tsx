"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, EyeOff, Loader2, Lock, Mail, Anchor } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsPending(true)
    setError("")

    await new Promise((r) => setTimeout(r, 2000))
    setIsPending(false)
    setError("Access Denied: Invalid maritime credentials.")
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-6 transition-colors duration-500 dark:bg-[#020617]">
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0">
        {/* Adaptive Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.15),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_70%)]" />
        {/* Architectural Grid Lineage */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="mb-10 flex flex-col items-center text-center">
          <motion.div
            whileHover={{ rotate: -5, scale: 1.05 }}
            className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-[0_0_30px_rgba(20,184,166,0.3)]"
          >
            <Anchor className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
            Client Portal
          </h1>
          <p className="mt-2 text-sm font-medium tracking-wide text-slate-500 dark:text-slate-400">
            Secure access to MCS project intelligence
          </p>
        </div>

        {/* The Card: Adaptive Glassmorphism */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/70 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-all sm:p-10 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          {/* Decorative Background Element */}
          <Anchor className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rotate-12 text-slate-900/[0.03] dark:text-white/[0.03]" />

          <form onSubmit={handleLogin} className="relative z-10 space-y-7">
            {/* Email Input */}
            <div className="space-y-3">
              <label className="ml-1 text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase dark:text-slate-500">
                Work Email
              </label>
              <div className="group relative">
                <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary dark:text-slate-500" />
                <Input
                  required
                  type="email"
                  placeholder="name@company.com"
                  className="h-14 rounded-2xl border-slate-200 bg-slate-100/50 pl-12 text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <label className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase dark:text-slate-500">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[10px] font-bold tracking-widest text-primary uppercase transition-colors hover:opacity-80"
                >
                  Forgot?
                </Link>
              </div>
              <div className="group relative">
                <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary dark:text-slate-500" />
                <Input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="h-14 rounded-2xl border-slate-200 bg-slate-100/50 pr-12 pl-12 text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-600"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-900 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Terminal */}
            <div className="flex items-center space-x-3 px-1">
              <Checkbox
                id="remember"
                className="h-5 w-5 border-slate-300 data-[state=checked]:border-primary data-[state=checked]:bg-primary dark:border-white/10"
              />
              <label
                htmlFor="remember"
                className="cursor-pointer text-xs font-medium text-slate-500 transition-colors hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
              >
                Remember this terminal for 30 days
              </label>
            </div>

            {/* Error Message Section */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs font-bold text-rose-600 shadow-lg dark:text-rose-400"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary Action Button */}
            <Button
              disabled={isPending}
              className="h-16 w-full rounded-2xl bg-primary font-bold tracking-widest text-white shadow-[0_10px_30px_-10px_rgba(20,184,166,0.5)] transition-all hover:-translate-y-1 hover:bg-primary/90 active:scale-95"
            >
              {isPending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "INITIALIZE SESSION"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase dark:text-slate-600">
          SEC-Maritime Protocol v4.01 // MCS Global
        </p>
      </motion.div>
    </div>
  )
}
