import { X } from "lucide-react";

import { Button } from "../ui/button";
import { type Message } from "@/types";

interface ReplyProps {
  replyingTo: Message;
  setReplyingTo: (message: Message | null) => void;
}

export const Reply = ({ replyingTo, setReplyingTo }: ReplyProps) => {
  return (
    <div className="reply-preview bg-secondary/20 p-2 border-t">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Replying to message from {replyingTo.sender}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setReplyingTo(null)}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm truncate">{replyingTo.content}</p>
    </div>
  );
};
