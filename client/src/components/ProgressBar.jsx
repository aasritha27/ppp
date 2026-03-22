import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ percentage }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400 font-mono tracking-wide uppercase text-xs">Form Completion</span>
        <span className="text-sm font-bold text-amber-600 dark:text-amber-400">{Math.round(percentage)}%</span>
      </div>
      <div className="h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-amber-500 rounded-full"
        />
      </div>
    </div>
  );
};

export default ProgressBar;
