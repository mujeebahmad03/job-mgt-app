import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { useToast } from "@/hooks/use-toast";
import {
  useMessages,
  type Message,
  type Attachment,
} from "@/hooks/useMessages";
import { MessageBubble } from "./messages/MessageBubble";
import { MessageInput } from "./messages/MessageInput";

export const Chat = () => {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const { toast } = useToast();

  const { messages, addMessage, isLoading, editMessage, deleteMessage } =
    useMessages({
      storageKey: "chat-messages",
    });

  const handleSubmit = (content: string, attachments: Attachment[]) => {
    if (editingMessageId) {
      editMessage({
        messageId: editingMessageId,
        content,
      });
      setEditingMessageId(null);
      toast({
        title: "Message updated",
        description: "Your message has been updated successfully.",
      });
    } else {
      const replyToData = replyingTo
        ? {
            id: replyingTo.id,
            content: replyingTo.content,
            sender: replyingTo.sender,
          }
        : undefined;

      addMessage(content, attachments, replyToData);
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    }

    setReplyingTo(null);
  };

  const handleEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setReplyingTo(null);
  };

  const handleDelete = (messageId: string) => {
    deleteMessage(messageId);
    toast({
      title: "Message deleted",
      description: "Your message has been deleted successfully.",
    });
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    setEditingMessageId(null);
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Message</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="message-area">
          <div className="message-list">
            {isLoading ? (
              <div className="text-center text-muted-foreground">
                Loading...
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground">
                No messages yet
              </div>
            ) : (
              messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  message={msg}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onReply={handleReply}
                />
              ))
            )}
          </div>

          {replyingTo && (
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
          )}

          <MessageInput
            onSubmit={handleSubmit}
            isEditing={!!editingMessageId}
            initialContent={
              editingMessageId
                ? messages.find((m) => m.id === editingMessageId)?.content
                : ""
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};
