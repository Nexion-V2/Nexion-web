"use client";

import { message } from "antd";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NotebookPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CreateClassroom from "./CreateClassroom";
import JoinClassroom from "./JoinClassroom";

// Components
import { SkeletonCard } from "./SkeletonCard";
import SearchBar from "@/components/ui/SearchBar";

// Redux
import type { AppDispatch } from "@/redux/store";
import {
  fetchClassrooms,
  selectClassroom,
} from "@/redux/slices/classroomSlice";

// Types
import type { Classroom } from "@/types/classroom";

export default function ClassroomPanel() {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch<AppDispatch>();

  // ------------------ REDUX STATE ------------------
  const classrooms = useSelector(
    (state: any) => Object.values(state.classroom.entities) as Classroom[]
  );

  const selectedClassroom = useSelector(
    (state: any) => state.classroom.entities[state.classroom.selectedId]
  );

  const [searchValue, setSearchValue] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  // ------------------ EFFECTS ------------------
  useEffect(() => {
    dispatch(fetchClassrooms());
  }, [dispatch]);

  // ------------------ FILTERING ------------------
  const filteredClassrooms = classrooms.filter((classroom) => {
    const name = classroom.name?.toLowerCase() ?? "";
    const desc = classroom.description?.toLowerCase() ?? "";
    const search = searchValue.toLowerCase();
    return name.includes(search) || desc.includes(search);
  });

  let displayClassrooms = searchValue ? filteredClassrooms : classrooms;

  // ------------------ HANDLERS ------------------
  const handleSelectClassroom = (classroomId: string) => {
    dispatch(selectClassroom(classroomId));
  };

  // ------------------ TEACHER FIRST SORT ------------------
  displayClassrooms = [
    ...displayClassrooms.filter((c) => c.isTeacher), // teachers first
    ...displayClassrooms.filter((c) => !c.isTeacher), // then others
  ];

  const isLoading = false;

  // ------------------ RENDER ------------------
  return (
    <div className="flex flex-col h-full w-full">
      {contextHolder}

      {/* Header */}
      <div className="w-full flex justify-between px-4 py-3 bg-neutral-900/70">
        <div className="flex items-center font-bold text-2xl">Classroom</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-medium border-none"
              title="Create New Classroom"
            >
              <NotebookPen size={18} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsCreateOpen(true)}>
                Create Classroom
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsJoinOpen(true)}>
                Join Classroom
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <CreateClassroom
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
        />
        <JoinClassroom
          isOpen={isJoinOpen}
          onClose={() => setIsJoinOpen(false)}
        />
      </div>

      {/* Search */}
      <div className="px-2 md:px-4">
        <SearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setIsSearching={() => {}}
          isLoading={isLoading}
        />
      </div>

      {/* Classroom List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {isLoading ? (
            <div className="px-4 py-2 w-full flex items-center bg-neutral-700/30 animate-pulse mb-3">
              <div className="py-1.5 w-1/2 bg-neutral-700 rounded" />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <h2 className="flex items-center text-xs font-medium text-[#67676D] tracking-wide">
                ALL CLASSROOMS ({displayClassrooms.length})
              </h2>
            </div>
          )}

          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : displayClassrooms.length > 0 ? (
            displayClassrooms.map((classroom: Classroom) => (
              <button
                key={classroom._id}
                onClick={() => handleSelectClassroom(classroom._id)}
                className={`relative w-full flex items-start gap-3 p-4 rounded-lg text-left transition-all duration-200 border hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 ${
                  selectedClassroom?._id === classroom._id
                    ? "bg-neutral-700/30"
                    : "bg-neutral-800/30 border-transparent hover:bg-neutral-800/30"
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md ${classroom.isTeacher ? 'bg-gradient-to-br from-blue-500 to-purple-600' : ''}`}>
                  {classroom.name.charAt(0).toUpperCase()}
                </div>

                <div className="flex-1">
                  <div className="font-semibold text-sm truncate text-neutral-50">
                    {classroom.name}
                  </div>

                  <p className="text-xs opacity-70 mt-1 line-clamp-2 text-gray-300">
                    {classroom.description || "No description"}
                  </p>

                  <div className="relative mt-2 flex gap-3 text-xs">
                    {(classroom.assignments?.length ?? 0) > 0 && (
                      <span className="relative text-blue-400 font-medium flex items-center gap-1">
                        <span className="absolute inset-0 blur-lg bg-blue-500/30 rounded opacity-50"></span>
                        <span className="relative z-10 flex items-center gap-1">
                          <span>
                            {classroom.assignments?.length ?? 0} assignments
                          </span>
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              No classrooms found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
