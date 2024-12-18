import { Dispute, DisputeCategory } from "@/types";
import { Message, Attachment } from "./messages";

const STORAGE_PREFIX = "dispute";

export const disputesApi = {
  getDisputes: async (jobId: string): Promise<Dispute[]> => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}_${jobId}`);
    if (!stored) return [];
    return JSON.parse(stored).map((dispute: Dispute) => ({
      ...dispute,
      createdAt: new Date(dispute.createdAt),
    }));
  },

  createDispute: async (
    jobId: string,
    category: DisputeCategory,
    title: string
  ): Promise<Dispute> => {
    const disputes = await disputesApi.getDisputes(jobId);
    const newDispute: Dispute = {
      id: Date.now().toString(),
      jobId,
      category,
      title,
      status: "open",
      createdAt: new Date(),
    };

    localStorage.setItem(
      `${STORAGE_PREFIX}_${jobId}`,
      JSON.stringify([...disputes, newDispute])
    );
    return newDispute;
  },

  getDisputeMessages: async (disputeId: string): Promise<Message[]> => {
    const stored = localStorage.getItem(
      `${STORAGE_PREFIX}_messages_${disputeId}`
    );
    if (!stored) return [];
    return JSON.parse(stored).map((msg: Message) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  },

  addDisputeMessage: async (
    disputeId: string,
    content: string,
    sender: Message["sender"],
    attachments: Attachment[] = []
  ): Promise<Message> => {
    const messages = await disputesApi.getDisputeMessages(disputeId);
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      attachments,
    };

    localStorage.setItem(
      `${STORAGE_PREFIX}_messages_${disputeId}`,
      JSON.stringify([...messages, newMessage])
    );
    return newMessage;
  },
};
