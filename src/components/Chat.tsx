import { Paperclip, Send, X } from "lucide-react";
import { useState } from "react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { useToast } from "@/hooks/use-toast";
import { useMessages, type Attachment } from "@/hooks/useMessages";
import { Textarea } from "./ui/textarea";
import { MessageBubble } from "./messages/MessageBubble";

export const Chat = () => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const { toast } = useToast();

  const { messages, addMessage, isLoading, editMessage, deleteMessage } =
    useMessages({
      storageKey: "chat-messages",
    });

  const handleAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newAttachments: Attachment[] = await Promise.all(
      files.map(async (file) => {
        const isImage = file.type.startsWith("image/");
        const attachment: Attachment = {
          type: isImage ? "image" : "file",
          url: URL.createObjectURL(file),
          name: file.name,
        };

        if (isImage) {
          attachment.preview = attachment.url;
        }

        return attachment;
      })
    );
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = prev.filter((_, i) => i !== index);
      // Cleanup URLs to prevent memory leaks
      URL.revokeObjectURL(prev[index].url);
      return newAttachments;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;

    if (editingMessageId) {
      editMessage({ messageId: editingMessageId, content: message });
      setEditingMessageId(null);
      toast({
        title: "Message updated",
        description: "Your message has been updated successfully.",
      });
    } else {
      addMessage(message, attachments);
      toast({
        title: "Message sent",
        description: "Your message has been sent successfully.",
      });
    }

    setMessage("");
    setAttachments([]);
  };

  const handleEdit = (messageId: string, content: string) => {
    setEditingMessageId(messageId);
    setMessage(content);
  };

  const handleDelete = (messageId: string) => {
    deleteMessage(messageId);
    toast({
      title: "Message deleted",
      description: "Your message has been deleted successfully.",
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Messages</CardTitle>
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
                />
              ))
            )}
          </div>

          {attachments.length > 0 && (
            <div className="attachment-preview">
              <div className="flex flex-wrap gap-2">
                {attachments.map((file, index) => (
                  <div key={index} className="attachment-item group relative">
                    {file.type === "image" ? (
                      <>
                        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                          <img
                            src={file.preview}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm">{file.name}</span>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      onClick={() => removeAttachment(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="message-input-area">
            <div className="flex gap-2">
              <div className="flex-1 min-h-[40px] max-h-[160px]">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={
                    editingMessageId
                      ? "Edit your message..."
                      : "Type your message..."
                  }
                  className="min-h-[40px] max-h-[160px] resize-none"
                />
              </div>
              <div className="flex gap-2 items-end">
                <Input
                  type="file"
                  multiple
                  className="hidden"
                  id="attachments"
                  onChange={handleAttachment}
                  accept="image/*,.pdf,.doc,.docx,.txt"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    document.getElementById("attachments")?.click()
                  }
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button
                  type="submit"
                  disabled={!message.trim() && attachments.length === 0}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
