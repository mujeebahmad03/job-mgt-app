import { useState } from "react";
import { AlertTriangle } from "lucide-react";

import { CreateIssue } from "./issues/CreateIssue";
import { IssueList } from "./issues/IssueList";
import { IssueMessageArea } from "./issues/IssueMessageArea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { useIsMobile } from "@/hooks/use-mobile";
import { useIssues, useIssueMessages } from "@/hooks/useIssues";
import { useToast } from "@/hooks/use-toast";
import { type Message, type Attachment } from "@/types";

export const IssueResolution = ({ jobId }: { jobId: string }) => {
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [showIssues, setShowIssues] = useState(true);

  const { toast } = useToast();
  const { issues } = useIssues(jobId);
  const { messages, addMessage, editMessage } = useIssueMessages(
    selectedIssueId || ""
  );
  const isMobile = useIsMobile();

  const handleIssueSelect = (issueId: string) => {
    setSelectedIssueId(issueId);
    if (isMobile) {
      setShowIssues(false);
    }
  };

  const handleSendMessage = (
    content: string,
    attachments: Attachment[],
    replyTo?: Message["replyTo"]
  ) => {
    addMessage(content, attachments, replyTo);
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
          <CreateIssue jobId={jobId} />
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
