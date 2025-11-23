import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquareText, FileText, RotateCcw } from "lucide-react";

interface ActionButtonsProps {
  assignmentId: string;
  onToggleExpand: (assignmentId: string, action: "submit" | "message") => void;
  isSubmitActive: boolean;
  isMessageActive: boolean;
  isSubmitted: boolean;
  onUnsubmit: () => void;
}

export function ActionButtons({
  assignmentId,
  onToggleExpand,
  isSubmitActive,
  isMessageActive,
  isSubmitted,
  onUnsubmit,
}: ActionButtonsProps) {
  return (
    <div className="flex gap-3 mt-5 flex-wrap">
      {/* Submit Button */}
      <Button
        onClick={() => {
          if (isSubmitted) {
            onUnsubmit(); // Call unsubmit handler
          } else {
            onToggleExpand(assignmentId, "submit");
          }
        }}
        size="sm"
        className={`flex-1 min-w-[150px] font-semibold transition-colors duration-200 rounded 
          ${
            isSubmitActive
              ? "bg-primary hover:bg-primary/90"
              : "bg-primary/80 hover:bg-primary"
          }
          text-primary-foreground ${
            isSubmitted
              ? "bg-red-600 text-destructive-foreground hover:bg-red-700"
              : ""
          }`}
      >
        <FileText size={16} className="mr-2" />
        {isSubmitted ? "Unsubmit" : "Submit Assignment"}
      </Button>

      {/* Discussion Button */}
      <Button
        variant="ghost"
        onClick={() => onToggleExpand(assignmentId, "message")}
        size="sm"
        className={`flex-1 min-w-[150px] font-semibold transition-colors duration-200 rounded 
          ${
            isMessageActive
              ? "bg-accent text-accent-foreground hover:bg-accent/90"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
      >
        <MessageSquareText size={16} className="mr-2" />
        Discussion
      </Button>
    </div>
  );
}
