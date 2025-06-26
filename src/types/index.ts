// TypeScript type definitions for JobSeeker Pro

export interface JobApplication {
  id: string;
  job_title: string;
  company: string;
  job_url: string;
  location: string;
  employment_type: string;
  job_description: string;
  salary_range?: string;
  status: 'pending' | 'applied' | 'interview' | 'offer' | 'rejected' | 'accepted';
  created_date: string;
  updated_date: string;
  is_bookmarked: boolean;
  source: string;
  auto_applied?: boolean;
  match_score?: number;
}

export interface Resume {
  id: string;
  file_name: string;
  file_path: string;
  parsed_content: string;
  skills: string[];
  experience: string[];
  education: string[];
  is_active: boolean;
  created_date: string;
  updated_date: string;
}

export interface JobPreferences {
  id: string;
  preferred_job_titles: string[];
  locations: string[];
  salary_min: number | null;
  salary_max: number | null;
  employment_types: string[];
  keywords_include: string[];
  keywords_exclude: string[];
  auto_apply_enabled: boolean;
  max_applications_per_day: number;
  email_alerts_enabled: boolean;
  alert_frequency: 'daily' | 'weekly';
  created_date: string;
  updated_date: string;
}

export interface FilterOptions {
  status: string;
  employment_type: string;
  auto_applied: string;
  date_range: string;
  remote_only: string;
  salary_min: string;
  salary_max: string;
  location_filter: string;
  bookmarked: string;
}

export interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  trend: string | null;
  color?: string;
  onClick: () => void;
  clickable?: boolean;
}

export interface PreferenceSectionProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  children: React.ReactNode;
}
