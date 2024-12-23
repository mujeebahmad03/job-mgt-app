import { Paperclip, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { type Attachment } from "@/types";

interface MessageInputProps {
  attachments: Attachment[];
  message: string;
  handleAttachment: (e: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onMessageChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  editingMessageId: string | null;
  isIssue?: boolean;
}

export const MessageInput = ({
  attachments,
  message,
  handleAttachment,
  onMessageChange,
  onSubmit,
  editingMessageId,
  isIssue,
}: MessageInputProps) => {
  const placeholder = isIssue
    ? "Type your message to admin..."
    : "Type your message...";

  return (
    <form onSubmit={onSubmit} className="message-input-area">
      <div className="flex gap-2">
        <div className="flex-1 min-h-[40px] max-h-[160px]">
          <Textarea
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder={
              editingMessageId ? "Edit your message..." : placeholder
            }
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
  );
};
