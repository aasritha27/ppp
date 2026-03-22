import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const FormField = ({ label, name, type = 'text', value, onChange, error, isValid, options, required, placeholder, as = 'input', rows }) => {
  return (
    <div className="flex flex-col relative w-full">
      <label className="label-text">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative w-full">
        {as === 'select' ? (
          <select
            name={name}
            value={value}
            onChange={onChange}
            className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : isValid ? 'border-emerald-500/50' : ''}`}
          >
            <option value="" disabled className="text-slate-400">Select an option</option>
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        ) : as === 'textarea' ? (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className={`input-field resize-none ${error ? 'border-red-500 focus:ring-red-500' : isValid ? 'border-emerald-500/50' : ''}`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : isValid ? 'border-emerald-500/50' : ''}`}
          />
        )}
        
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <AnimatePresence mode="wait">
            {isValid && !error && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><CheckCircle2 className="text-emerald-500 w-5 h-5" /></motion.div>}
            {error && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}><AlertCircle className="text-red-500 w-5 h-5" /></motion.div>}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="text-red-500 text-xs mt-1 font-medium"
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormField;
