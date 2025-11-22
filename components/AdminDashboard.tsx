import React, { useState, useEffect } from 'react';
import { Job, JobCategory } from '../types';
import { getJobs, saveJob, deleteJob, generateId } from '../services/jobService';
import { LOCATIONS, QUALIFICATIONS } from '../constants';
import { Plus, Trash2, Edit2, X, LayoutDashboard, Briefcase, ChevronLeft, Save, BarChart2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AdminDashboardProps {
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [formData, setFormData] = useState<Partial<Job>>({});
  
  // Stats
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedJobs = getJobs();
    setJobs(loadedJobs);
    
    // Calc Stats
    const todayStr = new Date().toDateString();
    const todayCount = loadedJobs.filter(j => new Date(j.postedDate).toDateString() === todayStr).length;
    setStats({ total: loadedJobs.length, today: todayCount });

    // Calc Chart Data (Jobs per Dept)
    const deptCounts: Record<string, number> = {};
    loadedJobs.forEach(j => {
      deptCounts[j.category] = (deptCounts[j.category] || 0) + 1;
    });
    const data = Object.keys(deptCounts).map(key => ({ name: key, value: deptCounts[key] }));
    setChartData(data);
  };

  const handleAddNew = () => {
    setEditingJob(null);
    setFormData({
      title: '', department: '', qualification: '', location: '', 
      lastDate: '', applyLink: '', notificationLink: '', 
      description: '', category: JobCategory.OTHER
    });
    setIsModalOpen(true);
  };

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setFormData({ ...job });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      deleteJob(id);
      loadData();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const jobToSave: Job = {
      id: editingJob ? editingJob.id : generateId(),
      title: formData.title || 'Untitled',
      department: formData.department || 'Unknown',
      qualification: formData.qualification || 'Any',
      location: formData.location || 'All India',
      lastDate: formData.lastDate || new Date().toISOString(),
      applyLink: formData.applyLink || '#',
      notificationLink: formData.notificationLink || '#',
      description: formData.description || '',
      category: (formData.category as JobCategory) || JobCategory.OTHER,
      postedDate: editingJob ? editingJob.postedDate : new Date().toISOString()
    };

    saveJob(jobToSave);
    setIsModalOpen(false);
    loadData();
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed h-full shadow-xl hidden md:flex">
        <div className="p-6 border-b border-slate-800">
           <h2 className="text-xl font-bold tracking-wide">Admin Panel</h2>
           <p className="text-xs text-slate-400 mt-1">SarkariJob Manager</p>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button className="w-full flex items-center space-x-3 px-4 py-3 bg-blue-600 rounded-lg text-white shadow-lg shadow-blue-900/50">
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-slate-400 hover:bg-slate-800 rounded-lg transition-colors">
            <Briefcase className="w-5 h-5" />
            <span>All Jobs</span>
          </button>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button onClick={onLogout} className="flex items-center text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-4 h-4 mr-2" /> Back to Website
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
           <div>
             <h1 className="text-2xl font-bold text-slate-800">Dashboard Overview</h1>
             <p className="text-slate-500">Manage job listings and view statistics.</p>
           </div>
           <div className="mt-4 md:mt-0 flex space-x-3">
             <button onClick={onLogout} className="md:hidden px-4 py-2 bg-white border rounded-lg text-sm font-medium">Back</button>
             <button onClick={handleAddNew} className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition-all">
               <Plus className="w-4 h-4 mr-2" /> Add New Job
             </button>
           </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Total Jobs</div>
             <div className="text-4xl font-bold text-slate-800">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <div className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-2">Updated Today</div>
             <div className="text-4xl font-bold text-blue-600">{stats.today}</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-center justify-center">
             <p className="text-center text-sm text-slate-400">System Status: <span className="text-green-500 font-bold">Local Storage Active</span></p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center">
            <BarChart2 className="w-5 h-5 mr-2 text-blue-500" /> Jobs per Category
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 12}} axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Job List Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-700">Recent Job Postings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                <tr>
                  <th className="px-6 py-3">Job Title</th>
                  <th className="px-6 py-3">Department</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Last Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobs.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-400">No jobs added yet.</td>
                  </tr>
                )}
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-800">{job.title}</td>
                    <td className="px-6 py-3 text-slate-600">{job.department}</td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-medium">
                        {job.category}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-slate-600">{job.lastDate}</td>
                    <td className="px-6 py-3 text-right space-x-2">
                      <button 
                        onClick={() => handleEdit(job)} 
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(job.id)} 
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in-up">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-bold text-slate-800">
                {editingJob ? 'Edit Job' : 'Add New Job'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Job Title</label>
                  <input required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Probationary Officer" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Department</label>
                  <input required className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} placeholder="e.g. SBI" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Qualification</label>
                  <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.qualification} onChange={e => setFormData({...formData, qualification: e.target.value})}>
                      <option value="">Select Qualification</option>
                      {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Last Date</label>
                  <input required type="date" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                    value={formData.lastDate} onChange={e => setFormData({...formData, lastDate: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Category</label>
                  <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as JobCategory})}>
                      {Object.values(JobCategory).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                 </div>
                 <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Location</label>
                   <select className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}>
                       <option value="">Select Location</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                 </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Short Description</label>
                <textarea className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20" 
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief details..." />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Apply Link (URL)</label>
                   <input type="url" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                     value={formData.applyLink} onChange={e => setFormData({...formData, applyLink: e.target.value})} />
                 </div>
                 <div className="space-y-2">
                   <label className="text-sm font-medium text-slate-700">Notification Link (PDF)</label>
                   <input type="url" className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                     value={formData.notificationLink} onChange={e => setFormData({...formData, notificationLink: e.target.value})} />
                 </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center shadow-lg shadow-blue-200">
                  <Save className="w-4 h-4 mr-2" /> {editingJob ? 'Update Job' : 'Save Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
