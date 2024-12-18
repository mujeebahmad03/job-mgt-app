import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageBubble } from "@/components/messages/MessageBubble";
import { Paperclip, Send, X } from "lucide-react";
import { type Message, type Attachment } from "@/services/messages";

interface IssueMessageAreaProps {
  messages: Message[];
  onSendMessage: (content: string, attachments: Attachment[]) => void;
  onBack?: () => void;
  showBackButton?: boolean;
}

export const IssueMessageArea = ({
  messages,
  onSendMessage,
  onBack,
  showBackButton,
}: IssueMessageAreaProps) => {
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState<Attachment[]>([]);

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
      URL.revokeObjectURL(prev[index].url);
      return newAttachments;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;

    onSendMessage(message, attachments);
    setMessage("");
    setAttachments([]);
  };

  return (
    <div className="message-area">
      {showBackButton && (
        <div className="sticky top-0 z-10 p-2 bg-background/80 backdrop-blur-sm border-b">
          <Button variant="ghost" size="sm" onClick={onBack} className="w-full">
            Back to Issues
          </Button>
        </div>
      )}
      <div className="message-list">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No messages yet
          </div>
        ) : (
          messages.map((msg) => <MessageBubble key={msg.id} message={msg} />)
        )}
      </div>

      {attachments.length > 0 && (
        <div className="attachment-preview">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="attachment-item group relative">
                {file.type === "image" ? (
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden">
                    <img
                      src={file.preview}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
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
              placeholder="Type your message to admin..."
              className="min-h-[40px] max-h-[160px] resize-none"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="file"
              multiple
              className="hidden"
              id="issue-attachments"
              onChange={handleAttachment}
              accept="image/*,.pdf,.doc,.docx,.txt"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                document.getElementById("issue-attachments")?.click()
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
  );
};
