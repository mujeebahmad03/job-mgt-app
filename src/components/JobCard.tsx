import { ExternalLink } from "lucide-react";

import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Job } from "@/types";

interface JobCardProps {
  job: Job;
}

export const JobCard = ({ job }: JobCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "pending";
      case "completed":
        return "completed";
      case "rejected":
        return "rejected";
      default:
        return "pending";
    }
  };

  return (
    <Card className="glass-card w-full transition-all duration-300 hover:shadow-xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <Badge variant="outline" className="mb-2">
            {job.job_type}
          </Badge>
          <h3 className="text-2xl font-semibold">{job.project_name}</h3>
          <p className="text-sm text-muted-foreground">{job.business_name}</p>
        </div>
        <Badge className={`status-badge ${getStatusColor(job.project_status)}`}>
          {job.project_status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-muted-foreground">
            Description
          </h4>
          <p className="mt-1">{job.project_description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Duration
            </h4>
            <p className="mt-1">{job.project_duration || "Not specified"}</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-muted-foreground">
              Amount
            </h4>
            <p className="mt-1">{job.amount || "Not specified"}</p>
          </div>
        </div>
        {job.project_link && (
          <div className="flex items-center gap-2">
            <ExternalLink className="h-4 w-4" />
            <a
              href={job.project_link.project_preview_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline"
            >
              View Project Preview
            </a>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
