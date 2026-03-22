import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { FileText, CheckCircle, ArrowLeft, ShieldAlert } from 'lucide-react';

const ReviewScreen = ({ formData, onBack, onSubmit, isSubmitting }) => {
  const { t } = useTranslation();

  const renderField = (label, value) => (
    <div className="flex flex-col border-b border-slate-200 dark:border-slate-800 pb-3">
      <span className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest font-mono">{label}</span>
      <p className="text-slate-800 dark:text-slate-200 font-medium mt-1">{value || 'N/A'}</p>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto glass-panel mt-6"
    >
      <div className="flex justify-between items-center mb-8 border-b border-slate-200 dark:border-slate-800 pb-4">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-800 dark:text-white flex items-center gap-3">
          <FileText className="text-amber-600 dark:text-amber-500" size={32} />
          {t('review')}
        </h2>
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner">
        {renderField(t('your_name'), formData.fullName)}
        {renderField(t('aadhaar_number'), 'XXXX-XXXX-' + formData.aadhaarNumber.slice(-4))}
        {renderField(t('mobile_number'), formData.mobileNumber)}
        {renderField(t('email_address'), formData.email)}
        {renderField(t('address'), `${formData.address}, ${formData.district}, ${formData.state}`)}
        {renderField(t('complaint_type'), formData.complaintType)}
        {renderField(t('incident_date'), formData.incidentDate)}
        {renderField(t('incident_time'), formData.incidentTime)}
        {renderField(t('incident_location'), formData.incidentLocation)}
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-inner mb-8">
        <span className="text-xs text-slate-500 dark:text-slate-500 uppercase tracking-widest font-mono block mb-2">{t('description')}</span>
        <p className="text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
          {formData.description}
        </p>
      </div>

      <div className="bg-slate-100 dark:bg-slate-800/80 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 flex items-start gap-4">
        <ShieldAlert className="text-amber-600 dark:text-amber-400 mt-1 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 uppercase tracking-wide">Declaration</h4>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input 
              type="checkbox" 
              required
              className="mt-1 w-5 h-5 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
              I hereby declare that the information provided above is true to the best of my knowledge. I am aware that providing false information is a punishable offense.
            </span>
          </label>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button type="button" onClick={onBack} disabled={isSubmitting} className="btn-secondary">
          Edit Details
        </button>
        <button type="button" onClick={onSubmit} disabled={isSubmitting} className="btn-primary flex items-center gap-2 px-10">
          {isSubmitting ? <span className="animate-pulse">Submitting...</span> : <><CheckCircle size={20} /> Submit Formal Complaint</>}
        </button>
      </div>
    </motion.div>
  );
};

export default ReviewScreen;
