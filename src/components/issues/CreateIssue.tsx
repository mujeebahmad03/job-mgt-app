import { Plus } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ISSUE_CATEGORIES, type IssueCategory } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useIssues } from "@/hooks/useIssues";

interface CreateIssueProps {
  jobId: string;
}

export const CreateIssue = ({ jobId }: CreateIssueProps) => {
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [title, setTitle] = useState("");

  const { toast } = useToast();
  const { createIssue } = useIssues(jobId);

  const handleCreateIssue = () => {
    if (!category || !title.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createIssue({ category, title: title.trim() });
    setIsCreatingIssue(false);
    setCategory("");
    setTitle("");

    toast({
      title: "Issue created",
      description: "Your issue has been created successfully.",
    });
  };

  return (
    <Dialog open={isCreatingIssue} onOpenChange={setIsCreatingIssue}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Issue
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Issue</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select
              value={category}
              onValueChange={(value) => setCategory(value as IssueCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(ISSUE_CATEGORIES).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter issue title"
            />
          </div>
          <Button onClick={handleCreateIssue} className="w-full">
            Create Issue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
