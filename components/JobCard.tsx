import React from 'react';
import { Job } from '../types';
import { Calendar, MapPin, GraduationCap, Building2, ArrowRight } from 'lucide-react';

interface JobCardProps {
  job: Job;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const today = new Date();
  const lastDate = new Date(job.lastDate);
  const isExpired = lastDate < today;

  // Format date nicely
  const formattedDate = new Date(job.lastDate).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div 
      className={`
        relative group overflow-hidden rounded-xl border transition-all duration-300 hover:shadow-xl
        ${isExpired ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200 hover:border-red-500/50'}
      `}
    >
      {/* Glass effect overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="p-5 flex flex-col h-full">
        <div className="flex justify-between items-start mb-3">
          <span className={`
            px-2 py-1 text-xs font-bold rounded uppercase tracking-wide
            ${isExpired ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'}
          `}>
            {job.category}
          </span>
          {isExpired && (
            <span className="px-2 py-1 text-xs font-bold rounded bg-red-600 text-white animate-pulse">
              EXPIRED
            </span>
          )}
        </div>

        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-sarkari-red transition-colors">
          {job.title}
        </h3>
        
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <Building2 className="w-4 h-4 mr-1" />
          <span className="font-medium">{job.department}</span>
        </div>

        <div className="space-y-2 text-sm text-gray-600 mb-6 flex-grow">
          <div className="flex items-center">
            <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
            <span>{job.qualification}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <span>{job.location}</span>
          </div>
          <div className={`flex items-center ${isExpired ? 'text-red-600 font-bold' : ''}`}>
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            <span>Last Date: {formattedDate}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <a 
            href={job.applyLink} 
            onClick={(e) => isExpired && e.preventDefault()}
            className={`
              flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold transition-colors
              ${isExpired 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-sarkari-red text-white hover:bg-red-700 shadow-md shadow-red-200'}
            `}
          >
            Apply Now
          </a>
          <button className="flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold border border-gray-300 text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
            View Details <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
