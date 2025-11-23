"use client";

import React, { useState } from "react";
import { BookOpen, Check, CheckSquare, Copy, Plus } from "lucide-react";

// Components
import TeacherAssignmentPanel from "./teacher/Create-new-assignment";
import TeacherContentView from "./teacher";
import StudentContentView from "./student";

// Redux
import { useSelector } from "react-redux";
import { selectSelectedClassroom } from "@/redux/slices/classroomSlice";

// Types
import type { Classroom } from "@/types/classroom";
type Tab = "assignments" | "notes";

export default function ContentPanel() {
  const classroom = useSelector(selectSelectedClassroom) as
    | Classroom
    | undefined;

  const [activeTab, setActiveTab] = useState<Tab>("assignments");
  const [showCreateAssignment, setShowCreateAssignment] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!classroom) return null;

  // console.log("All Classroom: ", classroom);

  const isTeacher = classroom.isTeacher;

  const onUpdateClassroom = (updatedClassroom: Classroom) => {
    // Optional: dispatch update classroom if needed
  };

  const handleJoinCodeCopy = () => {
    if (classroom.joinCode) {
      navigator.clipboard.writeText(classroom.joinCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex-1 md:w-3/4 flex flex-col overflow-hidden bg-neutral-900/50 border-l border-neutral-800">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/70 p-4 flex flex-col md:flex-row items-start justify-between gap-2 md:gap-0">
        <div className="flex-1">
          <h2 className="text-xl md:text-2xl font-bold text-neutral-100">
            <span className="text-blue-400">{classroom.name}</span>
          </h2>
          <p className="text-sm text-neutral-400">{classroom.description}</p>

          {/* Join Code */}
          {classroom.joinCode && (
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm ">Join Code:</span>
              <div className="flex items-center gap-2 bg-sidebar-accent/20 rounded px-2 py-1.5">
                <code className="text-sm font-mono font-semibold text-sidebar-foreground flex-1">
                  {classroom.joinCode}
                </code>
                <button
                  onClick={handleJoinCodeCopy}
                  className="p-1 hover:bg-sidebar-accent/40 rounded transition-colors"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {isTeacher && (
          <button
            onClick={() => setShowCreateAssignment(true)}
            className="ml-0 md:ml-4 px-4 py-2 bg-blue-700 text-blue-50 rounded font-medium hover:bg-blue-600 hover:scale-102 transition-all flex items-center gap-2 text-sm shadow-md"
          >
            <Plus size={18} strokeWidth={2} />
            <span className="hidden md:flex">New Assignment</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-800 bg-neutral-900/60 px-4 md:px-6">
        <TabButton
          icon={<CheckSquare size={16} />}
          label="Assignments"
          isActive={activeTab === "assignments"}
          onClick={() => setActiveTab("assignments")}
          count={classroom.assignments?.length ?? 0}
        />
        <TabButton
          icon={<BookOpen size={16} />}
          label="Lecture Notes"
          isActive={activeTab === "notes"}
          onClick={() => setActiveTab("notes")}
          count={classroom.lectureNotes?.length ?? 0}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 text-neutral-200">
        {activeTab === "assignments" && isTeacher && (
          <TeacherContentView
            classroom={classroom}
            onUpdateClassroom={onUpdateClassroom}
          />
        )}
        {activeTab === "assignments" && !isTeacher && (
          <StudentContentView classroom={classroom} />
        )}

        {activeTab === "notes" && (
          <div className="space-y-4">
            {classroom.lectureNotes.length === 0 ? (
              <p className="text-neutral-500 text-center py-10">
                No lecture notes yet.
              </p>
            ) : (
              classroom.lectureNotes.map((note) => (
                <div
                  key={note._id}
                  className="p-4 border border-neutral-800 rounded-lg bg-neutral-800/40 hover:bg-neutral-800/60 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-200"
                >
                  <h3 className="font-semibold text-neutral-100">
                    {note.title}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    {new Date(note.date).toLocaleDateString()}
                  </p>
                  <button
                    onClick={() => {}}
                    className="mt-3 px-3 py-1.5 text-xs font-medium rounded bg-blue-700/70 text-blue-50 hover:bg-blue-600 transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Assignment Modal */}
      {showCreateAssignment && isTeacher && (
        <TeacherAssignmentPanel
          onClose={() => setShowCreateAssignment(false)}
          classroomId={classroom._id}
        />
      )}
    </div>
  );
}

interface TabButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  count: number;
}

function TabButton({ icon, label, isActive, onClick, count }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all duration-200 font-medium text-sm
        ${
          isActive
            ? "border-blue-500 text-blue-400"
            : "border-transparent text-neutral-400 hover:text-neutral-100 hover:border-neutral-700"
        }`}
    >
      {icon}
      {label}
      <span className="ml-2 px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-400 text-xs">
        {count}
      </span>
    </button>
  );
}
