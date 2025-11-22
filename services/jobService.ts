import { Job } from '../types';
import { INITIAL_JOBS } from '../constants';

const STORAGE_KEY = 'sarkari_jobs_data_v1';

export const getJobs = (): Job[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Seed initial data
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_JOBS));
      return INITIAL_JOBS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error reading jobs from storage", error);
    return [];
  }
};

export const saveJob = (job: Job): void => {
  const jobs = getJobs();
  const existingIndex = jobs.findIndex(j => j.id === job.id);
  
  if (existingIndex >= 0) {
    jobs[existingIndex] = job;
  } else {
    jobs.unshift(job);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
};

export const deleteJob = (id: string): void => {
  const jobs = getJobs();
  const filtered = jobs.filter(j => j.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
