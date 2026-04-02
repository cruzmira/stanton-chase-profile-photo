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
    <div className="min-h-screen flex items-center justify-center bg-[#e5efff]">
      <div className="w-full max-w-md px-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 flex flex-col items-center">

          {/* Stanton Chase Logo */}
          <img src="/logo-blue.svg" alt="Stanton Chase" className="h-12 mb-6" />

          {/* Title */}
          <h2 className="text-xl font-bold text-[#062152] mb-2 text-center">Password Protected Access</h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Please enter the password to access the application.
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
                className={`w-full border ${error ? 'border-red-400' : 'border-gray-200'} rounded-xl px-4 py-3 text-sm text-gray-800 outline-none transition-all duration-200 focus:border-[#1054cc] focus:ring-2 focus:ring-[#1054cc]/20 placeholder:text-gray-400`}
                autoFocus
              />
              {error && (
                <p className="text-red-500 text-xs mt-2 text-center">Incorrect password. Please try again.</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#1054cc] hover:bg-[#0d44ab] text-white font-semibold py-3 rounded-xl transition-colors duration-200 text-sm shadow-lg shadow-[#1054cc]/20"
            >
              Enter
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default PasswordScreen;
