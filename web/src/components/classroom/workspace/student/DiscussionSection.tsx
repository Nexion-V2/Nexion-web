"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageSquareText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Classroom } from "@/types/classroom";
import { v4 as uuidv4 } from "uuid";

// Utility Hook
import { useRelativeTime } from "@/hooks/useRelativeTime";

// Redux
import { useDispatch } from "react-redux";
// import { sendComment } from "@/redux/slices/classroomSlice";

// Mock current user (replace with auth later)
const CURRENT_USER_AUTHOR = "Student";

interface DiscussionSectionProps {
  classroomId: string;
  assignment: NonNullable<Classroom["assignments"]>[number];
}

// ----------------------------
// Child Component: MessageItem
// ----------------------------
interface MessageItemProps {
  message: NonNullable<Classroom["assignments"]>[number]["discussions"][number];
  isCurrentUser: boolean;
}

function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  const relativeTime = useRelativeTime(message.timestamp);

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] rounded-xl px-4 py-2 shadow-md ${
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-tl-none border"
        }`}
      >
        {!isCurrentUser && (
          <p className="text-xs font-bold mb-1">{message.author}</p>
        )}

        <p className="text-sm whitespace-pre-wrap">{message.message}</p>

        <p
          className={`text-[10px] mt-1 ${
            isCurrentUser
              ? "text-primary-foreground/70"
              : "text-muted-foreground"
          }`}
        >
          {relativeTime}
        </p>
      </div>
    </div>
  );
}

// ----------------------------
// Main Component: DiscussionSection
// ----------------------------
export function DiscussionSection({
  assignment,
  classroomId,
}: DiscussionSectionProps) {
  const [messages, setMessages] = useState(() => assignment.discussions ?? []);
  const [messageText, setMessageText] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  // Handle send
  const handleSend = () => {
    const trimmed = messageText.trim();
    if (!trimmed) return;

    const newMessage = {
      _id: uuidv4(),
      author: CURRENT_USER_AUTHOR,
      message: trimmed,
      timestamp: new Date().toISOString(),
      replies: 0,
    };

    // dispatch(
    //   sendComment({
    //     classroomId,
    //     assignmentId: assignment._id,
    //     message: newMessage,
    //   })
    // );

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="border-t border-border p-5 bg-muted/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <h4 className="font-semibold text-lg flex items-center gap-2">
        <MessageSquareText size={20} className="text-accent-foreground" />
        Discussion ({messages.length})
      </h4>

      {/* Messages Container */}
      <div
        ref={chatContainerRef}
        className="space-y-4 mb-5 max-h-72 overflow-y-auto bg-background border rounded-lg p-4 custom-scrollbar"
      >
        {messages.length === 0 ? (
          <p className="text-center text-muted-foreground text-sm py-6">
            No messages yet. Start the conversation!
          </p>
        ) : (
          messages.map((d) => {
            const isCurrentUser = d.author === CURRENT_USER_AUTHOR;
            return (
              <MessageItem
                key={d._id}
                message={d}
                isCurrentUser={isCurrentUser}
              />
            );
          })
        )}
      </div>

      {/* Input + Send */}
      <div className="flex gap-2">
        <Input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
        />
        <Button size="icon" disabled={!messageText.trim()} onClick={handleSend}>
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
