import { MoreVertical, Edit, Reply, Check, CheckCheck } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { MessageAttachment } from "./MessageAttachment";
import { MessageReactions, type Reaction } from "./MessageReactions";
import { type Message } from "@/types";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert } from "../Alert";

interface MessageBubbleProps {
  message: Message;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: Message) => void;
  onQuoteClick?: (messageId: string) => void;
  isIssue?: boolean;
}

export const MessageBubble = ({
  message,
  onEdit,
  onDelete,
  onReply,
  onQuoteClick,
  isIssue = false,
}: MessageBubbleProps) => {
  const isMobile = useIsMobile();
  const [reactions, setReactions] = useState<Reaction[]>([
    { type: "like", count: 0, reacted: false },
    { type: "dislike", count: 0, reacted: false },
    { type: "heart", count: 0, reacted: false },
    { type: "smile", count: 0, reacted: false },
    { type: "angry", count: 0, reacted: false },
  ]);

  const handleReaction = (type: Reaction["type"]) => {
    setReactions((prev) =>
      prev.map((reaction) =>
        reaction.type === type
          ? {
              ...reaction,
              count: reaction.reacted ? reaction.count - 1 : reaction.count + 1,
              reacted: !reaction.reacted,
            }
          : reaction
      )
    );
  };

  return (
    <div className="group" id={`message-${message.id}`}>
      <div
        className={`message-bubble ${
          message.sender === "talent"
            ? "sent"
            : message.sender === "system"
            ? "system"
            : "received"
        }`}
      >
        {message.replyTo && (
          <div
            className="reply-to cursor-pointer hover:bg-secondary/30 transition-colors"
            onClick={() => onQuoteClick?.(message.replyTo!.id)}
          >
            <span className="text-muted-foreground">
              Replying to {message.replyTo.sender}:
            </span>
            <p className="truncate">{message.replyTo.content}</p>
          </div>
        )}
        <div className="flex justify-between items-start gap-2">
          <p>{message.content}</p>
          {message.sender === "talent" && (onEdit || onReply) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-6 w-6 ${
                    isMobile ? "bg-secondary/50" : ""
                  } hover:bg-secondary`}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && (
                  <DropdownMenuItem
                    onClick={() => onEdit(message.id, message.content)}
                  >
                    <Edit className="h-3 w-3 mr-2" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onReply && (
                  <DropdownMenuItem onClick={() => onReply(message)}>
                    <Reply className="h-3 w-3 mr-2" />
                    Reply
                  </DropdownMenuItem>
                )}
                {!isIssue && onDelete && (
                  <Alert
                    actionType="destructive"
                    title="Delete Message"
                    description="Are you sure you want to delete this message? This action cannot be undone."
                    onCompletion={() => onDelete(message.id)}
                    trigger={
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={(e) => e.preventDefault()}
                      >
                        Delete
                      </DropdownMenuItem>
                    }
                  />
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.attachments.map((attachment, index) => (
              <MessageAttachment
                key={index}
                attachment={attachment}
                index={index}
              />
            ))}
          </div>
        )}
        <MessageReactions reactions={reactions} onReact={handleReaction} />
        <div className="timestamp">
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
          {message.edited && (
            <span className="text-muted-foreground">(edited)</span>
          )}
          {message.sender === "talent" && (
            <span className="ml-auto">
              {message.read ? (
                <CheckCheck className="h-3 w-3 text-blue-500" />
              ) : (
                <Check className="h-3 w-3" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
