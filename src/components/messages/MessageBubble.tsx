import { MoreVertical, Edit, Reply } from "lucide-react";
import { Button } from "../ui/button";
import { MessageAttachment } from "./MessageAttachment";
import { type Message } from "@/services/messages";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MessageBubbleProps {
  message: Message;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: Message) => void;
  isIssue?: boolean;
}

export const MessageBubble = ({
  message,
  onEdit,
  onDelete,
  onReply,
  isIssue = false,
}: MessageBubbleProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="group">
      <div
        className={`message-bubble ${
          message.sender === "user"
            ? "sent"
            : message.sender === "system"
            ? "system"
            : "received"
        }`}
      >
        {message.replyTo && (
          <div className="reply-to">
            <span className="text-muted-foreground">
              Replying to {message.replyTo.sender}:
            </span>
            <p className="truncate">{message.replyTo.content}</p>
          </div>
        )}
        <div className="flex justify-between items-start gap-2">
          <p>{message.content}</p>
          {message.sender === "user" && (onEdit || onReply) && (
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem
                        className="text-destructive"
                        onSelect={(e) => e.preventDefault()}
                      >
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Message</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this message? This
                          action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(message.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
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
        <div className="timestamp flex items-center gap-2 text-xs opacity-70">
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
          {message.edited && (
            <span className="text-muted-foreground">(edited)</span>
          )}
        </div>
      </div>
    </div>
  );
};
