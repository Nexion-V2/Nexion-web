"use client";

import {
  ChevronDown,
  FileText,
  CalendarDays,
  MessageSquare,
  UsersRound,
  Clock,
} from "lucide-react";
import type { Assignment } from "@/types/classroom";
import DiscussionsSection from "./DiscussionsSection";
import SubmissionsSection from "./SubmissionsSection";
import AssignmentMenu from "./AssignmentMenu";

interface AssignmentCardProps {
  assignment: Assignment;
  classroomId: string;
  expandedDiscussions: boolean;
  expandedSubmissions: boolean;
  onToggleDiscussions: (assignmentId: string) => void;
  onToggleSubmissions: (assignmentId: string) => void;
  onEdit: (assignment: Assignment) => void;
}

export default function AssignmentCard({
  classroomId,
  assignment,
  expandedDiscussions,
  expandedSubmissions,
  onToggleDiscussions,
  onToggleSubmissions,
  onEdit,
}: AssignmentCardProps) {
  console.log("Assignment: ", assignment);
  const dueDate = new Date(assignment.dueDate);
  const formattedDate = dueDate.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const formattedTime = dueDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="border border-border rounded-lg bg-card overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-4">
        {/* --- Header --- */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg flex items-center gap-2 text-primary">
              <FileText size={18} className="text-indigo-500" />
              {assignment.title}
            </h3>

            {assignment.description && (
              <p className="text-sm text-foreground/70 mt-1">
                {assignment.description}
              </p>
            )}

            {/* --- Date & Time --- */}
            <div className="text-sm mt-3 flex flex-col gap-1">
              <p className="flex items-center gap-2 text-foreground/80">
                <CalendarDays size={14} className="text-indigo-500" />
                <span>
                  <span className="text-foreground/60">Due Date:</span>{" "}
                  <span className="font-medium">{formattedDate}</span>
                </span>
              </p>
              <p className="flex items-center gap-2 text-foreground/80">
                <Clock size={14} className="text-violet-500" />
                <span>
                  <span className="text-foreground/60">Time:</span>{" "}
                  <span className="font-medium uppercase">{formattedTime}</span>
                </span>
              </p>
            </div>

            {/* --- Stats --- */}
            <div className="flex gap-5 mt-3">
              <p className="text-xs flex items-center gap-1 text-muted-foreground">
                <MessageSquare size={13} className="text-indigo-400" />
                {assignment.discussions.length} discussion
                {assignment.discussions.length !== 1 ? "s" : ""}
              </p>
              <p className="text-xs flex items-center gap-1 text-muted-foreground">
                <UsersRound size={13} className="text-violet-400" />
                {assignment.submissions?.length || 0} submission
                {(assignment.submissions?.length || 0) !== 1 ? "s" : ""}
              </p>
            </div>
          </div>

          {/* --- Menu (moved to separate component) --- */}
          <AssignmentMenu classroomId={classroomId} assignment={assignment} onEdit={onEdit} />
        </div>

        {/* --- Buttons (Simple) --- */}
        <div className="flex gap-2 mt-4 flex-wrap flex-row">
          <button
            onClick={() => onToggleSubmissions(assignment._id)}
            className="flex-1 min-w-[140px] px-3 py-2 text-xs font-medium rounded bg-primary text-primary-foreground hover:opacity-90 transition-all flex items-center justify-center gap-1"
          >
            <UsersRound size={14} />
            {expandedSubmissions ? "Hide Submissions" : "View Submissions"}
            <ChevronDown
              size={14}
              className={`transition-transform ${
                expandedSubmissions ? "rotate-180" : ""
              }`}
            />
          </button>

          <button
            onClick={() => onToggleDiscussions(assignment._id)}
            className="flex-1 min-w-[140px] px-3 py-2 text-xs font-medium rounded bg-muted text-foreground hover:bg-muted/80 transition-all flex items-center justify-center gap-1"
          >
            <MessageSquare size={14} />
            {expandedDiscussions ? "Hide Discussions" : "View Discussions"}
            <ChevronDown
              size={14}
              className={`transition-transform ${
                expandedDiscussions ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* --- Expanded Sections --- */}
      {expandedDiscussions && (
        <DiscussionsSection classroomId={classroomId} assignment={assignment} discussions={assignment.discussions} />
      )}
      {expandedSubmissions && (
        <SubmissionsSection submissions={assignment.submissions} />
      )}
    </div>
  );
}