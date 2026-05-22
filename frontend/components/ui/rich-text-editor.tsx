"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Pilcrow,
  List,
  ListOrdered,
  IndentIncrease,
  IndentDecrease,
  Link2,
} from "lucide-react"

type RichTextEditorProps = {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

type Action = {
  label: string
  command: string
  value?: string
  icon: React.ComponentType<{ className?: string }>
}

const actions: Action[] = [
  { label: "Bold", command: "bold", icon: Bold },
  { label: "Italic", command: "italic", icon: Italic },
  { label: "Underline", command: "underline", icon: Underline },
  { label: "Delete", command: "strikeThrough", icon: Strikethrough },
  { label: "Heading 1", command: "formatBlock", value: "h1", icon: Heading1 },
  { label: "Heading 2", command: "formatBlock", value: "h2", icon: Heading2 },
  { label: "Heading", command: "formatBlock", value: "h3", icon: Heading3 },
  { label: "Heading 4", command: "formatBlock", value: "h4", icon: Heading4 },
  { label: "Paragraph", command: "formatBlock", value: "p", icon: Pilcrow },
  { label: "Bullets", command: "insertUnorderedList", icon: List },
  { label: "Numbers", command: "insertOrderedList", icon: ListOrdered },
  { label: "Indent", command: "indent", icon: IndentIncrease },
  { label: "Outdent", command: "outdent", icon: IndentDecrease },
]

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content...",
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [activeCommands, setActiveCommands] = useState<Record<string, boolean>>(
    {}
  )

  useEffect(() => {
    if (!editorRef.current) return
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  function runCommand(action: Action) {
    editorRef.current?.focus()
    document.execCommand(action.command, false, action.value)
    onChange(editorRef.current?.innerHTML ?? "")
    syncCommandState()
  }

  function syncCommandState() {
    const state: Record<string, boolean> = {
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      indent: false,
      outdent: false,
    }
    const format = (document.queryCommandValue("formatBlock") || "")
      .toString()
      .toLowerCase()
      .replace(/[<>]/g, "")
    state.h1 = format === "h1"
    state.h2 = format === "h2"
    state.h3 = format === "h3"
    state.h4 = format === "h4"
    state.p = format === "p"
    setActiveCommands(state)
  }

  function getSelectionListNode() {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return null
    let node: Node | null = sel.anchorNode
    while (node && node !== editorRef.current) {
      if (
        node instanceof HTMLElement &&
        (node.tagName === "UL" || node.tagName === "OL")
      ) {
        return node
      }
      node = node.parentNode
    }
    return null
  }

  function setListStyle(styleType: string) {
    editorRef.current?.focus()
    const list = getSelectionListNode()
    if (!list || !(list instanceof HTMLElement)) return
    list.style.listStyleType = styleType
    onChange(editorRef.current?.innerHTML ?? "")
  }

  function insertLink() {
    editorRef.current?.focus()
    const url = window.prompt("Enter URL")
    if (!url) return
    document.execCommand("createLink", false, url)
    onChange(editorRef.current?.innerHTML ?? "")
    syncCommandState()
  }

  return (
    <div
      className={`overflow-hidden rounded-lg border border-border bg-background shadow-xs transition-all ${
        isFocused ? "ring-2 ring-primary/30" : ""
      }`}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-background p-2.5">
        {actions.map((action) => (
          <Button
            key={action.label}
            type="button"
            variant={(() => {
              if (action.command === "formatBlock" && action.value === "h3") {
                return activeCommands.h3 ? "default" : "outline"
              }
              if (action.command === "formatBlock" && action.value === "h1") {
                return activeCommands.h1 ? "default" : "outline"
              }
              if (action.command === "formatBlock" && action.value === "h2") {
                return activeCommands.h2 ? "default" : "outline"
              }
              if (action.command === "formatBlock" && action.value === "h4") {
                return activeCommands.h4 ? "default" : "outline"
              }
              if (action.command === "formatBlock" && action.value === "p") {
                return activeCommands.p ? "default" : "outline"
              }
              return activeCommands[action.command] ? "default" : "outline"
            })()}
            size="sm"
            className="h-8 rounded-md px-2.5 text-xs"
            onClick={() => runCommand(action)}
            title={action.label}
          >
            <action.icon className="size-3.5" />
          </Button>
        ))}
        <div className="mx-1 h-5 w-px bg-border" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-md px-2.5 text-xs"
          onClick={insertLink}
          title="Insert link"
        >
          <Link2 className="size-3.5" />
        </Button>
        <div className="mx-1 h-5 w-px bg-border" />
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-md px-2 text-[11px]"
          onClick={() => setListStyle("disc")}
          title="Disc list style"
        >
          Disc
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-md px-2 text-[11px]"
          onClick={() => setListStyle("circle")}
          title="Circle list style"
        >
          Circle
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-md px-2 text-[11px]"
          onClick={() => setListStyle("square")}
          title="Square list style"
        >
          Square
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-md px-2 text-[11px]"
          onClick={() => setListStyle("decimal")}
          title="Decimal list style"
        >
          1.2.3
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-md px-2 text-[11px]"
          onClick={() => setListStyle("lower-alpha")}
          title="Lower alpha list style"
        >
          a.b.c
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-8 rounded-md px-2 text-[11px]"
          onClick={() => setListStyle("lower-roman")}
          title="Roman list style"
        >
          i.ii
        </Button>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        className="min-h-40 bg-background px-4 py-3 text-[15px] leading-7 text-foreground outline-none [&_h1]:mb-3 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold [&_h4]:mb-2 [&_h4]:text-lg [&_h4]:font-semibold [&_ul]:my-2 [&_ul]:pl-6 [&_ul]:list-disc [&_ol]:my-2 [&_ol]:pl-6 [&_ol]:list-decimal [&_li]:mb-1 [&_p]:mb-3"
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false)
          syncCommandState()
        }}
        onInput={() => {
          onChange(editorRef.current?.innerHTML ?? "")
          syncCommandState()
        }}
        onKeyUp={syncCommandState}
        onMouseUp={syncCommandState}
        onKeyDown={(event) => {
          if (event.key === "Tab") {
            const list = getSelectionListNode()
            if (list) {
              event.preventDefault()
              document.execCommand(
                event.shiftKey ? "outdent" : "indent",
                false
              )
              onChange(editorRef.current?.innerHTML ?? "")
              syncCommandState()
            }
          }
        }}
        data-placeholder={placeholder}
      />
    </div>
  )
}
