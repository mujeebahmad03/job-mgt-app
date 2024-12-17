import { useState } from "react";
import { JobCard } from "@/components/JobCard";
import { ActionButtons } from "@/components/ActionButtons";
import { Chat } from "@/components/Chat";
import { Job } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, AlertTriangle } from "lucide-react";
import { DisputeResolution } from "@/components/DisputeResolution";

const Index = () => {
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

  const handleComplete = () => {
    console.log("Job completed");
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

        <Tabs defaultValue="chat" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat with Client
            </TabsTrigger>
            <TabsTrigger value="dispute" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Dispute Resolution
            </TabsTrigger>
          </TabsList>
          <TabsContent value="chat" className="mt-6">
            <Chat />
          </TabsContent>
          <TabsContent value="dispute" className="mt-6">
            <DisputeResolution />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
