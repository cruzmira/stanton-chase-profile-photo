import React from 'react';

interface LandingPageProps {
    onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
    const steps = [
        { icon: '📸', label: 'Upload Your Photo', color: 'bg-blue-50 text-blue-600', desc: 'Upload a selfie or headshot' },
        { icon: '🎨', label: 'Select Style', color: 'bg-orange-50 text-orange-600', desc: 'Choose a professional style' },
        { icon: '🤖', label: 'AI Generation (Gemini)', color: 'bg-red-50 text-red-600', desc: 'Generate with Gemini AI' },
        { icon: '📥', label: 'Download & Use', color: 'bg-green-50 text-green-600', desc: 'Download your result' },
    ];

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex flex-col">

            {/* Top Nav */}
            <nav className="bg-[#003f2d] px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <img src="/stanton_white.png" alt="Stanton Chase" className="h-5" />
                    <span className="text-white/60 text-sm font-medium">Profile Photo Generator</span>
                </div>
                <button
                    onClick={onEnterApp}
                    className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-semibold px-5 py-2 rounded-lg transition-all"
                >
                    Enter Application →
                </button>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-[#003f2d] to-[#001e15] text-white px-8 py-14 md:py-20">
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-lg">🤖</span>
                        <span className="text-xs font-bold uppercase tracking-widest text-green-300/80">AI-Powered Platform</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
                        Stanton Chase Profile Photo
                    </h1>
                    <p className="text-white/60 text-lg">
                        AI-Powered Professional Headshot Generator
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow max-w-6xl mx-auto w-full px-8 py-12 grid grid-cols-1 lg:grid-cols-5 gap-12">

                {/* Left Column — Overview (3/5) */}
                <div className="lg:col-span-3 space-y-10">

                    {/* Enter Application CTA */}
                    <button
                        onClick={onEnterApp}
                        className="w-full bg-[#003f2d] hover:bg-[#002e21] text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg flex items-center justify-center gap-2"
                    >
                        Enter Application
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </button>

                    {/* Overview */}
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                            <span className="w-1 h-7 bg-[#006a4e] rounded-full inline-block"></span>
                            Overview
                        </h2>
                        <p className="text-gray-600 leading-relaxed">
                            The Stanton Chase Profile Photo platform leverages advanced Generative AI to transform selfies and casual headshots into professional corporate portraits. Upload your photo, select a style, and let AI generate a polished headshot in seconds.
                        </p>
                    </div>

                    {/* Benefits */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Benefits</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-start gap-2">
                                <span className="text-[#006a4e] mt-1">•</span>
                                Professional headshots without a photo studio
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#006a4e] mt-1">•</span>
                                Multiple style variations from a single selfie
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#006a4e] mt-1">•</span>
                                Consistent, professional look across the team
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-[#006a4e] mt-1">•</span>
                                Instant generation — from upload to polished headshot in seconds
                            </li>
                        </ul>
                    </div>

                    {/* Business Value */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Business Value</h3>
                        <ul className="space-y-2 text-gray-600">
                            <li className="flex items-center gap-2"><span className="text-[#006a4e]">✓</span> Significant cost savings vs. professional photo sessions</li>
                            <li className="flex items-center gap-2"><span className="text-[#006a4e]">✓</span> Consistent corporate look for the entire team</li>
                            <li className="flex items-center gap-2"><span className="text-[#006a4e]">✓</span> Ready for LinkedIn, company website, and internal directories</li>
                            <li className="flex items-center gap-2"><span className="text-[#006a4e]">✓</span> Multi-language support (EN, CZ, SK)</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column — Steps (2/5) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">AI Generation Pipeline</div>

                    {steps.map((step, i) => (
                        <div key={i} className="relative">
                            <div className={`flex items-center gap-4 p-4 rounded-xl border border-gray-100 bg-white shadow-sm`}>
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${step.color}`}>
                                    {step.icon}
                                </div>
                                <span className="font-semibold text-gray-800 text-sm">{step.label}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className="flex justify-center py-1">
                                    <div className="w-px h-4 bg-gray-200"></div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Additional Information */}
                    <div className="mt-8 border-t border-gray-100 pt-6">
                        <h4 className="text-sm font-bold text-gray-900 mb-4">Additional Information</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wide">Category</span>
                                <p className="font-semibold text-gray-700 mt-1">Generative AI — Image</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wide">Industry</span>
                                <p className="font-semibold text-gray-700 mt-1">Executive Search</p>
                            </div>
                            <div>
                                <span className="text-xs text-gray-400 uppercase tracking-wide">Version</span>
                                <p className="font-semibold text-gray-700 mt-1">v1.0</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LandingPage;
