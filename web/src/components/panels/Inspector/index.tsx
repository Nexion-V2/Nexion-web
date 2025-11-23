"use client";
import { useRef, useState, useCallback } from "react";
import {
  Volume2,
  ImageIcon,
  FileText,
  Ban,
  ChevronRight,
  ArrowLeft,
  MessageSquare,
  Zap,
} from "lucide-react";
import { usePanel } from "@/context/PanelContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { SummarySection } from "./sections/SummarySection";
import { NotificationsSection } from "./sections/NotificationsSection";
import { MediaSection } from "./sections/MediaSection";
import { FilesSection } from "./sections/FilesSection";
import { AdvancedSection } from "./sections/Advance";
import { SafetySection } from "./sections/SafetySection";

export default function Inspector() {
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "summary"
  );
  const { selectedConversation } = usePanel();

  const user = selectedConversation;
  const triggerRef = useRef<HTMLButtonElement>(null);

  const closeSidebar = useCallback(() => {
    if (triggerRef.current) {
      triggerRef.current.click();
    }
  }, []);

  const sections = [
    {
      id: "summary",
      label: "Conversation Summary",
      icon: MessageSquare,
      description: "Chat overview & stats",
      component: SummarySection,
    },
    {
      id: "mute",
      label: "Notifications",
      icon: Volume2,
      description: "Sound & alerts",
      component: NotificationsSection,
    },
    {
      id: "image",
      label: "Media",
      icon: ImageIcon,
      description: "Images & videos",
      component: MediaSection,
    },
    {
      id: "files",
      label: "Files",
      icon: FileText,
      description: "Documents & attachments",
      component: FilesSection,
    },
    {
      id: "advanced",
      label: "Advanced",
      icon: Zap,
      description: "More options",
      component: AdvancedSection,
    },
    {
      id: "block",
      label: "Safety",
      icon: Ban,
      description: "Block & report",
      component: SafetySection,
    },
  ];

  if (!user) return null;

  return (
    <Sidebar side="right" className="h-full border-neutral-800">
      <div className="h-full flex flex-col bg-neutral-900">
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 pt-4">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-lg transition-colors text-gray-300 hover:text-white hover:bg-nexion-primary-foreground"
            onClick={closeSidebar}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>
        <SidebarTrigger ref={triggerRef} className="hidden" />

        <div className="flex-grow overflow-y-auto">
          {/* Profile Section */}
          <div className=" px-4 pb-5 border-b border-white/10">
            <div className="flex flex-col items-center gap-3">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                  {(user.name || "NA").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center w-full">
                <h3 className="font-bold text-lg tracking-tight text-white">
                  {user.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {user.username ? user.username : "user@domain.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Sections */}
          <div className="px-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const Component = section.component;
              const isExpanded = expandedSection === section.id;

              return (
                <div key={section.id}>
                  <button
                    onClick={() =>
                      setExpandedSection(isExpanded ? null : section.id)
                    }
                    className="w-full text-left transition-all duration-200 my-1"
                  >
                    <div className="flex items-center justify-between px-3 py-2 rounded group transition-colors hover:bg-white/5 text-white">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 rounded bg-white/5">
                          <Icon className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-white">
                            {section.label}
                          </p>
                          <p className="text-xs text-gray-500">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight
                        className={`w-4 h-4 transition-all duration-300 text-gray-600 ${
                          isExpanded ? "rotate-90" : ""
                        }`}
                      />
                    </div>
                  </button>

                  {/* Expandable Content */}
                  {isExpanded && (
                    <div className="p-3 mx-2 rounded border border-white/8 bg-transparent space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                      <Component />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
