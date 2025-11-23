"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, BotMessageSquare } from "lucide-react"; // Import MessageCircle or another suitable icon
import { useChatSocket } from "./hooks/useChatSocket";

export function AiChatBot() {
  const { messages, sendMessage, isLoading } = useChatSocket();
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  const hasMessages = messages && messages.length > 0;

  return (
    <div className="flex flex-col h-full">
      <div className="relative flex-1 overflow-y-auto p-4 flex flex-col-reverse">
        {/* Loading Indicator for AI response */}
        {isLoading && (
          <div className="flex justify-start pb-4">
            {" "}
            {/* Added pb-4 for spacing */}
            <div className="bg-muted rounded-lg px-2.5 py-1.5 rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce" />
                <div
                  className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                />
                <div
                  className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Conditional rendering for no messages state */}
        {!hasMessages && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
            <div className="flex items-center justify-center w-20 h-20 mb-4 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-700 animate-pulse">
              <BotMessageSquare className="w-10 h-10 text-blue-600 dark:text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
              No Messages Yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Start the conversation by typing below. Your AI assistant is ready
              to chat!
            </p>
          </div>
        )}

        {/* Display messages (reversed order for flex-col-reverse) */}
        {hasMessages && (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md rounded-lg px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-blue-500 text-white rounded-br-none shadow-sm"
                      : "bg-muted text-foreground rounded-bl-none shadow-sm"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <p
                    className={`text-[10px] mt-1 tracking-wider uppercase ${
                      message.sender === "user"
                        ? "text-blue-200"
                        : "text-muted-foreground/70"
                    }`}
                  >
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}

            {/* Scroll anchor goes at the bottom (visually top) of the reversed list */}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="border-t border-border bg-card px-2 py-2">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-1 rounded border-none focus:ring-0 outline-none focus-visible:ring-0 !bg-transparent"
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            size="icon"
            className="shrink-0 rounded bg-blue-500 hover:bg-blue-600"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4 text-blue-50" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
