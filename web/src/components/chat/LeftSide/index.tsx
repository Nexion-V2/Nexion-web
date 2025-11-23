"use client";

import React, { useState } from "react";
import { SquarePen, Pin } from "lucide-react";

// Components
import ChatListSkeleton from "./ChatListSkeleton";
import SearchBar from "@/components/ui/SearchBar";
import ChatItem from "./ChatItem";

// Hooks
import { useSearchUserAndConversations } from "../Hooks/SearchUserAndConversations";
import { useInitialConversations } from "../Hooks/useInitialConversations";
import { Button } from "@/components/ui/button";

export default function ChatList() {
  // State for search
  const [searchValue, setSearchValue] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Hooks to fetch data
  const searchResults = useSearchUserAndConversations(searchValue);
  const { data: initialConversations, loading: isLoading } =
    useInitialConversations();

  // Determine which chats to show based on search state
  const displayItems =
    (isSearching ? searchResults : initialConversations) ?? [];

  // console.log("Current conversations:", displayItems);

  // Separate pinned chats
  const pinnedChats = displayItems?.filter(
    (chat) => chat.isPinned && chat.name?.toLowerCase().includes("")
  );

  // Separate unpinned chats
  const unpinnedChats = displayItems?.filter((chat) => !chat.isPinned);

  //Loading state
  if (isLoading) {
    return <ChatListSkeleton />;
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Header */}
      <div className="w-full flex justify-between px-4 py-3 bg-neutral-900/70">
        <div className="flex items-center font-bold text-2xl">Message</div>
        <Button
          variant="outline"
          // onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 font-medium border-none"
          title="Create New Classroom"
        >
          <SquarePen  size={18} />
        </Button>
      </div>

      {/* Search */}
      <div className="px-2 md:px-4">
        <SearchBar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          setIsSearching={setIsSearching}
        />
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {/* Pinned Chats */}
        {pinnedChats?.length > 0 && (
          <div className="mt-4 px-4">
            <h2 className="text-xs font-medium text-[#67676D] tracking-wide mb-3 flex items-center gap-2">
              <Pin size={12} /> PINNED CHATS
            </h2>
            <div className="space-y-1">
              {pinnedChats?.map((conversation) => (
                <ChatItem key={conversation.id} conversation={conversation} />
              ))}
            </div>
          </div>
        )}

        {/* All Chats */}
        {unpinnedChats?.length > 0 && (
          <div className="mt-4 px-4">
            <h2 className="text-xs font-medium text-[#67676D] tracking-wide mb-3">
              ALL CONVERSATIONS
            </h2>
            <div className="space-y-1">
              {unpinnedChats?.map((conversation) => (
                <ChatItem key={conversation.id} conversation={conversation} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
