"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown } from "lucide-react"

type FaqItem = {
  q: string
  a: string
}

type FaqGroup = {
  title: string
  items: FaqItem[]
}

type FaqAccordionProps = {
  groups: FaqGroup[]
}

export function FaqAccordion({ groups }: FaqAccordionProps) {
  const [openByGroup, setOpenByGroup] = useState<Record<string, number | null>>(
    () =>
      Object.fromEntries(
        groups.map((group, index) => [group.title, index === 0 ? 0 : null])
      )
  )

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {groups.map((group) => (
        <section
          key={group.title}
          className="h-fit rounded-2xl border border-slate-200 bg-white p-7 dark:border-white/10 dark:bg-white/5"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            {group.title}
          </h2>
          <div className="mt-5 space-y-4">
            {group.items.map((item, idx) => {
              const isOpen = openByGroup[group.title] === idx
              const panelId = `${group.title.replace(/\s+/g, "-").toLowerCase()}-${idx}`

              return (
                <div
                  key={item.q}
                  className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 dark:border-white/10 dark:bg-[#020617]/60"
                >
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() =>
                      setOpenByGroup((prev) => ({
                        ...prev,
                        [group.title]: isOpen ? null : idx,
                      }))
                    }
                    className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      {item.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-slate-500 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-primary" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-slate-200 px-5 py-4 dark:border-white/10">
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            {item.a}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
