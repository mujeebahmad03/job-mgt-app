import { Edit, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { MessageAttachment } from "./MessageAttachment";
import { type Message } from "@/services/messages";

interface MessageBubbleProps {
  message: Message;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
}

export const MessageBubble = ({
  message,
  onEdit,
  onDelete,
}: MessageBubbleProps) => {
  if (message.sender === "system") {
    return (
      <div className="flex justify-center my-6">
        <div className="message-bubble system bg-success/20 text-success-foreground border border-success/30 px-6 py-3 animate-scale-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <p className="text-sm font-medium">{message.content}</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div
      className={`message-bubble ${
        message.sender === "user" ? "sent" : "received"
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <p>{message.content}</p>
        {message.sender === "user" && onEdit && onDelete && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onEdit(message.id, message.content)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-destructive hover:text-destructive"
              onClick={() => onDelete(message.id)}
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
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
      <div className="timestamp">
        {new Date(message.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};
