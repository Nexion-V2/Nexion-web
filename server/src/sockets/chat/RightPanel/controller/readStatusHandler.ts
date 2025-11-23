// src/sockets/handlers/readStatusHandler.ts (FINAL LOGIC)

import { Server } from "socket.io";
import { AuthenticatedSocket } from "@/types/chat";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message/Message"; //  Message Model Import করা হয়েছে

// Assuming getConversationParticipants helper function is available
const getConversationParticipants = async (convId: string): Promise<string[]> => {
    const conv = await Conversation.findById(convId).select('participants.user');
    return conv ? conv.participants.map(p => p.user.toString()) : [];
};

export const handleReadStatus = (
  io: Server,
  socket: AuthenticatedSocket,
  userSockets: Map<string, Set<string>>
) => {
  socket.on(
    "conversation:read",
    async ({ conversationId }: { conversationId: string }) => {
      try {
        if (!socket.user || !conversationId) return;

        const currentUserId = socket.user._id;
        const now = new Date();

        // 1. BULK DELIVERY UPDATE (Handles offline "delivered" status)
        // যে মেসেজগুলো currentUserId-কে পাঠানো হয়েছে এবং 'delivered' স্ট্যাটাসে নেই, সেগুলোকে 'delivered' করা
        await Message.updateMany(
            { 
                conversationId: conversationId,
                senderId: { $ne: currentUserId }, 
                deliveryStatus: { $ne: "delivered" }
            },
            { $set: { deliveryStatus: "delivered" } }
        );

        // 2. 🔑 BULK SEEN/READ UPDATE 
        // এই কনভারসেশনের সমস্ত মেসেজে currentUserId-কে 'readBy' অ্যারেতে যুক্ত করা।
        await Message.updateMany(
            { 
                conversationId: conversationId, 
                readBy: { $ne: currentUserId } 
            },
            { $addToSet: { readBy: currentUserId } }
        );

        // 3. Update Conversation: lastViewed (Your original step 1)
        await Conversation.updateOne(
          { _id: conversationId, "participants.user": currentUserId },
          { $set: { "participants.$.lastViewed": now } }
        );

        // 4. BROADCAST 'message:read' TO SENDER(S)
        
        // Find the last message that the current user just read (sent by others)
        const lastMessage = await Message.findOne({ 
                conversationId: conversationId,
                senderId: { $ne: currentUserId } // Ensure we only broadcast to the sender
            })
            .sort({ createdAt: -1 }) 
            .select('_id senderId');
        
        const participants = await getConversationParticipants(conversationId);
        
        if (lastMessage && lastMessage.senderId) {
            const senderId = lastMessage.senderId.toString();
            const messageId = lastMessage._id ? lastMessage._id.toString() : null;

            if (!messageId) return;

            // Broadcast 'message:read' ONLY to the sender's active sockets
            const sockets = userSockets.get(senderId);
            if (sockets) {
                const readPayload = { 
                    conversationId: conversationId,
                    messageId: messageId, // The message that should display the blue tick
                    readerId: currentUserId.toString()
                };
                
                sockets.forEach((sId) => {
                    // Sender's UI will update the status of the last message to 'seen'.
                    io.to(sId).emit("message:read", readPayload);
                });
            }
        }
        
        // 5. Broadcast "conversation:marked_read" (Your original step 2, but adjusted for userSockets)
        // This clears the unread count/badge for all participants
        for (const userId of participants) {
            const userSocks = userSockets.get(userId);
            userSocks?.forEach((sId) => {
                io.to(sId).emit("conversation:marked_read", { conversationId });
            });
        }
        
      } catch (error) {
        console.error("Error handling conversation:read:", error);
      }
    }
  );
};