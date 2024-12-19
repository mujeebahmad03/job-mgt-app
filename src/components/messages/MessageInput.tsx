import { Paperclip, Send, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { type Attachment } from "@/services/messages";

interface MessageInputProps {
  onSubmit: (content: string, attachments: Attachment[]) => void;
  isEditing?: boolean;
  initialContent?: string;
}

export const MessageInput = ({
  onSubmit,
  isEditing = false,
  initialContent = "",
}: MessageInputProps) => {
  const [message, setMessage] = useState(initialContent);
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

    onSubmit(message, attachments);
    setMessage("");
    setAttachments([]);
  };

  return (
    <form onSubmit={handleSubmit} className="message-input-area">
      <div className="flex gap-2">
        <div className="flex-1 min-h-[40px] max-h-[160px]">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              isEditing ? "Edit your message..." : "Type your message..."
            }
            className="min-h-[40px] max-h-[160px] resize-none"
          />
        </div>
        <div className="flex gap-2">
          <input
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
            onClick={() => document.getElementById("attachments")?.click()}
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
    </form>
  );
};
