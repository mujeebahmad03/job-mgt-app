import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { disputesApi } from "@/services/disputes";
import { DisputeCategory } from "@/types";
import { Attachment } from "./useMessages";

export const useDisputes = (jobId: string) => {
  const queryClient = useQueryClient();

  const { data: disputes = [], isLoading: isGettingDisputes } = useQuery({
    queryKey: ["disputes", jobId],
    queryFn: () => disputesApi.getDisputes(jobId),
  });

  const { mutate: createDispute } = useMutation({
    mutationFn: ({
      category,
      title,
    }: {
      category: DisputeCategory;
      title: string;
    }) => disputesApi.createDispute(jobId, category, title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disputes", jobId] });
    },
  });

  return {
    isGettingDisputes,
    disputes,
    createDispute,
  };
};

export const useDisputeMessages = (disputeId: string) => {
  const queryClient = useQueryClient();

  const { data: messages = [], isLoading: isFetchingDisputeMessages } =
    useQuery({
      queryKey: ["dispute-messages", disputeId],
      queryFn: () => disputesApi.getDisputeMessages(disputeId),
    });

  const { mutate: addMessage } = useMutation({
    mutationFn: (data: { content: string; attachments: Attachment[] }) =>
      disputesApi.addDisputeMessage(
        disputeId,
        data.content,
        "user",
        data.attachments
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dispute-messages", disputeId],
      });
    },
  });

  return {
    isFetchingDisputeMessages,
    messages,
    addMessage: (content: string, attachments: Attachment[] = []) => {
      addMessage({ content, attachments });
    },
  };
};
