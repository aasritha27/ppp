import React, { useState } from 'react';
import { Search, MapPin, Clock, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

const ComplaintTracker = () => {
  const [refId, setRefId] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!refId.trim()) return;

    setLoading(true);
    setError('');
    setStatus(null);

    try {
      const res = await fetch(`/api/complaints/${refId}`);
      if (!res.ok) {
        throw new Error('Complaint not found');
      }
      const data = await res.json();
      setStatus(data);
    } catch (err) {
      setError(err.message || 'Error fetching status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto glass-panel mt-6 relative">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-slate-900 dark:text-white tracking-tight">Track Complaint Status</h2>
        <p className="text-slate-600 dark:text-slate-400 font-medium mt-2">Enter your reference number to view real-time updates.</p>
      </div>

      <form onSubmit={handleTrack} className="flex gap-4 mb-10 w-full max-w-xl mx-auto relative">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="e.g. CMP-20231024-12345"
            value={refId}
            onChange={(e) => setRefId(e.target.value)}
            className="input-field pl-12 h-14 font-mono uppercase tracking-wider text-sm shadow-inner"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary h-14 px-8">
          {loading ? 'Tracking...' : 'Track'}
        </button>
      </form>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-center border border-red-200 dark:border-red-800 font-medium shadow-sm">
          {error}
        </div>
      )}

      {status && (
        <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-8 border border-slate-200 dark:border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          
          <div className="flex justify-between items-start mb-8 relative">
            <div>
              <span className="text-xs text-slate-500 tracking-widest uppercase font-mono mb-1 block">Reference ID</span>
              <h3 className="text-2xl font-mono font-bold text-slate-800 dark:text-white tracking-wider">{status.referenceNumber}</h3>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 border border-emerald-200 dark:border-emerald-800/50">
              <CheckCircle2 size={16} /> Status: {status.status}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <FileText className="text-amber-500 mt-1" size={20} />
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono tracking-widest block mb-1">Type</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{status.complaintType}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
              <Clock className="text-amber-500 mt-1" size={20} />
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono tracking-widest block mb-1">Filed On</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">
                  {new Date(status.createdAt).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 col-span-1 md:col-span-2">
              <MapPin className="text-amber-500 mt-1" size={20} />
              <div>
                <span className="text-xs text-slate-500 uppercase font-mono tracking-widest block mb-1">Incident Location</span>
                <p className="text-slate-800 dark:text-slate-200 font-medium">{status.incidentLocation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintTracker;
