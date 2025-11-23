import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { v4 } from "uuid";

export interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export const useChatSocket = () => {
  const { socket } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;

    const handleIncomingMessage = (message: Message) => {
      // Only add assistant messages from backend
      if (message.sender === "assistant") {
        setMessages((prev) => [...prev, message]);
        setIsLoading(false);
      }
    };

    socket.on("ai:response", handleIncomingMessage);
    socket.on("ai:error", () => setIsLoading(false));

    return () => {
      socket.off("ai:response", handleIncomingMessage);
      socket.off("ai:error", () => setIsLoading(false));
    };
  }, [socket]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!socket) return;
      const userMessage: Message = {
        id: v4(),
        text,
        sender: "user",
        timestamp: new Date(),
      };

      // Add only locally (frontend)
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // Emit to backend (backend will reply only assistant)
      socket.emit("ai:message", { message: text });
    },
    [socket]
  );

  return { messages, sendMessage, isLoading };
};