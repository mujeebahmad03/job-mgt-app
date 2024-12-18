import { Issue, IssueCategory } from "@/types";
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
};
