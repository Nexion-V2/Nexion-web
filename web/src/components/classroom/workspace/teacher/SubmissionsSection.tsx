"use client"

import type { Assignment } from "@/types/classroom"

interface SubmissionsSectionProps {
  submissions?: Assignment["submissions"]
}

export default function SubmissionsSection({ submissions }: SubmissionsSectionProps) {
  console.log("Submission: ",submissions);
  const list = submissions ?? []

  return (
    <div className="border-t border-border p-4 bg-muted/20 space-y-4">
      <h4 className="font-semibold text-foreground">Student Submissions</h4>
      {list.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">No submissions yet.</p>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {list.map((submission) => (
            <div key={submission._id} className="bg-background rounded p-3 border border-border">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground text-sm">{submission.studentName}</p>
                  <p className="text-xs text-muted-foreground">
                    Submitted: {new Date(submission.submittedAt).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    submission.status === "graded"
                      ? "bg-green-100/20 text-green-600"
                      : "bg-yellow-100/20 text-yellow-600"
                  }`}
                >
                  {submission.status === "graded" ? `Grade: ${submission.grade}%` : "Pending"}
                </span>
              </div>
              <p className="text-sm text-foreground mb-2">{submission.content}</p>
              {submission.feedback && (
                <p className="text-xs text-muted-foreground italic">Feedback: {submission.feedback}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}