import React from 'react';
import { QrCode, ShieldCheck, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header id="app-header" className="bg-white border-b border-slate-200/80 shrink-0 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 flex items-center justify-between gap-3">
        {/* Brand & Identity */}
        <div className="flex items-center gap-2">
          <div 
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-blue-600 text-white shadow-2xs"
            title="QR Meeting & Link Generator"
          >
            <QrCode className="w-4 h-4" />
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-slate-900 font-['Plus_Jakarta_Sans',sans-serif]">
              QR Code Generator
            </h1>
            <span className="hidden sm:inline-flex items-center text-[10px] text-slate-500 font-normal">
              • Tanpa iklan, langsung ke tautan tujuan
            </span>
          </div>
        </div>

        {/* Security / Mode Badges */}
        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] font-medium rounded border border-emerald-200/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
            <span>100% Client-side</span>
          </div>
        </div>
      </div>
    </header>
  );
};
