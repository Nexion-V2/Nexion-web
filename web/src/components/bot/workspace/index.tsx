"use client";
import { BgRemoverBot } from "./bg-remover-bot";
import { PdfToDocxBot } from "./pdf-to-docx-bot";
import { usePanel } from "@/context/PanelContext";
import BackButton from "@/components/ui/BackButton";
import { AiChatBot } from "./ai-chat-bot";

export default function BotInterface() {
  const { activeBot } = usePanel();
  if (!activeBot) return null;
  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center border-b border-border bg-card p-4 sticky top-0 z-10">
        <BackButton />
        <div className="flex items-center gap-3">
          <span className="text-3xl bg-blue-500 rounded-full p-2"><activeBot.icon /></span>
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {activeBot.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {activeBot.description}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeBot.type === "bg-remover" && <BgRemoverBot />}
        {activeBot.type === "pdf-to-docx" && <PdfToDocxBot />}
        {activeBot.type === "ai-chat" && <AiChatBot />}
      </div>
    </div>
  );
}
