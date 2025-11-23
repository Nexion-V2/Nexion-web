"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquareText, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Hook
import { useRelativeTime } from "@/hooks/useRelativeTime";

// Types
import type { Assignment } from "@/types/classroom";

// Redux
import { useDispatch } from "react-redux";
// import { sendComment } from "@/redux/slices/classroomSlice";

// UUID
import { v4 as uuidv4 } from "uuid";

const CURRENT_USER_AUTHOR = "You"; // Placeholder for current user identification

// -------------------------------------------
// Child Component: MessageItem
// -------------------------------------------
interface MessageItemProps {
  message: NonNullable<Assignment["discussions"]>[number];
  isCurrentUser: boolean;
}

function MessageItem({ message, isCurrentUser }: MessageItemProps) {
  const relativeTime = useRelativeTime(message.timestamp);

  return (
    <div
      key={message._id}
      className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[80%] rounded-xl px-4 py-2 shadow-md transition-all duration-150 ${
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-tl-none border border-border"
        }`}
      >
        {/* Show author for others */}
        {!isCurrentUser && (
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-bold text-primary/80">{message.author}</p>
          </div>
        )}

        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.message}</p>

        <div
          className={`text-right mt-1 ${isCurrentUser ? "text-primary-foreground/70" : "text-muted-foreground"
            }`}
        >
          <p className="text-[10px]">{relativeTime}</p>
        </div>
      </div>
    </div>
  );
}

// ----------------------------
// Main Component: DiscussionsSection
// ----------------------------

interface DiscussionsSectionProps {
  discussions: Assignment["discussions"];
  classroomId: string;
  assignment: Assignment;
}

export default function DiscussionsSection({
  discussions,
  classroomId,
  assignment,
}: DiscussionsSectionProps) {
  const [messages, setMessages] = useState(() => discussions ?? []);
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
    //     assignmentId: assignment.id,
    //     message: newMessage,
    //   })
    // );

    setMessages((prev) => [...prev, newMessage]);
    setMessageText("");
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="border-t border-border p-5 bg-muted/20 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
      <div>
        <h4 className="font-semibold text-foreground mb-4 text-lg flex items-center gap-2">
          <MessageSquareText size={20} className="text-indigo-500" />
          Discussion ({messages.length})
        </h4>

        {/* --- Discussion Messages --- */}
        <div
          className="space-y-4 mb-5 max-h-72 overflow-y-auto bg-background border border-border rounded-lg p-4 custom-scrollbar"
          ref={chatContainerRef}
        >
          {messages.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-6">
              No messages yet. Start the conversation!
            </p>
          ) : (
            messages.map((discussion) => {
              const isCurrentUser = discussion.author === CURRENT_USER_AUTHOR;

              return (
                <MessageItem
                  key={discussion._id}
                  message={discussion}
                  isCurrentUser={isCurrentUser}
                />
              );
            })
          )}
        </div>

        <div className="flex gap-2">
          <Input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-input/50 border-input focus-visible:ring-offset-background rounded"
          />
          <Button
            size="icon"
            disabled={!messageText.trim()}
            onClick={handleSend}
            className="shrink-0 bg-indigo-500 hover:bg-indigo-600 text-white rounded"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}