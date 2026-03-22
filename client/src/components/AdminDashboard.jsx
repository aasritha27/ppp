import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Users, FileText, Download } from 'lucide-react';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: In a real app this would have authentication
    fetch('/api/complaints/all/mock-admin')
      .then(res => res.json())
      .then(data => {
        setComplaints(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  const exportCSV = () => {
    const headers = ['Reference Number', 'Name', 'Phone', 'Type', 'Status', 'Date'];
    const rows = complaints.map(c => [
      c.referenceNumber,
      c.fullName,
      c.mobileNumber,
      c.complaintType,
      c.status,
      new Date(c.createdAt).toLocaleDateString()
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `complaints_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-mono tracking-widest uppercase">Loading Secure Data...</div>;

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <LayoutDashboard className="text-amber-600 dark:text-amber-500" /> Executive Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">Classified Police View - Access Restricted</p>
        </div>
        <button onClick={exportCSV} className="btn-secondary flex items-center gap-2 bg-white dark:bg-slate-900">
          <Download size={18} /> Export Records
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { icon: <FileText size={24}/>, label: 'Total Complaints', value: complaints.length, color: 'text-amber-600 dark:text-amber-400' },
          { icon: <Users size={24}/>, label: 'Active Users', value: new Set(complaints.map(c => c.mobileNumber)).size, color: 'text-fuchsia-600 dark:text-fuchsia-400' },
          { icon: <LayoutDashboard size={24}/>, label: 'Pending Action', value: complaints.filter(c => c.status === 'Pending').length, color: 'text-amber-600 dark:text-amber-500' },
          { icon: <FileText size={24}/>, label: 'Resolved', value: complaints.filter(c => c.status === 'Resolved').length, color: 'text-emerald-600 dark:text-emerald-400' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col shadow-md">
            <div className={`${stat.color} bg-slate-100 dark:bg-slate-800/50 w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <span className="text-3xl font-bold text-slate-800 dark:text-white font-mono tracking-tight">{stat.value}</span>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono mt-1">{stat.label}</span>
          </div>
        ))}
      </div>

      <div className="glass-panel overflow-x-auto rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-0 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-mono uppercase tracking-widest text-xs">
              <th className="p-4 text-slate-500 dark:text-slate-400 font-bold">Ref ID</th>
              <th className="p-4 text-slate-500 dark:text-slate-400 font-bold">Citizen</th>
              <th className="p-4 text-slate-500 dark:text-slate-400 font-bold">Type</th>
              <th className="p-4 text-slate-500 dark:text-slate-400 font-bold">Status</th>
              <th className="p-4 text-slate-500 dark:text-slate-400 font-bold">Date Logged</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-slate-500 font-medium">No complaints found in system.</td>
              </tr>
            ) : complaints.map((c) => (
              <tr key={c.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="p-4 font-mono text-sm text-amber-600 dark:text-amber-400 font-bold">{c.referenceNumber}</td>
                <td className="p-4 text-slate-800 dark:text-slate-300 font-medium">{c.fullName}<br/><span className="text-xs text-slate-500 font-mono">{c.mobileNumber}</span></td>
                <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{c.complaintType}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wide border ${
                    c.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-400 dark:border-emerald-800' 
                    : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-900/40 dark:text-amber-400 dark:border-amber-800'
                  }`}>
                    {c.status}
                  </span>
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-400 text-sm font-medium">{new Date(c.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
