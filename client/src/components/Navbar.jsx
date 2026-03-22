import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Moon, Sun, Globe, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-amber-600 dark:text-amber-500" />
            <Link to="/">
              <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight hover:opacity-80 transition-opacity">
                {t('portal_title')}
              </h1>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-300 font-medium text-sm">
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </Link>

            <div className="hidden md:flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-mono">
              <span>{t('help_emergency')}: <strong className="text-amber-600 dark:text-amber-500">100</strong></span>
              <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
              <span>{t('help_women')}: <strong className="text-amber-600 dark:text-amber-500">1091</strong></span>
              <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
              <span>Cyber: <strong className="text-amber-600 dark:text-amber-500">1930</strong></span>
            </div>

            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-md px-2 py-1 border border-slate-200 dark:border-slate-700 transition-colors">
              <Globe className="w-4 h-4 text-slate-500 dark:text-slate-400 mr-2" />
              <select 
                value={i18n.language} 
                onChange={handleLanguageChange}
                className="bg-transparent text-slate-700 dark:text-slate-300 text-sm focus:outline-none cursor-pointer font-medium"
              >
                <option value="en" className="bg-white dark:bg-slate-900">EN</option>
                <option value="hi" className="bg-white dark:bg-slate-900">हि</option>
                <option value="te" className="bg-white dark:bg-slate-900">తె</option>
              </select>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5 text-slate-600" />
              ) : (
                <Sun className="w-5 h-5 text-amber-400" />
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
