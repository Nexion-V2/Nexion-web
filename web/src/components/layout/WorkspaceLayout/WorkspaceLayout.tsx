"use client";

import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

// Contexts & Hooks
import { usePanel } from "@/context/PanelContext";
import { useAuth } from "@/context/AuthContext";
import { useResponsive } from "@/hooks/useResponsive";

// UI Components
import { DesktopSidebar, MobileSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import ContextNav from "@/components/panels/ContextNav";
import Workspace from "@/components/panels/Workspace";
import Inspector from "@/components/panels/Inspector";
import Loading from "./loading";
import { MyCalendar } from "@/components/calendar/Calendar";

export default function WorkspaceLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    selectedConversation,
    activeProfile,
    activeClassroom,
    activeBot,
    activeTab,
  } = usePanel();
  const { isAuthenticated, isLoading } = useAuth();
  const { isDesktop } = useResponsive();

  const isAnyPanelActive =
    selectedConversation || activeProfile || activeClassroom || activeBot;

  // 🔁 Redirect if unauthenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) return <Loading />;
  if (!isAuthenticated) return null;

  return (
    <SidebarProvider
      defaultOpen={false}
      className="flex flex-col h-[100dvh] md:flex-row overflow-hidden bg-nexion-primary"
      style={
        {
          "--sidebar-width": "22rem", // 22rem = 352px (same as w-88)
        } as React.CSSProperties
      }
    >
      {/* 🖥️ Desktop Sidebar */}
      {isDesktop && <DesktopSidebar />}

      {/* 🧭 Main Content Area */}
      <main className="flex-1 flex overflow-y-auto h-full">
        {!isDesktop ? (
          // 📱 Mobile layout
          activeTab === "calendar" ? (
            <div className="flex-1">
              <MyCalendar />
            </div>
          ) : isAnyPanelActive ? (
            <>
              <Workspace />
              <Inspector />
            </>
          ) : (
            <ContextNav />
          )
        ) : activeTab === "calendar" ? (
          // 🖥️ Desktop: Calendar view
          <div className="flex-1">
            <MyCalendar />
          </div>
        ) : (
          // 🖥️ Desktop: Default workspace
          <div className="h-full flex flex-1 overflow-y-auto rounded-2xl gap-0.5 bg-neutral-900">
            <ContextNav />
            <Workspace />
            <Inspector />
          </div>
        )}
      </main>

      {/* 📱 Mobile Bottom Sidebar */}
      {!isDesktop && <MobileSidebar />}
    </SidebarProvider>
  );
}
