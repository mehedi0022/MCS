"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Lock,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [strength, setStrength] = useState(0)
  const [isPending, setIsPending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    let score = 0
    if (password.length > 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    setStrength(score)
  }, [password])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return

    setIsPending(true)
    // Simulate secure vault update
    await new Promise((r) => setTimeout(r, 2000))
    setIsPending(false)
    setIsSuccess(true)
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 p-6 transition-colors duration-500 dark:bg-[#020617]">
      {/* Background Visuals */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a0a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a0a_1px,transparent_1px)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/70 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-all sm:p-10 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div key="reset-form" exit={{ opacity: 0, scale: 0.95 }}>
                <div className="mb-8 text-center">
                  <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                    Secure New Credentials
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Update your maritime access key
                  </p>
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* New Password */}
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase dark:text-slate-500">
                      New Password
                    </label>
                    <div className="group relative">
                      <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary dark:text-slate-500" />
                      <Input
                        required
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="h-14 rounded-2xl border-slate-200 bg-slate-100/50 pl-12 text-slate-900 transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/5 dark:bg-white/5 dark:text-white"
                      />
                    </div>

                    {/* Strength Indicator */}
                    <div className="flex gap-1.5 px-1 pt-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={cn(
                            "h-1 flex-1 rounded-full transition-all duration-500",
                            strength >= step
                              ? "bg-primary shadow-[0_0_10px_rgba(20,184,166,0.4)]"
                              : "bg-slate-200 dark:bg-white/10"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase dark:text-slate-500">
                      Confirm Password
                    </label>
                    <div className="group relative">
                      <Lock className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary dark:text-slate-500" />
                      <Input
                        required
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••"
                        className={cn(
                          "h-14 rounded-2xl border-slate-200 bg-slate-100/50 pl-12 text-slate-900 transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/5 dark:bg-white/5 dark:text-white",
                          confirm &&
                            password !== confirm &&
                            "border-rose-500/50 focus:border-rose-500/50 focus:ring-rose-500/10"
                        )}
                      />
                    </div>
                    {confirm && password !== confirm && (
                      <p className="ml-1 text-[10px] font-bold tracking-widest text-rose-500 uppercase">
                        Passwords do not match
                      </p>
                    )}
                  </div>

                  <Button
                    disabled={isPending || strength < 2 || password !== confirm}
                    className="h-16 w-full rounded-2xl bg-primary font-bold tracking-widest text-white shadow-[0_10px_30px_-10px_rgba(20,184,166,0.5)] transition-all hover:-translate-y-1 hover:bg-primary/90 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "UPDATE ACCESS KEY"
                    )}
                  </Button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                  Vault Updated
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  Your security credentials have been successfully re-encrypted.
                  You may now access the portal.
                </p>
                <Link href="/login" className="mt-8 block">
                  <Button className="h-14 w-full rounded-2xl bg-slate-900 text-white transition-all hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200">
                    RETURN TO LOGIN <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="mt-8 text-center text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase dark:text-slate-600">
          SEC-Maritime Protocol v4.01 // MCS Global
        </p>
      </motion.div>
    </div>
  )
}
