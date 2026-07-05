"use client"

import React, { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api, getApiErrorMessage, type ApiResponse } from "@/lib/api"

type ForgotPasswordResponse = {
  message: string
  resetUrl?: string
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [statusMessage, setStatusMessage] = useState("")
  const [devResetUrl, setDevResetUrl] = useState("")

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsPending(true)

    try {
      const response = await api.post<ApiResponse<ForgotPasswordResponse>>(
        "/auth/forgot-password",
        { email }
      )
      setStatusMessage(response.data.data.message)
      setDevResetUrl(response.data.data.resetUrl ?? "")
      setIsSent(true)
    } catch (error) {
      setError(getApiErrorMessage(error))
    } finally {
      setIsPending(false)
    }
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
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white/70 p-8 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] backdrop-blur-3xl transition-all sm:p-10 dark:border-white/10 dark:bg-white/5 dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
          <AnimatePresence mode="wait">
            {isSent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                </div>
                <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                  Reset Link Sent
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {statusMessage ||
                    "Recovery instructions have been dispatched to your registered work address. Please check your inbox."}
                </p>
                {devResetUrl && (
                  <a
                    href={devResetUrl}
                    className="mt-5 block rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs font-semibold break-all text-emerald-700 transition-colors hover:bg-emerald-500/15 dark:text-emerald-300"
                  >
                    Open local reset link
                  </a>
                )}
                <Link href="/login" className="mt-8 block cursor-pointer">
                  <Button
                    variant="outline"
                    className="w-full rounded-2xl border-slate-200 hover:bg-slate-100 dark:border-white/10 dark:text-white dark:hover:bg-white/5"
                  >
                    RETURN TO TERMINAL
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }}>
                <div className="mb-8 flex flex-col items-center text-center">
                  <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/5 dark:bg-white/5">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold tracking-tight text-slate-900 uppercase dark:text-white">
                    Reset Access
                  </h2>
                  <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    Verify credentials to receive recovery link
                  </p>
                </div>

                <form onSubmit={handleReset} className="space-y-6">
                  <div className="space-y-3">
                    <label className="ml-1 text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase dark:text-slate-500">
                      Work Email
                    </label>
                    <div className="group relative">
                      <Mail className="absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary dark:text-slate-500" />
                      <Input
                        required
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="name@company.com"
                        className="h-14 rounded-2xl border-slate-200 bg-slate-100/50 pl-12 text-slate-900 transition-all placeholder:text-slate-400 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder:text-slate-600"
                      />
                    </div>
                  </div>

                  {error && (
                    <p
                      role="alert"
                      className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-600 dark:text-rose-300"
                    >
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    disabled={isPending}
                    className="h-16 w-full cursor-pointer rounded-2xl bg-primary font-bold tracking-widest text-white shadow-[0_10px_30px_-10px_rgba(20,184,166,0.5)] transition-all hover:-translate-y-1 hover:bg-primary/90 active:scale-95"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      "SEND RESET LINK"
                    )}
                  </Button>

                  <Link
                    href="/login"
                    className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase transition-colors hover:text-slate-900 dark:text-slate-500 dark:hover:text-white"
                  >
                    <ArrowLeft size={14} /> Back to Login
                  </Link>
                </form>
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
