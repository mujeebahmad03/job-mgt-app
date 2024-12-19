import { Issue, IssueCategory, MESSAGE_EDIT_WINDOW } from "@/types";
import { Message, Attachment } from "./messages";

const STORAGE_PREFIX = "issue";

export const issuesApi = {
  getIssues: async (jobId: string): Promise<Issue[]> => {
    const stored = localStorage.getItem(`${STORAGE_PREFIX}_${jobId}`);
    if (!stored) return [];
    return JSON.parse(stored).map((issue: Issue) => ({
      ...issue,
      createdAt: new Date(issue.createdAt),
    }));
  },

  createIssue: async (
    jobId: string,
    category: IssueCategory,
    title: string
  ): Promise<Issue> => {
    const issues = await issuesApi.getIssues(jobId);
    const newIssue: Issue = {
      id: Date.now().toString(),
      jobId,
      category,
      title,
      status: "open",
      createdAt: new Date(),
    };

    localStorage.setItem(
      `${STORAGE_PREFIX}_${jobId}`,
      JSON.stringify([...issues, newIssue])
    );
    return newIssue;
  },

  getIssueMessages: async (issueId: string): Promise<Message[]> => {
    const stored = localStorage.getItem(
      `${STORAGE_PREFIX}_messages_${issueId}`
    );
    if (!stored) return [];
    return JSON.parse(stored).map((msg: Message) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  },

  addIssueMessage: async (
    issueId: string,
    content: string,
    sender: Message["sender"],
    attachments: Attachment[] = []
  ): Promise<Message> => {
    const messages = await issuesApi.getIssueMessages(issueId);
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      sender,
      timestamp: new Date(),
      attachments,
    };

    localStorage.setItem(
      `${STORAGE_PREFIX}_messages_${issueId}`,
      JSON.stringify([...messages, newMessage])
    );
    return newMessage;
  },

  editIssueMessage: async (
    disputeId: string,
    messageId: string,
    content: string
  ): Promise<Message> => {
    const messages = await issuesApi.getIssueMessages(disputeId);
    const messageToEdit = messages.find((m) => m.id === messageId);

    if (!messageToEdit) {
      throw new Error("Message not found");
    }

    if (
      Date.now() - new Date(messageToEdit.timestamp).getTime() >
      MESSAGE_EDIT_WINDOW
    ) {
      throw new Error("Message can no longer be edited");
    }

    const updatedMessages = messages.map((msg) =>
      msg.id === messageId ? { ...msg, content } : msg
    );

    localStorage.setItem(
      `${STORAGE_PREFIX}_messages_${disputeId}`,
      JSON.stringify(updatedMessages)
    );

    return { ...messageToEdit, content };
  },
};
