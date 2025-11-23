"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/redux/store";
import { toast } from "sonner";
import { createClassroom } from "@/redux/slices/classroomSlice";
import type { Classroom } from "@/types/classroom";

interface ClassroomFormData {
  name: string;
  description: string;
}

interface CreateClassroomProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateClassroom({ isOpen, onClose }: CreateClassroomProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<ClassroomFormData>({
    name: "",
    description: "",
  });

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error("Classroom name is required.");
      return;
    }

    const newClassroom: Partial<Classroom> = {
      name: formData.name,
      description: formData.description,
    };

    try {
      const result = await dispatch(createClassroom(newClassroom)).unwrap();
      toast.success(`Classroom "${result.name}" created successfully!`);
      onClose();
    } catch (err: any) {
      toast.error(err || "Failed to create classroom.");
    }
  };

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    if (isOpen) document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-card border border-border rounded-xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">Create New Classroom</h2>
            <p className="text-sm text-muted-foreground">Set up a new course for your students</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label htmlFor="classroom-name" className="block text-sm font-medium text-foreground mb-2">
              Classroom Name <span className="text-red-500">*</span>
            </label>
            <input
              id="classroom-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. React Fundamentals"
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-border focus:border-primary/50 transition-colors"
              onKeyPress={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>

          <div>
            <label htmlFor="classroom-description" className="block text-sm font-medium text-foreground mb-2">
              Description (Optional)
            </label>
            <textarea
              id="classroom-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of the classroom..."
              rows={3}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground placeholder:text-sm placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-border focus:border-primary/50 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="rounded">
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!formData.name.trim()}
            className="disabled:opacity-70 rounded"
          >
            Create Classroom
          </Button>
        </div>
      </div>
    </div>
  );
}
