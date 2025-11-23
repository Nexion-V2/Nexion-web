import { useEffect, useState, useRef, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { usePanel } from "@/context/PanelContext";
import { IMessage } from "@/types/message/indexs";
import { getMessages } from "./getMessages";

export function useChatMessages() {
    const [allMessages, setAllMessages] = useState<IMessage[]>([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const { socket } = useSocket();
    const { selectedConversation } = usePanel();
    const scrollRef = useRef<HTMLDivElement>(null); // 🔑 The single source of truth for the scroll container
    const { fetchInitialMessages, isMessageLoading } = getMessages();
    const limit = 7; // messages per fetch

    // --- Load initial messages ---
    useEffect(() => {
        const chatId = selectedConversation?.id;
        if (!chatId || !socket) return;

        // Reset state when conversation changes
        setAllMessages([]);
        setSkip(0);
        setHasMore(true);

        const loadInitial = async () => {
            const data = await fetchInitialMessages(limit, 0);
            if (data) {
                setAllMessages(data.messages);
                setSkip(data.messages.length);
                setHasMore(data.hasMore ?? false);

                // Scroll to bottom (scrollTop=0 is the bottom in flex-col-reverse)
                setTimeout(() => {
                    scrollRef.current?.scrollTo(0, 0); 
                }, 50);
            }
            socket.emit("conversation:read", { conversationId: chatId });
        };

        loadInitial();
    }, [socket, selectedConversation?.id, fetchInitialMessages, limit]);

    // --- Load older messages on scroll (Callback for infinite scrolling) ---
    const loadOlderMessages = useCallback(async () => {
        if (!selectedConversation || !hasMore || isMessageLoading) return;

        const container = scrollRef.current;
        if (!container) return;

        const data = await fetchInitialMessages(limit, skip);
        if (data?.messages?.length) {
            setAllMessages(prev => [...prev, ...data.messages]);
            setSkip(prev => prev + data.messages.length);
            setHasMore(data.hasMore ?? false);
        }

    }, [selectedConversation, hasMore, skip, fetchInitialMessages, isMessageLoading, limit]);

    // --- Auto scroll on new message (Kept here for completeness, though MessageList can handle it) ---
    // ❌ We are removing the auto-scroll useEffect from the hook to prevent conflicts.

    return { allMessages, setAllMessages, scrollRef, hasMore, loadOlderMessages, isMessageLoading };
}