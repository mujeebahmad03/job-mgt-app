import { X } from "lucide-react";

import { Button } from "../ui/button";
import { Attachment } from "@/types";

interface AttachmentPreviewProps {
  attachments: Attachment[];
  removeAttachment: (index: number) => void;
}

export const AttachmentPreview = ({
  attachments,
  removeAttachment,
}: AttachmentPreviewProps) => {
  return (
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
              <span className="text-sm">{file.name}</span>
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
  );
};
