"use client";

import React, { useState } from "react";
import type { Classroom } from "@/types/classroom";
import { AssignmentCard } from "./AssignmentCard";

interface StudentContentViewProps {
  classroom: Classroom;
}

export default function StudentContentView({ classroom }: StudentContentViewProps) {
  // Keep global expansion state so only one assignment/action combo is open at a time
  const [expandedAssignment, setExpandedAssignment] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<"submit" | "message" | null>(null);

  const handleToggleExpand = (assignmentId: string, action: "submit" | "message") => {
    if (expandedAssignment === assignmentId && activeAction === action) {
      setExpandedAssignment(null);
      setActiveAction(null);
    } else {
      setExpandedAssignment(assignmentId);
      setActiveAction(action);
    }
  };

  return (
    <div className="space-y-6 rounded-lg">
      {classroom.assignments?.length === 0 ? (
        <p className="text-muted-foreground text-center py-8 text-lg">No assignments yet. Check back later!</p>
      ) : (
        classroom.assignments?.map((assignment) => (
          <AssignmentCard
            key={assignment._id}
            classroomId={classroom._id}
            assignment={assignment}
            expandedAssignmentId={expandedAssignment}
            activeAction={activeAction}
            onToggleExpand={handleToggleExpand}
          />
        ))
      )}
    </div>
  );
}