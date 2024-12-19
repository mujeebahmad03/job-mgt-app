import { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { IssueList } from "./issues/IssueList";
import { IssueMessageArea } from "./issues/IssueMessageArea";
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
import { Input } from "./ui/input";

import { useToast } from "@/hooks/use-toast";
import { useIssues, useIssueMessages } from "@/hooks/useIssues";
import { ISSUE_CATEGORIES, IssueCategory } from "@/types";
import { type Attachment } from "@/services/messages";

export const IssueResolution = ({ jobId }: { jobId: string }) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [isCreatingIssue, setIsCreatingIssue] = useState(false);
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [title, setTitle] = useState("");
  const [showIssues, setShowIssues] = useState(true);

  const { toast } = useToast();
  const { issues, createIssue } = useIssues(jobId);
  const { messages, addMessage, editMessage } = useIssueMessages(
    selectedIssueId || ""
  );
  const isMobile = useIsMobile();

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

  const handleIssueSelect = (issueId: string) => {
    setSelectedIssueId(issueId);
    if (isMobile) {
      setShowIssues(false);
    }
  };

  const handleSendMessage = (content: string, attachments: Attachment[]) => {
    addMessage(content, attachments);
    toast({
      title: "Message sent",
      description: "Your message has been sent to the admin.",
    });
  };

  const handleEditMessage = (messageId: string, content: string) => {
    editMessage(messageId, content);
    toast({
      title: "Message updated",
      description: "Your message has been updated successfully.",
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Issue Resolution
          </CardTitle>
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
                    onValueChange={(value) =>
                      setCategory(value as IssueCategory)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ISSUE_CATEGORIES).map(
                        ([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
                          </SelectItem>
                        )
                      )}
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
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div
          className={`grid ${
            isMobile ? "grid-cols-1" : "grid-cols-12"
          } divide-y md:divide-y-0 md:divide-x`}
        >
          <div
            className={`${
              isMobile ? (showIssues ? "block" : "hidden") : "col-span-4"
            } p-4`}
          >
            <IssueList
              issues={issues}
              selectedIssueId={selectedIssueId}
              onSelect={handleIssueSelect}
            />
          </div>

          <div
            className={`${
              isMobile ? (!showIssues ? "block" : "hidden") : "col-span-8"
            }`}
          >
            {selectedIssueId ? (
              <IssueMessageArea
                messages={messages}
                onSendMessage={handleSendMessage}
                onEditMessage={handleEditMessage}
                onBack={() => setShowIssues(true)}
                showBackButton={isMobile}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a issue to view messages
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
