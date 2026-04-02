import React, { useState } from 'react';
import PasswordScreen from './components/PasswordScreen';
import Header from './components/Header';
import PhotoGenerator from './components/PhotoGenerator';
import { AppState, Language } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOCKED);
  const [language, setLanguage] = useState<Language>(Language.EN);

  const handleUnlock = () => {
    setAppState(AppState.UNLOCKED);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  if (appState === AppState.LOCKED) {
    return <PasswordScreen onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-[#e5efff] flex flex-col text-[#1A1A1A] font-sans selection:bg-[#1054cc] selection:text-white relative overflow-x-hidden">

      {/* Subtle Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-gradient-to-br from-[#f0f5ff] to-transparent rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-gradient-to-tl from-[#e5efff] to-transparent rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[40%] left-[20%] w-[20vw] h-[20vw] bg-[#1054cc] rounded-full blur-[150px] opacity-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header currentLang={language} onLanguageChange={handleLanguageChange} />

        <main className="flex-grow pt-8 md:pt-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <PhotoGenerator currentLang={language} />
        </main>

        <footer className="mt-20 pb-8 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-8"></div>
            <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">
              &copy; {new Date().getFullYear()} Stanton Chase. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;
