import React from 'react';
import { motion } from 'framer-motion';
import { UploadCloud, X, FileText, Image as ImageIcon } from 'lucide-react';

const FileUpload = ({ onFilesSelect }) => {
  const [dragActive, setDragActive] = React.useState(false);
  const [files, setFiles] = React.useState([]);

  const handleFiles = (newFiles) => {
    const validFiles = Array.from(newFiles).filter(file => {
      const isTypeValid = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
      const isSizeValid = file.size <= 10 * 1024 * 1024; // 10MB
      return isTypeValid && isSizeValid;
    });

    const updatedFiles = [...files, ...validFiles].slice(0, 5); // Max 5 files
    setFiles(updatedFiles);
    onFilesSelect(updatedFiles);
  };

  return (
    <div className="col-span-1 md:col-span-2 mt-4">
      <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 font-mono uppercase tracking-wide text-xs mb-2">
        Upload Evidence (Images/PDF)
      </label>
      
      <div 
        className={`relative w-full rounded-xl border-2 border-dashed p-8 transition-colors text-center cursor-pointer 
          ${dragActive ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20' : 'border-slate-300 bg-slate-50 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:bg-slate-800'}`}
        onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setDragActive(false); }}
        onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
          }
        }}
        onClick={() => document.getElementById('file-upload').click()}
      >
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          accept="image/jpeg, image/png, application/pdf" 
          className="hidden" 
          onChange={(e) => handleFiles(e.target.files)} 
        />
        
        <div className="flex flex-col items-center gap-3">
          <UploadCloud className={`w-10 h-10 ${dragActive ? 'text-amber-500' : 'text-slate-400 dark:text-slate-500'}`} />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            <span className="text-amber-600 dark:text-amber-400 font-medium">Click to upload</span> or drag and drop
          </p>
          <span className="text-xs text-slate-500 dark:text-slate-500">SVG, PNG, JPG or PDF (max. 10MB) - Up to 5 files</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map((file, idx) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              key={idx} className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3 overflow-hidden text-slate-700 dark:text-slate-300">
                {file.type.includes('pdf') ? <FileText className="text-red-500 flex-shrink-0" size={20} /> : <ImageIcon className="text-amber-500 flex-shrink-0" size={20} />}
                <div className="flex flex-col overflow-hidden">
                  <span className="text-sm truncate font-medium">{file.name}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-500 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
              </div>
              <button onClick={() => {
                const newArr = files.filter((_, i) => i !== idx);
                setFiles(newArr);
                onFilesSelect(newArr);
              }} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
