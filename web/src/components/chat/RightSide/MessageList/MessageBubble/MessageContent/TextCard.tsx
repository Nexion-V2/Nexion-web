import { DraftMessage } from "@/types/message/indexs";
import ExpandableText from "@/components/ui/ExpandableText";

export default function TextCard({ msg }: { msg: DraftMessage }) {
  if (!msg.text) return null;

  return (
    <div className="text-sm text-gray-50 space-y-2.5">
      {msg.text && <ExpandableText text={msg.text} />}
    </div>
  );
}
