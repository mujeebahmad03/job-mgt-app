import { Button } from "./ui/button";
import { Check, X } from "lucide-react";

import { Alert } from "./Alert";
import { useToast } from "@/hooks/use-toast";

interface ActionButtonsProps {
  status: string;
  onComplete: () => void;
  onReject: () => void;
}

export const ActionButtons = ({
  status,
  onComplete,
  onReject,
}: ActionButtonsProps) => {
  const { toast } = useToast();

  if (
    status.toLowerCase() === "completed" ||
    status.toLowerCase() === "rejected"
  ) {
    return null;
  }

  const handleComplete = () => {
    onComplete();
    toast({
      title: "Job Completed",
      description: "The job has been marked as completed.",
    });
  };

  const handleReject = () => {
    onReject();
    toast({
      title: "Job Rejected",
      description: "The job has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex gap-4">
      <Alert
        title="Complete this job?"
        description="This action cannot be undone. The job will be marked as completed."
        trigger={
          <Button
            variant="default"
            className="bg-emerald-500 hover:bg-emerald-500/90 transition-colors"
          >
            <Check className="mr-2 h-4 w-4" />
            Complete Job
          </Button>
        }
        onCompletion={handleComplete}
      />

      <Alert
        title="Reject this job?"
        description="This action cannot be undone. The job will be marked as rejected."
        trigger={
          <Button variant="destructive">
            <X className="mr-2 h-4 w-4" />
            Reject Job
          </Button>
        }
        onCompletion={handleReject}
      />
    </div>
  );
};
