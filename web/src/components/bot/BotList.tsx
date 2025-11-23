"use client";

import { useState, useMemo } from "react";
import { usePanel } from "@/context/PanelContext";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/SearchBar";
import { BotMessageSquare , SquarePen } from "lucide-react";
import type { Bot } from "@/types/bot";
import { FileText, Image  } from "lucide-react";

const bots: Bot[] = [
  {
    id: "1",
    name: "Background Remover",
    description: "Remove image backgrounds instantly",
    icon: Image ,
    type: "bg-remover",
  },
  {
    id: "2",
    name: "PDF to DOCX",
    description: "Convert PDF files to Word documents",
    icon: FileText,
    type: "pdf-to-docx",
  },
  {
    id: "3",
    name: "AI Chat",
    description: "Chat with an AI assistant",
    icon: BotMessageSquare,
    type: "ai-chat",
  },
];

export default function BotList() {
  const { activeBot, setActiveBot } = usePanel();
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Search filtering
  const filteredBots = useMemo(() => {
    const term = searchValue.toLowerCase();
    return bots.filter(
      (bot) =>
        bot.name.toLowerCase().includes(term) ||
        bot.description.toLowerCase().includes(term)
    );
  }, [searchValue]);

  const displayBots = searchValue ? filteredBots : bots;

  return (
    <div className="flex flex-col h-full w-full bg-card/80 backdrop-blur-md">
      {/* Header */}
      <div className="w-full flex justify-between px-4 py-3 bg-neutral-900/70">
        <div className="flex items-center font-bold text-2xl">Bots</div>
        <Button
          variant="outline"
          // onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 font-medium border-none"
          title="Create New Classroom"
        >
          <SquarePen size={18} />
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

      {/* Bots List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-medium text-[#67676D] tracking-wide">
              ALL BOTS ({displayBots.length})
            </h2>
          </div>

          {/* Bots Display */}
          {displayBots.length > 0 ? (
            displayBots.map((bot) => {
              const isActive = activeBot?.id === bot.id;
              return (
                <button
                  key={bot.id}
                  onClick={() => setActiveBot(bot)}
                  className={`relative w-full flex items-start gap-3 p-4 rounded-lg text-left transition-all duration-200 border hover:scale-105 hover:shadow-lg shadow-blue-500/30
                    ${
                      isActive
                        ? "bg-neutral-700/40 border-neutral-700"
                        : "bg-neutral-800/30 border-transparent hover:bg-neutral-800/50"
                    }`}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-md bg-blue-500 text-white">
                    <bot.icon />
                  </div>

                  {/* Bot Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate text-neutral-50">
                      {bot.name}
                    </div>
                    <p className="text-xs opacity-70 mt-1 line-clamp-2 text-gray-300">
                      {bot.description}
                    </p>

                    {/* Type Badge */}
                    <div className="relative mt-2 flex gap-3 text-xs">
                      <span
                        className={`relative font-medium flex items-center gap-1 capitalize
                          ${
                            bot.type === "bg-remover"
                              ? "text-emerald-400"
                              : "text-blue-400"
                          }`}
                      >
                        <span
                          className={`absolute inset-0 blur-lg rounded opacity-40 ${
                            bot.type === "bg-remover"
                              ? "bg-emerald-500/30"
                              : "bg-blue-500/30"
                          }`}
                        ></span>
                        <span className="relative z-10">
                          {bot.type.replace("-", " ")}
                        </span>
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="text-center py-10 text-gray-500">
              No bots found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

