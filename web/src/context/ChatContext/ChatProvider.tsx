"use client";
import React, { createContext, useContext, useMemo, useState } from "react";
import { IMessage, DraftMessage } from "@/types/message/indexs";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatAI } from "./hooks/useChatAI";
import { useChatDraft } from "./hooks/useChatDraft";
import { useChatUpload } from "./hooks/useChatUpload";
import { useNewMessage } from "./hooks/useNewMessage";
import { useMessageConfirm } from "./hooks/useMessageConfirm";
import { useMessageDelivery } from "./hooks/useMessageDelivery";
import { useMessageSeen } from "./hooks/useMessageSeen";

interface ChatContextType {
  allMessages: IMessage[];
  setAllMessages: React.Dispatch<React.SetStateAction<IMessage[]>>;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  hasMore: boolean;
  isMessageLoading: boolean;
  loadOlderMessages: () => void;
  draftMessage: DraftMessage;
  setDraftMessage: React.Dispatch<React.SetStateAction<DraftMessage>>;
  replyToId: string | null;
  setReplyToId: React.Dispatch<React.SetStateAction<string | null>>;
  uploadProgress: Record<string, number>;
  setUploadProgress: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  aiSuggestions: string[];
  showAISuggestions: boolean;
  onAISuggestion: (s: string) => void;
  isRecordingActive: boolean;
  setIsRecordingActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  // Manage all chat messages.
  const { allMessages, setAllMessages, scrollRef, hasMore, loadOlderMessages, isMessageLoading } = useChatMessages();
  // Handle incoming new messages
  useNewMessage(setAllMessages);
  // Message confirmation management
  useMessageConfirm(setAllMessages);
  // Message Delivery status management
  useMessageDelivery(setAllMessages);
  // Message Seen status management could be added here similarly
  useMessageSeen(setAllMessages);

  const { aiSuggestions, showAISuggestions, onAISuggestion } = useChatAI();
  const { draftMessage, setDraftMessage, replyToId, setReplyToId } = useChatDraft();
  const { uploadProgress, setUploadProgress } = useChatUpload();
  const [isRecordingActive, setIsRecordingActive] = useState(false);

const value = useMemo(
  () => ({
    allMessages,
    setAllMessages,
    scrollRef,
    hasMore,
    loadOlderMessages,
    draftMessage,
    setDraftMessage,
    replyToId,
    setReplyToId,
    uploadProgress,
    setUploadProgress,
    aiSuggestions,
    showAISuggestions,
    onAISuggestion,
    isRecordingActive,
    setIsRecordingActive,
    isMessageLoading
  }),
  [
    allMessages,
    draftMessage,
    replyToId,
    uploadProgress,
    aiSuggestions,
    showAISuggestions,
    onAISuggestion,
    isRecordingActive,
    hasMore,
    loadOlderMessages,
    scrollRef
  ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
