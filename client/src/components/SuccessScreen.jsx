import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { CheckCircle2, Download, Home, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import confetti from 'canvas-confetti';
import { generateComplaintPDF } from '../utils/pdfGenerator';

const SuccessScreen = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { ref } = useParams();
  const formData = location.state?.formData;
  
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Trigger confetti on mount
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#0ea5e9', '#3b82f6', '#10b981']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#0ea5e9', '#3b82f6', '#10b981']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  const handleDownloadPDF = async () => {
    if (!formData) return;
    setIsGenerating(true);
    await generateComplaintPDF(formData, ref);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        transition={{ type: "spring", bounce: 0.4 }}
        className="glass-panel p-8 md:p-12 rounded-3xl max-w-2xl w-full text-center border-t-4 border-t-emerald-500 shadow-2xl"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-emerald-50 max-w-24 mx-auto dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="text-emerald-500 w-12 h-12" />
        </motion.div>

        <h1 className="text-3xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          {t('complaint_submitted')}
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 font-medium">
          {t('success_message')}
        </p>

        <div className="bg-slate-100 dark:bg-slate-800/80 rounded-2xl p-6 mb-8 border border-slate-200 dark:border-slate-700 shadow-inner">
          <span className="text-xs text-slate-500 uppercase tracking-widest block mb-2 font-mono">{t('ref_number')}</span>
          <span className="text-3xl font-mono font-bold text-amber-600 dark:text-amber-400 tracking-widest">{ref}</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={handleDownloadPDF}
            disabled={isGenerating || !formData}
            className={`btn-primary flex items-center justify-center gap-2 w-full sm:w-auto ${!formData ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Download size={20} />
            {isGenerating ? 'Generating...' : t('download_pdf')}
          </button>
          
          <button 
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Home size={20} />
            {t('return_home')}
          </button>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 flex items-start gap-4 text-left bg-purple-50 dark:bg-amber-900/20 p-4 rounded-xl">
          <AlertCircle className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            Please keep this reference number safe. You can use it to track the status of your complaint at any time. A confirmation has also been sent to your registered mobile number.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessScreen;
