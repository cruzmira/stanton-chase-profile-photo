import React, { useState } from 'react';
import PasswordScreen from './components/PasswordScreen';
import LandingPage from './components/LandingPage';
import Header from './components/Header';
import PhotoGenerator from './components/PhotoGenerator';
import { AppState, Language } from './types';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LOCKED);
  const [language, setLanguage] = useState<Language>(Language.EN);

  const handleUnlock = () => {
    setAppState(AppState.LANDING);
  };

  const handleEnterApp = () => {
    setAppState(AppState.UNLOCKED);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  if (appState === AppState.LOCKED) {
    return <PasswordScreen onUnlock={handleUnlock} />;
  }

  if (appState === AppState.LANDING) {
    return <LandingPage onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col text-[#1A1A1A] font-sans selection:bg-[#006a4e] selection:text-white relative overflow-x-hidden">

      {/* Sophisticated Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[80vw] h-[80vw] bg-gradient-to-br from-[#E6F4F1] to-transparent rounded-full blur-[120px] opacity-60"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-gradient-to-tl from-[#F0FDF4] to-transparent rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute top-[40%] left-[20%] w-[20vw] h-[20vw] bg-[#006a4e] rounded-full blur-[150px] opacity-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header currentLang={language} onLanguageChange={handleLanguageChange} />

        <main className="flex-grow pt-8 md:pt-12 px-4 md:px-8 max-w-7xl mx-auto w-full">
          <PhotoGenerator currentLang={language} />
        </main>

        <footer className="mt-20 pb-8 text-center">
          <div className="max-w-7xl mx-auto px-4">
            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-8"></div>
            <p className="text-gray-400 text-xs font-medium tracking-wide uppercase">
              &copy; {new Date().getFullYear()} CBRE, Inc. All rights reserved.
            </p>
            <div className="mt-4 flex justify-center gap-6 text-xs text-gray-500">
              <span className="hover:text-[#006a4e] transition-colors cursor-pointer">Privacy Policy</span>
              <span className="w-px h-3 bg-gray-300"></span>
              <span className="hover:text-[#006a4e] transition-colors cursor-pointer">Terms of Use</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;