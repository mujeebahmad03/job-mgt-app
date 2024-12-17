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
