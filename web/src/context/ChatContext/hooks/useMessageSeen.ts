// src/context/hooks/useMessageSeen.ts

import { useEffect, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { IMessage } from "@/types/message/indexs";

interface SeenUpdatePayload {
    conversationId: string;
    messageId: string; // The ID of the message that is now seen (lastMessage._id)
    readerId: string;
}

/**
 * Custom hook to listen for the 'message:read' socket event 
 * and update the message list to show the "seen" status (e.g., blue tick).
 * * @param setAllMessages - State setter function from the ChatProvider (or parent component).
 */
export const useMessageSeen = (
    setAllMessages: React.Dispatch<React.SetStateAction<IMessage[]>>
) => {
    const { socket } = useSocket();

    const handleMessageSeen = useCallback(
        (data: SeenUpdatePayload) => {
            console.log("Received message:read, updating UI:", data);

            // সমস্ত মেসেজ আপডেট করা হচ্ছে
            setAllMessages(prevMessages => {
                
                // CRITICAL LOGIC: Find the specific message by ID and update its status
                return prevMessages.map(msg => {
                    // 1. মেসেজটি প্রেরকের পাঠানো হতে হবে এবং তার ID মিলতে হবে
                    if (msg._id === data.messageId) {
                        
                        // 2. 🔑 স্ট্যাটাস আপডেট: deliveryStatus পরিবর্তন করা হচ্ছে 'seen' বা 'read' এ
                        // আপনার IMessage স্কিমা অনুযায়ী এখানে পরিবর্তন করুন।
                        // যদি আপনার স্ট্যাটাস তিনটি লেভেল (sent, delivered, seen) হয়, তবে এখানে পরিবর্তন করুন।
                        return { 
                            ...msg, 
                            deliveryStatus: "seen" // 'seen' স্ট্যাটাস সেট করা হচ্ছে
                        };
                    }
                    return msg;
                });
            });
        },
        [setAllMessages] 
    ); // setAllMessages must be a dependency

    useEffect(() => {
        if (!socket) return;
        
        // 🔑 'message:read' ইভেন্টের জন্য লিসেনার যুক্ত করা
        socket.on("message:read", handleMessageSeen);

        return () => {
            // ক্লিনআপ ফাংশন: কম্পোনেন্ট আনমাউন্ট হলে লিসেনার সরিয়ে ফেলা
            socket.off("message:read", handleMessageSeen);
        };
    }, [socket, handleMessageSeen]);
};