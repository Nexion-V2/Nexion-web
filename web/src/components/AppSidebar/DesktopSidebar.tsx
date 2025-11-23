"use client";

import React from "react";
import { User } from "lucide-react";
import { NavigationItems, TAB_KEYS, TabKey } from "./NavigationItems";
import { usePanel } from "@/context/PanelContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function DesktopSidebar() {
  const { activeTab, setActiveTab } = usePanel();

  return (
    <TooltipProvider delayDuration={100} >
      <div className="hidden md:flex h-full w-18 flex-col items-center py-4">
        {/* Brand / Logo */}
        <div className="mb-12">
          <div className="flex items-center justify-center text-gray-300 font-extrabold text-[28px]">
            NX
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-col space-y-4 gap-4 flex-1">
          {NavigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setActiveTab(item.id as TabKey)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all group relative z-10 hover:scale-105 ${
                      isActive
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-shadow"
                        : "text-gray-400 hover:text-white hover:bg-nexion-primary-foreground"
                    }`}
                  >
                    <Icon strokeWidth={2} width={20} height={20} />
                  </button>
                </TooltipTrigger>

                <TooltipContent
                  side="right"
                  className={`text-xs font-medium rounded px-2 py-1`}
                >
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Profile Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setActiveTab(TAB_KEYS.PROFILE as TabKey)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all group relative hover:scale-105 ${
                activeTab === TAB_KEYS.PROFILE
                  ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-shadow"
                  : "text-gray-400 hover:text-white hover:bg-nexion-primary-foreground"
              }`}
            >
              <User size={20} />
            </button>
          </TooltipTrigger>

          <TooltipContent
            side="right"
            className="text-xs font-medium rounded px-2 py-1"
          >
            Profile
            
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
