import { Paperclip, Image as ImageIcon, Download } from "lucide-react";
import { Button } from "../ui/button";
import { type Attachment } from "@/types";

interface MessageAttachmentProps {
  attachment: Attachment;
  index: number;
}

export const MessageAttachment = ({ attachment, index }: MessageAttachmentProps) => {
  const handleDownload = () => {
    // Create an anchor element and trigger download
    const link = document.createElement('a');
    link.href = attachment.url;
    link.download = attachment.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      key={index}
      className="relative bg-background/10 rounded p-2 text-sm flex items-center gap-2 group"
    >
      {attachment.type === "image" ? (
        <ImageIcon className="h-4 w-4" />
      ) : (
        <Paperclip className="h-4 w-4" />
      )}
      <span>{attachment.name}</span>
      <Button
        variant="ghost"
        size="icon"
        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={handleDownload}
      >
        <Download className="h-3 w-3" />
      </Button>
    </div>
  );
};