export interface Job {
  do_shop_id: string;
  business_name: string;
  business_email: string;
  project_name: string;
  project_description: string;
  project_duration: string | null;
  project_type: string;
  job_type: string;
  project_status: string;
  amount?: string;
  project_link?: {
    project_preview_link: string;
    query_preview_link: string;
  };
}

export type DisputeCategory =
  | "payment_delay"
  | "quality_issues"
  | "scope_changes"
  | "communication_problems"
  | "deadline_concerns"
  | "technical_issues"
  | "other";

export interface Dispute {
  id: string;
  jobId: string;
  category: DisputeCategory;
  title: string;
  status: "open" | "resolved";
  createdAt: Date;
}

export const DISPUTE_CATEGORIES: Record<DisputeCategory, string> = {
  payment_delay: "Payment Delay",
  quality_issues: "Quality Issues",
  scope_changes: "Scope Changes",
  communication_problems: "Communication Problems",
  deadline_concerns: "Deadline Concerns",
  technical_issues: "Technical Issues",
  other: "Other Issue",
};
