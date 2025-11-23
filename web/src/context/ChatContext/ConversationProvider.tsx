"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { ISearchResult } from "@/types/message/types";
import { useChatListUpdate } from "./hooks/useChatListUpdate";
import { useUserStatusUpdate } from "./hooks/useUserStatusUpdate";
import { useConversationApi } from "./hooks/useFetchConversations";

interface ConversationContextType {
  conversations: ISearchResult[];
  isConversationsLoading: boolean;
  setConversations: React.Dispatch<React.SetStateAction<ISearchResult[]>>;
  conversationError: string | null;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
  undefined
);

export const useConversation = () => {
  const context = useContext(ConversationContext);
  if (!context)
    throw new Error(
      "useConversation must be used within a ConversationProvider"
    );
  return context;
};

export const ConversationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const {
    fetchInitialConversations,
    isConversationsLoading,
    conversationError,
  } = useConversationApi();
  const [conversations, setConversations] = useState<ISearchResult[]>([]);
  const { user } = useAuth();

  // Initial load of conversations
  useEffect(() => {
    if (!user) return; // no valid session yet

    const loadConversations = async () => {
      const result = await fetchInitialConversations();
      if (result?.conversations) setConversations(result.conversations);
    };

    loadConversations();
  }, [user, fetchInitialConversations]);

  //Use the custom hook to handle real-time conversation updates
  useChatListUpdate(setConversations);

  // Use the custom hook to handle real-time user status updates
  useUserStatusUpdate(setConversations);

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        isConversationsLoading,
        setConversations,
        conversationError,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
