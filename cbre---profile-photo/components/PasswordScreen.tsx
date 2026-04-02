import React, { useState } from 'react';

interface PasswordScreenProps {
  onUnlock: () => void;
}

const PasswordScreen: React.FC<PasswordScreenProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'stanton*') {
      onUnlock();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: '#062152' }}>
      <div className="w-full max-w-md px-6 flex flex-col items-center">

        {/* Stanton Chase Logo */}
        <img src="/stanton_white.png" alt="Stanton Chase" className="h-16 mb-2" />

        {/* Subtitle */}
        <p className="text-white/40 text-xs uppercase tracking-[0.3em] font-light mb-12">
          Profile Photo Generator
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Password"
              className={`w-full bg-white/10 backdrop-blur-sm border ${error ? 'border-red-400' : 'border-white/20'} rounded-xl px-5 py-4 text-sm text-white text-center outline-none transition-all duration-200 focus:border-white/40 focus:bg-white/15 placeholder:text-white/40`}
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-xs mt-2 text-center">Incorrect password. Please try again.</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1054cc] to-[#3d7fe5] hover:from-[#0d44ab] hover:to-[#1054cc] text-white font-semibold py-4 rounded-xl transition-all duration-200 text-sm shadow-lg shadow-[#1054cc]/30"
          >
            Enter
          </button>
        </form>

      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-white/20 text-xs font-light italic">
        Powered by Encounte s.r.o.
      </p>
    </div>
  );
};

export default PasswordScreen;
