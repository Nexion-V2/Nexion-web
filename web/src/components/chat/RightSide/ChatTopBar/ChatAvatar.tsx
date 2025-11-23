"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ISelectedChatHeader } from "@/types/message/types";

export default function ChatAvatar({ User }: { User: ISelectedChatHeader }) {
  return (
    <Avatar className="w-12 h-12 rounded-lg flex-shrink-0">
      <AvatarImage src={User.avatar} alt={User.name} />
      <AvatarFallback className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white">
        <span className="text-xl font-bold">
          {(User.name || "NA").slice(0, 2).toUpperCase()}
        </span>
      </AvatarFallback>
    </Avatar>
  );
}
