"use client"

export function NotificationsSection() {
  const options = ["Mute 1 Hour", "Mute Until Tomorrow", "Always Mute"]

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-gray-400">Choose notification settings</p>
      <div className="space-y-2">
        {options.map((option) => (
          <button
            key={option}
            className="w-full py-2 px-3 rounded text-xs font-medium transition-colors border border-white/10 bg-transparent hover:bg-white/5 text-gray-300 hover:text-white"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
