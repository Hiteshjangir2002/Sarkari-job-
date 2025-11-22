import React, { useState, useEffect, useMemo } from 'react';
import { Job, JobCategory, FilterState } from '../types';
import { getJobs } from '../services/jobService';
import { JobCard } from './JobCard';
import { Search, Filter, Bell, Menu, X, Briefcase } from 'lucide-react';
import { LOCATIONS, QUALIFICATIONS } from '../constants';

export const PublicPortal: React.FC<{ onLoginClick: () => void }> = ({ onLoginClick }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    qualification: '',
    location: '',
    category: ''
  });

  useEffect(() => {
    setJobs(getJobs());
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchSearch = job.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                          job.department.toLowerCase().includes(filters.search.toLowerCase());
      const matchQual = filters.qualification ? job.qualification === filters.qualification : true;
      const matchLoc = filters.location ? job.location === filters.location : true;
      const matchCat = filters.category ? job.category === filters.category : true;
      return matchSearch && matchQual && matchLoc && matchCat;
    });
  }, [jobs, filters]);

  // Quick stats for marquee
  const latestJobTitles = jobs.slice(0, 5).map(j => `${j.title} @ ${j.department}`).join('  ✦  ');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <header className="bg-gradient-to-r from-red-800 to-red-900 text-white sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setFilters({ search: '', qualification: '', location: '', category: '' })}>
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                <Briefcase className="text-red-800 w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight">Sarkari<span className="text-yellow-400">Job</span></h1>
                <p className="text-[10px] text-gray-300 tracking-widest uppercase">Public Employment Portal</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium hover:text-yellow-400 transition-colors">Home</a>
              <a href="#latest-jobs" className="text-sm font-medium hover:text-yellow-400 transition-colors">Latest Jobs</a>
              <a href="#admit-card" className="text-sm font-medium hover:text-yellow-400 transition-colors">Admit Card</a>
              <a href="#results" className="text-sm font-medium hover:text-yellow-400 transition-colors">Results</a>
              <button onClick={onLoginClick} className="text-xs bg-black/30 hover:bg-black/50 px-3 py-1.5 rounded border border-white/20 transition-colors">
                Admin Login
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-red-900 text-white p-4 space-y-3 shadow-xl">
          <a href="#" className="block hover:text-yellow-400">Home</a>
          <a href="#latest-jobs" className="block hover:text-yellow-400">Latest Jobs</a>
          <a href="#admit-card" className="block hover:text-yellow-400">Admit Card</a>
          <a href="#results" className="block hover:text-yellow-400">Results</a>
          <button onClick={onLoginClick} className="block w-full text-left text-sm text-gray-300 pt-2 border-t border-white/10">Admin Login</button>
        </div>
      )}

      {/* Marquee */}
      <div className="bg-black text-white py-2 overflow-hidden whitespace-nowrap relative">
         <div className="animate-marquee inline-block px-4 text-sm font-mono text-yellow-400">
           <span className="mr-4">LATEST UPDATES:</span> 
           {latestJobTitles}
         </div>
      </div>
      <style>{`
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100vw); }
          100% { transform: translateX(-100%); }
        }
      `}</style>

      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Dream <span className="text-red-700">Sarkari Job</span> in 2025
          </h2>
          <p className="text-gray-500 mb-8 max-w-2xl mx-auto">
            The most trusted portal for Government Jobs, Bank Jobs, Railway Recruitment, and SSC Notifications. Updated daily.
          </p>
          
          {/* Main Search Bar */}
          <div className="max-w-3xl mx-auto relative">
            <input
              type="text"
              placeholder="Search by Job Title, Department, or Keyword..."
              className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-gray-200 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all text-lg shadow-sm outline-none"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Filters */}
          <aside className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900 flex items-center">
                  <Filter className="w-4 h-4 mr-2" /> Filters
                </h3>
                <button 
                  onClick={() => setFilters({ search: '', qualification: '', location: '', category: '' })}
                  className="text-xs text-red-600 hover:underline"
                >
                  Reset
                </button>
              </div>

              {/* Category Filter */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Category</label>
                <select 
                  className="w-full p-2 border rounded-lg text-sm focus:border-red-500 outline-none bg-gray-50"
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {Object.values(JobCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Qualification Filter */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Qualification</label>
                <select 
                  className="w-full p-2 border rounded-lg text-sm focus:border-red-500 outline-none bg-gray-50"
                  value={filters.qualification}
                  onChange={(e) => setFilters({ ...filters, qualification: e.target.value })}
                >
                  <option value="">Any Qualification</option>
                  {QUALIFICATIONS.map(q => (
                    <option key={q} value={q}>{q}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">State / Location</label>
                <select 
                  className="w-full p-2 border rounded-lg text-sm focus:border-red-500 outline-none bg-gray-50"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                >
                  <option value="">All Locations</option>
                  {LOCATIONS.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Links Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hidden lg:block">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                <Bell className="w-4 h-4 mr-2 text-yellow-500" /> Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-blue-600 hover:underline block py-1 border-b border-gray-50">Download Admit Cards</a></li>
                <li><a href="#" className="text-blue-600 hover:underline block py-1 border-b border-gray-50">Latest Results</a></li>
                <li><a href="#" className="text-blue-600 hover:underline block py-1 border-b border-gray-50">Answer Keys</a></li>
                <li><a href="#" className="text-blue-600 hover:underline block py-1">Syllabus</a></li>
              </ul>
            </div>
          </aside>

          {/* Job Listings */}
          <main className="lg:col-span-9" id="latest-jobs">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Latest Jobs <span className="text-gray-400 text-lg font-normal">({filteredJobs.length})</span>
              </h2>
              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                 {/* Simple category pills for quick filtering */}
                 {['Bank', 'Railway', 'SSC', 'Police'].map(cat => (
                   <button 
                    key={cat}
                    onClick={() => setFilters({...filters, category: cat})}
                    className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${filters.category === cat ? 'bg-red-600 text-white shadow-lg shadow-red-200' : 'bg-white border hover:border-red-300'}`}
                   >
                     {cat}
                   </button>
                 ))}
              </div>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                <button 
                  onClick={() => setFilters({ search: '', qualification: '', location: '', category: '' })}
                  className="mt-4 text-red-600 font-medium hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredJobs.map(job => (
                  <JobCard key={job.id} job={job} />
                ))}
              </div>
            )}

            {/* Info Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
              <div className="bg-white p-6 rounded-xl border-l-4 border-blue-500 shadow-sm" id="results">
                 <h3 className="font-bold text-xl mb-4 text-gray-800">Latest Results</h3>
                 <ul className="space-y-3">
                   {[1,2,3].map(i => (
                     <li key={i} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer flex justify-between border-b border-gray-100 pb-2">
                       <span>SSC CGL 2024 Final Result Declared</span>
                       <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">New</span>
                     </li>
                   ))}
                 </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border-l-4 border-green-500 shadow-sm" id="admit-card">
                 <h3 className="font-bold text-xl mb-4 text-gray-800">Admit Cards</h3>
                 <ul className="space-y-3">
                   {[1,2,3].map(i => (
                     <li key={i} className="text-sm text-gray-600 hover:text-green-600 cursor-pointer flex justify-between border-b border-gray-100 pb-2">
                       <span>IBPS PO Mains Admit Card 2025</span>
                       <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">Active</span>
                     </li>
                   ))}
                 </ul>
              </div>
            </div>
          </main>

        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-auto">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div>
                <h4 className="text-white font-bold mb-4">About SarkariJob</h4>
                <p className="text-sm leading-relaxed">Your number one source for all government jobs. We're dedicated to giving you the very best of job notifications with a focus on dependability and daily updates.</p>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Home</a></li>
                  <li><a href="#" className="hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-white">Disclaimer</a></li>
                </ul>
              </div>
              <div>
                 <h4 className="text-white font-bold mb-4">Job Categories</h4>
                 <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white">Bank Jobs</a></li>
                  <li><a href="#" className="hover:text-white">Railway Jobs</a></li>
                  <li><a href="#" className="hover:text-white">Police Jobs</a></li>
                  <li><a href="#" className="hover:text-white">Defence Jobs</a></li>
                 </ul>
              </div>
              <div>
                <h4 className="text-white font-bold mb-4">Connect</h4>
                <p className="text-sm mb-4">Get updates on social media</p>
                <div className="flex space-x-4">
                   <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors cursor-pointer">F</div>
                   <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors cursor-pointer">T</div>
                   <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors cursor-pointer">Y</div>
                </div>
              </div>
           </div>
           <div className="border-t border-gray-800 pt-8 text-center text-sm">
             <p>© 2025 SarkariJob Portal. All rights reserved.</p>
           </div>
        </div>
      </footer>
    </div>
  );
};
