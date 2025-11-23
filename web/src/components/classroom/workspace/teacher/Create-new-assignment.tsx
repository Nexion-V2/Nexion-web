"use client";

import { useState } from "react";
import { X, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { addAssignment } from "@/redux/slices/classroomSlice";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "@/redux/store";

interface TeacherAssignmentPanelProps {
  onClose: () => void;
  classroomId: string;
}

export default function TeacherAssignmentPanel({
  onClose,
  classroomId,
}: TeacherAssignmentPanelProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [time, setTime] = useState<string>("");

  // Redux
  const dispatch = useDispatch();
  const { loading, error } = useSelector(
    (state: RootState) => state.classroom.addAssignmentStatus
  );

  // Submit Handler
  const handleSubmit = async () => {
    if (!title.trim() || !date) {
      alert("Please fill in both title and due date.");
      return;
    }

    const newAssignment = {
      classroomId,
      assignment: {
        title,
        description,
        dueDate: date.toISOString(),
        dueTime: time,
        discussions: [],
        submissions: [],
      },
    };

    const result = await dispatch(addAssignment(newAssignment) as any);

    if (result.meta.requestStatus === "fulfilled") {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#131313] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#2a2a2a] overflow-hidden animate-in fade-in zoom-in-95">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
          <h2 className="text-2xl font-bold text-gray-100">
            Create New Assignment
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-gray-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-gray-100" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 text-red-400 bg-red-500/10 border border-red-500 p-3 rounded text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="assignment-title"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Assignment Title <span className="text-red-500">*</span>
            </label>
            <Input
              id="assignment-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Your Assignment Title"
              className="w-full bg-[#0f0f0f] border border-[#2f2f2f] text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary rounded"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="assignment-description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description
            </label>
            <Textarea
              id="assignment-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the assignment requirements..."
              className="w-full resize-none h-32 bg-[#0f0f0f] border border-[#2f2f2f] text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary rounded"
            />
          </div>

          {/* Date + Time */}
          <div className="grid gap-2 md:grid-cols-2">
            {/* Date Picker */}
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal rounded",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Select date</span>}
                    <CalendarClock className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(selectedDate) => {
                      setDate(selectedDate);
                      setPopoverOpen(false);
                    }}
                    initialFocus
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="grid gap-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-end pt-4">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="rounded"
            >
              {loading ? "Creating..." : "Create Assignment"}
            </Button>

            <Button
              onClick={onClose}
              variant="outline"
              disabled={loading}
              className="border border-primary text-primary hover:bg-primary/10 rounded"
            >
              Cancel
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
