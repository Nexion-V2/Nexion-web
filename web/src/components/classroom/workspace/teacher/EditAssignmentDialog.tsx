"use client";

import { useEffect, useState } from "react";
import { CalendarClock } from "lucide-react";
import { format } from "date-fns"; // Date formatting

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { Assignment } from "@/types/classroom";

interface EditAssignmentDialogProps {
  open: boolean;
  assignment: Assignment | null;
  onSave: (assignmentId: string, newDueDate: string) => void;
  onClose: () => void;
}

export default function EditAssignmentDialog({
  open,
  assignment,
  onSave,
  onClose,
}: EditAssignmentDialogProps) {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (assignment?.dueDate) {
      const parsed = new Date(assignment.dueDate);
      setDate(parsed);
      const h = parsed.getHours().toString().padStart(2, "0");
      const m = parsed.getMinutes().toString().padStart(2, "0");
      setTime(`${h}:${m}`);
    }
  }, [assignment]);

  const handleSave = () => {
    if (!assignment || !date) return;
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours || 0);
    combined.setMinutes(minutes || 0);
    onSave(assignment._id, combined.toISOString());
  };

  const isSaveDisabled = !date || !assignment;

  if (!assignment) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      {/* Reduced custom classes, relying on shadcn/ui defaults */}
      <DialogContent className="sm:max-w-md bg-[#1e1d1d] border border-[#2a2a2a] rounded-xl shadow-xl w-full max-w-md p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CalendarClock size={18} />
            Edit Due Date:{" "}
            <span className="text-primary">{assignment.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Date Picker */}
          <div className="grid gap-2">
            <Label htmlFor="date">Due Date</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild className="rounded">
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? format(date, "PPP") : <span>Select date</span>}
                  <CalendarClock className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              {/* Removed custom popover styling */}
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

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaveDisabled} type="submit">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
