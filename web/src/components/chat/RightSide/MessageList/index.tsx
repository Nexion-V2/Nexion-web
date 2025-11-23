"use client";
import React, { useRef, useState, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import { useChat } from "@/context/ChatContext/ChatProvider";
import { LoaderCircle } from "lucide-react"; // Using LoaderCircle for the spinner

export default function MessageList() {
  const {
    allMessages,
    scrollRef, // ✅ Use the scrollRef provided by the hook
    hasMore,
    loadOlderMessages,
    isMessageLoading,
  } = useChat();
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);
  const messageRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  // ❌ Removed the local ref creation: const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToMessage = (messageId: string) => {
    const el = messageRefs.current[messageId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedMessageId(messageId);
      setTimeout(() => setHighlightedMessageId(null), 2000);
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || !hasMore) return;

    let isFetching = false; // 🔑 lock variable

    const handleScroll = async () => {
      const distanceFromTop =
        container.scrollHeight - container.clientHeight + container.scrollTop;

      if (distanceFromTop <= 100 && !isFetching) {
        isFetching = true; // lock
        console.log("🔼 Near top, load older messages");
        await loadOlderMessages(); // Call your API
        isFetching = false; // unlock
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [hasMore, loadOlderMessages]);

  return (
    <div
      ref={scrollRef} // Assign the hook's ref to the scrollable div
      className="flex-1 flex p-3 md:p-4 flex-col-reverse overflow-y-auto"
    >
      {allMessages.map((msg, index) => (
        <div key={msg._id ?? index} className="mb-4 flex-shrink-0">
          <MessageBubble
            message={msg}
            highlighted={highlightedMessageId === msg._id}
            scrollToMessage={scrollToMessage}
            ref={(el: HTMLDivElement) => {
              if (el && msg._id) messageRefs.current[msg._id] = el;
            }}
          />
        </div>
      ))}

      {/* Loading Indicator (Appears at the top of the chat area) */}
      {isMessageLoading && (
        <div className="flex justify-center items-center py-4 text-sm text-neutral-400">
          <LoaderCircle className="h-5 w-5 animate-spin mr-2" />
          <span>Loading older messages...</span>
        </div>
      )}

      {/* End of conversation indicator */}
      {!hasMore && allMessages.length > 0 && (
        <div className="text-center text-xs text-muted-foreground py-2 my-2">
          You've reached the beginning of the conversation.
        </div>
      )}
    </div>
  );
}
