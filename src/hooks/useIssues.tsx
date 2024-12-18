import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { issuesApi } from "@/services/issues";
import { IssueCategory } from "@/types";
import { Attachment } from "./useMessages";

export const useIssues = (jobId: string) => {
  const queryClient = useQueryClient();

  const { data: issues = [], isLoading: isGettingIssues } = useQuery({
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
    isGettingIssues,
    issues,
    createIssue,
  };
};

export const useIssueMessages = (issueId: string) => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading: isFetchingIssueMessages } = useQuery({
    queryKey: ["issue-messages", issueId],
    queryFn: () => issuesApi.getIssueMessages(issueId),
  });

  const { mutate: addMessage } = useMutation({
    mutationFn: (data: { content: string; attachments: Attachment[] }) =>
      issuesApi.addIssueMessage(
        issueId,
        data.content,
        "user",
        data.attachments
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["issue-messages", issueId],
      });
    },
  });

  return {
    isFetchingIssueMessages,
    messages,
    addMessage: (content: string, attachments: Attachment[] = []) => {
      addMessage({ content, attachments });
    },
  };
};
