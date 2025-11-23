"use client"

export function SafetySection() {
  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-400">Account safety options</p>
      <button className="w-full py-2 px-3 rounded text-xs font-medium transition-colors border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200">
        Report User
      </button>
      <button className="w-full py-2 px-3 rounded text-xs font-medium transition-colors border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-300 hover:text-red-200">
        Block User
      </button>
    </div>
  )
}
