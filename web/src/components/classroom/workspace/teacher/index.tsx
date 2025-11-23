"use client";

import { useState } from "react";
import type { Classroom, Assignment } from "@/types/classroom";

import AssignmentCard from "./AssignmentCard";
import EditAssignmentDialog from "./EditAssignmentDialog";

// Redux
import { useDispatch } from "react-redux";
import { updateAssignment } from "@/redux/slices/classroomSlice";

interface TeacherContentViewProps {
  classroom: Classroom;
  onUpdateClassroom?: (classroom: Classroom) => void;
}

export default function TeacherContentView({
  classroom,
  onUpdateClassroom,
}: TeacherContentViewProps) {
  // console.log("Classroom", classroom);
  const [expandedSubmissions, setExpandedSubmissions] = useState<string | null>(
    null
  );
  const [expandedDiscussions, setExpandedDiscussions] = useState<string | null>(
    null
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [currentAssignmentToEdit, setCurrentAssignmentToEdit] =
    useState<Assignment | null>(null);
  const dispatch = useDispatch();

  const handleViewSubmissions = (assignment: Assignment) => {
    setExpandedSubmissions(
      expandedSubmissions === assignment._id ? null : assignment._id
    );
  };

  const handleViewDiscussions = (assignment: Assignment) => {
    setExpandedDiscussions(
      expandedDiscussions === assignment._id ? null : assignment._id
    );
  };

  const onEdit = (assignment: Assignment) => {
    setCurrentAssignmentToEdit(assignment);
    setIsEditDialogOpen(true);
  };

  const handleSaveAssignment = (assignmentId: string, newDueDate: string) => {
    console.log(
      "Updating assignment:",
      assignmentId,
      "New due date:",
      newDueDate
    );

    dispatch(
      updateAssignment({
        classroomId: classroom._id,
        assignmentId: assignmentId,
        updatedFields: { dueDate: newDueDate },
      })
    );

    setIsEditDialogOpen(false);
    setCurrentAssignmentToEdit(null);
  };

  return (
    <div className="space-y-4">
      <EditAssignmentDialog
        open={isEditDialogOpen}
        assignment={currentAssignmentToEdit}
        onSave={handleSaveAssignment}
        onClose={() => {
          setIsEditDialogOpen(false);
          setCurrentAssignmentToEdit(null);
        }}
      />

      {classroom.assignments?.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">
          No assignments yet.
        </p>
      ) : (
        classroom.assignments?.map((assignment) => (
          <AssignmentCard
            key={assignment._id}
            classroomId={classroom._id}
            assignment={assignment}
            expandedDiscussions={expandedDiscussions === assignment._id}
            expandedSubmissions={expandedSubmissions === assignment._id}
            onToggleDiscussions={() => handleViewDiscussions(assignment)}
            onToggleSubmissions={() => handleViewSubmissions(assignment)}
            onEdit={() => onEdit(assignment)}
          />
        ))
      )}
    </div>
  );
}
