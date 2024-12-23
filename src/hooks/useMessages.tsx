import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { messagesApi } from "@/services/messages";
import { type Message, type Attachment } from "@/types";

interface UseMessagesProps {
  storageKey: string;
}

export const useMessages = ({ storageKey }: UseMessagesProps) => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", storageKey],
    queryFn: () => messagesApi.getMessages(storageKey),
  });

  const { mutate: addMessage } = useMutation({
    mutationFn: (messageData: {
      content: string;
      attachments: Attachment[];
      replyTo?: Message["replyTo"];
    }) =>
      messagesApi.addMessage(storageKey, {
        content: messageData.content,
        attachments: messageData.attachments,
        sender: "talent",
        replyTo: messageData.replyTo,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", storageKey] });
    },
  });

  const { mutate: markAsRead } = useMutation({
    mutationFn: (messageId: string) =>
      messagesApi.markAsRead(storageKey, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", storageKey] });
    },
  });

  const { mutate: addSystemMessage } = useMutation({
    mutationFn: (content: string) =>
      messagesApi.addSystemMessage(storageKey, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", storageKey] });
    },
  });

  const { mutate: editMessage } = useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: string;
      content: string;
    }) => messagesApi.editMessage(storageKey, messageId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", storageKey] });
    },
  });

  const { mutate: deleteMessage } = useMutation({
    mutationFn: (messageId: string) =>
      messagesApi.deleteMessage(storageKey, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", storageKey] });
    },
  });

  return {
    messages,
    isLoading,
    addMessage: (
      content: string,
      attachments: Attachment[] = [],
      replyTo?: Message["replyTo"]
    ) => {
      addMessage({ content, attachments, replyTo });
    },
    markAsRead,
    addSystemMessage,
    editMessage,
    deleteMessage,
  };
};

export type { Message, Attachment };
