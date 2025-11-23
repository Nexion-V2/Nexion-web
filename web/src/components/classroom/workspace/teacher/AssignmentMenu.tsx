"use client";

import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import type { Assignment } from "@/types/classroom";
import { toast } from "sonner";

//Redux
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { deleteAssignment } from "@/redux/slices/classroomSlice";

interface AssignmentMenuProps {
  assignment: Assignment;
  classroomId: string;
  onEdit: (assignment: Assignment) => void;
}

export default function AssignmentMenu({
  assignment,
  classroomId,
  onEdit,
}: AssignmentMenuProps) {
  const dispatch = useDispatch<AppDispatch>();

  const { loading, error } = useSelector(
    (state: RootState) => state.classroom.deleteAssignmentStatus
  );

  const onDelete = async (assignmentId: string) => {
    const resultAction = await dispatch(
      deleteAssignment({ assignmentId, classroomId })
    );
    if (deleteAssignment.fulfilled.match(resultAction)) {
      toast.success("Assignment deleted successfully");
    } else {
      toast.error("Failed to delete assignment");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-full hover:bg-muted transition-colors text-foreground/80">
          <MoreVertical size={18} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onSelect={() => onEdit(assignment)}
          className="flex items-center gap-2 text-foreground focus:text-foreground/90 rounded"
        >
          Edit Assignment
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => onDelete(assignment._id)}
          className="flex items-center gap-2 text-destructive focus:text-destructive rounded"
        >
          Delete Assignment
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
