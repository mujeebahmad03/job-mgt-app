export interface Attachment {
  type: "file" | "image";
  url: string;
  name: string;
  preview?: string;
}

export interface Message {
  id: string;
  content: string;
  sender: "user" | "client" | "admin";
  timestamp: Date;
  attachments?: Attachment[];
}

// Simulated API functions that currently use localStorage
export const messagesApi = {
  getMessages: async (storageKey: string): Promise<Message[]> => {
    const stored = localStorage.getItem(storageKey);
    if (!stored) return [];
    return JSON.parse(stored).map((msg: Message) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  },

  addMessage: async (
    storageKey: string,
    message: Omit<Message, "id" | "timestamp">
  ): Promise<Message> => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };

    const currentMessages = await messagesApi.getMessages(storageKey);
    const updatedMessages = [...currentMessages, newMessage];
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));

    return newMessage;
  },

  editMessage: async (
    storageKey: string,
    messageId: string,
    content: string
  ): Promise<Message> => {
    const messages = await messagesApi.getMessages(storageKey);
    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, content } : msg
    );
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
    return updatedMessages.find((msg) => msg.id === messageId)!;
  },

  deleteMessage: async (
    storageKey: string,
    messageId: string
  ): Promise<void> => {
    const messages = await messagesApi.getMessages(storageKey);
    const updatedMessages = messages.filter((msg) => msg.id !== messageId);
    localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
  },
};
