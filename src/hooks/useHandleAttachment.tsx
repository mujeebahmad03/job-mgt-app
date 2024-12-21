import { useState } from "react";
import { Attachment } from "./useMessages";
import { useToast } from "@/hooks/use-toast";

export const useHandleAttachment = () => {
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const handleAttachment = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file size (max 5MB per file)
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const invalidFiles = files.filter((file) => file.size > MAX_FILE_SIZE);

    if (invalidFiles.length > 0) {
      toast({
        title: "Error",
        description: "Some files exceed the maximum size of 5MB",
        variant: "destructive",
      });
      return;
    }

    // Simulate upload progress
    setUploadProgress(0);
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    try {
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

      toast({
        title: "Success",
        description: "Files uploaded successfully",
      });
    } catch (error) {
      console.log(JSON.stringify(error, null, 2));
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive",
      });
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => {
      const newAttachments = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index].url);
      return newAttachments;
    });
  };

  return {
    attachments,
    handleAttachment,
    removeAttachment,
    setAttachments,
    uploadProgress,
  };
};
