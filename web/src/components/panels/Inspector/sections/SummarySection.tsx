"use client"

export function SummarySection() {
  const conversationSummary = [
    "Discussed project timeline and Q4 deliverables",
    "Reviewed design mockups for new dashboard",
    "Decided on implementation strategy for API",
    "Scheduled follow-up meeting for next week",
  ]

  return (
    <div className="space-y-2 pt-2">
      <p className="text-xs font-semibold text-gray-200">Last Hour Summary</p>
      <div className="space-y-2">
        {conversationSummary.map((summary, idx) => (
          <div key={idx} className="flex gap-2 text-xs p-2 rounded bg-transparent border border-white/5">
            <span className="text-blue-400 font-bold flex-shrink-0">•</span>
            <span className="text-gray-400">{summary}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
