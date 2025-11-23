import { useState, useCallback } from "react";
import axios from "axios";
import { usePanel } from "@/context/PanelContext";
import { useSocket } from "@/context/SocketContext";
import { IMessage } from "@/types/message/indexs";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface FetchResult {
  messages: IMessage[];
  hasMore: boolean;
}

export function getMessages() {
  const { selectedConversation } = usePanel();
  const { socket } = useSocket();
  // Use a single loading state for any active fetch operation
  const [isMessageLoading, setIsMessageLoading] = useState<boolean>(false);
  const [initialMessageError, setInitialMessageError] = useState<string | null>(
    null
  );

  const fetchInitialMessages = useCallback(
    async (
      limit: number = 50,
      skip: number = 0
    ): Promise<FetchResult | null> => {
      const convId = selectedConversation?.id;
      const isUser = selectedConversation?.type === "user";
      console.log(selectedConversation);

      if (!convId || isUser) {
        setInitialMessageError("No conversation selected.");
        return null;
      }

      try {
        setIsMessageLoading(true);
        setInitialMessageError(null);

        const response = await axios.get(
          `${API_BASE_URL}/api/chat/${selectedConversation.id}/messages`,
          {
            params: { limit, skip },
            withCredentials: true,
          }
        );

        const data = response.data;
        if (data.success) {
          if (socket) {
            socket.emit("conversation:read", { conversationId: convId });
          }
          return {
            messages: data.messages as IMessage[],
            hasMore: data.hasMore || false,
          };
        }
        return null;
      } catch (err) {
        console.error("API Fetch Error:", err);
        setInitialMessageError(
          `Failed to load messages: ${
            axios.isAxiosError(err) ? err.message : "Unknown error"
          }`
        );
        return null;
      } finally {
        setIsMessageLoading(false);
      }
    },
    [selectedConversation?.id, socket]
  );

  return { fetchInitialMessages, isMessageLoading, initialMessageError };
}
