export interface Job {
  id: string;
  title: string;
  department: string;
  qualification: string;
  location: string; // State
  lastDate: string; // ISO Date string
  applyLink: string;
  notificationLink: string;
  description: string;
  category: JobCategory;
  postedDate: string; // ISO Date string
}

export enum JobCategory {
  BANK = 'Bank',
  RAILWAY = 'Railway',
  POLICE = 'Police',
  SSC = 'SSC',
  UPSC = 'UPSC',
  STATE_GOVT = 'State Govt',
  OTHER = 'Other'
}

export interface FilterState {
  search: string;
  qualification: string;
  location: string;
  category: string;
}

export type ViewMode = 'public' | 'admin';
