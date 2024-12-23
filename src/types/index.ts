export interface Attachment {
  type: "image" | "file";
  url: string;
  name: string;
  preview?: string;
}

export type MessageSender = "talent" | "business" | "system" | "admin";

export interface Message {
  id: string;
  content: string;
  sender: MessageSender;
  timestamp: Date;
  attachments?: Attachment[];
  edited?: boolean;
  read?: boolean;
  replyTo?: {
    id: string;
    content: string;
    sender: MessageSender;
  };
}

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

export type IssueCategory =
  | "payment_delay"
  | "quality_issues"
  | "scope_changes"
  | "communication_problems"
  | "deadline_concerns"
  | "technical_issues"
  | "other";

export interface Issue {
  id: string;
  jobId: string;
  category: IssueCategory;
  title: string;
  status: "open" | "resolved";
  createdAt: Date;
}

export const ISSUE_CATEGORIES: Record<IssueCategory, string> = {
  payment_delay: "Payment Delay",
  quality_issues: "Quality Issues",
  scope_changes: "Scope Changes",
  communication_problems: "Communication Problems",
  deadline_concerns: "Deadline Concerns",
  technical_issues: "Technical Issues",
  other: "Other Issue",
};

export const MESSAGE_EDIT_WINDOW = 30 * 60 * 1000;
