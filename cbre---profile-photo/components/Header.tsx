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
    <header className="sticky top-0 z-50 bg-[#062152] shadow-lg">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo Area */}
        <div className="flex items-center space-x-4 cursor-default select-none">
          <img src="/logo-blue.svg" alt="Stanton Chase" className="h-7 brightness-0 invert" />
          <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
          <div className="text-xs font-semibold text-white/60 uppercase tracking-wider hidden sm:block">
            Profile AI
          </div>
        </div>

        {/* Right Navigation */}
        <div className="flex items-center gap-1 md:gap-2 text-sm font-medium" ref={menuRef}>

          {/* About */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('about')}
              className={`px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all focus:outline-none ${activeMenu === 'about' ? 'bg-white/10 text-white' : ''}`}
            >
              {t.about}
            </button>
            {activeMenu === 'about' && (
              <div className="absolute right-0 mt-4 w-80 bg-white text-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 animate-fade-in origin-top-right z-50">
                <h3 className="text-[#062152] font-bold text-lg tracking-tight mb-3">{t.about}</h3>
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
              className={`flex items-center px-4 py-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all focus:outline-none ${activeMenu === 'phone' ? 'bg-white/10 text-white' : ''}`}
            >
              <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              <span>{t.phone}</span>
            </button>
            {activeMenu === 'phone' && (
              <div className="absolute right-0 mt-4 bg-white text-[#062152] rounded-2xl shadow-xl py-4 px-6 border border-gray-100 whitespace-nowrap font-bold text-lg animate-fade-in origin-top-right z-50">
                <a href="tel:+420224854060" className="hover:text-[#1054cc] transition-colors">
                  +420 224 854 060
                </a>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-white/20 mx-2"></div>

          {/* Language */}
          <div className="relative">
            <button
              onClick={() => toggleMenu('lang')}
              className={`flex items-center pl-4 pr-3 py-2 rounded-full text-white bg-white/10 hover:bg-white/20 transition-all focus:outline-none uppercase text-xs font-bold tracking-wider ${activeMenu === 'lang' ? 'ring-2 ring-[#1054cc]/40' : ''}`}
            >
              <span className="mr-1">{currentLang}</span>
              <svg className={`w-3 h-3 ml-1 transform transition-transform duration-300 ${activeMenu === 'lang' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {activeMenu === 'lang' && (
              <div className="absolute right-0 mt-4 w-40 bg-white text-gray-800 rounded-2xl shadow-xl py-2 border border-gray-100 overflow-hidden z-50 animate-fade-in origin-top-right">
                {Object.values(Language).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => {
                      onLanguageChange(lang);
                      setActiveMenu(null);
                    }}
                    className={`w-full text-left px-5 py-3 text-sm flex items-center transition-colors hover:bg-[#e5efff] ${currentLang === lang ? 'text-[#1054cc] font-bold bg-[#e5efff]' : 'text-gray-600'}`}
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
