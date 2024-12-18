import { useState } from "react";
import { AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "./ui/button";
import { DisputeList } from "./disputes/DisputeList";
import { DisputeMessageArea } from "./disputes/DisputeMessageArea";
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
import { useDisputes, useDisputeMessages } from "@/hooks/useDispute";
import { DISPUTE_CATEGORIES, DisputeCategory } from "@/types";
import { type Attachment } from "@/services/messages";

export const DisputeResolution = ({ jobId }: { jobId: string }) => {
  const [selectedDisputeId, setSelectedDisputeId] = useState<string | null>(
    null
  );
  const [isCreatingDispute, setIsCreatingDispute] = useState(false);
  const [category, setCategory] = useState<DisputeCategory | "">("");
  const [title, setTitle] = useState("");
  const [showDisputes, setShowDisputes] = useState(true);

  const { toast } = useToast();
  const { disputes, createDispute } = useDisputes(jobId);
  const { messages, addMessage } = useDisputeMessages(selectedDisputeId || "");
  const isMobile = useIsMobile();

  const handleCreateDispute = () => {
    if (!category || !title.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    createDispute({ category, title: title.trim() });
    setIsCreatingDispute(false);
    setCategory("");
    setTitle("");

    toast({
      title: "Dispute created",
      description: "Your dispute has been created successfully.",
    });
  };

  const handleDisputeSelect = (disputeId: string) => {
    setSelectedDisputeId(disputeId);
    if (isMobile) {
      setShowDisputes(false);
    }
  };

  const handleSendMessage = (content: string, attachments: Attachment[]) => {
    addMessage(content, attachments);
    toast({
      title: "Message sent",
      description: "Your message has been sent to the admin.",
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Dispute Resolution
          </CardTitle>
          <Dialog open={isCreatingDispute} onOpenChange={setIsCreatingDispute}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                New Dispute
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Dispute</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select
                    value={category}
                    onValueChange={(value) =>
                      setCategory(value as DisputeCategory)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(DISPUTE_CATEGORIES).map(
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
                    placeholder="Enter dispute title"
                  />
                </div>
                <Button onClick={handleCreateDispute} className="w-full">
                  Create Dispute
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
              isMobile ? (showDisputes ? "block" : "hidden") : "col-span-4"
            } p-4`}
          >
            <DisputeList
              disputes={disputes}
              selectedDisputeId={selectedDisputeId}
              onSelect={handleDisputeSelect}
            />
          </div>

          <div
            className={`${
              isMobile ? (!showDisputes ? "block" : "hidden") : "col-span-8"
            }`}
          >
            {selectedDisputeId ? (
              <DisputeMessageArea
                messages={messages}
                onSendMessage={handleSendMessage}
                onBack={() => setShowDisputes(true)}
                showBackButton={isMobile}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a dispute to view messages
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
