import React, { useRef, useState } from "react";
import { Attachment, Message } from "./useMessages";
import { useToast } from "./use-toast";
import { MESSAGE_EDIT_WINDOW } from "@/types";

export const useHandleMessageActions = (
  attachments: Attachment[],
  messages: Message[],
  onSendMessage: (
    content: string,
    attachments: Attachment[],
    replyTo?: Message["replyTo"]
  ) => void,
  setAttachments: React.Dispatch<React.SetStateAction<Attachment[]>>,
  isIssue?: boolean,
  onEditMessage?: (messageId: string, content: string) => void
) => {
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);

  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && attachments.length === 0) return;

    if (editingMessageId && onEditMessage) {
      onEditMessage(editingMessageId, message);
      setEditingMessageId(null);
      setMessage("");
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

      onSendMessage(message, attachments, replyToData);
      setMessage("");
      setAttachments([]);
      setReplyingTo(null);
    }
  };

  const canEditMessage = (timestamp: Date) => {
    return Date.now() - new Date(timestamp).getTime() <= MESSAGE_EDIT_WINDOW;
  };

  const handleEdit = (messageId: string, content: string) => {
    const messageToEdit = messages.find((m) => m.id === messageId);
    if (!messageToEdit) return;

    if (isIssue && !canEditMessage(messageToEdit.timestamp)) {
      toast({
        title: "Cannot edit message",
        description: "Messages can only be edited within 30 minutes of sending",
        variant: "destructive",
      });
      return;
    }

    setEditingMessageId(messageId);
    setMessage(content);
  };

  const handleReply = (message: Message) => {
    setReplyingTo(message);
    setEditingMessageId(null);
  };

  const scrollToMessage = (messageId: string) => {
    const messageElement = document.getElementById(`message-${messageId}`);
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
      messageElement.classList.add("bg-secondary/30");
      setTimeout(() => {
        messageElement.classList.remove("bg-secondary/30");
      }, 2000);
    }
  };

  return {
    message,
    messageListRef,
    replyingTo,
    handleEdit,
    handleSubmit,
    handleReply,
    scrollToMessage,
    setReplyingTo,
    editingMessageId,
    setMessage,
  };
};
