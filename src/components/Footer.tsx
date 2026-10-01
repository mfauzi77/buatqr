import React from 'react';
import { ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="app-footer" className="border-t border-slate-200/80 bg-white/90 py-1.5 px-4 shrink-0 text-center text-[11px] text-slate-500 flex items-center justify-between gap-2 max-w-7xl mx-auto w-full">
      <div className="flex items-center gap-1.5">
        <span className="font-semibold text-slate-700">QR Code Generator</span>
        <span className="text-slate-300">•</span>
        <span className="hidden sm:inline">Format: Background Putih + Judul Rapat + QR Code</span>
      </div>
      <div className="flex items-center gap-1 text-emerald-600 font-medium">
        <ShieldCheck className="w-3 h-3" />
        <span>Pemrosesan 100% di browser pengguna</span>
      </div>
    </footer>
  );
};
