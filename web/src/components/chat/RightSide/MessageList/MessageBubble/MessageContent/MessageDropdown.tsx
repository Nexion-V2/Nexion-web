import { FC } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical } from "lucide-react";
import { useChat } from "@/context/ChatContext/ChatProvider";
import { useSocket } from "@/context/SocketContext";

interface MessageDropdownProps {
  options?: string[];
  msgId: string;
}

const MessageDropdown: FC<MessageDropdownProps> = ({
  options = ["Reply", "Forward", "Copy", "Report", "Delete"],
  msgId,
}) => {
  const { setReplyToId, allMessages, setAllMessages } = useChat();
  const { socket } = useSocket();

  const onClick = (item: string) => {
    switch (item) {
      case "Reply":
        setReplyToId(msgId);
        break;

      case "Forward":
        // forward logic
        break;

      case "Copy":
        navigator.clipboard.writeText(
          allMessages.find((msg) => msg._id === msgId)?.content.text || ""
        );
        break;

      case "Edit":
        // edit logic
        break;

      case "Delete":
        if (socket) {
          socket.emit("deleteMessage", { messageId: msgId });

          socket.on("messageDeleted", ({ messageId }) => {
            setAllMessages((prev) =>
              prev.filter((msg) => msg._id !== messageId)
            );
          });
        }
        break;

      default:
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <EllipsisVertical
          className="text-gray-400 flex-shrink-0 w-6 h-6 p-1 hover:bg-[#323438]/50 rounded-sm cursor-pointer"
          strokeWidth={2}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        className="bg-[#1a1a1a] border border-neutral-800 text-gray-200 shadow-lg p-0"
      >
        {options.map((item) => (
          <DropdownMenuItem
            key={item}
            onClick={() => onClick(item)}
            disabled={item === "Forward" || item === "Report"}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-200 data-[highlighted]:bg-neutral-800 data-[highlighted]:text-gray-200 rounded-none cursor-pointer"
          >
            {item}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MessageDropdown;
