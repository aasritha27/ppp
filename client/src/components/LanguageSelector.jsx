import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ onSelect }) => {
  const { t } = useTranslation();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 w-full relative min-h-[80vh]">

      <motion.div 
        className="w-full max-w-4xl glass-panel relative z-10 p-10 md:p-14 border border-slate-200 dark:border-slate-800 shadow-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-10 w-full text-center">
          <Shield className="w-20 h-20 text-amber-600 dark:text-amber-500 mb-6" />
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mb-6 tracking-tight">
            Citizen Police Portal
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-medium mb-2 max-w-lg mx-auto text-lg leading-relaxed">
            Please select your preferred language<br/>
            कृपया आगे बढ़ने के लिए भाषा चुनें<br/>
            కొనసాగడానికి భాషను ఎంచుకోండి
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
          {[
            { id: 'en', title: 'English', desc: 'Proceed in English' },
            { id: 'hi', title: 'हिन्दी', desc: 'हिंदी में आगे बढ़ें' },
            { id: 'te', title: 'తెలుగు', desc: 'తెలుగులో కొనసాగండి' }
          ].map((lang) => (
            <motion.button
              key={lang.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelect(lang.id)}
              className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 p-8 flex flex-col items-center justify-center gap-3 transition-colors border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl cursor-pointer group shadow-sm hover:shadow-lg"
            >
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">{lang.title}</h2>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-mono tracking-tight">{lang.desc}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LanguageSelector;
