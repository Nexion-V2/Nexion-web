"use client"
import { FileCheck, Download, ExternalLink } from "lucide-react"

export function FilesSection() {
  const files = [
    { id: 1, name: "Project Specifications.pdf", size: "2.4 MB", url: "#" },
    { id: 2, name: "Budget Breakdown.xlsx", size: "850 KB", url: "#" },
    { id: 3, name: "Design System.figma", size: "12.1 MB", url: "#" },
  ]

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-400">
        <span className="font-medium text-gray-200">{files.length}</span> documents shared
      </div>
      <div className="space-y-2">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-3 p-2 rounded bg-transparent border border-white/5 hover:border-white/20 transition-colors group"
          >
            <div className="flex-shrink-0 p-2 rounded bg-white/5 group-hover:bg-white/10 transition-colors">
              <FileCheck className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-300 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{file.size}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:bg-white/10 rounded"
                title="Open"
              >
                <ExternalLink className="w-3 h-3 text-gray-400" />
              </a>
              <button className="p-1 hover:bg-white/10 rounded" title="Download">
                <Download className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-2 px-3 rounded-lg text-xs font-medium transition-colors border border-white/10 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white flex items-center justify-center gap-2">
        <FileCheck className="w-3 h-3" />
        View All Files
      </button>
    </div>
  )
}
