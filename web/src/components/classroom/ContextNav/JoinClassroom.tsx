import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "@/redux/store";
import { joinClassroom,  } from "@/redux/slices/classroomSlice";
import { toast } from "sonner";

interface JoinClassroomProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinClassroom({ isOpen, onClose }: JoinClassroomProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [joinCode, setJoinCode] = useState("");

  const { loading, error } = useSelector(
  (state: RootState) => state.classroom.joinClassroom
);

  const handleJoin = async () => {
    if (joinCode.trim()) {
      try {
        const result = await dispatch(joinClassroom(joinCode.trim())).unwrap();
        toast.success(`Joined classroom "${result.name}" successfully!`);
      } catch (err: any) {
        toast.error(err || "Failed to join classroom.");
      }
      onClose();
      setJoinCode("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card border border-border rounded-xl shadow-lg max-w-md w-full animate-in fade-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Join Classroom</h2>
          <p className="text-sm text-muted-foreground mt-1">Enter the join code from your teacher</p>
        </div>

        {/* Modal Content */}
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 rounded">Join Code</label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Enter Join Code"
              className="w-full px-3 py-2 rounded border border-input bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-center text-lg font-mono tracking-widest"
              onKeyPress={(e) => e.key === "Enter" && handleJoin()}
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-border flex gap-3 justify-end">
          <button
            onClick={() => {
              onClose();
              setJoinCode("");
            }}
            className="px-4 py-2 rounded border border-input bg-background text-foreground hover:bg-muted transition-colors font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            disabled={!joinCode.trim() || loading}
            className="px-4 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium text-sm"
          >
            { loading? "Joining..." : "Join Classroom"}
          </button>
        </div>
      </div>
    </div>
  );
}