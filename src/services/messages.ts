import { type Message, type Attachment } from "@/types";

const STORAGE_PREFIX = "messages";

export const messagesApi = {
  getMessages: async (storageKey: string): Promise<Message[]> => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}_${storageKey}`);
    if (!stored) return [];
    return JSON.parse(stored).map((msg: Message) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  },

  addMessage: async (
    storageKey: string,
    messageData: {
      content: string;
      attachments: Attachment[];
      sender: Message["sender"];
      replyTo?: Message["replyTo"];
    }
  ): Promise<Message> => {
    const messages = await messagesApi.getMessages(storageKey);
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    localStorage.setItem(
      `${STORAGE_PREFIX}_${storageKey}`,
      JSON.stringify([...messages, newMessage])
    );
    return newMessage;
  },

  markAsRead: async (storageKey: string, messageId: string): Promise<void> => {
    const messages = await messagesApi.getMessages(storageKey);
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, read: true } : msg
    );

    localStorage.setItem(
      `${STORAGE_PREFIX}_${storageKey}`,
      JSON.stringify(updatedMessages)
    );
  },

  editMessage: async (
    storageKey: string,
    messageId: string,
    content: string
  ): Promise<Message> => {
    const messages = await messagesApi.getMessages(storageKey);
    const messageToEdit = messages.find((msg) => msg.id === messageId);

    if (!messageToEdit) {
      throw new Error("Message not found");
    }

    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, content, edited: true } : msg
    );

    localStorage.setItem(
      `${STORAGE_PREFIX}_${storageKey}`,
      JSON.stringify(updatedMessages)
    );

    return { ...messageToEdit, content, edited: true };
  },

  deleteMessage: async (
    storageKey: string,
    messageId: string
  ): Promise<void> => {
    const messages = await messagesApi.getMessages(storageKey);
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);

    localStorage.setItem(
      `${STORAGE_PREFIX}_${storageKey}`,
      JSON.stringify(updatedMessages)
    );
  },

  addSystemMessage: async (
    storageKey: string,
    content: string
  ): Promise<Message> => {
    const message: Message = {
      id: Date.now().toString(),
      content,
      sender: "system",
      timestamp: new Date(),
    };

    const messages = await messagesApi.getMessages(storageKey);
    localStorage.setItem(
      `${STORAGE_PREFIX}_${storageKey}`,
      JSON.stringify([...messages, message])
    );
    return message;
  },
};
