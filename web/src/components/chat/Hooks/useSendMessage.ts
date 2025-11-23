import { useChat } from "@/context/ChatContext/ChatProvider";
import { usePanel } from "@/context/PanelContext";
import { useSocket } from "@/context/SocketContext";
import { useAuth } from "@/context/AuthContext";
import { v4 as uuid } from "uuid";
import { IMessage } from "@/types/message/indexs";

export function useSendMessage() {
  const {
    draftMessage,
    setDraftMessage,
    setAllMessages,
    replyToId,
    setReplyToId,
    setIsRecordingActive,
  } = useChat();
  const { socket } = useSocket();
  const { selectedConversation } = usePanel();
  const { user } = useAuth();

  const isReadyToSend = Boolean(draftMessage?.text?.trim().length);

  const handleMessageSend = async () => {
    if (
      !socket ||
      !selectedConversation ||
      !user ||
      !draftMessage?.text?.trim()
    )
      return;

    const textContent = draftMessage.text.trim();
    const tempId = uuid();

    const optimisticMessage: IMessage = {
      _id: tempId,
      conversationId: selectedConversation.id,
      senderId: user.id,
      senderName: user.username || user.name || "Unknown",
      senderAvatar: user.avatar || "",
      content: { text: textContent, attachments: [] },
      type: "text",
      deliveryStatus: "sending",
      isMe: true,
      replyToId: replyToId || undefined,
      isEdited: false,
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      reactions: [],
      readBy: [],
      isSystemMessage: false,
    };

    // Push to end (bottom)
    setAllMessages((prev) => [optimisticMessage, ...prev]);

    // Send via socket
    socket.emit("message:send", {
      conversation:
        selectedConversation.type !== "user"
          ? selectedConversation.id
          : undefined,
      partner:
        selectedConversation.type === "user"
          ? selectedConversation.id
          : undefined,
      sender: user.id,
      content: optimisticMessage.content,
      type: "text",
      senderName: user.name,
      senderAvatar: user.avatar,
      replyTo: replyToId,
      tempId,
    });

    socket.on("message:confirm", (data) => {
      setAllMessages((prev) =>
        prev.map((msg) => (msg._id === data._id ? { ...msg, ...data } : msg))
      );
    });

    setDraftMessage({ text: "", attachments: [] });
    setReplyToId(null);
    setIsRecordingActive(false);
  };

  return { handleMessageSend, isReadyToSend };
}
