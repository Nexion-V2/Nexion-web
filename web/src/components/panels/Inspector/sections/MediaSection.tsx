"use client"
import { Download, Eye } from "lucide-react"

export function MediaSection() {
  const mediaItems = [
    { id: 1, name: "Dashboard Design.png", url: "/dashboard-design-mockup.jpg", type: "image" },
    { id: 2, name: "API Wireframe.jpg", url: "/api-architecture.png", type: "image" },
    { id: 3, name: "Q4 Roadmap.png", url: "/product-roadmap-visual.png", type: "image" },
  ]

  return (
    <div className="space-y-3">
      <div className="text-xs text-gray-400">
        <span className="font-medium text-gray-200">{mediaItems.length}</span> images & videos shared
      </div>
      <div className="space-y-2">
        {mediaItems.map((media) => (
          <div
            key={media.id}
            className="flex items-center gap-3 p-2 rounded bg-transparent border border-white/5 hover:border-white/20 transition-colors group"
          >
            <img src={media.url || "/placeholder.svg"} alt={media.name} className="w-10 h-10 rounded object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-300 truncate">{media.name}</p>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-1 hover:bg-white/10 rounded" title="View">
                <Eye className="w-3 h-3 text-gray-400" />
              </button>
              <button className="p-1 hover:bg-white/10 rounded" title="Download">
                <Download className="w-3 h-3 text-gray-400" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="w-full py-2 px-3 rounded text-xs font-medium transition-colors border border-white/10 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white">
        View All Media
      </button>
    </div>
  )
}
