"use client";

import React from "react";

// Components
import ConversationWindow from "@/components/chat/RightSide";
import ClassroomWindow from "@/components/classroom/workspace";
import { ProfileRightPanel } from "@/components/profile/RightPanel";
import BotWorkspace from "@/components/bot/workspace";
import Welcome from "./Welcome";

// Context
import { usePanel } from "@/context/PanelContext";
import { ProfileProvider } from "@/context/ProfileContext/index";

// Redux
import { useSelector } from "react-redux";

export default function RightPanel() {
  const { activeTab, selectedConversation, activeProfile, activeBot } = usePanel();

  // Get selected classroom from Redux
  const selectedClassroomId = useSelector(
    (state: any) => state.classroom.selectedId
  );

  const activeClassroom = useSelector(
    (state: any) => state.classroom.entities[selectedClassroomId]
  );

  const isAnyPanelActive =
    selectedConversation || activeProfile || activeClassroom || activeBot;

  if (!isAnyPanelActive) {
    return <Welcome />;
  }

  switch (activeTab) {
    case "chats":
      return <ConversationWindow />;

    case "classroom":
      return <ClassroomWindow/>;

    case "bots":
      return <BotWorkspace />;

    case "profile":
      return (
        <ProfileProvider>
          <ProfileRightPanel />
        </ProfileProvider>
      );

    default:
      return <div>Select a tab to see content</div>;
  }
}
