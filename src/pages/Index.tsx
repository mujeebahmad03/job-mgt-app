import { useState } from "react";
import { JobCard } from "@/components/JobCard";
import { ActionButtons } from "@/components/ActionButtons";
import { Chat } from "@/components/Chat";
import { Job } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  AlertTriangle,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { IssueResolution } from "@/components/IssueResolution";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useMessages } from "@/hooks/useMessages";

const Index = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [job] = useState<Job>({
    do_shop_id: "123",
    business_name: "Tech Solutions Inc.",
    business_email: "contact@techsolutions.com",
    project_name: "Website Redesign",
    project_description:
      "Complete redesign of company website with modern UI/UX principles",
    project_duration: "3 months",
    project_type: "Web Development",
    job_type: "Fixed Price",
    project_status: "pending",
    amount: "$5,000",
    project_link: {
      project_preview_link: "https://preview.example.com",
      query_preview_link: "https://query.example.com",
    },
  });

  const { addSystemMessage } = useMessages({ storageKey: "chat-messages" });

  const handleComplete = () => {
    addSystemMessage(
      "🎉 Project has been completed and verified by the client! Thank you for your work."
    );
  };

  const handleReject = () => {
    console.log("Job rejected");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-4">
          <JobCard job={job} />
          <div className="flex justify-end">
            <ActionButtons
              status={job.project_status}
              onComplete={handleComplete}
              onReject={handleReject}
            />
          </div>
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
          <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-card hover:bg-accent rounded-lg transition-colors cursor-pointer group">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="font-medium">Messages & Issues</span>
            </div>
            {isOpen ? (
              <ChevronUp className="h-5 w-5 transition-transform duration-200" />
            ) : (
              <ChevronDown className="h-5 w-5 transition-transform duration-200" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="animate-accordion-down mt-2">
            <Tabs defaultValue="chat" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Messages
                </TabsTrigger>
                <TabsTrigger value="issue" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Issue Resolution
                </TabsTrigger>
              </TabsList>
              <TabsContent value="chat" className="mt-6">
                <Chat />
              </TabsContent>
              <TabsContent value="issue" className="mt-6">
                <IssueResolution jobId={job.do_shop_id} />
              </TabsContent>
            </Tabs>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
};

export default Index;
