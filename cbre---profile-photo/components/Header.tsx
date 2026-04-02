import React, { useState, useRef, useEffect } from 'react';
import { Language, DICTIONARY } from '../types';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ currentLang, onLanguageChange }) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = DICTIONARY[currentLang];

  const toggleMenu = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-6 z-50 px-4 md:px-8 max-w-7xl mx-auto w-full">
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-sm shadow-gray-200/50 h-16 flex items-center justify-between px-6 transition-all duration-300">

        {/* Logo Area */}
        <div className="flex items-center space-x-4 cursor-default select-none">
          <img src="/logo-blue.svg" alt="Stanton Chase" className="h-7" />
          <div className="h-4 w-px bg-gray-300 hidden sm:block transform rotate-12"></div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:block bg-gray-100 px-2 py-0.5 rounded-md">
            Profile AI
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-1 md:gap-2 text-sm font-medium" ref={menuRef}>

          {/* About */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('about')}
              className={`px-4 py-2 rounded-full text-gray-600 hover:text-[#006a4e] hover:bg-green-50/50 transition-all focus:outline-none ${activeMenu === 'about' ? 'bg-green-50 text-[#006a4e]' : ''}`}
            >
              {t.about}
            </button>
            {activeMenu === 'about' && (
              <div className="absolute right-0 mt-4 w-80 bg-white/95 backdrop-blur-xl text-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 p-6 border border-white ring-1 ring-black/5 animate-fade-in origin-top-right z-50">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[#003f2d] font-bold text-lg tracking-tight">{t.about}</h3>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {t.aboutContent}
                </p>
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="relative hidden md:block">
            <button
              onClick={() => toggleMenu('phone')}
              className={`flex items-center px-4 py-2 rounded-full text-gray-600 hover:text-[#006a4e] hover:bg-green-50/50 transition-all focus:outline-none ${activeMenu === 'phone' ? 'bg-green-50 text-[#006a4e]' : ''}`}
            >
              <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span>{t.phone}</span>
            </button>
            {activeMenu === 'phone' && (
              <div className="absolute right-0 mt-4 bg-white/95 backdrop-blur-xl text-[#003f2d] rounded-2xl shadow-xl shadow-gray-200/50 py-4 px-6 border border-white ring-1 ring-black/5 whitespace-nowrap font-bold text-lg animate-fade-in origin-top-right z-50">
                <a href="tel:+420224854060" className="hover:text-[#006a4e] transition-colors">
                  +420 224 854 060
                </a>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('lang')}
              className={`flex items-center pl-4 pr-3 py-2 rounded-full text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all focus:outline-none uppercase text-xs font-bold tracking-wider ${activeMenu === 'lang' ? 'ring-2 ring-[#006a4e]/20' : ''}`}
            >
              <span className="mr-1">{currentLang}</span>
              <svg className={`w-3 h-3 ml-1 transform transition-transform duration-300 ${activeMenu === 'lang' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {activeMenu === 'lang' && (
              <div className="absolute right-0 mt-4 w-40 bg-white/95 backdrop-blur-xl text-gray-800 rounded-2xl shadow-xl shadow-gray-200/50 py-2 border border-white ring-1 ring-black/5 overflow-hidden z-50 animate-fade-in origin-top-right">
                {Object.values(Language).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLanguageChange(lang);
                      setActiveMenu(null);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm flex items-center transition-colors hover:bg-gray-50 ${currentLang === lang ? 'text-[#006a4e] font-bold bg-green-50/50' : 'text-gray-600'}`}
                  >
                    <span className="uppercase w-8 font-bold text-xs">{lang}</span>
                    <span>
                      {lang === Language.EN && 'English'}
                      {lang === Language.CZ && 'Czech'}
                      {lang === Language.SK && 'Slovak'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;