"use client"

import React from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {
  CheckCircle2,
  AlertCircle,
  Info,
  XCircle,
  ArrowRight,
  Loader2,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type ModalType = "success" | "error" | "warning" | "info" | "loading"

interface DynamicModalProps {
  isOpen: boolean
  onClose: () => void
  type?: ModalType
  title: string
  description: string
  actionText?: string
  onAction?: () => void
  showCloseButton?: boolean
}

const modalConfig = {
  success: {
    icon: CheckCircle2,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    shadow: "shadow-[0_0_30px_rgba(16,185,129,0.16)]",
  },
  error: {
    icon: XCircle,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    shadow: "shadow-[0_0_30px_rgba(244,63,94,0.16)]",
  },
  warning: {
    icon: AlertCircle,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    shadow: "shadow-[0_0_30px_rgba(245,158,11,0.16)]",
  },
  info: {
    icon: Info,
    color: "text-primary",
    bgColor: "bg-primary/10",
    shadow: "shadow-[0_0_30px_rgba(20,184,166,0.16)]",
  },
  loading: {
    icon: Loader2,
    color: "text-primary",
    bgColor: "bg-primary/5",
    shadow: "shadow-none",
  },
}

export function DynamicModal({
  isOpen,
  onClose,
  type = "success",
  title,
  description,
  actionText = "Continue",
  onAction,
  showCloseButton = true,
}: DynamicModalProps) {
  const config = modalConfig[type]
  const Icon = config.icon

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-modal max-w-sm overflow-hidden rounded-[2rem] border-border/60 p-0 outline-none">
        <div className="flex flex-col items-center p-10 text-center">
          {/* Animated Icon Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={type}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={cn(
                "mb-8 flex h-24 w-24 items-center justify-center rounded-[2rem]",
                config.bgColor,
                config.shadow
              )}
            >
              <Icon
                className={cn(
                  "h-12 w-12",
                  config.color,
                  type === "loading" && "animate-spin"
                )}
              />
            </motion.div>
          </AnimatePresence>

          {/* Text Content */}
          <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground uppercase">
            {title}
          </h2>
          <p className="mt-4 px-2 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>

          {/* Action Footer */}
          <div className="mt-10 w-full space-y-3">
              <Button
                onClick={onAction || onClose}
                className={cn(
                  "group shadow-maritime-lg h-16 w-full rounded-2xl font-bold transition-all hover:-translate-y-1 active:scale-95",
                  type === "error"
                  ? "bg-rose-600 hover:bg-rose-700"
                  : "bg-primary"
              )}
            >
              {actionText}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Button>

            {showCloseButton && (
              <button
                onClick={onClose}
                className="text-[10px] font-bold tracking-[0.2em] text-muted-foreground uppercase transition-colors hover:text-foreground"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
