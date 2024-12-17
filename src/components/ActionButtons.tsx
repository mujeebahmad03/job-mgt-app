import { Button } from "./ui/button";
import { Check, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
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
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="default"
            className="bg-emerald-400 hover:bg-emerald-500/90 transition-colors"
          >
            <Check className="mr-2 h-4 w-4" />
            Complete Job
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Complete this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The job will be marked as completed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete}>
              Complete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive">
            <X className="mr-2 h-4 w-4" />
            Reject Job
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject this job?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The job will be marked as rejected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleReject}>Reject</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
