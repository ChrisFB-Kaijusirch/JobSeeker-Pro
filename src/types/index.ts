interface JobApplication {
  id: string;
  job_title: string;
  company_name: string;
  location: string;
  status: string;
  employment_type: string;
  auto_applied: boolean;
  job_description?: string;
  job_url: string;
  salary_range?: string;
  is_bookmarked?: boolean;
  created_date: string;
}

interface Resume {
  id: string;
  file_url: string;
  is_active: boolean;
  // Add other properties
}

interface JobPreference {
  id: string;
  preferred_job_titles: string[];
  locations: string[];
  salary_min: string | null;
  salary_max: string | null;
  employment_types: string[];
  keywords_include: string[];
  keywords_exclude: string[];
  auto_apply_enabled: boolean;
  max_applications_per_day: number;
  email_alerts_enabled: boolean;
  alert_frequency: string;
}