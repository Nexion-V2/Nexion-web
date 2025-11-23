"use client";

import React, { useState } from "react";
import type { Classroom, Submission } from "@/types/classroom";
import { ActionButtons } from "./ActionButtons";
import { DiscussionSection } from "./DiscussionSection";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Redux
import { useDispatch } from "react-redux";
import {
  submitAssignment,
  unsubmitAssignment,
} from "@/redux/slices/classroomSlice";

// UUID
import { v4 as uuidv4 } from "uuid";

// Utility Hook
import { useRelativeTime } from "@/hooks/useRelativeTime";
import { AppDispatch } from "@/redux/store";

// --------------------------------------------
// Constants
// --------------------------------------------
const CURRENT_USER_ID = "current-user";

// --------------------------------------------
// Props Interface
// --------------------------------------------
interface AssignmentCardProps {
  classroomId: string;
  assignment: NonNullable<Classroom["assignments"]>[number];
  expandedAssignmentId: string | null;
  activeAction: "submit" | "message" | null;
  onToggleExpand: (assignmentId: string, action: "submit" | "message") => void;
}

// --------------------------------------------
// Utility: Get current user's submission
// --------------------------------------------
const getSubmissionStatus = (
  assignment: NonNullable<Classroom["assignments"]>[number]
) => assignment.submissions?.find((s) => s.studentId === CURRENT_USER_ID);

// --------------------------------------------
// AssignmentCard Component
// --------------------------------------------
export function AssignmentCard({
  classroomId,
  assignment,
  expandedAssignmentId,
  activeAction,
  onToggleExpand,
}: AssignmentCardProps) {
  // -----------------------------
  // State
  // -----------------------------
  const [submissionText, setSubmissionText] = useState("");

  // -----------------------------
  // Redux Dispatch
  // -----------------------------
  const dispatch = useDispatch<AppDispatch>();

  // -----------------------------
  // Derived values
  // -----------------------------
  const isExpandedSubmit =
    expandedAssignmentId === assignment._id && activeAction === "submit";
  const isExpandedMessage =
    expandedAssignmentId === assignment._id && activeAction === "message";

  const currentSubmission = getSubmissionStatus(assignment);
  const isSubmitted = !!currentSubmission;
  const submittedTime = useRelativeTime(currentSubmission?.submittedAt ?? "");

  // -----------------------------
  // Handlers
  // -----------------------------
  const handleSubmit = async () => {
    const trimmed = submissionText.trim();
    if (!trimmed) return;

    const newSubmission: Submission = {
      _id: currentSubmission?._id ?? uuidv4(),
      content: trimmed,
      status: "submitted",
      submittedAt: new Date().toISOString(),
    };

    try {
      const result = await dispatch(
        submitAssignment({
          classroomId,
          assignmentId: assignment._id,
          submission: newSubmission,
        })
      ).unwrap(); // <-- unwrap()

      if (submitAssignment.fulfilled.match(result)) {
        setSubmissionText("");
        onToggleExpand(assignment._id, "submit");
        toast.success("Assignment submitted successfully!");
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleUnsubmit = () => {
    if (!currentSubmission) return;

    const unsubmittedPayload: Submission = {
      ...currentSubmission,
      content: "",
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    // dispatch(
    //   unsubmitAssignment({
    //     classroomId,
    //     assignmentId: assignment._id,
    //     studentId: unsubmittedPayload._id,
    //   })
    // );
  };

  // -----------------------------
  // Render JSX
  // -----------------------------
  return (
    <div className="border rounded-xl bg-card shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Assignment Info */}
      <div className="p-5">
        <h3 className="text-xl font-bold mb-1">{assignment.title}</h3>

        {assignment.description && (
          <p className="text-sm opacity-80">{assignment.description}</p>
        )}

        {/* Due Date */}
        <p className="text-sm mt-3">
          <span className="font-semibold text-primary">Due:</span>{" "}
          {new Date(assignment.dueDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {/* Submission Status */}
        {isSubmitted ? (
          <p className="text-sm font-semibold text-green-600 mt-2">
            Submitted:&nbsp;<span className="text-xs">{submittedTime}</span>
          </p>
        ) : (
          <p className="text-sm font-medium text-red-500 mt-2">
            Pending Submission
          </p>
        )}

        {/* Action Buttons */}
        <ActionButtons
          assignmentId={assignment._id}
          onToggleExpand={onToggleExpand}
          isSubmitActive={isExpandedSubmit}
          isMessageActive={isExpandedMessage}
          isSubmitted={isSubmitted}
          onUnsubmit={handleUnsubmit}
        />
      </div>

      {/* Submit Section */}
      {isExpandedSubmit && !isSubmitted && (
        <div className="border-t p-5 bg-muted/30 space-y-4">
          <h4 className="font-semibold text-lg mb-2">Submit Your Assignment</h4>

          <Textarea
            value={submissionText}
            onChange={(e) => setSubmissionText(e.target.value)}
            placeholder="Type your answer here..."
            className="h-32"
          />

          <div className="flex justify-end mt-3">
            <Button
              disabled={!submissionText.trim()}
              onClick={handleSubmit}
              className="rounded"
            >
              {isSubmitted ? "Resubmit" : "Submit"}
            </Button>
          </div>
        </div>
      )}

      {/* Discussion Section */}
      {isExpandedMessage && (
        <DiscussionSection classroomId={classroomId} assignment={assignment} />
      )}
    </div>
  );
}
