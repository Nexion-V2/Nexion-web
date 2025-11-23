"use client"
import { Pin, MessageSquare, FileCheck } from "lucide-react"

export function AdvancedSection() {
  const actions = [
    { label: "Pin Chat", icon: Pin },
    { label: "Clear Chat", icon: MessageSquare },
    { label: "Export Chat", icon: FileCheck },
  ]

  return (
    <div className="space-y-2">
      {actions.map((item) => (
        <button
          key={item.label}
          className="w-full py-2 px-3 rounded text-xs font-medium transition-colors border border-white/10 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white flex items-center gap-2"
        >
          <item.icon className="w-3 h-3" />
          {item.label}
        </button>
      ))}
    </div>
  )
}
