import {
  MessagesSquare,
  GraduationCap,
  MessageSquare,
  Calendar,
  BotMessageSquare,
} from "lucide-react";

export interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

// Desktop sidebar items
export const NavigationItems: NavigationItem[] = [
  { id: "chats", icon: MessageSquare, label: "All chats" },
  { id: "classroom", icon: GraduationCap, label: "Classroom" },
  { id: "bots", icon: BotMessageSquare, label: "Bots" },
  { id: "calendar", icon: Calendar, label: "Calendar" },
];

// Tab keys for easy reference
export const TAB_KEYS = {
  CHATS: "chats",
  BOTS: "bots",
  CLASSROOM: "classroom",
  CALENDAR: "calendar",
  PROFILE: "profile",
  SETTINGS: "settings",
} as const;

export type TabKey = (typeof TAB_KEYS)[keyof typeof TAB_KEYS];
