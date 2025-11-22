import { Job, JobCategory } from './types';

export const INITIAL_JOBS: Job[] = [
  {
    id: '1',
    title: 'Probationary Officer (PO)',
    department: 'State Bank of India',
    qualification: 'Graduate',
    location: 'All India',
    lastDate: '2025-12-31',
    applyLink: '#',
    notificationLink: '#',
    description: 'Recruitment of Probationary Officers in State Bank of India.',
    category: JobCategory.BANK,
    postedDate: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Assistant Loco Pilot',
    department: 'Indian Railways',
    qualification: '10th + ITI',
    location: 'All India',
    lastDate: '2025-10-15',
    applyLink: '#',
    notificationLink: '#',
    description: 'RRB ALP Recruitment 2025 for various zones.',
    category: JobCategory.RAILWAY,
    postedDate: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Sub Inspector',
    department: 'UP Police',
    qualification: 'Graduate',
    location: 'Uttar Pradesh',
    lastDate: '2024-01-01', // Expired example
    applyLink: '#',
    notificationLink: '#',
    description: 'Uttar Pradesh Police Recruitment and Promotion Board.',
    category: JobCategory.POLICE,
    postedDate: '2023-12-01T10:00:00.000Z'
  },
  {
    id: '4',
    title: 'Civil Services Exam',
    department: 'UPSC',
    qualification: 'Graduate',
    location: 'All India',
    lastDate: '2025-03-20',
    applyLink: '#',
    notificationLink: '#',
    description: 'Union Public Service Commission CSE 2025.',
    category: JobCategory.UPSC,
    postedDate: new Date().toISOString()
  }
];

export const LOCATIONS = [
  'All India', 'Uttar Pradesh', 'Bihar', 'Delhi', 'Maharashtra', 'Rajasthan', 'Madhya Pradesh'
];

export const QUALIFICATIONS = [
  '10th', '12th', 'Graduate', 'Post Graduate', 'ITI', 'Diploma', 'B.Tech', 'PhD'
];
