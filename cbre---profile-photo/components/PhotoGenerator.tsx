import React, { useState, useRef, useEffect } from 'react';
import { generateProfilePhoto } from '../services/geminiService';
import { Language, DICTIONARY } from '../types';

interface PhotoGeneratorProps {
  currentLang: Language;
}

const STYLES = [
  { id: 'classic', icon: '👔', color: 'from-gray-700 to-gray-900' },
  { id: 'casual', icon: '🧥', color: 'from-blue-500 to-blue-700' },
  { id: 'creative', icon: '🎨', color: 'from-purple-500 to-pink-500' },
  { id: 'outdoor', icon: '🌿', color: 'from-green-500 to-emerald-600' },
  { id: 'executive', icon: '👑', color: 'from-amber-600 to-yellow-700' },
  { id: 'minimalist', icon: '◻️', color: 'from-slate-300 to-slate-500' },
];

const PhotoGenerator: React.FC<PhotoGeneratorProps> = ({ currentLang }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('classic');

  // Camera state
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const t = DICTIONARY[currentLang];

  // Function to apply Stanton Chase watermark on generated image
  const applyWatermark = (imageSrc: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(imageSrc); return; }

        // Draw the generated image
        ctx.drawImage(img, 0, 0);

        const padding = img.width * 0.03;

        // Try logo first, fall back to text watermark
        const logo = new Image();
        logo.onload = () => {
          // Logo watermark — bottom-right, semi-transparent
          const logoWidth = img.width * 0.18;
          const logoHeight = (logo.height / logo.width) * logoWidth;
          ctx.globalAlpha = 0.35;
          ctx.drawImage(
            logo,
            img.width - logoWidth - padding,
            img.height - logoHeight - padding,
            logoWidth,
            logoHeight
          );
          ctx.globalAlpha = 1.0;
          resolve(canvas.toDataURL('image/png'));
        };
        logo.onerror = () => {
          // Text watermark fallback — bottom-right corner
          const fontSize = Math.round(img.width * 0.028);
          ctx.font = `600 ${fontSize}px Inter, Arial, sans-serif`;
          ctx.globalAlpha = 0.4;

          // Subtle dark background pill behind text
          const text = 'STANTON CHASE';
          const metrics = ctx.measureText(text);
          const textWidth = metrics.width;
          const pillPadX = fontSize * 0.5;
          const pillPadY = fontSize * 0.3;
          const pillX = img.width - textWidth - padding * 2 - pillPadX;
          const pillY = img.height - padding - fontSize - pillPadY;

          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
          const pillRadius = fontSize * 0.35;
          const pw = textWidth + pillPadX * 2;
          const ph = fontSize + pillPadY * 2;
          ctx.beginPath();
          ctx.roundRect(pillX, pillY, pw, ph, pillRadius);
          ctx.fill();

          // White text
          ctx.fillStyle = '#FFFFFF';
          ctx.globalAlpha = 0.7;
          ctx.fillText(text, pillX + pillPadX, pillY + fontSize + pillPadY * 0.4);

          ctx.globalAlpha = 1.0;
          resolve(canvas.toDataURL('image/png'));
        };
        logo.src = '/stanton_white.png';
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageSrc;
    });
  };

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      setStream(mediaStream);
      setIsCameraOpen(true);
      setError(null);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      }, 100);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1); // Mirror effect fix for selfie
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const capturedFile = new File([blob], "camera-photo.jpg", { type: "image/jpeg" });
            setFile(capturedFile);
            setPreview(URL.createObjectURL(capturedFile));
            setGeneratedImage(null);
            setError(null);
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setGeneratedImage(null);
      setError(null);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selectedFile = e.dataTransfer.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setGeneratedImage(null);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await generateProfilePhoto(file, selectedStyle);
      // Apply Stanton Chase watermark to the generated image
      const watermarked = await applyWatermark(result);
      setGeneratedImage(watermarked);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'stanton-chase-profile-photo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const resetAll = () => {
    setFile(null);
    setPreview(null);
    setGeneratedImage(null);
    setError(null);
    setSelectedStyle('classic');
  };

  const getStyleLabel = (styleId: string): string => {
    const key = `style${styleId.charAt(0).toUpperCase() + styleId.slice(1)}` as keyof typeof t;
    return t[key] as string || styleId;
  };

  return (
    <div className="flex flex-col items-center">

      {/* Hero Section */}
      <div className="text-center mb-12 max-w-3xl animate-fade-in-up">
        <h1 className="text-4xl md:text-6xl font-extrabold text-[#003f2d] mb-6 tracking-tight leading-tight">
          <span className="block">Professional Identity.</span>
          <span className="bg-gradient-to-r from-[#006a4e] to-[#40c090] bg-clip-text text-transparent">Enhanced by AI.</span>
        </h1>
        <p className="text-gray-500 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
          Transform your selfie into a corporate standard headshot with the Stanton Chase signature style in seconds.
        </p>
      </div>

      {/* Main Card Container */}
      <div className="w-full bg-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-white/50 p-6 md:p-10 relative overflow-hidden transition-all duration-500">

        {/* State 1: Empty / Upload */}
        {!file && !isCameraOpen && (
          <div className="animate-fade-in py-10">
            {/* Warning Badge */}
            <div className="flex justify-center mb-8">
              <div className="inline-flex items-center gap-3 px-5 py-3 bg-amber-50/80 backdrop-blur-sm text-amber-800 text-sm font-semibold rounded-full border border-amber-100 shadow-sm animate-pulse-slow">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                {t.onePersonWarning}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Drag Drop Area */}
              <div
                className="group relative border-2 border-dashed border-gray-200 hover:border-[#006a4e] bg-gray-50/50 hover:bg-[#006a4e]/5 rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 h-80"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />

                <div className="w-20 h-20 bg-white rounded-2xl shadow-lg shadow-gray-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300">
                  <svg className="w-8 h-8 text-[#006a4e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-[#006a4e] transition-colors">{t.uploadTitle}</h3>
                <p className="text-gray-400 text-center text-sm">{t.dragDrop}</p>
                <p className="text-gray-300 text-xs mt-2 text-center">JPG, PNG (Max 10MB) • Single Person Only</p>
              </div>

              {/* Camera Option */}
              <div className="flex flex-col h-80">
                <button
                  onClick={startCamera}
                  className="flex-1 relative overflow-hidden group rounded-3xl bg-[#003f2d] text-white p-8 flex flex-col items-center justify-center shadow-lg shadow-[#003f2d]/20 hover:shadow-[#003f2d]/40 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <svg className="w-16 h-16 mb-6 text-green-200 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  <span className="text-2xl font-bold">{t.useCamera}</span>
                  <span className="text-green-200/60 mt-2 text-sm">Take a photo now</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* State 2: Camera Active */}
        {isCameraOpen && (
          <div className="flex flex-col items-center animate-fade-in py-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white aspect-[3/4] md:aspect-video w-full max-w-2xl bg-black">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform scale-x-[-1]" // Mirror preview
              />

              {/* Camera UI Overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 border-white/50 rounded-tl-xl"></div>
                <div className="absolute top-8 right-8 w-12 h-12 border-t-4 border-r-4 border-white/50 rounded-tr-xl"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 border-b-4 border-l-4 border-white/50 rounded-bl-xl"></div>
                <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 border-white/50 rounded-br-xl"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-64 border border-white/30 rounded-[3rem]"></div>
                </div>
              </div>
            </div>

            <div className="flex gap-6 mt-8">
              <button onClick={stopCamera} className="px-8 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition-colors">
                {t.cancel}
              </button>
              <button onClick={capturePhoto} className="px-10 py-4 bg-[#006a4e] text-white font-bold rounded-2xl hover:bg-[#005a42] hover:-translate-y-1 transition-all shadow-lg shadow-[#006a4e]/20 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                {t.capture}
              </button>
            </div>
          </div>
        )}

        {/* State 3: Processing / Comparison */}
        {file && !isCameraOpen && (
          <div className="animate-fade-in">

            {/* Header Actions */}
            <div className="flex justify-between items-center mb-8 px-2">
              <button onClick={resetAll} className="flex items-center text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                Back
              </button>
              <div className="bg-gray-100 rounded-full px-4 py-1.5 text-xs font-bold text-gray-500 uppercase tracking-widest">
                Studio Mode
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">

              {/* Source Image */}
              <div className="flex flex-col items-center relative order-2 lg:order-1">
                <div className="relative w-full max-w-[340px] aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl ring-4 ring-white bg-gray-100 group">
                  <img src={preview!} alt="Original" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white text-xs font-bold uppercase tracking-wider bg-black/30 backdrop-blur-md px-3 py-1 rounded-lg border border-white/20">Source</span>
                  </div>
                </div>

                {!isLoading && !generatedImage && (
                  <div className="mt-8 w-full max-w-[340px] space-y-5">
                    {/* Style Selector */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3 text-center">{t.selectStyle}</p>
                      <div className="grid grid-cols-3 gap-2">
                        {STYLES.map((style) => (
                          <button
                            key={style.id}
                            onClick={() => setSelectedStyle(style.id)}
                            className={`relative flex flex-col items-center py-3 px-2 rounded-xl border-2 transition-all duration-200 ${selectedStyle === style.id
                                ? 'border-[#003F2D] bg-[#003F2D]/5 shadow-md scale-[1.02]'
                                : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                              }`}
                          >
                            <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${style.color} flex items-center justify-center text-lg mb-1.5 shadow-sm`}>
                              {style.icon}
                            </div>
                            <span className={`text-[10px] font-semibold leading-tight text-center ${selectedStyle === style.id ? 'text-[#003F2D]' : 'text-gray-500'
                              }`}>
                              {getStyleLabel(style.id)}
                            </span>
                            {selectedStyle === style.id && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#003F2D] rounded-full flex items-center justify-center">
                                <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generate Button */}
                    <button
                      onClick={handleGenerate}
                      className="w-full py-4 bg-[#003F2D] text-white text-lg font-bold rounded-2xl shadow-xl shadow-[#003F2D]/25 hover:bg-[#002e21] hover:-translate-y-1 hover:shadow-2xl transition-all flex items-center justify-center relative overflow-hidden group"
                    >
                      <span className="relative z-10 flex items-center">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        {t.generate}
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                    </button>
                  </div>
                )}
              </div>

              {/* Arrow / Loading State */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden lg:flex">
                <div className={`w-14 h-14 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center text-[#006a4e] transition-all duration-500 ${isLoading ? 'scale-110 shadow-[#006a4e]/20' : ''}`}>
                  {isLoading ? (
                    <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  ) : (
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                  )}
                </div>
              </div>

              {/* Result Image */}
              <div className="flex flex-col items-center order-1 lg:order-2">
                <div className={`relative w-full max-w-[340px] aspect-[4/5] rounded-[2rem] overflow-hidden transition-all duration-700 ${generatedImage ? 'ring-4 ring-[#006a4e] shadow-2xl shadow-[#006a4e]/20' : 'ring-4 ring-gray-100 bg-gray-50'}`}>
                  {isLoading ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                      <div className="w-24 h-24 rounded-full border-4 border-gray-200 border-t-[#006a4e] animate-spin mb-6"></div>
                      <p className="text-[#006a4e] font-bold text-lg animate-pulse">{t.generating}</p>
                      <p className="text-gray-400 text-xs mt-2 font-mono">AI PROCESSING</p>
                    </div>
                  ) : generatedImage ? (
                    <>
                      <img src={generatedImage} alt="Generated" className="w-full h-full object-cover animate-fade-in" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#003f2d]/90 to-transparent">
                        <div className="flex justify-between items-end">
                          <span className="text-white text-xs font-bold uppercase tracking-wider bg-[#006a4e] px-3 py-1 rounded-lg shadow-lg">Stanton Chase Professional</span>
                          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-pulse"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300">
                      <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                      </div>
                      <p className="font-medium text-sm">AI Result Area</p>
                    </div>
                  )}
                </div>

                {generatedImage && (
                  <button
                    onClick={handleDownload}
                    className="mt-8 w-full max-w-[340px] py-4 bg-white border border-gray-200 text-[#003f2d] font-bold text-lg rounded-2xl shadow-lg hover:border-[#006a4e] hover:text-[#006a4e] hover:shadow-xl transition-all flex items-center justify-center gap-2 group"
                  >
                    <svg className="w-5 h-5 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    {t.download}
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Error Notification */}
        {error && (
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4 animate-fade-in-up">
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-xl shadow-lg flex items-center">
              <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PhotoGenerator;