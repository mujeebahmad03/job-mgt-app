import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { issuesApi } from "@/services/issues";
import { type IssueCategory, type Message, type Attachment } from "@/types";

export const useIssues = (jobId: string) => {
  const queryClient = useQueryClient();

  const { data: issues = [] } = useQuery({
    queryKey: ["issues", jobId],
    queryFn: () => issuesApi.getIssues(jobId),
  });

  const { mutate: createIssue } = useMutation({
    mutationFn: ({
      category,
      title,
    }: {
      category: IssueCategory;
      title: string;
    }) => issuesApi.createIssue(jobId, category, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["issues", jobId] });
    },
  });

  return {
    issues,
    createIssue,
  };
};

export const useIssueMessages = (issueId: string) => {
  const queryClient = useQueryClient();

  const { data: messages = [] } = useQuery({
    queryKey: ["issue-messages", issueId],
    queryFn: () => issuesApi.getIssueMessages(issueId),
  });

  const { mutate: addMessage } = useMutation({
    mutationFn: (data: {
      content: string;
      attachments: Attachment[];
      replyTo?: Message["replyTo"];
    }) =>
      issuesApi.addIssueMessage(
        issueId,
        data.content,
        "talent",
        data.attachments,
        data.replyTo
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue-messages", issueId],
      });
    },
  });

  const { mutate: editMessage } = useMutation({
    mutationFn: (data: { messageId: string; content: string }) =>
      issuesApi.editIssueMessage(issueId, data.messageId, data.content),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue-messages", issueId],
      });
    },
  });

  const { mutate: deleteMessage } = useMutation({
    mutationFn: (messageId: string) =>
      issuesApi.deleteIssueMessage(issueId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue-messages", issueId],
      });
    },
  });

  return {
    messages,
    addMessage: (
      content: string,
      attachments: Attachment[] = [],
      replyTo?: Message["replyTo"]
    ) => {
      addMessage({ content, attachments, replyTo });
    },
    editMessage: (messageId: string, content: string) => {
      editMessage({ messageId, content });
    },
    deleteMessage,
  };
};
