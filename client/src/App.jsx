import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import './i18n/config.js';

import Navbar from './components/Navbar';
import LanguageSelector from './components/LanguageSelector';
import ComplaintForm from './components/ComplaintForm';
import SuccessScreen from './components/SuccessScreen';
import ComplaintTracker from './components/ComplaintTracker';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    // Initial theme check applied on mount
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, []);

  const handleLanguageSelect = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('appLanguage', lang);
    navigate('/form');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ y: [0, -50, 0], x: [0, 30, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-amber-300/20 dark:bg-amber-900/20 blur-[120px]"
        />
        <motion.div 
          animate={{ y: [0, 50, 0], x: [0, -30, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-emerald-300/20 dark:bg-emerald-900/20 blur-[100px]"
        />
        <motion.div 
          animate={{ y: [0, -30, 0], x: [0, -40, 0], scale: [1, 1.05, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-fuchsia-300/10 dark:bg-fuchsia-900/10 blur-[90px]"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col p-4 w-full h-full">
          <Routes>
            <Route path="/" element={<LanguageSelector onSelect={handleLanguageSelect} />} />
            <Route path="/form" element={<ComplaintForm />} />
            <Route path="/success/:ref" element={<SuccessScreen />} />
            <Route path="/track" element={<ComplaintTracker />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
